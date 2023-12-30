import UsersServices from '../services/users.js';
import { routeLogger } from '../../../utils/logger.js';

export default class UsersController {

	constructor() {

		this.userServices = new UsersServices();

	}

	register = async (req, res) => {
		try {

			const newUser = await this.userServices.register(req.body)

			newUser
				? res.status(201).json(newUser)
				: res.status(404).json({ message: 'Error de registro' })

		} catch (error) {

			routeLogger(req, 'error', error);

		}
	};
	login = async (req, res) => {
		try {
			const response = await this.userServices.login(req.body)
			const { user, pass, ...errorResponse } = response

			if (!response.user)
				return res.status(404).send(errorResponse);

			if (response?.pass === false && response.user)
				return res.status(404).send(errorResponse);

			const { password, isAdmin, ...otherDetails } = response?.user._doc;

			res.cookie('access_token', response.token, { httpOnly: true, sameSite: 'none', secure: true})
				.status(200)
				.json({ ...{ ...otherDetails }, isAdmin });

		} catch (error) {

			routeLogger(req, 'error', error);

		}
	};
	getByUserName = async (req, res) => {

		try {
			console.log('HOLAAAAA HOLAAAAA')
			if (req.headers.cookie) {
				const usuario = await this.userServices
					.getByUserName(req.headers.authorization);
				
			usuario 
				res.json(usuario)

			} else {
				res.json(false)
			}

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

			user

				? res.json(user)

				: res.status(404).json(user);


		} catch (error) {

			routeLogger(req, 'error', error);;

		}

	}

	updateUserPassword = async (req, res) => {

		try {

			const updatedUser = await this.userServices
				.updateUserPassword(req.body);

			updatedUser

				? res.json(updatedUser)

				: res.status(404).json(updatedUser);

		} catch (error) {

			routeLogger(req, 'error', error);

		}

	}

	updateUser = async (req, res) => {

		try {

			const updatedUser = await this.userServices
				.updateUser(req.params.id, req.body);

			updatedUser

				? res.json(updatedUser)

				: res.status(404).json(updatedUser);

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
