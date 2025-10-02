import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsNumber, IsArray } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Título del post' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Contenido del post', required: false })
  content?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'URL de la imagen de portada', required: false })
  coverImage?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Resumen del post', required: false })
  summary?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  @ApiProperty({ description: 'IDs de las categorías asociadas al post', type: [Number], required: false })
  categoryIds: number[];
}
