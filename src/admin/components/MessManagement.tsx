/**
 * Mess Management component
 * Manages day-by-day mess entries with breakfast, lunch, and dinner
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, PencilIcon, TrashIcon, CalendarIcon, CurrencyDollarIcon, CubeIcon, XMarkIcon, SunIcon, MoonIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from './Button';
import { Toast } from './Toast';
import { ConfirmDialog } from './ConfirmDialog';
import { Tabs } from './Tabs';
import { DataTable } from './DataTable';
import type { Column } from './DataTable';
import type { MessEntry, MessFormData, MealType } from '../types/hostel';
import type { ToastType } from '../types/common';
import type { Id } from '../types/common';
import * as messApiService from '../services/mess-api.service';
import { formatDate } from '../types/common';

interface MessManagementProps {
  hostelId: Id;
}

export const MessManagement: React.FC<MessManagementProps> = ({ hostelId }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'management'>('list');
  const [messEntries, setMessEntries] = useState<MessEntry[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<MessEntry | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    entry: MessEntry | null;
  }>({ open: false, entry: null });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    type: ToastType;
    message: string;
  }>({ open: false, type: 'success', message: '' });
  const analysisSectionRef = React.useRef<HTMLDivElement | null>(null);

  // Filter state
  const [filterType, setFilterType] = useState<'week' | 'month' | 'year' | 'custom'>('month');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [showCustomFilter, setShowCustomFilter] = useState(false);

  // Days of the week
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Resolve an entry date safely. Some APIs return createdAt but may omit date.
  const getEntryDate = useCallback((entry: MessEntry): Date | null => {
    const directDate = entry.date ? new Date(entry.date) : null;
    if (directDate && !Number.isNaN(directDate.getTime())) {
      return directDate;
    }

    const createdDate = entry.createdAt ? new Date(entry.createdAt) : null;
    if (createdDate && !Number.isNaN(createdDate.getTime())) {
      return createdDate;
    }

    return null;
  }, []);

  // Get date range based on filter type
  const getDateRange = useCallback(() => {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (filterType) {
      case 'week': {
        const dayIndex = today.getDay();
        const mondayOffset = dayIndex === 0 ? 6 : dayIndex - 1;
        start.setDate(today.getDate() - mondayOffset);
        end.setDate(start.getDate() + 6);
        break;
      }
      case 'month': {
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      }
      case 'year': {
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
      }
      case 'custom': {
        if (customStartDate) start = new Date(customStartDate);
        if (customEndDate) end = new Date(customEndDate);
        break;
      }
    }

    // Include full boundary days so timestamped entries are not excluded.
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }, [filterType, customStartDate, customEndDate]);

  // Filter mess entries based on date range
  const filteredEntries = useMemo(() => {
    const { start, end } = getDateRange();
    return messEntries.filter(entry => {
      const entryDate = getEntryDate(entry);
      if (!entryDate) return false;
      return entryDate >= start && entryDate <= end;
    });
  }, [messEntries, getDateRange, getEntryDate]);

  // Get current day name
  const getCurrentDayName = (): string => {
    const today = new Date();
    const dayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    // Convert to Monday-based index
    const mondayBasedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    return daysOfWeek[mondayBasedIndex];
  };

  const [selectedDay, setSelectedDay] = useState<string>(getCurrentDayName());
  const [formData, setFormData] = useState<MessFormData>({
    day: getCurrentDayName(),
    breakfast: { items: [{ id: `breakfast-${Date.now()}`, name: '', quantity: '', unit: '', cost: '', total: '', ingredients: '' }] },
    lunch: { items: [{ id: `lunch-${Date.now() + 1}`, name: '', quantity: '', unit: '', cost: '', total: '', ingredients: '' }] },
    dinner: { items: [{ id: `dinner-${Date.now() + 2}`, name: '', quantity: '', unit: '', cost: '', total: '', ingredients: '' }] },
    price: '',
  });

  // Update form day when day is selected
  useEffect(() => {
    setFormData(prev => ({ ...prev, day: selectedDay }));
  }, [selectedDay]);

  const loadMessEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      const entries = await messApiService.getMessEntriesByHostelAPI(hostelId);
      // Sort by day of week (Monday to Sunday)
      const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      entries.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
      setMessEntries(entries);
    } catch (error: any) {
      console.error('Error loading mess entries:', error);
      setToast({
        open: true,
        type: 'error',
        message: 'Failed to load mess entries',
      });
    } finally {
      setIsLoading(false);
    }
  }, [hostelId]);

  useEffect(() => {
    loadMessEntries();
  }, [loadMessEntries]);

  const handleAddItem = useCallback((mealType: MealType) => {
    setFormData((prev) => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        items: [...prev[mealType].items, { id: `${mealType}-${Date.now()}-${Math.random()}`, name: '', quantity: '', unit: '', cost: '', ingredients: '' }],
      },
    }));
  }, []);

  const handleRemoveItem = useCallback((mealType: MealType, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        items: prev[mealType].items.filter((_, i) => i !== index),
      },
    }));
  }, []);

  const handleItemChange = useCallback((
    mealType: MealType,
    index: number,
    field: 'name' | 'quantity' | 'unit' | 'cost' | 'ingredients' | 'total',
    value: string
  ) => {
    setFormData((prev) => {
      const items = prev[mealType].items.map((item, i) => {
        if (i !== index) return item;

        const updated = { ...item } as any;

        if (field === 'quantity') {
          updated.quantity = value;
          const qty = parseFloat(String(value)) || 0;
          const cost = parseFloat(String(updated.cost)) || 0;
          updated.total = (qty * cost).toFixed(2);
        } else if (field === 'cost') {
          updated.cost = value;
          const qty = parseFloat(String(updated.quantity)) || 0;
          const cost = parseFloat(String(value)) || 0;
          updated.total = (qty * cost).toFixed(2);
        } else if (field === 'total') {
          updated.total = value;
          const qty = parseFloat(String(updated.quantity)) || 0;
          const totalNum = parseFloat(String(value)) || 0;
          if (qty > 0) {
            const newCost = totalNum / qty;
            updated.cost = newCost ? newCost.toFixed(2) : '';
          }
        } else if (field === 'unit') {
          updated.unit = value;
        } else {
          // name or ingredients
          (updated as any)[field] = value;
        }

        return updated;
      });

      return {
        ...prev,
        [mealType]: {
          ...prev[mealType],
          items,
        },
      };
    });
  }, []);

  const handleNotesChange = useCallback((mealType: MealType, notes: string) => {
    setFormData((prev) => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        notes,
      },
    }));
  }, []);

  // Stable callback wrappers for each meal type
  const breakfastCallbacks = React.useMemo(() => ({
    onAddItem: () => handleAddItem('breakfast'),
    onRemoveItem: (index: number) => handleRemoveItem('breakfast', index),
    onItemChange: (index: number, field: 'name' | 'quantity' | 'unit' | 'cost' | 'ingredients' | 'total', value: string) => 
      handleItemChange('breakfast', index, field, value),
    onNotesChange: (notes: string) => handleNotesChange('breakfast', notes),
  }), [handleAddItem, handleRemoveItem, handleItemChange, handleNotesChange]);

  const lunchCallbacks = React.useMemo(() => ({
    onAddItem: () => handleAddItem('lunch'),
    onRemoveItem: (index: number) => handleRemoveItem('lunch', index),
    onItemChange: (index: number, field: 'name' | 'quantity' | 'unit' | 'cost' | 'ingredients' | 'total', value: string) => 
      handleItemChange('lunch', index, field, value),
    onNotesChange: (notes: string) => handleNotesChange('lunch', notes),
  }), [handleAddItem, handleRemoveItem, handleItemChange, handleNotesChange]);

  const dinnerCallbacks = React.useMemo(() => ({
    onAddItem: () => handleAddItem('dinner'),
    onRemoveItem: (index: number) => handleRemoveItem('dinner', index),
    onItemChange: (index: number, field: 'name' | 'quantity' | 'unit' | 'cost' | 'ingredients' | 'total', value: string) => 
      handleItemChange('dinner', index, field, value),
    onNotesChange: (notes: string) => handleNotesChange('dinner', notes),
  }), [handleAddItem, handleRemoveItem, handleItemChange, handleNotesChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that at least one item exists in each meal
    const hasBreakfastItems = formData.breakfast.items.some(
      (item) => item.name.trim() && item.quantity.trim()
    );
    const hasLunchItems = formData.lunch.items.some(
      (item) => item.name.trim() && item.quantity.trim()
    );
    const hasDinnerItems = formData.dinner.items.some(
      (item) => item.name.trim() && item.quantity.trim()
    );

    if (!hasBreakfastItems && !hasLunchItems && !hasDinnerItems) {
      setToast({
        open: true,
        type: 'warning',
        message: 'Please add at least one item to any meal',
      });
      return;
    }

    try {
      setIsLoading(true);
      // Filter out empty items before submitting
      const mapAndClean = (items: Array<{ name: string; quantity: string; unit?: string; cost?: string; total?: string; ingredients?: string }>) =>
        items
          .filter((item) => item.name.trim() && item.quantity.trim())
          .map((item) => {
            const qty = parseFloat(String(item.quantity)) || 0;
            const cost = parseFloat(String(item.cost)) || 0;
            const total = parseFloat(String(item.total)) || qty * cost || 0;
            return {
              name: item.name,
              quantity: String(item.quantity),
              unit: item.unit || '',
              cost: String(cost), // Convert to string for form data
              total: String(total), // Convert to string for form data
              ingredients: item.ingredients || '',
            };
          });

      const cleanedData: MessFormData = {
        day: formData.day,
        breakfast: {
          items: mapAndClean(formData.breakfast.items),
          notes: formData.breakfast.notes,
        },
        lunch: {
          items: mapAndClean(formData.lunch.items),
          notes: formData.lunch.notes,
        },
        dinner: {
          items: mapAndClean(formData.dinner.items),
          notes: formData.dinner.notes,
        },
        price: formData.price,
      };

      if (editingEntry) {
        await messApiService.updateMessEntryAPI(typeof editingEntry.id === 'string' ? parseInt(editingEntry.id, 10) : editingEntry.id, cleanedData);
        setToast({
          open: true,
          type: 'success',
          message: 'Mess entry updated successfully!',
        });
      } else {
        await messApiService.createMessEntryAPI(hostelId, cleanedData);
        setToast({
          open: true,
          type: 'success',
          message: 'Mess entry created successfully!',
        });
      }

      resetForm();
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setEditingEntry(null);
      await loadMessEntries();
    } catch (error: any) {
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to save mess entry. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (entry: MessEntry) => {
    // Helper to extract numeric value from quantity string
    const extractNumericQuantity = (quantity: string): number => {
      const numMatch = String(quantity).match(/(\d+\.?\d*)/);
      return numMatch ? parseFloat(numMatch[0]) : 0;
    };

    setEditingEntry(entry);
    setSelectedDay(entry.day);
    setFormData({
      day: entry.day,
      breakfast: {
        items:
          entry.breakfast.items.length > 0
            ? entry.breakfast.items.map((item, idx) => ({
                id: `breakfast-${entry.id}-${idx}`,
                name: item.name,
                quantity: item.quantity,
                unit: item.unit || '',
                cost: item.cost ? String(item.cost) : '',
                total: item.total ? String(item.total) : (() => {
                  const qty = extractNumericQuantity(item.quantity);
                  const cost = item.cost ? parseFloat(String(item.cost)) : 0;
                  return (qty * cost).toFixed(2);
                })(),
                ingredients: item.ingredients ? (Array.isArray(item.ingredients) ? item.ingredients.join(', ') : item.ingredients) : '',
              }))
            : [{ id: `breakfast-${Date.now()}`, name: '', quantity: '', unit: '', cost: '', ingredients: '' }],
        notes: entry.breakfast.notes,
      },
      lunch: {
        items:
          entry.lunch.items.length > 0
            ? entry.lunch.items.map((item, idx) => ({
                id: `lunch-${entry.id}-${idx}`,
                name: item.name,
                quantity: item.quantity,
                unit: item.unit || '',
                cost: item.cost ? String(item.cost) : '',
                total: item.total ? String(item.total) : (() => {
                  const qty = extractNumericQuantity(item.quantity);
                  const cost = item.cost ? parseFloat(String(item.cost)) : 0;
                  return (qty * cost).toFixed(2);
                })(),
                ingredients: item.ingredients ? (Array.isArray(item.ingredients) ? item.ingredients.join(', ') : item.ingredients) : '',
              }))
            : [{ id: `lunch-${Date.now()}`, name: '', quantity: '', unit: '', cost: '', ingredients: '' }],
        notes: entry.lunch.notes,
      },
      dinner: {
        items:
          entry.dinner.items.length > 0
            ? entry.dinner.items.map((item, idx) => ({
                id: `dinner-${entry.id}-${idx}`,
                name: item.name,
                quantity: item.quantity,
                unit: item.unit || '',
                cost: item.cost ? String(item.cost) : '',
                total: item.total ? String(item.total) : (() => {
                  const qty = extractNumericQuantity(item.quantity);
                  const cost = item.cost ? parseFloat(String(item.cost)) : 0;
                  return (qty * cost).toFixed(2);
                })(),
                ingredients: item.ingredients ? (Array.isArray(item.ingredients) ? item.ingredients.join(', ') : item.ingredients) : '',
              }))
            : [{ id: `dinner-${Date.now()}`, name: '', quantity: '', unit: '', cost: '', ingredients: '' }],
        notes: entry.dinner.notes,
      },
      price: entry.price ? entry.price.toString() : '',
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirm.entry) return;

    try {
      setIsLoading(true);
      await messApiService.deleteMessEntryAPI(typeof deleteConfirm.entry.id === 'string' ? parseInt(deleteConfirm.entry.id, 10) : deleteConfirm.entry.id);
      setToast({
        open: true,
        type: 'success',
        message: 'Mess entry deleted successfully',
      });
      await loadMessEntries();
    } catch (error: any) {
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to delete mess entry',
      });
    } finally {
      setIsLoading(false);
      setDeleteConfirm({ open: false, entry: null });
    }
  };

  const resetForm = () => {
    const now = Date.now();
    setSelectedDay('Monday');
    setFormData({
      day: 'Monday',
      breakfast: { items: [{ id: `breakfast-${now}`, name: '', quantity: '', unit: '', cost: '', total: '', ingredients: '' }] },
      lunch: { items: [{ id: `lunch-${now + 1}`, name: '', quantity: '', unit: '', cost: '', total: '', ingredients: '' }] },
      dinner: { items: [{ id: `dinner-${now + 2}`, name: '', quantity: '', unit: '', cost: '', total: '', ingredients: '' }] },
      price: '',
    });
  };

  const openMessAnalysis = useCallback(() => {
    setActiveTab('management');
    window.setTimeout(() => {
      analysisSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, []);

  // Calculate mess statistics for management tab
  const messStats = useMemo(() => {
    const dataToAnalyze = filteredEntries; // Use filtered entries
    const allItems: Array<{ name: string; quantity: string; unit?: string; mealType: string; date: string; numericQty: number; cost?: number }> = [];
    const totalEntries = dataToAnalyze.length;
    let totalMeals = 0;
    let breakfastCost = 0;
    let lunchCost = 0;
    let dinnerCost = 0;
    let leftoverSold = 0;
    let kitchenWaste = 0;

    const getItemTotal = (item: { quantity: string; cost?: string; total?: string }) => {
      const total = parseFloat(String(item.total)) || 0;
      if (total > 0) return total;
      const qty = parseFloat(String(item.quantity)) || 0;
      const cost = parseFloat(String(item.cost)) || 0;
      return qty * cost;
    };

    // Helper to extract numeric value from quantity string
    const extractNumericQuantity = (quantity: string): number => {
      const numMatch = String(quantity).match(/(\d+\.?\d*)/);
      return numMatch ? parseFloat(numMatch[0]) : 0;
    };

    dataToAnalyze.forEach((entry) => {
      const resolvedDate = getEntryDate(entry);
      const normalizedDate = resolvedDate ? resolvedDate.toISOString().split('T')[0] : 'unknown-date';

      ['breakfast', 'lunch', 'dinner'].forEach((mealType) => {
        const meal = entry[mealType as MealType];
        if (meal.items.length > 0) {
          totalMeals++;
        }

        const mealCost = meal.items.reduce((sum, item) => sum + getItemTotal(item as any), 0);
        if (mealType === 'breakfast') breakfastCost += mealCost;
        if (mealType === 'lunch') lunchCost += mealCost;
        if (mealType === 'dinner') dinnerCost += mealCost;

        meal.items.forEach((item) => {
          const total = getItemTotal(item as any);
          const itemName = item.name.toLowerCase();

          if (itemName.includes('leftover') || itemName.includes('sold')) {
            leftoverSold += total;
          }

          if (itemName.includes('waste')) {
            kitchenWaste += total;
          }

          const numericQty = extractNumericQuantity(item.quantity);
          allItems.push({
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            mealType: mealType.charAt(0).toUpperCase() + mealType.slice(1),
            date: normalizedDate,
            numericQty,
            cost: item.cost ? parseFloat(String(item.cost)) : undefined,
          });
        });
      });
    });

    // Group items by name to calculate totals
    const itemMap = new Map<string, { totalQuantity: number; unit: string; occurrences: number; dates: string[]; totalCost: number }>();
    
    allItems.forEach((item) => {
      const existing = itemMap.get(item.name);
      const itemCost = item.cost || 0;
      
      if (existing) {
        existing.totalQuantity += item.numericQty;
        existing.occurrences += 1;
        existing.totalCost += itemCost;
        if (!existing.dates.includes(item.date)) {
          existing.dates.push(item.date);
        }
      } else {
        itemMap.set(item.name, {
          totalQuantity: item.numericQty,
          unit: item.unit || '',
          occurrences: 1,
          dates: [item.date],
          totalCost: itemCost,
        });
      }
    });

    // Convert to array and sort by frequency first, then by quantity
    const materialUsage = Array.from(itemMap.entries())
      .map(([name, data], index) => ({
        id: `material-${index}-${name}`,
        name,
        totalQuantity: data.totalQuantity,
        unit: data.unit,
        occurrences: data.occurrences,
        datesUsed: data.dates.length,
        totalCost: data.totalCost,
      }))
      .sort((a, b) => {
        if (b.occurrences !== a.occurrences) {
          return b.occurrences - a.occurrences;
        }
        return b.totalQuantity - a.totalQuantity;
      });

    // Time-series data for material usage summary graph
    const availableMaterialsCount = itemMap.size;
    const dateMap = new Map<string, {
      dateLabel: string;
      date: string;
      usageEvents: number;
      totalQuantity: number;
      totalCost: number;
      materialsAvailable: number;
      uniqueMaterialNames: Set<string>;
    }>();

    allItems.forEach((item) => {
      const existing = dateMap.get(item.date);
      if (existing) {
        existing.usageEvents += 1;
        existing.totalQuantity += item.numericQty;
        existing.totalCost += (item.cost || 0);
        if (item.name.trim()) {
          existing.uniqueMaterialNames.add(item.name.trim().toLowerCase());
        }
      } else {
        dateMap.set(item.date, {
          dateLabel: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          date: item.date,
          usageEvents: 1,
          totalQuantity: item.numericQty,
          totalCost: item.cost || 0,
          materialsAvailable: availableMaterialsCount,
          uniqueMaterialNames: new Set(item.name.trim() ? [item.name.trim().toLowerCase()] : []),
        });
      }
    });

    const timeSeriesData = Array.from(dateMap.values())
      .map((day) => {
        const materialsUsedCount = day.uniqueMaterialNames.size;
        const utilizationPercent = day.materialsAvailable > 0
          ? Number(((materialsUsedCount / day.materialsAvailable) * 100).toFixed(2))
          : 0;

        return {
          dateLabel: day.dateLabel,
          date: day.date,
          usageEvents: day.usageEvents,
          totalQuantity: day.totalQuantity,
          totalCost: day.totalCost,
          materialsAvailable: day.materialsAvailable,
          materialsUsedCount,
          utilizationPercent,
        };
      })
      .sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

    // Top materials chart data
    const topMaterials = materialUsage.slice(0, 10).map(item => ({
      name: item.name,
      totalQuantity: item.totalQuantity,
      occurrences: item.occurrences,
    }));

    const averageDailyUtilization = timeSeriesData.length > 0
      ? timeSeriesData.reduce((sum, item) => sum + item.utilizationPercent, 0) / timeSeriesData.length
      : 0;

    return {
      totalEntries,
      totalMeals,
      totalItems: allItems.length,
      uniqueMaterials: itemMap.size,
      breakfastCost,
      lunchCost,
      dinnerCost,
      leftoverSold,
      kitchenWaste,
      materialUsage,
      timeSeriesData,
      topMaterials,
      averageDailyUtilization,
    };
  }, [filteredEntries, getEntryDate]);

  // Define tabs
  const tabs = [
    {
      id: 'list',
      label: 'Mess Menu',
      count: messEntries.length,
    },
    {
      id: 'management',
      label: 'Mess Management',
    },
  ];

  // Columns for material usage table
  const materialColumns: Column<typeof messStats.materialUsage[0]>[] = [
    {
      key: 'name',
      label: 'Material Name',
      sortable: true,
    },
    {
      key: 'totalQuantity',
      label: 'Total Quantity',
      render: (row) => {
        const qty = row.totalQuantity > 0 ? row.totalQuantity.toFixed(2) : '0';
        const unit = row.unit || 'units';
        return `${qty} ${unit}`;
      },
      sortable: true,
    },
    {
      key: 'occurrences',
      label: 'Times Used',
      render: (row) => `${row.occurrences} times`,
      sortable: true,
    },
    {
      key: 'datesUsed',
      label: 'Days Used',
      render: (row) => `${row.datesUsed} days`,
      sortable: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Mess Management</h2>
        <p className="text-slate-600 mt-1">Manage daily meals, ingredients, and costs</p>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(tab) => setActiveTab(tab as 'list' | 'management')}
      />

      {/* Tab Content */}
      {activeTab === 'list' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Header with Add Button */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Mess Entries</h3>
              <p className="text-sm text-slate-600">View and manage daily mess entries</p>
            </div>
                <div className="flex items-center gap-3 flex-wrap justify-end">
                  <Button
                    variant="outline"
                    onClick={openMessAnalysis}
                    icon={ChartBarIcon}
                  >
                    Mess Analysis
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      resetForm();
                      setIsAddModalOpen(true);
                    }}
                    icon={PlusIcon}
                  >
                    Add Mess Entry
                  </Button>
                </div>
          </div>

          {/* Mess Entries List */}
          {messEntries.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
          <CalendarIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 text-lg font-medium">No mess entries yet</p>
          <p className="text-slate-500 mt-1">Click "Add Mess Entry" to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messEntries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {entry.day}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {entry.price ? `Price: $${entry.price}` : 'Price not set'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ open: true, entry })}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Breakfast */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">Breakfast</h4>
                  {entry.breakfast.items.length > 0 ? (
                    <ul className="space-y-2">
                      {entry.breakfast.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-slate-700 bg-white p-2 rounded border border-yellow-100">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-slate-600 mt-1">
                            Qty: {item.quantity} {item.unit || ''}
                            {item.cost && ` | Cost: $${item.cost}`}
                            {item.total && ` | Total: $${item.total}`}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">No items</p>
                  )}
                  {entry.breakfast.notes && (
                    <p className="text-xs text-slate-600 mt-2 italic border-t border-yellow-200 pt-2">
                      📝 {entry.breakfast.notes}
                    </p>
                  )}
                </div>

                {/* Lunch */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">Lunch</h4>
                  {entry.lunch.items.length > 0 ? (
                    <ul className="space-y-2">
                      {entry.lunch.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-slate-700 bg-white p-2 rounded border border-blue-100">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-slate-600 mt-1">
                            Qty: {item.quantity} {item.unit || ''}
                            {item.cost && ` | Cost: $${item.cost}`}
                            {item.total && ` | Total: $${item.total}`}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">No items</p>
                  )}
                  {entry.lunch.notes && (
                    <p className="text-xs text-slate-600 mt-2 italic border-t border-blue-200 pt-2">
                      📝 {entry.lunch.notes}
                    </p>
                  )}
                </div>

                {/* Dinner */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">Dinner</h4>
                  {entry.dinner.items.length > 0 ? (
                    <ul className="space-y-2">
                      {entry.dinner.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-slate-700 bg-white p-2 rounded border border-purple-100">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-slate-600 mt-1">
                            Qty: {item.quantity} {item.unit || ''}
                            {item.cost && ` | Cost: $${item.cost}`}
                            {item.total && ` | Total: $${item.total}`}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">No items</p>
                  )}
                  {entry.dinner.notes && (
                    <p className="text-xs text-slate-600 mt-2 italic border-t border-purple-200 pt-2">
                      📝 {entry.dinner.notes}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
          )}
        </motion.div>
      )}

      {/* Mess Management Tab */}
      {activeTab === 'management' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Filter Bar */}
          <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
                <p className="text-sm text-slate-600 mt-1">Select a time period to analyze mess data</p>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={() => {
                  setFilterType('week');
                  setShowCustomFilter(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'week'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => {
                  setFilterType('month');
                  setShowCustomFilter(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'month'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => {
                  setFilterType('year');
                  setShowCustomFilter(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'year'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                This Year
              </button>
              <button
                onClick={() => {
                  setFilterType('custom');
                  setShowCustomFilter(!showCustomFilter);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  filterType === 'custom'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                Custom Range
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">Selected Period Entries</p>
                  <p className="text-2xl font-semibold text-slate-900">{messStats.totalEntries}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <CubeIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">Materials Tracked</p>
                  <p className="text-2xl font-semibold text-slate-900">{messStats.uniqueMaterials}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <CubeIcon className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">Total Items Used</p>
                  <p className="text-2xl font-semibold text-slate-900">{messStats.totalItems}</p>
                </div>
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                  <CurrencyDollarIcon className="w-6 h-6 text-sky-600" />
                </div>
              </div>
            </div>

            {/* Custom Date Range Picker */}
            {showCustomFilter && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Date Range Display */}
            {(() => {
              const { start, end } = getDateRange();
              return (
                <div className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  📅 Showing data from <span className="font-medium">{start.toLocaleDateString()}</span> to{' '}
                  <span className="font-medium">{end.toLocaleDateString()}</span>
                  {filteredEntries.length > 0 && (
                    <span className="ml-2">({filteredEntries.length} entries)</span>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Cost & Sales Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <CurrencyDollarIcon className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-sm text-amber-700 font-medium">Breakfast Cost</p>
              <p className="text-2xl font-bold text-amber-950 mt-1">${messStats.breakfastCost.toFixed(2)}</p>
              <p className="text-xs text-amber-700 mt-1">Total cost from breakfast items</p>
            </div>

            <div className="bg-sky-50 border border-sky-200 p-5 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
                <CurrencyDollarIcon className="w-6 h-6 text-sky-600" />
              </div>
              <p className="text-sm text-sky-700 font-medium">Lunch Cost</p>
              <p className="text-2xl font-bold text-sky-950 mt-1">${messStats.lunchCost.toFixed(2)}</p>
              <p className="text-xs text-sky-700 mt-1">Total cost from lunch items</p>
            </div>

            <div className="bg-violet-50 border border-violet-200 p-5 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
                <CurrencyDollarIcon className="w-6 h-6 text-violet-600" />
              </div>
              <p className="text-sm text-violet-700 font-medium">Dinner Cost</p>
              <p className="text-2xl font-bold text-violet-950 mt-1">${messStats.dinnerCost.toFixed(2)}</p>
              <p className="text-xs text-violet-700 mt-1">Total cost from dinner items</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <CurrencyDollarIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-sm text-emerald-700 font-medium">Leftover Sold</p>
              <p className="text-2xl font-bold text-emerald-950 mt-1">${messStats.leftoverSold.toFixed(2)}</p>
              <p className="text-xs text-emerald-700 mt-1">Inferred from items named leftover/sold</p>
            </div>

            <div className="bg-rose-50 border border-rose-200 p-5 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                <TrashIcon className="w-6 h-6 text-rose-600" />
              </div>
              <p className="text-sm text-rose-700 font-medium">Kitchen Waste</p>
              <p className="text-2xl font-bold text-rose-950 mt-1">${messStats.kitchenWaste.toFixed(2)}</p>
              <p className="text-xs text-rose-700 mt-1">Inferred from items named waste</p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <CalendarIcon className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Entries</p>
                  <p className="text-2xl font-bold text-blue-900">{messStats.totalEntries}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <CubeIcon className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-green-600 font-medium">Total Meals</p>
                  <p className="text-2xl font-bold text-green-900">{messStats.totalMeals}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <CubeIcon className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-purple-600 font-medium">Total Items</p>
                  <p className="text-2xl font-bold text-purple-900">{messStats.totalItems}</p>
                </div>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <CurrencyDollarIcon className="w-8 h-8 text-amber-600" />
                <div>
                  <p className="text-sm text-amber-600 font-medium">Unique Materials</p>
                  <p className="text-2xl font-bold text-amber-900">{messStats.uniqueMaterials}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Material Usage by Meal Type */}
          <div className="space-y-6">
            {/* Breakfast Items */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <SunIcon className="w-6 h-6 text-yellow-600" />
                  Breakfast Items
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  All items used in breakfast meals
                </p>
              </div>
              {messStats.materialUsage.filter(item => {
                const breakfastItems = filteredEntries.flatMap(entry => 
                  entry.breakfast.items.map(item => item.name)
                );
                return breakfastItems.includes(item.name);
              }).length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg border border-yellow-200">
                  <p className="text-slate-600">No breakfast items recorded yet</p>
                </div>
              ) : (
                <DataTable
                  columns={materialColumns}
                  data={messStats.materialUsage.filter(item => {
                    const breakfastItems = filteredEntries.flatMap(entry => 
                      entry.breakfast.items.map(item => item.name)
                    );
                    return breakfastItems.includes(item.name);
                  })}
                  emptyMessage="No breakfast items found"
                />
              )}
            </div>

            {/* Lunch Items */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <SunIcon className="w-6 h-6 text-blue-600" />
                  Lunch Items
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  All items used in lunch meals
                </p>
              </div>
              {messStats.materialUsage.filter(item => {
                const lunchItems = filteredEntries.flatMap(entry => 
                  entry.lunch.items.map(item => item.name)
                );
                return lunchItems.includes(item.name);
              }).length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg border border-blue-200">
                  <p className="text-slate-600">No lunch items recorded yet</p>
                </div>
              ) : (
                <DataTable
                  columns={materialColumns}
                  data={messStats.materialUsage.filter(item => {
                    const lunchItems = filteredEntries.flatMap(entry => 
                      entry.lunch.items.map(item => item.name)
                    );
                    return lunchItems.includes(item.name);
                  })}
                  emptyMessage="No lunch items found"
                />
              )}
            </div>

            {/* Dinner Items */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <MoonIcon className="w-6 h-6 text-purple-600" />
                  Dinner Items
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  All items used in dinner meals
                </p>
              </div>
              {messStats.materialUsage.filter(item => {
                const dinnerItems = filteredEntries.flatMap(entry => 
                  entry.dinner.items.map(item => item.name)
                );
                return dinnerItems.includes(item.name);
              }).length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg border border-purple-200">
                  <p className="text-slate-600">No dinner items recorded yet</p>
                </div>
              ) : (
                <DataTable
                  columns={materialColumns}
                  data={messStats.materialUsage.filter(item => {
                    const dinnerItems = filteredEntries.flatMap(entry => 
                      entry.dinner.items.map(item => item.name)
                    );
                    return dinnerItems.includes(item.name);
                  })}
                  emptyMessage="No dinner items found"
                />
              )}
            </div>
          </div>

          {/* Material Usage Analytics - Graphs */}
          <div className="space-y-6">
            {/* Material Usage Trend Over Time */}
            <div ref={analysisSectionRef} className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  📈 Material Usage Trend
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Daily summary of materials used vs total materials available for usage analysis
                </p>
              </div>

              {messStats.timeSeriesData && messStats.timeSeriesData.length > 0 ? (
                <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <p className="text-xs text-slate-500">Avg Daily Materials Used</p>
                    <p className="text-xl font-semibold text-slate-900">
                      {(
                        messStats.timeSeriesData.reduce((sum, item) => sum + item.materialsUsedCount, 0) /
                        Math.max(messStats.timeSeriesData.length, 1)
                      ).toFixed(1)}
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <p className="text-xs text-slate-500">Materials Available</p>
                    <p className="text-xl font-semibold text-slate-900">{messStats.uniqueMaterials}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <p className="text-xs text-slate-500">Avg Daily Utilization</p>
                    <p className="text-xl font-semibold text-slate-900">{messStats.averageDailyUtilization.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={messStats.timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="dateLabel" 
                        stroke="#64748b"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        stroke="#64748b"
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        formatter={(value: number | string, name: string) => {
                          if (name === 'Materials Used') {
                            return [`${value} materials`, name];
                          }
                          if (name === 'Total Materials Available') {
                            return [`${value} materials`, name];
                          }
                          return [value, name];
                        }}
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="materialsUsedCount" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Materials Used"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="materialsAvailable" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        dot={{ fill: '#f59e0b', r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Total Materials Available"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                </>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-slate-600">No data available for the selected period</p>
                </div>
              )}
            </div>

            {/* Top Materials Usage - Bar Chart */}
            <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  📊 Top Materials by Frequency
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Most frequently used materials for identifying bulk purchase candidates
                </p>
              </div>

              {messStats.topMaterials && messStats.topMaterials.length > 0 ? (
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={messStats.topMaterials}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#64748b"
                        tick={{ fontSize: 11 }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis 
                        stroke="#64748b"
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="occurrences" 
                        fill="#f59e0b" 
                        name="Times Used"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-slate-600">No data available for the selected period</p>
                </div>
              )}

              {/* Recommendations */}
              {messStats.topMaterials && messStats.topMaterials.length > 0 && (
                <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                  <h4 className="font-semibold text-amber-900 mb-2">💡 Bulk Purchase Recommendation</h4>
                  <p className="text-sm text-amber-800">
                    Based on usage patterns, consider buying <span className="font-bold">{messStats.topMaterials[0]?.name}</span> in bulk. 
                    It was used <span className="font-bold">{messStats.topMaterials[0]?.occurrences}</span> times during this period,
                    with a total quantity of <span className="font-bold">{messStats.topMaterials[0]?.totalQuantity.toFixed(2)}</span>,
                    making it the most frequently used material.
                  </p>
                  {messStats.topMaterials.slice(0, 3).length > 1 && (
                    <p className="text-sm text-amber-800 mt-2">
                      Other high-volume materials: {messStats.topMaterials.slice(1, 3).map(m => m.name).join(', ')}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Material Usage Table - All Items */}
          <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900">All Material Usage Summary</h3>
              <p className="text-sm text-slate-600 mt-1">
                Complete list of all materials and ingredients used in the mess system
              </p>
            </div>

            {messStats.materialUsage.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                <CubeIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 text-lg font-medium">No materials recorded yet</p>
                <p className="text-slate-500 mt-1">Add mess entries to track material usage</p>
              </div>
            ) : (
              <DataTable
                columns={materialColumns}
                data={messStats.materialUsage}
                emptyMessage="No materials found"
              />
            )}
          </div>

          <div className="flex justify-end">
            <Button variant="ghost" onClick={openMessAnalysis} icon={ChartBarIcon}>
              Reopen Mess Analysis
            </Button>
          </div>

          {/* Cost Summary (Placeholder for future cost tracking) */}
          <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900">Cost Summary</h3>
              <p className="text-sm text-slate-600 mt-1">
                Track costs and expenses for mess operations
              </p>
            </div>
            <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
              <CurrencyDollarIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 text-lg font-medium">Cost tracking coming soon</p>
              <p className="text-slate-500 mt-1">This feature will track material costs and expenses</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add/Edit Modal with Sidebar Layout */}
      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                setEditingEntry(null);
                resetForm();
              }}
              className="fixed inset-0 bg-black/50 z-50"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex overflow-hidden">
                {/* Left Sidebar - Days of Week */}
                <div className="w-64 bg-slate-800 flex flex-col">
                  <div className="p-6 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-6 h-6 text-white" />
                      <h2 className="text-lg font-semibold text-white">Select Day</h2>
                    </div>
                  </div>

                  <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {/* Days of Week */}
                    {daysOfWeek.map((day) => (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          selectedDay === day
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        <span className="font-medium">{day}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Content - All Meal Types */}
                <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
                  <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {selectedDay}
                      </h3>
                      <span className="block w-12 h-1 bg-pink-500 mt-1" />
                    </div>
                    <button
                      onClick={() => {
                        setIsAddModalOpen(false);
                        setIsEditModalOpen(false);
                        setEditingEntry(null);
                        resetForm();
                      }}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6 text-slate-600" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      {/* Breakfast Section */}
                      <MealSectionComponent
                        mealType="breakfast"
                        mealData={formData.breakfast}
                        {...breakfastCallbacks}
                      />
                      
                      {/* Lunch Section */}
                      <MealSectionComponent
                        mealType="lunch"
                        mealData={formData.lunch}
                        {...lunchCallbacks}
                      />
                      
                      {/* Dinner Section */}
                      <MealSectionComponent
                        mealType="dinner"
                        mealData={formData.dinner}
                        {...dinnerCallbacks}
                      />

                      {/* Price Field */}
                      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                          <CurrencyDollarIcon className="w-5 h-5 inline-block mr-2 text-green-600" />
                          Total Price (Optional)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="Enter total meal price"
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <p className="text-xs text-slate-600 mt-1">
                          Optional: Set a total price for all meals on {selectedDay}
                        </p>
                      </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddModalOpen(false);
                          setIsEditModalOpen(false);
                          setEditingEntry(null);
                          resetForm();
                        }}
                        className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                      >
                        {editingEntry ? 'Update Entry' : 'Create Entry'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteConfirm.open}
        title="Delete Mess Entry"
        message={`Are you sure you want to delete the mess entry for ${deleteConfirm.entry ? formatDate(deleteConfirm.entry.date) : ''}?`}
        confirmText="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ open: false, entry: null })}
      />

      {/* Toast */}
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>
  );
};

// MealSection component defined outside to prevent recreation on each render
interface MealSectionProps {
  mealType: MealType;
  mealData: { items: Array<{ id?: string; name: string; quantity: string; unit?: string; cost?: string; total?: string; ingredients?: string }>; notes?: string };
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onItemChange: (index: number, field: 'name' | 'quantity' | 'unit' | 'cost' | 'ingredients' | 'total', value: string) => void;
  onNotesChange: (notes: string) => void;
}

const MealSectionComponent: React.FC<MealSectionProps> = React.memo(({
  mealType,
  mealData,
  onAddItem,
  onRemoveItem,
  onItemChange,
  onNotesChange,
}) => {
  const mealLabel = mealType.charAt(0).toUpperCase() + mealType.slice(1);
  const mealColor =
    mealType === 'breakfast'
      ? 'bg-yellow-50 border-yellow-200'
      : mealType === 'lunch'
      ? 'bg-blue-50 border-blue-200'
      : 'bg-purple-50 border-purple-200';

  return (
    <div className={`border-2 rounded-lg p-4 ${mealColor}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-slate-900">{mealLabel}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddItem}
          icon={PlusIcon}
        >
          Add Item
        </Button>
      </div>

      <div className="mb-3">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="text-left text-xs text-slate-600">
                <th className="px-2 py-2 w-3/10">Menu</th>
                <th className="px-2 py-2 w-1/10">Quantity</th>
                <th className="px-2 py-2 w-1/10">Unit</th>
                <th className="px-2 py-2 w-1/10">Cost</th>
                <th className="px-2 py-2 w-1/10">Total</th>
                <th className="px-2 py-2 w-1/10"> </th>
              </tr>
            </thead>
            <tbody>
              {mealData.items.map((item, index) => {
                const qty = parseFloat(String(item.quantity)) || 0;
                const cost = parseFloat(String(item.cost)) || 0;
                const rowTotal = qty * cost;

                return (
                  <tr key={item.id || `item-${mealType}-${index}`} className="bg-white border-b border-slate-100">
                    <td className="px-2 py-3 align-top">
                      <input
                        type="text"
                        placeholder="Item name (e.g., Rice)"
                        value={item.name}
                        onChange={(e) => onItemChange(index, 'name', e.target.value)}
                        className="w-full px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </td>
                    <td className="px-2 py-3 align-top">
                      <input
                        type="text"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => onItemChange(index, 'quantity', e.target.value)}
                        className="w-full px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </td>
                    <td className="px-2 py-3 align-top">
                      <div className="flex gap-2">
                        <select
                          value={item.unit || ''}
                          onChange={(e) => onItemChange(index, 'unit', e.target.value)}
                          className="px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-36"
                        >
                          <option value="">Select</option>
                          <option value="kg">kg</option>
                          <option value="dozen">dozen</option>
                          <option value="liter">liter</option>
                          <option value="pcs">pcs</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-2 py-3 align-top">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={item.cost || ''}
                        onChange={(e) => onItemChange(index, 'cost', e.target.value)}
                        className="w-full px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </td>
                    <td className="px-2 py-3 align-top">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={item.total !== undefined ? String(item.total) : rowTotal.toFixed(2)}
                        onChange={(e) => onItemChange(index, 'total', e.target.value)}
                        className="w-full px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </td>
                    <td className="px-2 py-3 align-top text-right">
                      {mealData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onRemoveItem(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="px-2 py-3 text-right text-sm font-semibold">Grand Total</td>
                <td className="px-2 py-3 text-sm font-semibold">
                  ${mealData.items.reduce((sum, it) => {
                    const qty = parseFloat(String(it.quantity)) || 0;
                    const cost = parseFloat(String(it.cost)) || 0;
                    const total = parseFloat(String(it.total)) || (qty * cost) || 0;
                    return sum + total;
                  }, 0).toFixed(2)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-600 font-medium block mb-1">{mealLabel} Notes (Optional)</label>
        <textarea
          placeholder={`Add ingredients or preparation notes for ${mealLabel.toLowerCase()}. Example: Salt 1 tsp, Pepper 1/4 tsp, Butter 2 tbsp`}
          value={mealData.notes || ''}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          rows={3}
        />
        <p className="text-xs text-slate-500 mt-1">
          💡 Tip: List ingredients and their quantities here (e.g., "Salt 1 tsp, Eggs 2, Butter 2 tbsp")
        </p>
      </div>
    </div>
  );
});

