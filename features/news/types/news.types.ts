export type NewsAuthor = {
    id: string;
    firstName: string;
    lastName: string;
};

export type NewsItem = {
    id: string;
    title: string;
    slug: string;
    content?: string;
    excerpt: string | null;
    coverImage: string | null;
    images?: string[];
    category: string;
    tags?: string[];
    publishedAt: string;
    author: NewsAuthor;
};
