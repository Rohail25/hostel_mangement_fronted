/**
 * FP&A Mock Data
 * Comprehensive test data matching API response structure
 */

export const FPA_MOCK_DATA = {
  // ===== Summary Data =====
  summary: {
    success: true,
    data: {
      keyMetrics: {
        netIncome: {
          value: 125000,
          yoyGrowth: 15.5,
          label: 'NET INCOME',
        },
        totalRevenue: {
          value: 450000,
          label: 'TOTAL REVENUE',
        },
        totalExpenses: {
          value: 325000,
          label: 'TOTAL EXPENSES',
        },
        profitMargin: {
          value: 27.78,
          label: 'PROFIT MARGIN',
        },
      },
      breakEvenAnalysis: {
        breakEvenRevenue: 290000,
        marginOfSafety: {
          value: 160000,
          percentage: 35.56,
        },
        contributionMargin: 185000,
        contributionMarginRatio: 41.11,
      },
      performanceMetrics: {
        netProfitGrowth: 15.5,
        collectionEfficiency: 94.2,
        annualRevPAU: 45000,
        monthlyRevPAU: 3750,
        contributionMarginRatio: 41.11,
        // New Metrics
        monthlyBills: 450000,
        monthlyRent: 3750,
        totalPayable: 425000,
      },
      summary: {
        month: 1,
        monthName: 'January',
        year: 2026,
        totalIncome: 450000,
        totalExpense: 325000,
        netIncome: 125000,
        profitMargin: 27.78,
        expenseRatio: 72.22,
        yoyGrowth: 15.5,
        id: 1,
        profit: 125000,
        breakeven: 290000,
        cashflowRatio: 1.38,
        createdAt: '2026-01-28T10:00:00Z',
        updatedAt: '2026-01-28T10:00:00Z',
        hostelId: null,
      },
      operational: {
        totalTenants: 120,
        totalRooms: 40,
        totalBeds: 120,
      },
    },
    message: 'FP&A Summary Generated Successfully',
    statusCode: 200,
  },

  // ===== Monthly Comparison Data =====
  monthlyComparison: {
    success: true,
    data: {
      year: 2026,
      monthlyData: [
        {
          month: 1,
          monthName: 'January',
          income: 450000,
          expense: 325000,
          netIncome: 125000,
          bills: 450000,
          rent: 3750,
          payable: 425000,
        },
        {
          month: 2,
          monthName: 'February',
          income: 465000,
          expense: 330000,
          netIncome: 135000,
          bills: 465000,
          rent: 3875,
          payable: 440000,
        },
        {
          month: 3,
          monthName: 'March',
          income: 480000,
          expense: 335000,
          netIncome: 145000,
          bills: 480000,
          rent: 4000,
          payable: 455000,
        },
        {
          month: 4,
          monthName: 'April',
          income: 470000,
          expense: 340000,
          netIncome: 130000,
          bills: 470000,
          rent: 3917,
          payable: 445000,
        },
        {
          month: 5,
          monthName: 'May',
          income: 490000,
          expense: 345000,
          netIncome: 145000,
          bills: 490000,
          rent: 4083,
          payable: 465000,
        },
        {
          month: 6,
          monthName: 'June',
          income: 505000,
          expense: 350000,
          netIncome: 155000,
          bills: 505000,
          rent: 4208,
          payable: 478000,
        },
        {
          month: 7,
          monthName: 'July',
          income: 520000,
          expense: 355000,
          netIncome: 165000,
          bills: 520000,
          rent: 4333,
          payable: 493000,
        },
        {
          month: 8,
          monthName: 'August',
          income: 510000,
          expense: 360000,
          netIncome: 150000,
          bills: 510000,
          rent: 4250,
          payable: 483000,
        },
        {
          month: 9,
          monthName: 'September',
          income: 485000,
          expense: 355000,
          netIncome: 130000,
          bills: 485000,
          rent: 4042,
          payable: 460000,
        },
        {
          month: 10,
          monthName: 'October',
          income: 495000,
          expense: 350000,
          netIncome: 145000,
          bills: 495000,
          rent: 4125,
          payable: 470000,
        },
        {
          month: 11,
          monthName: 'November',
          income: 515000,
          expense: 358000,
          netIncome: 157000,
          bills: 515000,
          rent: 4292,
          payable: 488000,
        },
        {
          month: 12,
          monthName: 'December',
          income: 530000,
          expense: 365000,
          netIncome: 165000,
          bills: 530000,
          rent: 4417,
          payable: 502000,
        },
      ],
    },
    message: 'Monthly Comparison Data Retrieved',
    statusCode: 200,
  },

  // ===== Category Breakdown =====
  categoryBreakdown: {
    success: true,
    data: {
      income: {
        total: 450000,
        categories: [
          {
            id: 1,
            name: 'Room Rent',
            value: 360000,
            percent: 0.8,
          },
          {
            id: 2,
            name: 'Utility Bills',
            value: 54000,
            percent: 0.12,
          },
          {
            id: 3,
            name: 'Parking Fees',
            value: 27000,
            percent: 0.06,
          },
          {
            id: 4,
            name: 'Other Services',
            value: 9000,
            percent: 0.02,
          },
        ],
      },
      expenses: {
        total: 325000,
        categories: [
          {
            id: 1,
            name: 'Staff Salary',
            value: 130000,
            percent: 0.4,
          },
          {
            id: 2,
            name: 'Maintenance',
            value: 65000,
            percent: 0.2,
          },
          {
            id: 3,
            name: 'Utilities',
            value: 81250,
            percent: 0.25,
          },
          {
            id: 4,
            name: 'Insurance',
            value: 32500,
            percent: 0.1,
          },
          {
            id: 5,
            name: 'Other Expenses',
            value: 16250,
            percent: 0.05,
          },
        ],
      },
    },
    message: 'Category Breakdown Retrieved',
    statusCode: 200,
  },

  // ===== Cash Flow Data =====
  cashFlow: {
    success: true,
    data: {
      cashFlow: [
        {
          month: 'Jan',
          income: 450000,
          expense: 325000,
          net: 125000,
          cumulative: 125000,
        },
        {
          month: 'Feb',
          income: 465000,
          expense: 330000,
          net: 135000,
          cumulative: 260000,
        },
        {
          month: 'Mar',
          income: 480000,
          expense: 335000,
          net: 145000,
          cumulative: 405000,
        },
        {
          month: 'Apr',
          income: 470000,
          expense: 340000,
          net: 130000,
          cumulative: 535000,
        },
        {
          month: 'May',
          income: 490000,
          expense: 345000,
          net: 145000,
          cumulative: 680000,
        },
        {
          month: 'Jun',
          income: 505000,
          expense: 350000,
          net: 155000,
          cumulative: 835000,
        },
        {
          month: 'Jul',
          income: 520000,
          expense: 355000,
          net: 165000,
          cumulative: 1000000,
        },
        {
          month: 'Aug',
          income: 510000,
          expense: 360000,
          net: 150000,
          cumulative: 1150000,
        },
        {
          month: 'Sep',
          income: 485000,
          expense: 355000,
          net: 130000,
          cumulative: 1280000,
        },
        {
          month: 'Oct',
          income: 495000,
          expense: 350000,
          net: 145000,
          cumulative: 1425000,
        },
        {
          month: 'Nov',
          income: 515000,
          expense: 358000,
          net: 157000,
          cumulative: 1582000,
        },
        {
          month: 'Dec',
          income: 530000,
          expense: 365000,
          net: 165000,
          cumulative: 1747000,
        },
      ],
    },
    message: 'Cash Flow Data Retrieved',
    statusCode: 200,
  },

  // ===== Financial Ratios =====
  ratios: {
    success: true,
    data: {
      ratios: {
        profitMargin: {
          value: 27.78,
          label: 'Profit Margin',
          benchmark: 25,
          trend: 'up',
        },
        expenseRatio: {
          value: 72.22,
          label: 'Expense Ratio',
          benchmark: 70,
          trend: 'down',
        },
        currentRatio: {
          value: 2.15,
          label: 'Current Ratio',
          benchmark: 2.0,
          trend: 'up',
        },
        operatingExpenseRatio: {
          value: 35.5,
          label: 'Operating Expense Ratio',
          benchmark: 40,
          trend: 'down',
        },
        returnOnRevenue: {
          value: 28.5,
          label: 'Return on Revenue',
          benchmark: 25,
          trend: 'up',
        },
      },
    },
    message: 'Financial Ratios Retrieved',
    statusCode: 200,
  },
};

