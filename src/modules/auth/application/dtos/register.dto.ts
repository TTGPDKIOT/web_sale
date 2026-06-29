import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength, Matches, IsOptional, IsMobilePhone } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    const phone = value.trim();
    return phone.length ? phone : undefined;
  })
  @IsMobilePhone()
  phone?: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;

  @IsString()
  fullName: string;
}
