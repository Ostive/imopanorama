export interface Faq {
    id: string;
    question: string;
    answer: string;
    category: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface FaqFormData {
    question: string;
    answer: string;
    category: string;
    order: number;
    isActive: boolean;
}

export interface FaqFilter {
    category?: string;
    isActive?: boolean;
    search?: string;
}

export interface FaqSearchParams {
    page?: number;
    limit?: number;
    category?: string;
    isActive?: boolean;
    search?: string;
    enabled?: boolean;
}
