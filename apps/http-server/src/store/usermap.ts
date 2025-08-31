import { User } from "../types/types";

export const users = new Map<string, User>();

export function getUserByEmail(email: string): User | undefined {
  return users.get(email);
}

export function getUserById(id: string): User | undefined {
  return Array.from(users.values()).find(u => u.id === id);
}

export function addUser(user: User) {
  users.set(user.email, user);
}

export function updateUser(user: User) {
  users.set(user.email, user);
}
