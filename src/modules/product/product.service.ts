import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { QueryProductDto } from './dto/query-product.dto.js';
import { ProductResponseDto } from './dto/product-response.dto.js';
import { Prisma, Product } from '@prisma/client';
import { CategoryResponseDto } from '../category/dto/category-response.dto.js';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const { categoryId, sku, ...rest } = createProductDto;

    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    if (sku) {
      const existingProduct = await this.prisma.product.findUnique({
        where: { sku },
      });
      if (existingProduct) {
        throw new ConflictException(`Product with SKU ${sku} already exists`);
      }
    }

    const finalSku = sku || `SKU-${Date.now()}`;

    const product = await this.prisma.product.create({
      data: {
        ...rest,
        sku: finalSku,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return this.formatProduct(product);
  }

  async findAll(queryDto: QueryProductDto): Promise<{
    data: ProductResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const { page, limit, search, isActive, categoryId } = queryDto;

    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products.map((product) => this.formatProduct(product)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.formatProduct(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    const { categoryId, sku, ...rest } = updateProductDto;

    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }
    }

    if (sku && sku !== existingProduct.sku) {
      const skuTaken = await this.prisma.product.findUnique({
        where: { sku },
      });
      if (skuTaken) {
        throw new ConflictException(`Product with SKU ${sku} already exists`);
      }
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        sku,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return this.formatProduct(updatedProduct);
  }

  async remove(id: string): Promise<{ message: string }> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }

  private formatProduct(product: Product & { category?: any }): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description ?? '',
      price: Number(product.price),
      stock: product.stock,
      sku: product.sku,
      imageUrl: product.imageUrl ?? '',
      isActive: product.isActive,
      category: product.category
        ? {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
          description: product.category.description,
          image: product.category.imageUrl,
          isActive: product.category.isActive,
          createdAt: product.category.createdAt,
          updatedAt: product.category.updatedAt,
        }
        : undefined,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
