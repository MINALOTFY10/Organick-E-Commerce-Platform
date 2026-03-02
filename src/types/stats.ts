export interface StatsOrderItem {
    id: string;
    total: number;
    status: string;
    createdAt: Date | string;
}

export interface StatsTopProduct {
    name?: string | null;
    totalSold: number;
    price?: number;
    imageUrl?: string | null;
    category?: { name: string } | string | null;
}

export interface StatsType {
    users: number;
    orders: number;
    products: number;
    categories: number;
    blogs: number;
    revenue: number;
    pendingOrders: number;
    lowStockProducts: number;
    recentOrders: StatsOrderItem[];
    topProducts: StatsTopProduct[];
    chartData: { name: string; total: number }[];
    salesByCategory: { name: string; value: number; color: string }[];
}
