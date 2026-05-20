import type { BaseAPI } from '../fixtures/BaseAPI';

export async function login(api: BaseAPI, username: string, password: string): Promise<string> {
  const { id } = await api.login(username, password);
  return String(id);
}
