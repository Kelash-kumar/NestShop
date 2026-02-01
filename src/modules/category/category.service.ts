import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Category, Prisma } from '@prisma/client';
import { CategoryResponseDto } from './dto/category-response.dto.js';
import { QueryCategoryDto } from './dto/query-category.dto.js';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const { name, slug, ...rest } = createCategoryDto;

    const generatedSlug = await this.generateSlug(slug);

    //create new category
    const category = await this.prisma.category.create({
      data: {
        name,
        slug: generatedSlug,
        ...rest,
      },
    });

    return this.formatCategory(category, 0);
  }

  //get all categories
  async findAll(queryDto: QueryCategoryDto): Promise<{
    data: CategoryResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const { page, limit, search, isActive } = queryDto;

    // const where = this.prisma.category.buildQuery();
    const where: Prisma.CategoryWhereInput = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              products: true
            }
          }
        }
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      data: categories.map((category) => this.formatCategory(category, category._count.products)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  //get category by id
  async findOne(id: string): Promise<CategoryResponseDto> {

    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    if (!category) {
      throw new NotFoundException('Category not found for id: ' + id);
    }
    return this.formatCategory(category, category._count.products);
  }

  //find category by slug

  // Get category by slug
  async findBySlug(slug: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found for slug: ' + slug);
    }

    return this.formatCategory(category, Number(category._count.products));
  }

  // Updatecategory
  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    if (
      updateCategoryDto.slug &&
      updateCategoryDto.slug !== existingCategory.slug
    ) {
      const slugTaken = await this.prisma.category.findUnique({
        where: { slug: updateCategoryDto.slug },
      });

      if (slugTaken) {
        throw new ConflictException(
          `Category with slug ${updateCategoryDto.slug} already exists`,
        );
      }
    }

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return this.formatCategory(
      updatedCategory,
      Number(updatedCategory._count.products),
    );
  }

  // Remove a catgory
  async remove(id: string): Promise<{ message: string }> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category._count.products > 0) {
      throw new BadRequestException(
        `Cannot delete category with ${category._count.products} products. Remove or reassign first`,
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: `Category delete successfully` };
  }

  //function to generate slug
  private async generateSlug(slug: string): Promise<string> {
    let generatedSlug = slug.toLowerCase().trim();
    generatedSlug = generatedSlug.replace(/[^a-z0-9]+/g, '-');
    generatedSlug = generatedSlug.replace(/^-|-$/g, '');

    //check if slug already exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug: generatedSlug },
    });

    if (existingCategory) {
      throw new BadRequestException('Category already exists with this slug');
    }
    return generatedSlug;
  }

  //function to format category
  private formatCategory(category: Category, productCount?: number): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? undefined,
      image: category.imageUrl ?? undefined,
      isActive: category.isActive,
      productCount,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
