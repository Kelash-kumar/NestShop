import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({
        example: 'Electronics',
        description: 'Name of the category',
        maxLength: 100,
        minLength: 3,
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    name: string;


    @ApiProperty({
        example: 'Description of the category',
        description: 'Description of the category',
        maxLength: 255,
        minLength: 3,
        required: false,
    })
    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(255)
    description?: string;

    @ApiProperty({
        example: 'electronics',
        description: 'Slug of the category',
        maxLength: 100,
        minLength: 3,
        required: false,
    })
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    slug: string;

    @ApiProperty({
        example: 'https://example.com/image.jpg',
        description: 'Image URL of the category',
    })
    @IsString()
    @IsOptional()
    @IsUrl()
    imageUrl?: string;

    @ApiProperty({
        example: true,
        description: 'Is active of the category',
    })
    @IsBoolean()
    isActive?: boolean;
}
