import jwt from "jsonwebtoken";
import createError from "http-errors";

const verifyToken = (request, response, next) => {
  let token = request.headers["x-access-token"] || request.headers.authorization;
  // eslint-disable-next-line prefer-const
  let checkBearer = "Bearer ";

  if (token) {
    if (token.startsWith(checkBearer)) {
      token = token.slice(checkBearer.length, token.length);
    }
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        response.json({
          success: false,
          message: "Failed to authenticate",
        });
      } else {
        request.decoded = decoded;
        next();
      }
    });
  } else {
    return next(createError.Unauthorized());
  }
};

export default verifyToken;
