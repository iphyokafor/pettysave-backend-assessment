import createError from "http-errors";
import Task from "../Models/task";

export default class taskController {
    static async postTask(request, response, next) {
        try {
            const { title, description, status } = request.body;

            const task = await new Task({
                title,
                description,
                user_id: request.decoded.user._id,
                status,
            });
            const savedData = await task.save();
            return response.status(200).json({
                message: "Task details added successfully",
                savedData,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getTask(request, response, next) {
        try {
            let { page, limit } = request.query;
            page = page < 1 ? 1 : page;
            limit = 5;

            const count = await Task.countDocuments();
            // eslint-disable-next-line prefer-const
            let totalPages = Math.ceil(count / limit);
            page = page > totalPages ? totalPages : page;

            const task = await Task.find({})
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .populate({
                    path: "user_id",
                    select: "first_name last_name email",
                })
                .collation({ locale: "en" })
                .exec();

            return response.status(200).json({
                message: "All tasks displayed",
                task,
                // eslint-disable-next-line object-shorthand
                totalPages: totalPages,
                currentPage: page,
                totalTask: count,
            });
        } catch (error) {
            next(error);
        }
    }

    static async filterTask(request, response, next) {
        try {
            const sortBy = request.query.sortBy ? request.query.sortBy : "";
            const task = await Task.find({}).where({ status: sortBy }).exec();
            console.log("task", task);

            return response.status(200).json({
                message: "Success",
                task,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getSingleTask(request, response, next) {
        try {
            const task = await Task.findOne({ _id: request.params.id })
                .populate("user_id")
                .exec();
            return response.status(200).json({
                message: "A single task",
                task,
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateTask(request, response, next) {
        try {
            const { id } = request.params;
            const task = await Task.findOne({ _id: id });
            console.log(task.status);
            if (!task) {
                throw createError.BadRequest("Task doesn't exist");
            }

            if (request.body.title) task.title = request.body.title;
            if (request.body.description) task.description = request.body.description;
            if (request.body.status) task.status = request.body.status;

            const updateTask = await task.save();
            return response.status(200).json({
                message: "Task updated successfully!!",
                updateTask,
            });
        } catch (error) {
            next(error);
        }
    }
}