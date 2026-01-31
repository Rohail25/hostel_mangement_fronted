/**
 * FP&A Service - Financial Planning & Analysis API integration
 */

import { api } from '../../services/apiClient';
import { API_ROUTES } from '../../services/api.config';
import type { ApiResponse } from '../../services/apiClient';
import { FPA_MOCK_DATA } from '../mock/fpa.mock';

// ===== FLAG TO TOGGLE BETWEEN MOCK AND REAL API =====
// Set to TRUE to use mock data, FALSE to use real API
const USE_MOCK_DATA = false; // Using real API - integrated with backend
// ===== END FLAG =====

/**
 * FP&A Summary Response Types
 */
export interface FPASummaryResponse {
  success: boolean;
  data: {
    keyMetrics: {
      netIncome: {
        value: number;
        yoyGrowth: number;
        label: string;
      };
      totalRevenue: {
        value: number;
        label: string;
      };
      totalExpenses: {
        value: number;
        label: string;
      };
      profitMargin: {
        value: number;
        label: string;
      };
    };
    breakEvenAnalysis: {
      breakEvenRevenue: number;
      marginOfSafety: {
        value: number;
        percentage: number;
      };
      contributionMargin: number;
      contributionMarginRatio: number;
    };
    performanceMetrics: {
      netProfitGrowth: number;
      collectionEfficiency: number;
      annualRevPAU: number;
      monthlyRevPAU: number;
      contributionMarginRatio: number;
      // New Metrics
      monthlyBills: number;
      monthlyRent: number;
      totalPayable: number;
    };
    summary: {
      month: string;
      monthName: string;
      year: number;
      totalIncome: number;
      totalExpense: number;
      netIncome: number;
      profitMargin: number;
      expenseRatio: number;
      yoyGrowth: number;
      id: number;
      profit: number;
      breakeven: number;
      cashflowRatio: number;
      createdAt: string;
      updatedAt: string;
      hostelId: number | null;
    };
    operational: {
      totalTenants: number;
      totalRooms: number;
      totalBeds: number;
    };
  };
  message: string;
  statusCode: number;
}

export interface MonthlyComparisonResponse {
  success: boolean;
  data: {
    year: number;
    monthlyData: Array<{
      month: number;
      monthName: string;
      income: number;
      expense: number;
      netIncome: number;
    }>;
  };
  message: string;
  statusCode: number;
}

export interface CategoryBreakdownResponse {
  success: boolean;
  data: {
    income: {
      total: number;
      categories: Array<{
        name?: string;
        category?: string;
        value?: number;
        amount?: number;
      }>;
    };
    expenses: {
      total: number;
      categories: Array<{
        name?: string;
        category?: string;
        value?: number;
        amount?: number;
      }>;
    };
  };
  message: string;
  statusCode: number;
}

export interface CashFlowResponse {
  success: boolean;
  data: {
    year: number;
    cashFlow: Array<{
      month: number;
      monthName: string;
      monthAbbr: string;
      income: number;
      expense: number;
      netIncome: number;
      cumulativeCashFlow: number;
    }>;
  };
  message: string;
  statusCode: number;
}

export interface FinancialRatiosResponse {
  success: boolean;
  data: {
    ratios: {
      profitMargin: {
        value: number;
        label: string;
        description: string;
      };
      expenseRatio: {
        value: number;
        label: string;
        description: string;
      };
      currentRatio: {
        value: number;
        label: string;
        description: string;
      };
      operatingExpenseRatio: {
        value: number;
        label: string;
        description: string;
      };
      returnOnRevenue: {
        value: number;
        label: string;
        description: string;
      };
    };
    summary: {
      totalIncome: number;
      totalExpense: number;
      netIncome: number;
    };
  };
  message: string;
  statusCode: number;
}

/**
 * Get FP&A Summary
 * @param params - Query parameters (year, month, hostelId)
 */
