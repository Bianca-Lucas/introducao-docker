import { ApiConsumes, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    description: 'Título do livro',
    example: 'O Senhor dos Anéis',
  })

  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Autor do livro',
    example: 'J.R.R. Tolkien',
  })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    description: 'Data de publicação do livro',
    example: '1954-07-29',
  })
  @IsDateString()
  @IsOptional()
  publicationDate?: string;

  @ApiProperty({
    description: 'Categoria do livro',
    example: 'Fantasia',
  })
  @IsString()
  @IsOptional()
  category?: string;
}
