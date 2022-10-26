import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Post,
	Put, Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUserDto';
import { UserService } from './user.service';
import { IdValidationPipe } from '../pipes/IdValidationPipe';
import { USER_ALREADY_EXIST_ERROR, USER_NOT_FOUND } from './user.constants';

export interface ISearchParams {
	skip: number;
	limit: number;
	name: string;
	email: string;
	company: string;
	isActive: string;
	fromAge: number;
	toAge: number;
	fromBalance: number;
	toBalance: number;
	sortByIsActive: number;
	sortByBalance: number;
	sortByAge: number;
	sortByEyeColor: number;
	sortByName: number;
	sortByGender: number;
	sortByCompany: number;
	sortByEmail: number;
	sortByPhone: number;
	sortByAddress: number;
}

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@UsePipes(new ValidationPipe())
	@Post()
	async create(@Body() createUserDto: CreateUserDto) {
		const oldUser = await this.userService.findUserByEmail(createUserDto.email);
		if (oldUser) {
			throw new BadRequestException(USER_ALREADY_EXIST_ERROR);
		}
		return this.userService.create(createUserDto);
	}

	// @Get('all')
	// async getAllUsers() {
	// 	return this.userService.findAll();
	// }

	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedUser = await this.userService.deleteById(id);
		if (!deletedUser) {
			throw new NotFoundException(USER_NOT_FOUND);
		}
	}

	@Put(':id')
	async updateById(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateUserDto) {
		const updatedUser = await this.userService.updateById(id, dto);
		if (!updatedUser) {
			throw new NotFoundException(USER_NOT_FOUND);
		}

		return updatedUser;
	}

	@Get('search')
	async search(@Query() query: ISearchParams) {
		return this.userService.search(query);
	}
}
