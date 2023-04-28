import UsersServices from '../services/users.js';
import logger, { routeLogger } from '../utils/logger.js';

export default class UsersController {

	constructor() {

		this.userServices = new UsersServices();

	}


	getByUserName = async (req, res) => {

		try {
			
			const usuario = await this.userServices
				.getByUserName(req.user?.username);
		
			 res.json(usuario);

		} catch (error) {

			routeLogger(req, 'error', error);

		}

	}

	failRegister = async (req, res) => {
		try {

			res.status(404).json({ message: 'Error de registro' });

		} catch (error) {

			routeLogger(req, 'error', error);

		}
	}

	logout = async (req, res) => {

		try {

			res.json({ message: `Hasta luego ${req.user.username}` });


			setTimeout(() => {

				req.logout((error) => {

					if (error) {

						logger.error('Error en cierre de sesión');

					} else {

						logger.info('session eliminada con éxito');

					}

				});
			}, 2000);

		} catch (error) {

			routeLogger(req, 'error', error);

		}

	}

	failLogin = async (req, res) => {

		try {

			res.status(404).json({ message: 'Error en el login' });

		} catch (error) {

			routeLogger(req, 'error', error);

		}

	}


	deleteById = async (req, res) => {

		try {

			const deletedUser = await this.userServices
				.deleteById(req.params.id);

			deletedUser.data

				? res.status(200).json(deletedUser)

				: res.status(404).json(deletedUser);

		} catch (error) {

			routeLogger(req, 'error', error);

		}

	}

	getAllUsers = async (req, res) => {

		try {

			const users = await this.userServices
				.getAllUsers();

			res.json(users);

		} catch (error) {

			routeLogger(req, 'error', error);

		}

	}

	getById = async (req, res) => {

		try {

			const user = await this.userServices
				.getById(req.params.id);

			user.data

				? res.status(200).json(user)

				: res.status(404).json(user);


		} catch (error) {

			routeLogger(req, 'error', error);;

		}

	}

	updateUser = async (req, res) => {

		try {

			const updatedUser = await this.userServices
				.updateUser(req.params.id, req.body);
			updatedUser.data

				? res.json(updatedUser)

				: res.status(404).json(updatedUser.message);

		} catch (error) {

			routeLogger(req, 'error', error);

		}

	}

}
