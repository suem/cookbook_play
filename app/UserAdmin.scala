
import util.StringUtil.StringCrypto

object UserQueries {
  def updateUser(loginname: String, newpw:String): String = {
    val pw = newpw.toPasswordHash

    s"""
		 UPDATE "USERS" SET "PASSWORD"='$pw' WHERE "LOGINNAME"='$loginname';
    """
  }
}

object UserAdmin extends App {

  println(UserQueries.updateUser("sam", "12345"))
}

