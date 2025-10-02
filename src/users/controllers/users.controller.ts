import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { UsersService } from '../services/users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}
  @Get()
  getUsers() {
    return this.service.findAll();
  }

  @Get(':id/profile')
  getProfile(@Param('id', ParseIntPipe) id: number) {
    return this.service.findProfileByUserId(id);
  }
  @Get(':id/posts')
  getPosts(@Param('id', ParseIntPipe) id: number) {
    return this.service.findPostsByUserId(id);
  }

  @Get(':id')
  findUser(@Param('id', ParseIntPipe) id: number) {
    return this.service.getUserById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.service.create(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
    return this.service.update(id, body);
  }
}
