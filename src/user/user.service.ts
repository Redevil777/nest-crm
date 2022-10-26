import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/CreateUserDto';
import { UserModel } from './user.model';
// import querystring from 'querystring';
import * as queryString from 'query-string';
import * as escapeString from 'escape-string';
import { ISearchParams } from './user.controller';
import e from 'express';

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
		const { name, company, email, isActive, fromAge, toAge, fromBalance, toBalance } = searchParams;
		const findParams: { [ index: string ]: any } = {};
		if (name || company || email) {
			const orParams = [];
			if (name) {
				const $regexName = new RegExp(escapeString.escapeString(searchParams.name));
				orParams.push({
					name: {
						$regex: $regexName,
						$options: 'i',
					}
				});
			}
			if (company) {
				const $regexName = new RegExp(escapeString.escapeString(searchParams.company));
				orParams.push({
					company: {
						$regex: $regexName,
						$options: 'i',
					}
				});
			}

			if (email) {
				const $regexName = new RegExp(escapeString.escapeString(searchParams.email));
				orParams.push({
					email: {
						$regex: $regexName,
						$options: 'i',
					}
				})
			}
			findParams['$or'] = orParams;
		}
		if (isActive) {
			findParams['isActive'] = isActive;
		}
		if (fromAge && toAge && fromAge < toAge) {
			findParams['age'] = {
				$gte: fromAge,
				$lte: toAge,
			}
		}
		if (fromBalance && toBalance && fromBalance < toBalance) {
			findParams['balance'] = {
				$gte: fromBalance,
				$lte: toBalance,
			}
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

	search(searchParams: ISearchParams) {
		const findParams = this.createFindParams(searchParams);

		const { skip = 0, limit = 10 } = searchParams;

		const sortParams = this.configSortParams(searchParams);

		return this.userModel.find(findParams)
			.skip(skip)
			.limit(limit)
			.sort(sortParams)
	}

}
