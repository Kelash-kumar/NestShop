import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        description: "Email of the user",
        example: "[EMAIL_ADDRESS]"
    })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        description: "Password of the user",
        example: "password123"
    })
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @IsNotEmpty()
    password: string

    @ApiProperty({
        description: "First name of the user",
        example: "John"
    })
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    @IsNotEmpty()
    firstName: string

    @ApiProperty({
        description: "Last name of the user",
        example: "Doe"
    })
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    @IsNotEmpty()
    lastName: string

    @ApiProperty({
        description: "Role of the user",
        example: "USER"
    })
    @IsEnum(Role)
    @IsNotEmpty()
    role: Role
}
