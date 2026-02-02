import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryProductDto {
    @ApiPropertyOptional({
        description: 'Page number for pagination',
        example: 1,
        default: 1,
        minimum: 1,
    })
    @IsOptional()
    @Type(() => Number)
    page = 1;

    @ApiPropertyOptional({
        description: 'Number of items per page for pagination',
        example: 10,
        default: 10,
        minimum: 1,
    })
    @IsOptional()
    @Type(() => Number)
    limit = 10;

    @ApiPropertyOptional({
        description: 'Search term to filter products by name or description',
        example: 'electronics',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: 'Filter by active status' })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({ description: 'Filter by category ID' })
    @IsOptional()
    @IsString()
    categoryId?: string;
}
