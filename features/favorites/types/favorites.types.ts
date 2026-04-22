export interface Favorite {
    id: string;
    userId: string;
    propertyId: string;
    createdAt: Date;
    property?: {
        id: string;
        title: string;
        price: number;
        // other fields if needed for display
    };
}
