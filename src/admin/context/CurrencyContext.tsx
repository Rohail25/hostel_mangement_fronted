/**
 * Currency Context
 * Provides user's selected currency throughout the application
 */

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import * as currencyApiService from '../services/currency-api.service';
import type { Currency } from '../services/currency-api.service';

interface CurrencyContextType {
  currency: Currency | null;
  isLoading: boolean;
  refreshCurrency: () => Promise<void>;
  currencySymbol: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCurrency = async () => {
    try {
      setIsLoading(true);
      const data = await currencyApiService.getUserCurrencyAPI();
      setCurrency(data);
    } catch (error) {
      console.error('Error fetching currency:', error);
      setCurrency(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCurrency();
  }, []);

  const currencySymbol = currency?.symbol || '$';

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        isLoading,
        refreshCurrency,
        currencySymbol,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

/**
 * Hook to use Currency context
 */
export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};
