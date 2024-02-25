import ApiError from "../exceptions/ApiError.js";
import tokenService from "../service/token-service.js";

export default function(req, res, next) {
	try {
		const authorizationHeader = req.headers.authorization;
		console.log('authorizationHeader', authorizationHeader);
		if (!authorizationHeader) {
			return next(ApiError.UnAuthorizedError());
		}

		const accessToken = authorizationHeader.split(' ')[1];
		if (!accessToken) {
			return next(ApiError.UnAuthorizedError());
		}

		const userData = tokenService.validateAccessToken(accessToken);
		if (!userData) {
			return next(ApiError.UnAuthorizedError());
		}

		req.user = userData;
		next();
	} catch(err) {
		return next(ApiError.UnAuthorizedError());
	}
}