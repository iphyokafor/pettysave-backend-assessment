import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        min: 3,
        max: 50,
    },
    last_name: {
        type: String,
        required: true,
        min: 3,
        max: 50,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: false,
    },
    access_token: {
        type: String,
    },
    refreshed_token: {
        type: String,
    },
}, { timestamps: true });

// eslint-disable-next-line func-names
UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;

    return userObject;
};

const User = mongoose.model("User", UserSchema);

export default User;