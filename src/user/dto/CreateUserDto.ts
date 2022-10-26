import { IsEmail, IsNumber, IsString, Min } from 'class-validator';

export class CreateUserDto {

	@IsNumber()
	@Min(0, {
		message: 'Balance can\'t be less than 0'
	})
	balance: number;

	@IsNumber()
	@Min(0, {
		message: 'Age can\'t be less than 0'
	})
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