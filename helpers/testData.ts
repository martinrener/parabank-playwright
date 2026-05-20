import type { RegistrationData, TransferPayload } from '../types/parabank';

export function uniqueUsername(): string {
  return `user_${Date.now()}`;
}

export function uniquePassword(): string {
  return `pass_${Date.now()}`;
}

export function buildRegistrationData(): RegistrationData {
  return {
    firstName: 'Test',
    lastName: 'User',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    ssn: '123-45-6789',
    username: uniqueUsername(),
    password: uniquePassword(),
  };
}

export function buildTransferPayload(fromId: string, toId: string): TransferPayload;
export function buildTransferPayload(fromId: string, toId: string, amount: number): TransferPayload;
export function buildTransferPayload(fromId: string, toId: string, overrides: Partial<TransferPayload>): TransferPayload;
export function buildTransferPayload(
  fromId: string,
  toId: string,
  amountOrOverrides?: number | Partial<TransferPayload>,
): TransferPayload {
  const base: TransferPayload = { fromId, toId, amount: 100 };

  if (typeof amountOrOverrides === 'number') {
    return { ...base, amount: amountOrOverrides };
  }

  if (typeof amountOrOverrides === 'object') {
    return { ...base, ...amountOrOverrides };
  }

  return base;
}
