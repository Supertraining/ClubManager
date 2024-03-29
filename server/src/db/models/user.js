import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    nombre: { type: String, require: true },
    apellido: { type: String, require: true },
    edad: { type: Number, require: true, min: 12, max: 99 },
    telefono: { type: String, require: true },
    reserves: [{ type: Object }],
    admin: {type: Boolean, require: true},
});

export const userModel = mongoose.model('users', userSchema);

