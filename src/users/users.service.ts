import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { User } from './user.model';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: '1',
      name: 'Luis David',
      email: 'luisdavidld551@gmail.com',
    },
    {
      id: '2',
      name: 'Jenifer Karina',
      email: 'jenifer@gmail.com',
    },
    {
      id: '3',
      name: 'Jenifer Karina de Dominguez',
      email: 'jeniferD@gmail.com',
    },
  ];

  findAll() {
    return this.users;
  }

  getUserById(id: string) {
    const position = this.findOne(id);
    const user = this.users[position];
    if (user.id == '1') {
      throw new ForbiddenException('Tú no tienes permitido acceder a este usuario.');
    }
    return user;
  }
  create(user: CreateUserDto) {
    const newUser = {
      ...user,
      id: `${new Date().getTime()}`,
    };
    this.users.push(newUser);
    return newUser;
  }

  delete(id: string) {
    const position = this.findOne(id);
    this.users.splice(position, 1);
    return { message: 'Usuario eliminado', code: 202 };
  }

  update(id: string, user: UpdateUserDto) {
    const position = this.findOne(id);
    if (position !== -1) {
      this.users[position] = {
        ...this.users[position],
        ...user,
      };
    }
    return this.users[position];
  }
  private findOne(id: string) {
    const position = this.users.findIndex((user) => user.id === id);
    if (position === -1) {
      throw new NotFoundException(`Usuario con el id ${id} no encontrado`);
    }
    return position;
  }
}
