import mongoose from "mongoose";
import { Logger } from '../utils/logger.js'

export class MongoConnection {
    
    static connect = async (url) => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        Logger.level().info('Conected to MongoDB');
    } catch (error) {
        throw error
    }
}
}

mongoose.connection.on('disconnected', () => {
    Logger.level().info('MongoDB disconnected');
})
mongoose.connection.on('connected', () => {
    Logger.level().info('MongoDB connected');
})