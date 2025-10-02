import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCategoryDto } from './../dto/create-category.dto';
import { UpdateCategoryDto } from './../dto/update-category.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './../entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async findAll() {
    const categories = await this.categoriesRepository.find();
    return categories;
  }

  async findOne(id: number) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`La categoria con el id ${id} no se encuentra`);
    }
    return category;
  }

  async create(body: CreateCategoryDto) {
    try {
      const newCategory = await this.categoriesRepository.save(body);
      return this.findOne(newCategory.id);
    } catch {
      throw new BadRequestException('Error al crear una categoria');
    }
  }

  async update(id: number, changes: UpdateCategoryDto) {
    try {
      const category = await this.findOne(id);
      const updatedCategory = this.categoriesRepository.merge(category, changes);
      const savedCategory = await this.categoriesRepository.save(updatedCategory);
      return savedCategory;
    } catch {
      throw new BadRequestException('Error al atualizar una categoria');
    }
  }

  async remove(id: number) {
    try {
      await this.categoriesRepository.delete(id);
      return { message: 'Categoria eliminada' };
    } catch {
      throw new BadRequestException('Error al eliminar una categoria');
    }
  }
}
