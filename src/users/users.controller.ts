import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}
  @Get()
  getUsers() {
    return this.service.findAll();
  }

  @Get(':id')
  findUser(@Param('id') id: string) {
    return this.service.getUserById(id);
  }

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.service.create(body);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.service.update(id, body);
  }
}
