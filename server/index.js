import { createLogger } from 'winston';
import app from './src/app.js'
import { Logger } from './src/utils/logger.js';

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
 Logger.level().info(`Club Manager app listening at ${PORT}`);
})

