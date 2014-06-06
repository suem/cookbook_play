package model

import play.api.db.slick.Config.driver.simple._
import play.api.libs.json._
import play.api.libs.functional.syntax._

object RecipeService {

  case class Recipe(
                     id: Option[Long],
                     name: String,
                     description: String,
                     instructions: String,
                     ingredients: Seq[Ingredient])

  case class Ingredient(
                         name: String,
                         unit: String,
                         amount: Float
                         )

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
        "unit" -> ingredient.unit
      )
    }

    implicit val recipeWrites = new Writes[Recipe] {
      def writes(recipe: Recipe) = Json.obj(
        "id" -> recipe.id,
        "name" -> recipe.name,
        "description" -> recipe.description,
        "instructions" -> recipe.instructions,
        "ingredients" -> recipe.ingredients
      )
    }

  }

  def create(recipe: Recipe)(implicit s: Session): Long = {
    val recipeRow = DBModel.RecipeRow(None, recipe.name, recipe.description, recipe.instructions)
    (DBModel.recipeRows returning DBModel.recipeRows.map(_.id)) += recipeRow
  }

  def list(implicit s: Session): Seq[Recipe] = {
    val rows: Seq[DBModel.RecipeRow] = DBModel.recipeRows.list
    rows.map(r => Recipe(r.id, r.name, r.description, r.instructions, Seq()))
  }

  def findOne(id: Long)(implicit s: Session): Option[Recipe] = {
    val recipeRow = DBModel.recipeRows.filter(_.id === id).firstOption
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

  def storeRecipe(recipe: Recipe)(implicit s: Session): Long = {
    s.withTransaction {

      //first we need to lookup all ingredients
      val existingIngredientsMap = (for {i <- DBModel.ingredientRows} yield (i.name, i.id)).list.toMap

      val ingredientsNotInDB = recipe.ingredients.filter(r => !existingIngredientsMap.contains(r.name)).distinct

      val newIngredientsMap = ingredientsNotInDB.map { i =>
        //insert new ingredients into db
        val id = (DBModel.ingredientRows returning DBModel.ingredientRows.map(_.id)) += DBModel.IngredientRow(None, i.name)
        (i.name, id)
      }.toMap


      val getRecipeRow = { id: Option[Long] => DBModel.RecipeRow(id, recipe.name, recipe.description, recipe.instructions)}

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
        val ingredientId = existingIngredientsMap.get(i.name).getOrElse(newIngredientsMap(i.name))
        //insert new row
        DBModel.recipeIngredientRows += DBModel.RecipeIngredientRow(None, i.unit, i.amount, recipeId, ingredientId)
      }

      recipeId
    }
  }

}

