import UserDAO from "../DAOs/users.js";
import logger from "../utils/logger.js";

export default class UsersRepo {

	constructor() {

		this.dao = new UserDAO();

	}

	async getByUserName(username) {

		try {

			const user = await this.dao
				.getByUserName(username)
				
			return user

		} catch (err) {

			logger.error(err);

		}

	}

	async insertUser(data) {
	
		try {
			
			let newUser = await this.dao
				.insertUser(data);
			
			return newUser 

		} catch (err) {

			logger.error(err);

		}

	}

	async deleteById(id) {

		try {

			const data = await this.dao
				.deleteById(id);
			
			return data;

		} catch (err) {

			logger.error(err);

		}

	}

	async getAllUsers() {

		try {

			const data = await this.dao
				.getAllUsers();
			
			return data

		} catch (err) {

			logger.error(err);

		}

	}

	async getById(id) {
		
		try {

			const data = await this.dao
				.getById(id);
			
			return data; 

		}
		catch (err) {
			
			logger.error(err);

		}

	}

	async updateUser(id, data) {

		try {
			
			const newUser = await this.dao
				.updateUser(id, data);
			
			return newUser;

		} catch (err) {

			logger.error(err);

		}

	}

}


