import userService from "../service/user-service.js";
class UserController {
	async registration(req, res, next) {
		try {
			const {email, password} = req.body;
			const userData = await userService.registration(email, password);
			res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
			return res.json(userData);
		} catch (err) {
			console.error(err);
		}
	}

	async login(req, res, next) {
		try {

		} catch (err) {
			console.error(err);
		}
	}

	async logout(req, res, next) {
		try {

		} catch (err) {
			console.error(err);
		}
	}

	async activate(req, res, next) {
		try {

		} catch (err) {
			console.error(err);
		}
	}

	async refresh(req, res, next) {
		try {

		} catch (err) {
			console.error(err);
		}
	}

	async users(req, res, next) {
		try {
			res.json(['qwqw', 'qwqwq']);
		} catch (err) {
			console.error(err);
		}
	}
}

export default new UserController();