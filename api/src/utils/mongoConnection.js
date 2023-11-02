import mongoose from "mongoose";
import logger from '../utils/logger.js'

export const connect = async (url) => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        logger.info('Conected to MongoDB');
    } catch (error) {
        throw error
    }
}

mongoose.connection.on('disconnected', () => {
    logger.info('MongoDB disconnected');
})
mongoose.connection.on('connected', () => {
    logger.info('MongoDB connected');
})