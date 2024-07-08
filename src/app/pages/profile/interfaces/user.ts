export interface User {
  id: number;
  name: string;
  email: string;
  registry: {
    name: string;
    surname: string;
    fiscalcode?: string;
    company_name?: string;
    country: string;
    cca2: string;
    ccn3: string;
    vat: string;
    phone: string;
    phone_whatsapp: string;
    licensenumber: string;
  }
}
