import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';

@Module({
	imports: [
		MongooseModule.forFeature([{
			schema: UserSchema,
			name: 'User',
		}])
	],
	providers: [UserService],
	controllers: [UserController],
	exports: [UserService]
})
export class UserModule {}
