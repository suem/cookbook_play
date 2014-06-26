package util

import javax.xml.bind.annotation.adapters.HexBinaryAdapter
import java.security.MessageDigest

object StringUtil {
  implicit class StringImprovements(val s: String) {
    import scala.util.control.Exception._
    def toLongOpt = catching(classOf[NumberFormatException]) opt s.toLong
  }
  implicit class StringCrypto(val str: String) {
    def toPasswordHash = (new HexBinaryAdapter()).marshal(MessageDigest.getInstance("SHA-256").digest(str.getBytes))
  }
}
