/**
 * Type definitions for accounts and financial transactions
 */

import type { Id } from './common';

/** Transaction types */
export type TransactionType = 'Rent' | 'Deposit' | 'Expense' | 'Refund';

/** Transaction status */
export type TransactionStatus = 'Paid' | 'Pending' | 'Overdue';

/**
 * Transaction entity
 * Represents a financial transaction in the system
 */
export interface Transaction {
  id: Id;
  date: string; // ISO date string
  ref: string; // Reference number
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description?: string;
  tenantId?: Id;
  tenantName?: string;
}

/**
 * Account summary for dashboard
 */
export interface AccountSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  pendingAmount: number;
  overdueAmount: number;
}

/**
 * Monthly financial data
 */
export interface MonthlyFinance {
  month: string;
  income: number;
  expenses: number;
  net?: number;
}

/**
 * Yearly financial data
 */
export interface YearlyFinance {
  year: number;
  income: number;
  expenses: number;
  net?: number;
}

