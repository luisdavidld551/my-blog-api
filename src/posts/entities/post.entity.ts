import { User } from '../../users/entitites/users.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, JoinTable, ManyToMany } from 'typeorm';
import { Category } from './category.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'posts' })
export class Post {
  @ApiProperty({ description: 'Identificador único del post' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ description: 'Título del post' })
  title: string;

  @ApiProperty({ description: 'Contenido del post', required: false })
  @Column({ type: 'text', nullable: true })
  content: string;

  @ApiProperty({ description: 'URL de la imagen de portada', required: false })
  @Column({ type: 'varchar', length: 900, name: 'cover_image', nullable: true })
  coverImage: string;

  @ApiProperty({ description: 'Resumen del post', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  summary: string;

  @ApiProperty({ description: 'Indica si el post es un borrador', default: true })
  @Column({ type: 'boolean', default: true, name: 'is_draft', nullable: true })
  isDraft: boolean;

  @ApiProperty({ description: 'Fecha de creación del post' })
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización del post' })
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Category, (category) => category.posts)
  @JoinTable({
    name: 'posts_categories',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];
}
