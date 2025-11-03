/**
 * Tabs component
 * Tabbed navigation interface
 */

import React from 'react';
import { clsx } from 'clsx';

export interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  /** Available tabs */
  tabs: Tab[];
  /** Currently active tab ID */
  activeTab: string;
  /** Tab change handler */
  onChange: (tabId: string) => void;
}

/**
 * Tabs component for content switching
 */
export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="border-b border-slate-200">
      <nav className="flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={clsx(
                  'ml-2 py-0.5 px-2 rounded-full text-xs',
                  activeTab === tab.id
                    ? 'bg-brand-100 text-brand-600'
                    : 'bg-slate-100 text-slate-600'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

