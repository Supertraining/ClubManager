import mongoose from "mongoose";

export const connect = async (url) => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Conected to MongoDB');
    } catch (error) {
        throw error
    }
}

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
})
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
})