/**
 * Helper function to get mock data for a specific month
 */
export const getMockMonthData = (month: number, year: number) => {
  const monthData = FPA_MOCK_DATA.monthlyComparison.data.monthlyData.find(
    m => m.month === month
  );
  
  if (!monthData) {
    return FPA_MOCK_DATA.summary.data;
  }

  // Calculate metrics for the selected month
  const monthMetrics = {
    ...FPA_MOCK_DATA.summary.data,
    summary: {
      ...FPA_MOCK_DATA.summary.data.summary,
      month,
      monthName: monthData.monthName,
      year,
      totalIncome: monthData.income,
      totalExpense: monthData.expense,
      netIncome: monthData.netIncome,
      profitMargin: ((monthData.netIncome / monthData.income) * 100),
      expenseRatio: ((monthData.expense / monthData.income) * 100),
    },
    performanceMetrics: {
      ...FPA_MOCK_DATA.summary.data.performanceMetrics,
      monthlyBills: monthData.bills,
      monthlyRent: monthData.rent,
      totalPayable: monthData.payable,
    },
    keyMetrics: {
      netIncome: {
        ...FPA_MOCK_DATA.summary.data.keyMetrics.netIncome,
        value: monthData.netIncome,
      },
      totalRevenue: {
        ...FPA_MOCK_DATA.summary.data.keyMetrics.totalRevenue,
        value: monthData.income,
      },
      totalExpenses: {
        ...FPA_MOCK_DATA.summary.data.keyMetrics.totalExpenses,
        value: monthData.expense,
      },
    },
  };

  return monthMetrics;
};
