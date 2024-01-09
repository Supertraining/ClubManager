import winston, { format } from 'winston';
import chalk from 'chalk';

const { combine, prettyPrint, timestamp, errors } = winston.format;

const LEVEL = Symbol.for('level');
function filterOnly(level) {

	return format(function (info) {

		if (info[LEVEL] === level) {

			return info;

		}

	})();
}

const logger = winston.createLogger(
	
	{
		format: combine(errors({ stack: true }), timestamp(), prettyPrint()),
		transports: [
			new winston.transports.Console({ level: 'info', format: filterOnly('info') }),
			new winston.transports.File({ level: 'warn', format: filterOnly('warn'), filename: './src/log/warn.log' }),
			new winston.transports.File({ level: 'error', format: filterOnly('error'), filename: './src/log/error.log', }),
		],

	}

);

export const routeLogger = async (req, lvl, error) => {

	try {

		if (lvl == 'info') {

			logger.info(`Ruta ${req.method} ${req.url}`);

		} else if (lvl == 'warn') {

			logger.warn(`Ruta ${req.method} ${req.url} no esta implementada`);

		} else if (lvl == 'error') {

			logger.error(`Ha ocurrido un error en la ruta ${req.method} ${req.url}, ${error}`);

		}

	} catch (error) {

		logger.error(error);

	}
	
};

export const errorLogger = async (err, additionalInfo) => {

	try {

		if (!additionalInfo) {
			logger.error(err.stack);
			
			return;
		}

		const errorMessage = `Error occurred: ${err.message}\nAdditional Info:\n
		Route: ${additionalInfo.route} 
		Method: ${additionalInfo.method}
		IP: ${additionalInfo.ip}
		User_agent: ${additionalInfo.user_agent}
		user: ${additionalInfo.user?.username}
		Stack Trace: ${err.stack}\n\n`;

		logger.error(errorMessage)

		console.error(chalk.red.bold('Error occurred, check error.log file for more details'));

	} catch (error) {

		logger.error(error);

	}
	
};

export default logger;
