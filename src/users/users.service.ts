import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entitites/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.usersRepository.find();
    return users;
  }

  async getUserById(id: number) {
    const user = await this.findOne(id);
    if (user.id == 1) {
      throw new ForbiddenException('Tú no tienes permitido acceder a este usuario.');
    }
    return user;
  }

  async create(user: CreateUserDto) {
    try {
      const newUser = await this.usersRepository.save(user);
      return newUser;
    } catch {
      throw new BadRequestException('Error al crear un usuario');
    }
  }

  async update(id: number, userChange: UpdateUserDto) {
    try {
      const user = await this.findOne(id);
      const updateUser = this.usersRepository.merge(user, userChange);
      return await this.usersRepository.save(updateUser);
    } catch {
      throw new BadRequestException('Error al actualizar un usuario');
    }
  }

  async delete(id: number) {
    const user = await this.findOne(id);
    await this.usersRepository.delete(user.id);
    return { message: 'Usuario eliminado', code: 202 };
  }

  private async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuario con el id ${id} no encontrado`);
    }
    return user;
  }
}
