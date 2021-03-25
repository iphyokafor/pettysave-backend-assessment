/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
import mongoose from "mongoose";
import faker from "faker";
import dotenv from "dotenv";
import userModel from "../Models/user";
import taskModel from "../Models/task";
import jwtHelper from "../helpers/utils/jwt";
import bcryptHelper from "../helpers/utils/bcrypt";

// eslint-disable-next-line no-unused-vars
const { generateToken, refreshToken, verifyRefreshToken } = jwtHelper;
const { hashPassword } = bcryptHelper;

dotenv.config();

// connection to mongodb
const connect = () => {
    /** connection mongodb */
    mongoose
        .connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        })
        .then(() => {
            console.log("mongodb connected...");
        })
        .catch((err) => console.log(err.message));

    mongoose.connection.on("connected", () => {
        console.log("Mongoose connected to db");
    });
};

// Drop existing users if any
const userModelSeed = () => userModel.deleteMany({});

// Drop existing apartment if any
const taskModelSeed = () => taskModel.deleteMany({});

const Seeders = {
    async seedUserModel() {
        try {
            // make a bunch of users
            const users = [];
            for (let i = 0; i < 2; i += 1) {
                const first_name = faker.name.firstName();
                const last_name = faker.name.lastName();
                const address = faker.address.streetAddress();
                const pass = "password";
                const password = hashPassword(pass);
                const token = await generateToken({ users });
                const refreshedToken = await refreshToken({ users });
                const newUser = {
                    email: faker.internet.email(first_name, last_name),
                    first_name,
                    last_name,
                    address,
                    password,
                    access_token: token,
                    refreshed_token: refreshedToken,
                };
                users.push(newUser);
            }

            await userModel.insertMany(users);
        } catch (error) {
            console.log("error", error);
        }
    },

    async seedTaskModel() {
        try {
            // make a bunch of task
            const task = [];
            for (let i = 0; i < 2; i += 1) {
                const title = faker.lorem.word();
                const description = faker.lorem.sentence();
                const user_id = "605a80194005731d2c95b3dc";
                const status = "pending";

                const newTask = {
                    title,
                    description,
                    user_id,
                    status,
                };
                task.push(newTask);
            }

            await taskModel.insertMany(task);
        } catch (error) {
            console.log("error", error);
        }
    },
};

const migration = async() => {
    try {
        await connect();
        await userModelSeed();
        await taskModelSeed();
        await Seeders.seedTaskModel();
        await Seeders.seedUserModel();
        console.log("db migration successful");
    } catch (error) {
        console.log("error", error);
    }
};

migration();