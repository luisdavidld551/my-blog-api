import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entitites/users.entity';
import { Repository } from 'typeorm';
import { Profile } from '../entitites/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async findAll() {
    const users = await this.usersRepository.find({ relations: ['profile'] });
    return users;
  }

  async getUserById(id: number) {
    const user = await this.findOne(id);
    if (user.id == 1) {
      throw new ForbiddenException('Tú no tienes permitido acceder a este usuario.');
    }
    return user;
  }

  async findProfileByUserId(id: number) {
    const user = await this.findOne(id);
    return user.profile;
  }

  async findPostsByUserId(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: ['posts'],
    });
    if (!user) {
      throw new NotFoundException(`Usuario con el id ${id} no encontrado`);
    }
    return user.posts;
  }
  async create(user: CreateUserDto) {
    try {
      const newUser = this.usersRepository.create(user);
      const savedUser = await this.usersRepository.save(newUser);
      return this.findOne(savedUser.id);
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
    try {
      await this.usersRepository.delete(id);
      return { message: 'Usuario eliminado', code: 202 };
    } catch {
      throw new BadRequestException(`Error al eliminar el usuario con el id: ${id}`);
    }
  }

  private async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: ['profile'],
    });
    if (!user) {
      throw new NotFoundException(`Usuario con el id ${id} no encontrado`);
    }
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`Usuario con el email ${email} no encontrado`);
    }
    return user;
  }
}
