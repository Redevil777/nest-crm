import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Min } from 'class-validator';

@Schema()
export class UserModel {

	@Prop()
	isActive: boolean;

	@Prop()
	balance: number;

	@Prop()
	age: number;

	@Prop()
	eyeColor: string;

	@Prop()
	name: string;

	@Prop()
	gender: string;

	@Prop()
	company: string;

	@Prop({ unique: true })
	email: string;

	@Prop()
	phone: string;

	@Prop()
	address: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
UserSchema.index({ name: 'text', email: 'text', company: 'text' });
