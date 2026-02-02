import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Min,
    MinLength,
} from 'class-validator';

export class CreateProductDto {
    @ApiProperty({
        example: 'Product 1',
        description: 'Name of the product',
    })
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'Description of the product',
        description: 'Description of the product',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: 100.5,
        description: 'Price of the product',
    })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price: number;

    @ApiProperty({
        example: 10,
        description: 'Stock of the product',
    })
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    stock: number;

    @ApiProperty({
        example: 'SKU-123',
        description: 'SKU of the product',
        required: false,
    })
    @IsString()
    @IsOptional()
    sku?: string;

    @ApiProperty({
        example: 'https://example.com/image.jpg',
        description: 'Image URL of the product',
        required: false,
    })
    @IsOptional()
    imageUrl?: string;

    @ApiProperty({
        example: '1',
        description: 'Category ID of the product',
    })
    @IsString()
    @IsNotEmpty()
    categoryId: string;
}
