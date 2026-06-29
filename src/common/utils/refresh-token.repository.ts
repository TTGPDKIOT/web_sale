export abstract class RefreshTokenRepository {
  abstract findById(id: string): Promise<any | null>;
  abstract findByTokenHash(tokenHash: string): Promise<any | null>;
  abstract findActiveTokensByUserId(userId: string): Promise<any[]>;
  abstract create(refreshToken: any): Promise<any>;
  abstract update(id: string, data: Partial<any>): Promise<any | null>;
  abstract revokeToken(id: string): Promise<void>;
  abstract revokeAllUserTokens(userId: string): Promise<void>;
}
