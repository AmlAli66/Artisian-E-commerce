export interface Artist {
    id: number;
    name: string;
    bio: string;
    imageUrl: string;
    expertise: string[];
    featured?: boolean;
}
