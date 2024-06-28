export type UserType = {
  image?: string | undefined | null;
  name?: string | undefined | null;
  email?: string | undefined | null;
} | undefined;

export interface ServerResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}