import nodemailer from 'nodemailer';

class MailService {
	constructor() {
		// TODO: разобраться с отправкой email
		const smtpConfig = {
			service: 'gmail',//process.env.SMTP_SERVICE,
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: true,
			logger: true,
			// secure: false,
			// ignoreTLS: true,
			debug: true,
			auth: {
			  // TODO: replace `user` and `pass` values from <https://forwardemail.net>
				// user: process.env.SMTP_USER,
				// pass: process.env.SMTP_PASS,
				// type: "OAuth2",
				// user: process.env.SMTP_USER,
				// clientId: "323709727023-jk8vkjvkh89t1hfjgtta7g3fbk7ogi4e.apps.googleusercontent.com",
				// clientSecret: "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",
				// refreshToken: "REFRESH_TOKEN_HERE"    
			},
			// tls: {
			// 	rejectUnAuthorized: true
			// }
		}

		this.transporter = nodemailer.createTransport(smtpConfig)
	}	

	async sendActivationLink(to, link) {
		console.log(process.env);
		await this.transporter.sendMail({
			from: process.env.SMTP_USER, // sender address
			to, // list of receivers
			subject: `Активация аккаунта на ${process.env.API_URL}`, // Subject line
			text: '', // plain text body
			html: `
				<div>
					<h1>Для активации аккаунта перейдите по ссылке</h1>
					<a href="${link}">${link}</a>
				</div>
			`,
		});
	}
}

export default new MailService();