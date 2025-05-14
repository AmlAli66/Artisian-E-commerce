interface ProductDetails {
    burnTime: string;
    weight: string;
    scentNotes: string[];
    mood: string[];
}

export interface Product {
    id: number;
    name: string;
    price: number;
    categoryId: number;
    description: string;
    details: ProductDetails;
    images: string[];
    artistId: number;
    artistName: string;
    inStock: boolean;
    featured: boolean;
    seasonal?: boolean;
}