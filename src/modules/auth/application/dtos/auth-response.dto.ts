export class CurrentUserDto {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  roles: string[];
  permissions: string[];
}

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: CurrentUserDto;
}

export class TokenResponseDto {
  accessToken: string;
  refreshToken: string;
}

export class JwtPayloadDto {
  sub: string; // user id
  email: string;
  roles: string[];
  permissions: string[];
}
