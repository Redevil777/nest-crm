import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/CreateUserDto';
import { UserModel } from './user.model';
import * as escapeString from 'escape-string';
import { ISearchParams } from './user.controller';

@Injectable()
export class UserService {
	constructor(
		@InjectModel('User') private readonly userModel: Model<UserModel>
	) {}

	async create(user: CreateUserDto) {
		return this.userModel.create(user);
	}

	// findAll() {
	// 	return this.userModel.find({}).exec();
	// }

	deleteById(id: string) {
		return this.userModel.findByIdAndRemove(id).exec();
	}

	updateById(id: string, dto: CreateUserDto) {
		return this.userModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}

	findUserByEmail(email: string) {
		return this.userModel.findOne({ email }).exec();
	}

	insertMany(users: CreateUserDto[]) {
		return this.userModel.insertMany(users);
	}

	getUserAmount() {
		return this.userModel.countDocuments().exec();
	}

	private createFindParams(searchParams: ISearchParams) {
		const { searchInput, isActive, ageFrom, ageTo, balanceFrom, balanceTo } = searchParams;
		const findParams: { [ index: string ]: any } = {};
		if (searchInput) {
			const $regexSearchInput = new RegExp(escapeString.escapeString(searchParams.searchInput));
			findParams['$or'] = [
				{
					name: {
						$regex: $regexSearchInput,
						$options: 'i',
					}
				},
				{
					company: {
						$regex: $regexSearchInput,
						$options: 'i',
					}
				},
				{
					email: {
						$regex: $regexSearchInput,
						$options: 'i',
					}
				}
			];
		}
		if (isActive) {
			findParams['isActive'] = isActive;
		}
		if (ageFrom) {
			if (!findParams.age) findParams.age = {};
			findParams.age['$gte'] = ageFrom;
		}
		if (ageTo) {
			if (!findParams.age) findParams.age = {};
			findParams.age['$lte'] = ageTo;
		}
		if (balanceFrom) {
			if (!findParams.balance) findParams.balance = {};
			findParams.balance['$gte'] = balanceFrom;
		}
		if (balanceTo) {
			findParams.balance['$lte'] = balanceTo;
		}

		return findParams;
	}

	private configSortParams(searchParams: ISearchParams) {
		const {
			sortByName, sortByBalance, sortByCompany, sortByAddress, sortByAge,
			sortByGender, sortByEmail, sortByPhone, sortByIsActive, sortByEyeColor
		} = searchParams;

		const sortParams: { [ index: string ]: any } = {};

		if (sortByName) {
			sortParams['name'] = sortByName;
		}
		if (sortByBalance) {
			sortParams['balance'] = sortByBalance;
		}
		if (sortByCompany) {
			sortParams['company'] = sortByCompany;
		}
		if (sortByAddress) {
			sortParams['address'] = sortByAddress;
		}
		if (sortByAge) {
			sortParams['age'] = sortByAge;
		}
		if (sortByGender) {
			sortParams['gender'] = sortByGender;
		}
		if (sortByEmail) {
			sortParams['email'] = sortByEmail;
		}
		if (sortByPhone) {
			sortParams['phone'] = sortByPhone;
		}
		if (sortByIsActive) {
			sortParams['isActive'] = sortByIsActive;
		}
		if (sortByEyeColor) {
			sortParams['eyeColor'] = sortByEyeColor;
		}
		return sortParams;
	}

	async search(searchParams: ISearchParams) {
		const findParams = this.createFindParams(searchParams);

		const { skip = 0, limit = 10 } = searchParams;

		const sortParams = this.configSortParams(searchParams);

		const userInfo = await Promise.all([
			this.userModel.find(findParams)
				.skip(skip)
				.limit(limit)
				.sort(sortParams),
			this.userModel.countDocuments(findParams)
		]);

		return {
			users: userInfo[0],
			userAmount: userInfo[1],
		}

	}

}
