import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() data: CreateUserDto): Promise<UserEntity> {
    return this.userService.create(data);
  }

  @Get()
  findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string): Promise<UserEntity> {
    return this.userService.findByName(name);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.remove(+id);
  }
}
