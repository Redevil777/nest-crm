import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { UserGenerationService } from './utils/user-generation/user.generation.service';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly userService: UserService,
		private readonly userGenerationService: UserGenerationService,
	) {}

	onModuleInit() {
		this.userGenerationService.validateAndGenerateUsers();
	}

}
