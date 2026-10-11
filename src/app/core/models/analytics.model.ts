export interface DashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  inProductionOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  pendingQuotes: number;
  totalQuotes: number;
  totalCustomers: number;
  totalActiveProducts: number;
}

export interface RevenueByMonth {
  month: string;
  revenue: number;
}

export interface TopProduct {
  productId: number;
  productName: string;
  totalQuantitySold: number;
}
