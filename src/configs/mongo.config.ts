import { ConfigService } from '@nestjs/config';
import {
	MongooseModuleOptions,
} from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';

export const getMongoConfig = async (configService: ConfigService): Promise<MongooseModuleOptions> => {
	return {
		uri: getMongoUri(configService),
		...getMongoOptions()
	};
};

export const getMongoUri = (configService: ConfigService): string => {
	console.log(`mongodb://${configService.get('MONGO_LOGIN')}:${configService.get('MONGO_PASSWORD')}@${configService.get('MONGO_HOST')}:${configService.get('MONGO_PORT')}/${configService.get('MONGO_AUTH_DB')}`);
	return `mongodb://${configService.get('MONGO_LOGIN')}:${configService.get('MONGO_PASSWORD')}@${configService.get('MONGO_HOST')}:${configService.get('MONGO_PORT')}/${configService.get('MONGO_AUTH_DB')}`;
};

const getMongoOptions = (): MongooseModuleOptions => ({
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});