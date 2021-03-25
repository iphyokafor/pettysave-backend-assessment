import createError from "http-errors";
import User from "../Models/user";
import { authSchema, loginSchema } from "../helpers/validation/user";
import jwtHelper from "../helpers/utils/jwt";
import bcryptHelper from "../helpers/utils/bcrypt";

const { generateToken, refreshToken, verifyRefreshToken } = jwtHelper;
const { hashPassword, comparePassword } = bcryptHelper;

export default class userController {
    static async registerUsers(request, response, next) {
        try {
            const result = await authSchema.validateAsync(request.body);

            result.password = await hashPassword(result.password);

            const emailExist = await User.findOne({ email: result.email });
            if (emailExist) {
                throw createError.Conflict(`${result.email} already in use`);
            }
            const user = new User(result);
            await user.save();

            const token = await generateToken({ user });
            const refreshedToken = await refreshToken({ user });
            response.send({
                message: "Registration successful",
                user,
                access_token: token,
                refresh_token: refreshedToken,
            });
        } catch (error) {
            if (error.isJoi === true) error.status = 422;
            next(error);
        }
    }

    // eslint-disable-next-line consistent-return
    static async loginUsers(request, response, next) {
        try {
            const result = await loginSchema.validateAsync(request.body);

            const user = await User.findOne({ email: result.email });
            if (!user) {
                throw createError.NotFound("User not registered");
            }

            const match = await comparePassword(user.password, result.password);

            if (match) {
                const token = await generateToken({ user });
                const refreshedToken = await refreshToken({ user });
                response.cookie("token", token);
                response.send({
                    message: "Logged in!",
                    user,
                    accessToken: token,
                    refreshToken: refreshedToken,
                });
            } else {
                throw createError.Unauthorized("Email/password not valid");
            }
        } catch (error) {
            if (error.isJoi === true) {
                return next(createError.BadRequest("Invalid Email/password"));
            }
            next(error);
        }
    }

    static async refreshTokenUser(request, response, next) {
        try {
            const { refreshedToken } = request.body;
            if (!refreshedToken) throw createError.BadRequest();
            const user = await verifyRefreshToken(refreshedToken);
            const token = await generateToken({ user });
            const refresh = await refreshToken({ user });
            response.send({
                accessToken: token,
                refreshToken: refresh,
            });
        } catch (error) {
            next(error);
        }
    }
}