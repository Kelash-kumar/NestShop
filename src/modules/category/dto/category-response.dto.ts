import { ApiProperty } from "@nestjs/swagger";

export class CategoryResponseDto {
    @ApiProperty({
        description: "Category id",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    id: string;

    @ApiProperty({
        description: "Category name",
        example: "Electronics",
    })
    name: string;

    @ApiProperty({
        description: "Category description",
        example: "Electronics",
    })
    description?: string;

    @ApiProperty({
        description: "Category image",
        example: "https://example.com/image.jpg",
    })
    image?: string;

    @ApiProperty({
        description: "Category slug",
        example: "electronics",
    })
    slug?: string;

    @ApiProperty({
        description: "Category product count",
        example: 10,
    })
    productCount?: number;

    @ApiProperty({
        description: "Category is active",
        example: true,
    })
    isActive?: boolean;

    @ApiProperty({
        description: "Category created at",
        example: "2022-01-01T00:00:00.000Z",
    })
    createdAt: Date;

    @ApiProperty({
        description: "Category updated at",
        example: "2022-01-01T00:00:00.000Z",
    })
    updatedAt: Date;
}
