export interface Project {
    id: string;
    title: string;
    description: string;
    location: string;
    category: string;
    surface?: number;
    duration?: string;
    budget?: string | number; // Merged type
    coverImage?: string;
    images: string[];
    status?: string;
    client?: string;
    year?: number;
    tags?: string[];
    features?: string[];
    type?: string; // from index.ts
    size?: number; // alias for surface?
    completionDate?: Date;
}

export interface ProcessStep {
    id: string;
    step: number;
    title: string;
    description: string;
    icon: string;
}

export interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
    features: string[];
    isActive: boolean;
    order: number;
    // Merged fields from index.ts
    priceRange?: string;
    category?: 'construction' | 'renovation' | 'energy' | 'consulting' | string;
    duration?: string;
}

export type ContactFormData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    projectType: string;
    budget: string;
    location: string;
    message: string;
};

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    experience: number;
    photo: string;
    specialties: string[];
}

export interface Quote {
    id: string;
    clientName: string;
    email: string;
    phone: string;
    projectType: 'house' | 'commercial' | 'renovation' | 'other';
    budget: number;
    description: string;
    urgency: 'low' | 'medium' | 'high';
    status: 'pending' | 'reviewed' | 'quoted' | 'accepted' | 'declined';
    createdAt: Date;
}

export interface QuoteRequest {
    clientName: string;
    email: string;
    phone: string;
    projectType: 'house' | 'commercial' | 'renovation' | 'other';
    budget: number;
    description: string;
    urgency: 'low' | 'medium' | 'high';
}
