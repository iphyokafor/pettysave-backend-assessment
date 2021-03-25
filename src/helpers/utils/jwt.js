import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.JWT_KEY;
const refreshKey = process.env.REFRESH_TOKEN_KEY;

export default class jwtHelper {
  static async generateToken(payload, secret = secretKey) {
    const token = await jwt.sign(payload, secret, { expiresIn: "1d" });
    return token;
  }

  static async refreshToken(payload, secret = refreshKey) {
    const token = await jwt.sign(payload, secret, { expiresIn: "7d" });
    return token;
  }

  static async verifyRefreshToken(refreshToken) {
    const token = await jwt.verify(refreshToken, refreshKey);
    return token;
  }
}
