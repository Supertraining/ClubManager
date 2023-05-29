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

			usuario
				? res.json(usuario)
				: res.status(404).json(usuario)

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

			req.logout((error) => {

				if (error) {

					logger.error('Error en cierre de sesión');

				} else {

					logger.info('session eliminada con éxito');

				}

			});

			res.json(true);

		} catch (error) {

			routeLogger(req, 'error', error);

		}

	}

	failLogin = (req, res) => {

		try {

			res.status(404).end();

		} catch (error) {

			routeLogger(req, 'error', error);

		}

	}


	deleteById = async (req, res) => {

		try {

			const deletedUser = await this.userServices
				.deleteById(req.params.id);

			deletedUser

				? res.status(200).json(deletedUser.deletedCount)

				: res.status(404).json(deletedUser.deletedCount);

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

			user

				? res.json(user)

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
	updateUserReserves = async (req, res) => {

		try {

			const updatedUser = await this.userServices
				.updateUserReserves(req.params.username, req.body);

			updatedUser

				? res.json(updatedUser)

				: res.status(404).json(false);

		} catch (error) {

			routeLogger(req, 'error', error);

		}

	}

	deleteReserveById = async (req, res) => {

		try {
			
			let deletedReserve = await this.userServices.
				deleteReserveById(req.body.username, req.body.reserveId)
			
			res.json(deletedReserve);

		} catch (error) {

			routeLogger(req, 'error', error);

		}
	}

}
