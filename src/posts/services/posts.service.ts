import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { OpenaiService } from '../../ai/services/openai.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly openaiService: OpenaiService,
  ) {}

  async findAll() {
    const posts = await this.postsRepository.find({ relations: ['user.profile', 'categories'] });
    return posts;
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user.profile', 'categories'],
    });
    if (!post) {
      throw new NotFoundException(`Post con el id ${id} no encontrado`);
    }
    return post;
  }

  async create(post: CreatePostDto, userId: number) {
    try {
      const newPost = await this.postsRepository.save({
        ...post,
        user: { id: userId },
        categories: post.categoryIds?.map((id) => ({ id })),
      });
      return await this.findOne(newPost.id);
    } catch {
      throw new BadRequestException('Error al crear un post');
    }
  }

  async update(id: number, changes: UpdatePostDto) {
    try {
      const post = await this.findOne(id);
      const updatedPost = this.postsRepository.merge(post, changes);
      const savedPost = await this.postsRepository.save(updatedPost);
      return savedPost;
    } catch {
      throw new BadRequestException('Error al actualizar un post');
    }
  }

  async publish(id: number, userId: number) {
    const post = await this.findOne(id);
    if (post.user.id !== userId) {
      throw new ForbiddenException('No tienes permiso para publicar este post');
    }
    if (!post.content || !post.title || post.categories.length === 0) {
      throw new BadRequestException('El post contiene campos vacíos, el contenido, título y categoría son obligatorios');
    }
    const sumarry = await this.openaiService.generateSummary(post.content);
    const image = await this.openaiService.generateImage(sumarry);
    const changea = this.postsRepository.merge(post, {
      isDraft: false,
      summary: sumarry,
      coverImage: image,
    });
    const updatedPost = await this.postsRepository.save(changea);
    return this.findOne(updatedPost.id);
  }

  async remove(id: number) {
    try {
      await this.postsRepository.delete(id);
      return { message: 'Post eliminado' };
    } catch {
      throw new BadRequestException(`Error al eliminar el post con el id: ${id}`);
    }
  }

  async getPostsByCategoryId(categoryId: number) {
    const posts = await this.postsRepository.find({
      where: { categories: { id: categoryId } },
      relations: ['user.profile'],
    });
    if (!posts) {
      throw new NotFoundException(`No se encontraron posts para la categoria con el id ${categoryId}`);
    }
    return posts;
  }
}
