import model.DBModel
import play.api._
import play.api.db.slick._
import play.api.db.slick.Session
import play.api.Play.current
import play.api.db.slick.Config.driver.simple._
import model.DBModel._
import util.StringUtil.StringCrypto

object Global extends GlobalSettings {

  override def onStart(app: Application) {
    println("STARTING COOKBOOK")
//    InitialData.insert()
  }

}

/** Initial set of data to be imported into the sample application. */
object InitialData {
  def insert(): Unit = {
    DB.withSession { implicit s: Session =>
//      recipeIngredientRows.delete
//      recipeRows.delete
//      ingredientRows.delete
//      userRows.delete

//      val userIds = (userRows returning userRows.map(_.id)) ++= Seq(
//        UserRow(None, "sam", "sam".toPasswordHash, "Samuel Ueltschi"),
//        UserRow(None, "petra", "petra".toPasswordHash, "Petra Wittwer"))
//
//      val recipeIds = (recipeRows returning recipeRows.map(_.id)) ++= Seq(
//        RecipeRow(None, "Curry", "fein", "Man nehme", userIds(0)),
//        RecipeRow(None, "Spaghetti", "fein", "Man nehme", userIds(0)),
//        RecipeRow(None, "Spaetzli", "fein", "Man nehme", userIds(1)))
//
//      val ingredientIds = (ingredientRows returning ingredientRows.map(_.id)) ++= Seq(
//        IngredientRow(None, "Currypaste"),
//        IngredientRow(None, "Spaghetti"),
//        IngredientRow(None, "Ei"))
//
//      recipeIngredientRows ++= Seq(
//        RecipeIngredientRow(Some(1), "gr", 2, recipeIds(0), ingredientIds(0)),
//        RecipeIngredientRow(Some(1), "gr", 245, recipeIds(0), ingredientIds(1)),
//        RecipeIngredientRow(Some(1), "msp", 1, recipeIds(0), ingredientIds(2)),
//        RecipeIngredientRow(Some(1), "msp", 10, recipeIds(1), ingredientIds(1)),
//        RecipeIngredientRow(Some(1), "msp", 100, recipeIds(1), ingredientIds(1)),
//        RecipeIngredientRow(Some(1), "msp", 1000, recipeIds(1), ingredientIds(1)),
//        RecipeIngredientRow(Some(1), "msp", 10000, recipeIds(1), ingredientIds(1)),
//        RecipeIngredientRow(Some(1), "gr", 10, recipeIds(1), ingredientIds(0)))
    }
  }
}
