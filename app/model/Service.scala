package model

import util.StringUtil.StringCrypto
import play.api.db.slick.Config.driver.simple._
import play.api.libs.json._
import play.api.libs.functional.syntax._
import scala.slick.jdbc.{GetResult, StaticQuery => Q}

object Service {

  case class User(
                   id: Option[Long],
                   loginname: String,
                   name: String)

  //currently users are equivalent to cookbooks, later a user can have many cookbooks

  case class Recipe(
                     id: Option[Long],
                     name: String,
                     description: String,
                     instructions: String,
                     ingredients: Seq[Ingredient])

  case class Ingredient(
                         name: String,
                         unit: String,
                         amount: Float)

  case class IngredientSuggestion(name: String, unit: String)

  case class Cookbook(
                       id: Option[Long],
                       name: String)

  object JSONConverters {
    //JSON reads

    implicit val ingredientReads: Reads[Ingredient] =
      ((JsPath \ "name").read[String] and (JsPath \ "unit").read[String] and (JsPath \ "amount").read[Float])(Ingredient.apply _)

    implicit val recipeReads: Reads[Recipe] =
      ((JsPath \ "id").read[Option[Long]] and (JsPath \ "name").read[String] and (JsPath \ "description").read[String] and
        (JsPath \ "instructions").read[String] and (JsPath \ "ingredients").read[Seq[Ingredient]])(Recipe.apply _)

    //JSON writes

    implicit val ingredientWrites = new Writes[Ingredient] {
      def writes(ingredient: Ingredient) = Json.obj(
        "name" -> ingredient.name,
        "amount" -> ingredient.amount,
        "unit" -> ingredient.unit)
    }

    implicit val recipeWrites = new Writes[Recipe] {
      def writes(recipe: Recipe) = Json.obj(
        "id" -> recipe.id,
        "name" -> recipe.name,
        "description" -> recipe.description,
        "instructions" -> recipe.instructions,
        "ingredients" -> recipe.ingredients)
    }

    implicit val cookbookWrites = new Writes[Cookbook] {
      def writes(cookbook: Cookbook) = Json.obj("id" -> cookbook.id, "name" -> cookbook.name)
    }

    implicit val userWrites = new Writes[User] {
      def writes(user: User) = Json.obj("id" -> user.id, "loginname" -> user.loginname, "name" -> user.name)
    }

    implicit val ingredientSuggestionWrites = new Writes[IngredientSuggestion] {
      def writes(ingSug: IngredientSuggestion) = Json.obj("name" -> ingSug.name, "unit" -> ingSug.unit)
    }

  }

  def cookbookList(implicit s: Session): Seq[Cookbook] = {
    DBModel.userRows.list.map(u => Cookbook(u.id, u.displayname))
  }

  def cookbook(id: Long)(implicit s: Session): Option[Cookbook] = {
    DBModel.userRows.filter(_.id === id).firstOption.map { row => Cookbook(row.id, row.displayname)}
  }

  def recipes(cookbookId: Long)(implicit s: Session): Seq[Recipe] = {
    DBModel.recipeRows.filter(_.userId === cookbookId).list.map { r => Recipe(r.id, r.name, r.description, r.instructions, Seq())}
  }

  def recipe(cookbookId: Long, recipeId: Long)(implicit s: Session): Option[Recipe] = {
    val recipeRow = DBModel.recipeRows.filter({ r => r.id === recipeId && r.userId === cookbookId}).firstOption
    recipeRow.map({ r =>
      val ingredients = (for {
        ri <- DBModel.recipeIngredientRows if ri.recipeId === r.id
        i <- ri.ingredient
      } yield (i.name, ri.unit, ri.amount)).list.map {
        case (name, unit, amount) => Ingredient(name, unit, amount)
      }
      Recipe(r.id, r.name, r.description, r.instructions, ingredients)
    })
  }

  def user(userId: Long)(implicit s: Session): Option[User] =
    DBModel.userRows.filter(_.id === userId).firstOption.map {
      row => User(row.id, row.loginname, row.displayname)
    }

  def user(loginname: String, password: String)(implicit s: Session): Option[User] =
    DBModel.userRows.filter({ row => row.loginname === loginname && row.password === password.toPasswordHash}).firstOption.map {
      row => User(row.id, row.loginname, row.displayname)
    }

  def removeRecipe(cookbookId: Long, recipeId: Long)(implicit s: Session): Boolean = {
    s.withTransaction {
      val recipeQuery = DBModel.recipeRows.filter({ row => row.id === recipeId && row.userId === cookbookId})
      //check if this recipe actually exists for this user
      if (recipeQuery.exists.run) {
        DBModel.recipeIngredientRows.filter(_.recipeId === recipeId).delete
        recipeQuery.delete
        //TODO delete dangling ingredients
        true
      } else false
    }
  }

  def storeRecipe(cookbookId: Long, recipe: Recipe)(implicit s: Session): Long = {
    s.withTransaction {

      //first we need to lookup all ingredients
      val existingIngredientsMap = (for {i <- DBModel.ingredientRows} yield (i.name, i.id)).list.toMap

      val ingredientsNotInDB = recipe.ingredients.filter(r => !existingIngredientsMap.contains(r.name)).distinct

      val newIngredientsMap = ingredientsNotInDB.map { i =>
        //insert new ingredients into db
        val id = (DBModel.ingredientRows returning DBModel.ingredientRows.map(_.id)) += DBModel.IngredientRow(None, i.name)
        (i.name, id)
      }.toMap


      val getRecipeRow = { id: Option[Long] => DBModel.RecipeRow(id, recipe.name, recipe.description, recipe.instructions, cookbookId)}

      //insert or update recipe
      val recipeId = recipe.id match {
        case Some(id) =>
          //update recipe
          DBModel.recipeRows.filter(_.id === id).update(getRecipeRow(Some(id)))
          //delete existing RecipeIngredients
          DBModel.recipeIngredientRows.filter(_.recipeId === id).delete
          id

        //insert new recipe
        case None => (DBModel.recipeRows returning DBModel.recipeRows.map(_.id)) += getRecipeRow(None)

      }

      //insert RecipeIngredients
      recipe.ingredients.foreach { i =>
        //should return correct ingredient id or something went wrong
        val ingredientId = existingIngredientsMap.getOrElse(i.name, newIngredientsMap(i.name))
        //insert new row
        DBModel.recipeIngredientRows += DBModel.RecipeIngredientRow(None, i.unit, i.amount, recipeId, ingredientId)
      }

      recipeId
    }
  }

  def unitSuggesions(implicit s: Session): Seq[String] = {
    Q.queryNA[String](
      """
        SELECT DISTINCT "UNIT" FROM "RECIPE_INGREDIENT"
      """
    ).list
  }

  def ingredientSuggestions(implicit s: Session): Seq[IngredientSuggestion] = {
    implicit val getIngredientSuggestion = GetResult(r => IngredientSuggestion(r.<<, r.<<))
    val query = """
                SELECT DISTINCT ing."NAME" ,ri."UNIT"
                FROM "INGREDIENT" ing, "RECIPE_INGREDIENT" ri
                WHERE ing."ID" = ri."INGREDIENT_ID"
                AND ri."UNIT" = (
                         SELECT "UNIT"
                         FROM "RECIPE_INGREDIENT"
                         WHERE "INGREDIENT_ID" = ing."ID"
                         GROUP BY "INGREDIENT_ID", "UNIT"
                         ORDER BY COUNT("UNIT") DESC LIMIT 1
                )
                """
    Q.queryNA[IngredientSuggestion](query).list
  }

}

