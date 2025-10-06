export type User = {
    id: string;
    name: string;
    email: string;
    password: string;

    createdAt: Date;
    updatedAt: Date;
}

export type LoginUser = {
    email: string;
    password: string;
}

export type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;

    createdAt: Date;
    updatedAt: Date;
}

export type Category = {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}