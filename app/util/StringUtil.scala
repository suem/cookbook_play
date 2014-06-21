package util

object StringUtil {
  implicit class StringImprovements(val s: String) {
    import scala.util.control.Exception._
    def toLongOpt = catching(classOf[NumberFormatException]) opt s.toLong
  }
}
