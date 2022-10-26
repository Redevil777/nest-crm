import { Module } from '@nestjs/common';
import { UserGenerationService } from './user.generation.service';
import { UserModule } from '../../user/user.module';

@Module({
	imports: [UserModule],
	providers: [UserGenerationService],
	exports: [UserGenerationService]
})
export class UserGenerationModule {}
