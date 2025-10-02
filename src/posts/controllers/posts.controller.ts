import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { PostsService } from '../services/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Payload } from '../../auth/models/payload.model';
import { Post as PostEntity } from '../entities/post.entity';

//@ApiOperation({ summary: 'Gestión de posts' })
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Crear un nuevo post' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.postsService.create(createPostDto, userId);
  }

  @ApiOperation({ summary: 'Obtener todos los posts' })
  @ApiResponse({ status: 200, description: 'Lista de posts obtenida correctamente.', type: PostEntity, isArray: true })
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un post por ID' })
  @ApiResponse({ status: 200, description: 'El Post.', type: PostEntity })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un post por ID' })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @ApiOperation({ summary: 'Publicar un post por ID' })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id/publish')
  publish(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.postsService.publish(id, userId);
  }

  @ApiOperation({ summary: 'Eliminar un post por ID' })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }
}
