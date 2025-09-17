import { User } from '@/entities/user.entity.js';
import { IUserRepository } from '@/application/dependency-interfaces/repositories/user.repository.js';
import { UserModel } from './schemas/user.schema.js';

export class UserMongoRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    try {
      const userData = await UserModel.findById(id).exec();
      if (!userData) return null;

      return new User({
        id: userData._id.toString(),
        name: userData.name,
        email: userData.email,
        passwordHash: userData.passwordHash,
        role: userData.role as 'admin' | 'user',
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      });
    } catch (error) {
      throw new Error(
        `Failed to find user by ID: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const userData = await UserModel.findOne({ email: email.toLowerCase() }).exec();
      if (!userData) return null;

      return new User({
        id: userData._id.toString(),
        name: userData.name,
        email: userData.email,
        passwordHash: userData.passwordHash,
        role: userData.role as 'admin' | 'user',
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      });
    } catch (error) {
      throw new Error(
        `Failed to find user by email: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const usersData = await UserModel.find().exec();
      return usersData.map(
        (userData) =>
          new User({
            id: userData._id.toString(),
            name: userData.name,
            email: userData.email,
            passwordHash: userData.passwordHash,
            role: userData.role as 'admin' | 'user',
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
          }),
      );
    } catch (error) {
      throw new Error(
        `Failed to find all users: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async add(user: User): Promise<User> {
    try {
      const userData = new UserModel({
        _id: user.id,
        name: user.name,
        email: user.email.toLowerCase(),
        passwordHash: user.getPasswordHash(),
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

      await userData.save();
      return user;
    } catch (error) {
      if (error instanceof Error && error.message.includes('duplicate key')) {
        throw new Error('User with this email already exists');
      }
      throw new Error(
        `Failed to add user: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async update(user: User): Promise<User> {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        user.id,
        {
          name: user.name,
          email: user.email.toLowerCase(),
          passwordHash: user.getPasswordHash(),
          role: user.role,
          updatedAt: user.updatedAt,
        },
        { new: true, runValidators: true },
      ).exec();

      if (!updatedUser) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error(
        `Failed to update user: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async delete(user: User): Promise<void> {
    try {
      const result = await UserModel.findByIdAndDelete(user.id).exec();
      if (!result) {
        throw new Error('User not found');
      }
    } catch (error) {
      throw new Error(
        `Failed to delete user: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
