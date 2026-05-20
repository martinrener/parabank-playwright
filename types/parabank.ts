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

export interface Account {
  id: number;
  customerId: number;
  type: string;
  balance: number;
}

export interface Transaction {
  id: number;
  accountId: number;
  type: string;
  date: string;
  amount: number;
  description: string;
}
