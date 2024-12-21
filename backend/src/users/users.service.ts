import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import { AuthRole } from 'src/common/const/auth.const';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findAllSellers(): Promise<User[]> {
    return this.userModel.find({ role: AuthRole.Seller }).exec();
  }

  async createUser(email: string, password: string): Promise<User> {
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('Пользователь уже существует');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ email, password: hashedPassword });
    return newUser.save();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(_id: string): Promise<User | null> {
    return this.userModel.findOne({ _id }).exec();
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<User> | null> {
    const user = await this.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async findUsersByIds(ids: string[]): Promise<User[]> {
    return this.userModel.find({ _id: { $in: ids } }).exec();
  }

  async update(user: User, updateDto: Partial<User>): Promise<User> {
    const userId = user._id.toString();
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId, // ID автомобиля, который нужно обновить
      updateDto, // Данные для обновления
      { new: true }, // Опция: вернуть обновленный документ
    );

    if (!updatedUser) {
      throw new Error(`Seller Request with ID ${user._id} not found`);
    }

    return updatedUser;
  }
}
