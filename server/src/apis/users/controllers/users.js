
export default class UsersController {

	constructor(userServices) {

		this.userServices = userServices;

	}

	register = async (req, res, next) => {
		try {
			const newUser = await this.userServices.register(req.body)

			newUser
				? res.status(201).json(newUser)
				: res.status(404).json({ message: 'Error de registro' })

		} catch (error) {

			next(error)

		}
	};
	login = async (req, res, next) => {
		try {

			const response = await this.userServices.login(req.body)

			res.json(response);

		} catch (error) {

			next(error)

		}
	};
	getByUserName = async (req, res, next) => {

		try {

			const usuario = await this.userServices
				.getByUserName(req.headers.authorization);

			usuario
			res.json(usuario)

		} catch (error) {

			next(error)

		}

	}

	deleteById = async (req, res, next) => {

		try {

			const isUserDeleted = await this.userServices
				.deleteById(req.params.id);

			res.status(200).json(isUserDeleted)

		} catch (error) {

			next(error)

		}

	}

	getAllUsers = async (req, res, next) => {

		try {
			const users = await this.userServices
				.getAllUsers();

			res.json(users);

		} catch (error) {

			next(error)

		}

	}

	getById = async (req, res, next) => {

		try {

			const user = await this.userServices
				.getById(req.params.id);

			res.json(user)

		} catch (error) {

			next(error);

		}

	}

	updateUserPassword = async (req, res, next) => {

		try {

			const updatedUser = await this.userServices
				.updateUserPassword(req.body);

			updatedUser

				? res.json(updatedUser)

				: res.status(404).json(updatedUser);

		} catch (error) {

			next(error)

		}

	}

	updateUser = async (req, res, next) => {

		try {

			const updatedUser = await this.userServices
				.updateUser(req.params.id, req.body);

			res.json(updatedUser)

		} catch (error) {

			next(error)

		}

	}

	updateUserReserves = async (req, res, next) => {

		try {

			const updatedUser = await this.userServices
				.updateUserReserves(req.params.username, req.body);

			updatedUser

			res.json(updatedUser)

		} catch (error) {

			next(error)

		}

	}

	deleteReserveById = async (req, res, next) => {

		try {

			let deletedReserve = await this.userServices.
				deleteReserveById(req.body.username, req.body.reserveId)

			res.json(deletedReserve);

		} catch (error) {

			next(error)

		}
	}

}
