import { ApiProperty } from "@nestjs/swagger";
import { CategoryResponseDto } from "../../category/dto/category-response.dto.js";


export class ProductResponseDto {
    @ApiProperty({
        example: '1',
        description: 'ID of the product',
        required: true,
    })
    id: string;

    @ApiProperty({
        example: 'Product 1',
        description: 'Name of the product',
        required: true,
    })
    name: string;

    @ApiProperty({
        example: 'Description of the product',
        description: 'Description of the product',
    })
    description: string;

    @ApiProperty({
        example: 100,
        description: 'Price of the product',
    })
    price: number;

    @ApiProperty({
        example: 10,
        description: 'Stock of the product',
        required: true,
    })
    stock: number;

    @ApiProperty({
        example: 'https://example.com/image.jpg',
        description: 'Image URL of the product',
    })
    imageUrl: string;

    @ApiProperty({
        example: 'SKU-123',
        description: 'SKU of the product',
    })
    sku: string;

    @ApiProperty({
        example: true,
        description: 'Is product active',
    })
    isActive: boolean;

    @ApiProperty({
        description: 'Category of the product',
        type: () => CategoryResponseDto
    })
    category?: CategoryResponseDto;

    @ApiProperty({
        example: '2022-01-01T00:00:00.000Z',
        description: 'Created at of the product',
        required: true,
    })
    createdAt: Date;

    @ApiProperty({
        example: '2022-01-01T00:00:00.000Z',
        description: 'Updated at of the product',
        required: true,
    })
    updatedAt: Date;
}