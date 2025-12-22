import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "owner"]
    }
},{timestamps:true})


const User = mongoose.model("User", userSchema);
export default User;