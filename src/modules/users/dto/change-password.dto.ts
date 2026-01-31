import { IsNotEmpty, IsString, MinLength, MaxLength, IsStrongPassword, Matches } from "class-validator";

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    currentPassword: string


    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    @IsStrongPassword()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        })
    newPassword: string
}