export const getFPASummary = async (params?: {
  year?: number;
  month?: number;
  hostelId?: number;
}): Promise<FPASummaryResponse> => {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return FPA_MOCK_DATA.summary as FPASummaryResponse;
  }

  const queryParams = new URLSearchParams();
  if (params?.year) queryParams.append('year', params.year.toString());
  if (params?.month) queryParams.append('month', params.month.toString());
  if (params?.hostelId) queryParams.append('hostelId', params.hostelId.toString());

  const url = `${API_ROUTES.FPA.SUMMARY}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get<FPASummaryResponse['data']>(url) as Promise<FPASummaryResponse>;
};

/**
 * Get Monthly Comparison Data
 * @param params - Query parameters (year, hostelId)
 */
export const getMonthlyComparison = async (params?: {
  year?: number;
  hostelId?: number;
}): Promise<MonthlyComparisonResponse> => {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return FPA_MOCK_DATA.monthlyComparison as MonthlyComparisonResponse;
  }

  const queryParams = new URLSearchParams();
  if (params?.year) queryParams.append('year', params.year.toString());
  if (params?.hostelId) queryParams.append('hostelId', params.hostelId.toString());

  const url = `${API_ROUTES.FPA.MONTHLY_COMPARISON}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get<MonthlyComparisonResponse['data']>(url) as Promise<MonthlyComparisonResponse>;
};

/**
 * Get Category Breakdown
 * @param params - Query parameters (year, month, hostelId)
 */
export const getCategoryBreakdown = async (params?: {
  year?: number;
  month?: number;
  hostelId?: number;
}): Promise<CategoryBreakdownResponse> => {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return FPA_MOCK_DATA.categoryBreakdown as CategoryBreakdownResponse;
  }

  const queryParams = new URLSearchParams();
  if (params?.year) queryParams.append('year', params.year.toString());
  if (params?.month) queryParams.append('month', params.month.toString());
  if (params?.hostelId) queryParams.append('hostelId', params.hostelId.toString());

  const url = `${API_ROUTES.FPA.CATEGORIES}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get<CategoryBreakdownResponse['data']>(url) as Promise<CategoryBreakdownResponse>;
};

/**
 * Get Cash Flow Analysis
 * @param params - Query parameters (year, hostelId)
 */
export const getCashFlow = async (params?: {
  year?: number;
  hostelId?: number;
}): Promise<CashFlowResponse> => {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return FPA_MOCK_DATA.cashFlow as CashFlowResponse;
  }

  const queryParams = new URLSearchParams();
  if (params?.year) queryParams.append('year', params.year.toString());
  if (params?.hostelId) queryParams.append('hostelId', params.hostelId.toString());

  const url = `${API_ROUTES.FPA.CASH_FLOW}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get<CashFlowResponse['data']>(url) as Promise<CashFlowResponse>;
};

/**
 * Get Financial Ratios
 * @param params - Query parameters (year, hostelId)
 */
export const getFinancialRatios = async (params?: {
  year?: number;
  hostelId?: number;
}): Promise<FinancialRatiosResponse> => {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return FPA_MOCK_DATA.ratios as FinancialRatiosResponse;
  }

  const queryParams = new URLSearchParams();
  if (params?.year) queryParams.append('year', params.year.toString());
  if (params?.hostelId) queryParams.append('hostelId', params.hostelId.toString());

  const url = `${API_ROUTES.FPA.RATIOS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get<FinancialRatiosResponse['data']>(url) as Promise<FinancialRatiosResponse>;
};

/**
 * Download FP&A PDF Report
 * @param params - Query parameters (year, month, hostelId, viewType)
 */
export const downloadFPAPDF = async (params?: {
  year?: number;
  month?: number;
  hostelId?: number;
  viewType?: 'monthly' | 'yearly';
}): Promise<void> => {
  const queryParams = new URLSearchParams();
  if (params?.year) queryParams.append('year', params.year.toString());
  if (params?.month) queryParams.append('month', params.month.toString());
  if (params?.hostelId) queryParams.append('hostelId', params.hostelId.toString());
  if (params?.viewType) queryParams.append('viewType', params.viewType);

  const url = `${API_ROUTES.FPA.PRINT}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  try {
    // Import axios and config for blob download
    const axios = (await import('axios')).default;
    const { API_BASE_URL } = await import('../../services/api.config');
    const { getToken } = await import('../../services/auth.storage');
    
    const token = getToken();
    const fullUrl = `${API_BASE_URL}${url}`;
    
    const response = await axios.get(fullUrl, {
      responseType: 'blob',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });

    // Create blob and download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url_blob = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url_blob;
    link.download = `FP&A-Report-${params?.viewType || 'monthly'}-${params?.year || new Date().getFullYear()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url_blob);
  } catch (error: any) {
    console.error('Error downloading PDF:', error);
    throw new Error(error?.response?.data?.message || 'Failed to download PDF');
  }
};

