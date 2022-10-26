import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as cliProgress from 'cli-progress';
import * as colors from 'ansi-colors';
import { Logger } from '@nestjs/common';
import { UserModel } from '../../user/user.model';

const REQUIRED_USER_AMOUNTS = 1000000;

interface FakeData {
	firstNames: string[],
	lastNames: string[],
	companies: string[],
	eyeColor: string[],
	address: string[],
}

@Injectable()
export class UserGenerationService {
	constructor(
		private readonly userService: UserService,
	) {}

	private readonly logger = new Logger(UserGenerationService.name);

	async validateAndGenerateUsers() {
		const currentUserAmount = await this.userService.getUserAmount();

		const diff = REQUIRED_USER_AMOUNTS - currentUserAmount;
		if (diff > 0) {
			return this.generateUsers(diff);
		}
		this.logger.log('Minimum number of users already created');
	}

	async generateUsers(newUsersAmount: number) {
		const fakeData = this.getFile();
		const newUsers: UserModel[] = [];
		this.logger.log(`Started to generate ${newUsersAmount} new users`);

		const pb = this.createCliProgressInstance();
		pb.start(newUsersAmount, 0);
		let insertedUsers = 0;
		for (let i = 0; i < newUsersAmount; i++) {
			const newUser = this.generateUser(fakeData);
			newUsers.push(newUser);
			if (newUsers.length % Math.floor(newUsersAmount / 10) === 0) {
				insertedUsers += newUsers.length;
				await this.insertUsersToDatabase(newUsers.splice(0, newUsers.length));
				pb.update(insertedUsers);
			}
		}
		await this.insertUsersToDatabase(newUsers);
		pb.update(insertedUsers + newUsers.length);
		pb.stop();

		this.logger.log(`User generation finished`);
	}

	insertUsersToDatabase(users: UserModel[]) {
		return this.userService.insertMany(users);
	}

	getRandomEmail() {
		const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
		let email = '';
		for (let i = 0; i < 15; i++){
			email += chars[Math.floor(Math.random() * chars.length)];
		}
		return `${email}@gmail.ru`;
	}

	getRandomPhoneNumber() {
		return Math.floor(Math.random() * 9) + 1;
	}

	getRandomPhoneCode() {
		const randomNumber = Math.floor(Math.random() * 3) + 1;
		if (randomNumber === 1) return '29';
		if (randomNumber === 2) return '33';
		if (randomNumber === 3) return '44';
	}

	generateUser(fakeData: FakeData): UserModel {
		const isActive = !!Math.floor(Math.random() * 2);
		const firstName = fakeData.firstNames[Math.floor(Math.random() * fakeData.firstNames.length)];
		const lastName = fakeData.lastNames[Math.floor(Math.random() * fakeData.lastNames.length)];
		const name = `${firstName} ${lastName}`;
		const balance = Math.floor(Math.random() * 1000000);
		const age = Math.floor(Math.random() * (100-18)) + 18;
		const eyeColor = fakeData.eyeColor[Math.floor(Math.random() * fakeData.eyeColor.length)];
		const gender = Math.floor(Math.random() * 2) === 1 ? 'male' : 'female';
		const company = fakeData.companies[Math.floor(Math.random() * fakeData.companies.length)];
		const email = this.getRandomEmail();
		const phone = `+375(${this.getRandomPhoneCode()}) ${this.getRandomPhoneNumber()}${this.getRandomPhoneNumber()}${this.getRandomPhoneNumber()}-${this.getRandomPhoneNumber()}${this.getRandomPhoneNumber()}-${this.getRandomPhoneNumber()}${this.getRandomPhoneNumber()}`;
		const address = fakeData.address[Math.floor(Math.random() * fakeData.address.length)];
		return {
			isActive,
			balance,
			age,
			eyeColor,
			name,
			gender,
			company,
			email,
			phone,
			address,
		};
	}

	getFile(): FakeData {
		return JSON.parse(readFileSync(join(process.cwd(), 'user-fake-data.json'), { encoding: 'utf8' }));
	}

	createCliProgressInstance() {
		return new cliProgress.SingleBar({
			format: 'User Generation Progress |' + colors.cyan('{bar}') + ' | {percentage}% | {value}/{total} ',
			barCompleteChar: '\u2588',
			barIncompleteChar: '\u2591',
			hideCursor: true
		});
	}
}