import mongoose from "mongoose";


const courtSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    unavailableDates: {
        lunes: [{ type: Object }],
        martes: [{ type: Object }],
        miercoles: [{ type: Object }],
        jueves: [{ type: Object }],
        viernes: [{ type: Object }],
        sabado: [{ type: Object }],
        domingo: [{ type: Object }],
    }
});

export const courtModel = mongoose.model('courts', courtSchema);