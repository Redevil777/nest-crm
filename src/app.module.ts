import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoUri } from './configs/mongo.config';
import { UserGenerationModule } from './utils/user-generation/user.generation.module';

@Module({
	imports: [
		UserModule,
		UserGenerationModule,
		ConfigModule.forRoot(),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				uri: getMongoUri(configService),
			}),
		})
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
