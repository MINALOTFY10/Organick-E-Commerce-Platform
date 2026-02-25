export interface Product {
    id: string;
    name: string;
    summary: string;
    description: string;
    additionalInfo?: string | null;
    price: number;
    salePrice?: number | null;
    stock: number;
    imageUrl?: string | null;
    categoryName: string;
    createdAt: Date;
    updatedAt: Date;
}