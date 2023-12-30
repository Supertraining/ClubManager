import app from './src/app.js'
import logger from './src/utils/logger.js';

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  logger.info(`Club Manager app listening at ${PORT}`);
})

