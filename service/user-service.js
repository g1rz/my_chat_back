import userModel from "../models/user-model.js";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import mailService from "./mail-service.js";
import tokenService from "./token-service.js";
import UserDto from "../dtos/user-dto.js";
import ApiError from "../exceptions/ApiError.js";

class UserService {
	async registration(email, password) {
		const candidate = await userModel.findOne({email});
		if (candidate) {
			throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже зарегистрирован`);
		}
		const hashPassword = await bcrypt.hash(password, 3);
		const activationLink = uuidv4();
		const user = await userModel.create({email, password: hashPassword, activationLink});
		// TODO: разобраться с отправкой email
		// await mailService.sendActivationLink(email, `${process.env.API_URL}/api/activate/${activationLink}`);

		const userDto = new UserDto(user);
		const tokens = tokenService.generateTokens({...userDto});

		await tokenService.saveToken(userDto.id, tokens.refreshToken);

		return {
			...tokens,
			user: userDto
		}
	}

	async activate(activationLink) {
		const user = await userModel.findOne({activationLink});

		if (!user) {
			throw ApiError.BadRequest('Некорректная ссылка активации');
		}

		user.isActivated = true;
		await user.save();
	}

	async login(email, password) {
		
		const user = await userModel.findOne({email});
		if (!user) {
			throw ApiError.BadRequest('Пользователь с таким email не найден');
		} 

		const isPassEquals = await bcrypt.compare(password, user.password);

		if (!isPassEquals) {
			throw ApiError.BadRequest('Пароль неверный');
		}

		const userDto = new UserDto(user);
		const tokens = tokenService.generateTokens({...userDto});

		await tokenService.saveToken(userDto.id, tokens.refreshToken);

		return {
			...tokens,
			user: userDto
		}
	}

	async logout(refreshToken) {
		const token = tokenService.removeToken(refreshToken);
		return token;
	}

	async refresh(refreshToken) {
		if (!refreshToken) {
			throw ApiError.UnAuthorizedError();
		}
		const userData = tokenService.validateRefreshToken(refreshToken);
		const tokenFromDB = await tokenService.findToken(refreshToken);

		if (!userData || !tokenFromDB) {
			throw ApiError.UnAuthorizedError();
		}
		const user = await userModel.findById(userData.id);
		const userDto = new UserDto(user);
		const tokens = tokenService.generateTokens({...userDto});

		await tokenService.saveToken(userDto.id, tokens.refreshToken);

		return {
			...tokens,
			user: userDto
		}
	}

	async getAllUsers() {
		const users = await userModel.find();
		return users;
	}
}

export default new UserService();