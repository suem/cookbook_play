package controllers

import java.security.MessageDigest

import util.StringUtil.StringImprovements
import model.Service
import model.Service.JSONConverters._
import model.Service.Recipe
import play.api.Play.current
import play.api.db.slick.{DBAction, DBSessionRequest, dbSessionRequestAsSession}
import play.api.libs.functional.syntax._
import play.api.libs.json._
import play.api.mvc.{Action, BodyParsers, Controller, SimpleResult}

object Application extends Controller {

  def cookbooks = DBAction { implicit rs => Ok(Json.toJson(Service.cookbookList))}

  def cookbook(cookbookId: Long) = DBAction { implicit rs =>
    Service.cookbook(cookbookId) match {
      case Some(cookbook) => Ok(Json.toJson(cookbook))
      case None => NotFound
    }
  }

  def recipes(cookbookId: Long) = DBAction { implicit rs =>
    Ok(Json.toJson(Service.recipes(cookbookId)))
  }

  def recipe(cookbookId: Long, recipeId: Long) = DBAction { implicit rs =>
    Service.recipe(cookbookId, recipeId) match {
      case Some(recipe) => Ok(Json.toJson(recipe))
      case None => NotFound
    }
  }

  def withJson[A](requestHandler: A => SimpleResult)(implicit rs: DBSessionRequest[JsValue], reads: Reads[A]): SimpleResult = {
    rs.request.body.validate[A] match {
      case JsSuccess(jsonObject, _) => requestHandler(jsonObject)
      case JsError(errors) => BadRequest(Json.obj("status" -> "KO", "message" -> JsError.toFlatJson(errors)))
    }
  }

  case class LoginForm(loginname: String, password: String)

  implicit val loginFormReads: Reads[LoginForm] = ((JsPath \ "loginname").read[String] and (JsPath \ "password").read[String])(LoginForm.apply _)

  def login = DBAction(BodyParsers.parse.json) { implicit rs =>
    withJson[LoginForm] { loginForm =>
      val hash = MessageDigest.getInstance("SHA-256")
      println(hash.digest(loginForm.password.getBytes))
      Service.user(loginForm.loginname, loginForm.password) match {
        case Some(user) => Ok(Json.toJson(user)).withSession("user_id" -> user.id.get.toString)
        case None => Unauthorized.withNewSession
      }
    }
  }

  def logout = Action { request =>
    Ok(Json.obj("status" -> "OK")).withNewSession
  }

  def currentUser = DBAction { implicit rs =>
    val userOpt = for {
      idString <- rs.request.session.get("user_id")
      id <- idString.toLongOpt
      user <- Service.user(id)
    } yield Json.toJson(user)

    userOpt match {
      case Some(user) => Ok(user)
      case None => NotFound
    }
  }

  def removeRecipe(cookbookId: Long, recipeId: Long) = DBAction { implicit rs =>
    val validUserId: Option[Long] = rs.request.session.get("user_id").flatMap(_.toLongOpt) flatMap { id =>
      if (id == cookbookId) Some(id)
      else None
    }

    if (validUserId.isDefined) {
      if(Service.removeRecipe(cookbookId,recipeId))  Ok(Json.obj("status" -> "OK"))
      else BadRequest("Invalid recipeId, cookbookId")
    } else Unauthorized
  }

  def storeRecipe(cookbookId: Long) = DBAction(BodyParsers.parse.json) { implicit rs =>

    val validUserId: Option[Long] = rs.request.session.get("user_id").flatMap(_.toLongOpt) flatMap { id =>
      if (id == cookbookId) Some(id)
      else None
    }

    if (validUserId.isDefined) {
      withJson[Recipe] { recipe =>
        val id = Service.storeRecipe(cookbookId, recipe)
        Ok(Json.obj("status" -> "OK", "recipeId" -> id))
      }
    } else Unauthorized

  }

  def unitSuggestions = DBAction { implicit rs =>
    Ok(Json.toJson(Service.unitSuggesions))
  }

  def ingredientSuggestions = DBAction { implicit rs =>
    Ok(Json.toJson(Service.ingredientSuggestions))
  }

}