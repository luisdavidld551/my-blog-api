import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { ConfigService } from '@nestjs/config';
import { Env } from './env.model';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly service: UsersService,
    private readonly configService: ConfigService<Env>,
  ) {}

  @Get()
  getHello(): string {
    const myVar = this.configService.get('MY_VAR', { infer: true });
    const message = this.appService.getHello();
    return `${message} ${myVar}`;
  }

  @Get('usersApi')
  getUsers() {
    return this.service.findAll();
  }
}
