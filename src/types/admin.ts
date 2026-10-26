export interface AdminDashboardStats {
  totalLeads: number;
  todayLeads: number;
  conversionRate: number; // 24.5%
  popularTrim: string;
  popularColor: string;
  avgEstimatedMonthly: number;
}

export interface AdminApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface AdminLeadFilter {
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}
