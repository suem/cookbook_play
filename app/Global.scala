import play.api._
import play.api.db.slick._
import play.api.db.slick.Session
import play.api.Play.current
import play.api.db.slick.Config.driver.simple._
import model.DBModel._

object Global extends GlobalSettings {

  override def onStart(app: Application) {
    println("STARTING COOKBOOK")
    InitialData.insert()
  }

}

/** Initial set of data to be imported into the sample application. */
object InitialData {
  def insert(): Unit = {
    DB.withSession { implicit s: Session =>
      recipeIngredientRows.delete
      recipeRows.delete
      ingredientRows.delete

      val recipeIds = (recipeRows returning recipeRows.map(_.id))++= Seq(
        RecipeRow(Some(1), "Curry", "fein", "Man nehme"),
        RecipeRow(Some(2), "Spaghetti", "fein", "Man nehme"),
        RecipeRow(Some(3), "Spaetzli", "fein", "Man nehme")
      )

      val ingredientIds = (ingredientRows returning ingredientRows.map(_.id)) ++= Seq(
        IngredientRow(Some(1),"Mehl"),
        IngredientRow(Some(2),"Zucker"),
        IngredientRow(Some(3),"Salz")
      )

      recipeIngredientRows ++= Seq(
        RecipeIngredientRow(Some(1),"gr",2,recipeIds(0),ingredientIds(0)),
        RecipeIngredientRow(Some(1),"gr",245,recipeIds(0),ingredientIds(1)),
        RecipeIngredientRow(Some(1),"msp",1,recipeIds(0),ingredientIds(2))
      )
    }
  }
}
