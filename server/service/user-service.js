import userModel from "../models/user-model.js";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import mailService from "./mail-service.js";
import tokenService from "./token-service.js";
import UserDto from "../dtos/user-dto.js";

class UserService {
	async registration(email, password) {
		const candidate = await userModel.findOne({email});
		if (candidate) {
			throw new Error(`Пользователь с почтовым адресом ${email} уже зарегистрирован`);
		}
		const hashPassword = await bcrypt.hash(password, 3);
		const activationLink = uuidv4();
		const user = await userModel.create({email, password: hashPassword, activationLink});
		await mailService.sendActivationLink(email, activationLink);

		const userDto = new UserDto(user);
		const tokens = tokenService.generateTokens({...userDto});

		await tokenService.saveToken(userDto.id, tokens.refreshToken);

		return {
			...tokens,
			user: userDto
		}
	}
}

export default new UserService();