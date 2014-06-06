package controllers

import play.api.mvc._
import play.api.db.slick._
import play.api.Play.current
import play.api.libs.json._
import play.api.libs.functional.syntax._
import model.RecipeService
import model.RecipeService.{ Recipe, Ingredient }
import model.RecipeService.JSONConverters._

object Application extends Controller {

  def recipe(id: Long) = DBAction { implicit rs =>
    val r = RecipeService.findOne(id)
    r match {
      case Some(recipe) => Ok(Json.toJson(recipe))
      case None => NotFound
    }
  }

  def recipes = DBAction { implicit rs =>
    val list = RecipeService.list
    Ok(Json.toJson(list))
  }

  def safeRecipe = DBAction(BodyParsers.parse.json) { implicit rs =>
    val recipe: JsResult[Recipe] = rs.request.body.validate[Recipe]
    recipe match {
      case JsSuccess(r,_) =>
        val id = RecipeService.storeRecipe(r)
        Ok(Json.obj("status" -> "OK", "recipeId" -> id))
      case JsError(errors) => BadRequest(Json.obj("status" -> "KO", "message" -> JsError.toFlatJson(errors)))
    }
//    recipe.fold(
//      errors => {
//        BadRequest(Json.obj("status" -> "KO", "message" -> JsError.toFlatJson(errors)))
//      },
//      r => {
//        val id = RecipeService.storeRecipe(r)
//        Ok(Json.obj("status" -> "OK", "recipeId" -> id))
//      })
  }

}