export type User = {
    id?: string;
    name: string;
    email: string;
    password?: string;
}

export type LoginUser = {
    email: string;
    password: string;
}

export type Product = {
    id?: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    categoryId: string;
    companyId: string;
}

export type Category = {
    id?: string;
    name: string;
}

export type Company = {
    id: string;
    name: string;
    address?: string;
    phone?: string;
    email?: string;
}