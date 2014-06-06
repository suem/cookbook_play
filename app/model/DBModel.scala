package model

import play.api.db.slick.Config.driver.simple._
import scala.slick.lifted.Tag

object DBModel {

  //case classes for row mapping
  case class RecipeRow(
                        id: Option[Long],
                        name: String,
                        description: String,
                        instructions: String)

  case class IngredientRow(id: Option[Long], name: String)

  case class RecipeIngredientRow(
                                  id: Option[Long],
                                  unit: String,
                                  amount: Float,
                                  recipeId: Long,
                                  ingredientId: Long)

  //table definitions
  class RecipeTable(tag: Tag) extends Table[RecipeRow](tag, "RECIPES") {

    def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)

    def name = column[String]("NAME", O.NotNull)

    def description = column[String]("DESCRIPTION")

    def instructions = column[String]("INSTRUCTIONS")

    def * = (id.?, name, description, instructions) <>(RecipeRow.tupled, RecipeRow.unapply _)

    def name_unique = index("unique_recipe_name", name, unique = true)
  }

  class IngredientTable(tag: Tag) extends Table[IngredientRow](tag, "INGREDIENT") {

    def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)

    def name = column[String]("NAME", O.NotNull)

    def * = (id.?, name) <>(IngredientRow.tupled, IngredientRow.unapply _)

    def name_unique = index("unique_ingredient_name", name, unique = true)
  }

  class RecipeIngredientTable(tag: Tag) extends Table[RecipeIngredientRow](tag, "RECIPE_INGREDIENT") {

    def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)

    def unit = column[String]("UNIT", O.NotNull)

    def amount = column[Float]("AMOUNT")

    def recipeId = column[Long]("RECIPE_ID")

    def recipe = foreignKey("RECIPE_FK", recipeId, recipeRows)(_.id)

    def ingredientId = column[Long]("INGREDIENT_ID")

    def ingredient = foreignKey("INGREDIENT_FK", ingredientId, ingredientRows)(_.id)

    def * = (id.?, unit, amount, recipeId, ingredientId) <>(RecipeIngredientRow.tupled, RecipeIngredientRow.unapply _)

  }

  val recipeRows = TableQuery[RecipeTable]
  val ingredientRows = TableQuery[IngredientTable]
  val recipeIngredientRows = TableQuery[RecipeIngredientTable]

}

