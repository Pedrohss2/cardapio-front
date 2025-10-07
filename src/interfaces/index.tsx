export type User = {
    name: string;
    email: string;
    password: string;
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
}

export type Category = {
    id: string;
    name: string;

}