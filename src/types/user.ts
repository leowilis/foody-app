export interface AuthUser {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly avatar: string | null;
}

export interface User extends AuthUser {
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}
