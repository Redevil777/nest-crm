import { IsEmail, IsInt, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {

	@Type(() => Number)
	@Min(0, {
		message: 'Balance can\'t be less than 0'
	})
	@IsInt()
	balance: number;

	@Type(() => Number)
	@Min(0, {
		message: 'Age can\'t be less than 0'
	})
	@IsInt()
	age: number;

	@IsString()
	eyeColor: string;

	@IsString()
	name: string;

	@IsString()
	gender: string;

	@IsString()
	company: string;

	@IsEmail()
	email: string;

	@IsString()
	phone: string;

	@IsString()
	address: string;
}