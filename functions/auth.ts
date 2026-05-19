import { type APIRequestContext } from '@playwright/test';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  address: Address;
  phoneNumber: string;
  ssn: string;
}

export async function getCustomer(
  request: APIRequestContext,
  username: string,
  password: string,
): Promise<Customer> {
  const baseUrl = process.env.API_BASE_URL;
  const response = await request.get(`${baseUrl}/login/${username}/${password}`, {
    headers: { Accept: 'application/json' },
  });
  const data = await response.json();
  return {
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    address: data.address,
    phoneNumber: data.phoneNumber,
    ssn: data.ssn,
  };
}
