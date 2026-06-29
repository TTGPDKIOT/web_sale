export interface IHashService {
  hash(plaintext: string, salt?: number | string): Promise<string>;
  compare(plaintext: string, hash: string): Promise<boolean>;
}

// Mock implementation - will be replaced with bcrypt in actual usage
export class HashService implements IHashService {
  async hash(plaintext: string, salt: number | string = 10): Promise<string> {
    // This will be replaced with bcrypt in the actual implementation
    // For now, we'll use a placeholder
    return plaintext;
  }

  async compare(plaintext: string, hash: string): Promise<boolean> {
    // This will be replaced with bcrypt comparison
    return plaintext === hash;
  }
}
