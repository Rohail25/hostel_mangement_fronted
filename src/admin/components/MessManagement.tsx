/**
 * Mess Management component
 * Manages day-by-day mess entries with breakfast, lunch, and dinner
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, PencilIcon, TrashIcon, CalendarIcon, CurrencyDollarIcon, CubeIcon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';
import { Modal } from './Modal';
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

  // Days of the week
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Helper function to get date for selected day (this week)
  const getDateForDay = (dayName: string): string => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayIndex = daysOfWeek.indexOf(dayName);
    
    // Convert to Monday-based week (0 = Monday, 6 = Sunday)
    const mondayBasedCurrentDay = currentDay === 0 ? 6 : currentDay - 1;
    const daysToAdd = dayIndex - mondayBasedCurrentDay;
    
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysToAdd);
    
    return targetDate.toISOString().split('T')[0];
  };

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
    breakfast: { items: [{ id: `breakfast-${Date.now()}`, name: '', quantity: '', unit: '' }] },
    lunch: { items: [{ id: `lunch-${Date.now() + 1}`, name: '', quantity: '', unit: '' }] },
    dinner: { items: [{ id: `dinner-${Date.now() + 2}`, name: '', quantity: '', unit: '' }] },
    price: '',
  });

  // Update form day when day is selected
  useEffect(() => {
    setFormData(prev => ({ ...prev, day: selectedDay }));
  }, [selectedDay]);

  useEffect(() => {
    loadMessEntries();
  }, [hostelId]);

  const loadMessEntries = async () => {
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
  };

  const handleAddItem = useCallback((mealType: MealType) => {
    setFormData((prev) => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        items: [...prev[mealType].items, { id: `${mealType}-${Date.now()}-${Math.random()}`, name: '', quantity: '', unit: '' }],
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
    field: 'name' | 'quantity' | 'unit',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        items: prev[mealType].items.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      },
    }));
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
    onItemChange: (index: number, field: 'name' | 'quantity' | 'unit', value: string) => 
      handleItemChange('breakfast', index, field, value),
    onNotesChange: (notes: string) => handleNotesChange('breakfast', notes),
  }), [handleAddItem, handleRemoveItem, handleItemChange, handleNotesChange]);

  const lunchCallbacks = React.useMemo(() => ({
    onAddItem: () => handleAddItem('lunch'),
    onRemoveItem: (index: number) => handleRemoveItem('lunch', index),
    onItemChange: (index: number, field: 'name' | 'quantity' | 'unit', value: string) => 
      handleItemChange('lunch', index, field, value),
    onNotesChange: (notes: string) => handleNotesChange('lunch', notes),
  }), [handleAddItem, handleRemoveItem, handleItemChange, handleNotesChange]);

  const dinnerCallbacks = React.useMemo(() => ({
    onAddItem: () => handleAddItem('dinner'),
    onRemoveItem: (index: number) => handleRemoveItem('dinner', index),
    onItemChange: (index: number, field: 'name' | 'quantity' | 'unit', value: string) => 
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
      const cleanedData: MessFormData = {
        day: formData.day,
        breakfast: {
          items: formData.breakfast.items.filter(
            (item) => item.name.trim() && item.quantity.trim()
          ),
          notes: formData.breakfast.notes,
        },
        lunch: {
          items: formData.lunch.items.filter(
            (item) => item.name.trim() && item.quantity.trim()
          ),
          notes: formData.lunch.notes,
        },
        dinner: {
          items: formData.dinner.items.filter(
            (item) => item.name.trim() && item.quantity.trim()
          ),
          notes: formData.dinner.notes,
        },
        price: formData.price,
      };

      if (editingEntry) {
        await messApiService.updateMessEntryAPI(editingEntry.id, cleanedData);
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
              }))
            : [{ id: `breakfast-${Date.now()}`, name: '', quantity: '', unit: '' }],
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
              }))
            : [{ id: `lunch-${Date.now()}`, name: '', quantity: '', unit: '' }],
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
              }))
            : [{ id: `dinner-${Date.now()}`, name: '', quantity: '', unit: '' }],
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
      await messApiService.deleteMessEntryAPI(deleteConfirm.entry.id);
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
      breakfast: { items: [{ id: `breakfast-${now}`, name: '', quantity: '', unit: '' }] },
      lunch: { items: [{ id: `lunch-${now + 1}`, name: '', quantity: '', unit: '' }] },
      dinner: { items: [{ id: `dinner-${now + 2}`, name: '', quantity: '', unit: '' }] },
      price: '',
    });
  };

  // Helper function to get day name from date string
  const getDayName = (dateString: string): string => {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  // Calculate mess statistics for management tab
  const messStats = useMemo(() => {
    const allItems: Array<{ name: string; quantity: string; unit?: string; mealType: string; date: string }> = [];
    let totalEntries = messEntries.length;
    let totalMeals = 0;

    messEntries.forEach((entry) => {
      ['breakfast', 'lunch', 'dinner'].forEach((mealType) => {
        const meal = entry[mealType as MealType];
        if (meal.items.length > 0) {
          totalMeals++;
        }
        meal.items.forEach((item) => {
          allItems.push({
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            mealType: mealType.charAt(0).toUpperCase() + mealType.slice(1),
            date: entry.date,
          });
        });
      });
    });

    // Group items by name to calculate totals
    const itemMap = new Map<string, { totalQuantity: number; unit: string; occurrences: number; dates: string[] }>();
    
    allItems.forEach((item) => {
      const existing = itemMap.get(item.name);
      const quantity = parseFloat(item.quantity) || 0;
      
      if (existing) {
        existing.totalQuantity += quantity;
        existing.occurrences += 1;
        if (!existing.dates.includes(item.date)) {
          existing.dates.push(item.date);
        }
      } else {
        itemMap.set(item.name, {
          totalQuantity: quantity,
          unit: item.unit || '',
          occurrences: 1,
          dates: [item.date],
        });
      }
    });

    // Convert to array and sort by total quantity
    const materialUsage = Array.from(itemMap.entries())
      .map(([name, data], index) => ({
        id: `material-${index}-${name}`,
        name,
        totalQuantity: data.totalQuantity,
        unit: data.unit,
        occurrences: data.occurrences,
        datesUsed: data.dates.length,
      }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity);

    return {
      totalEntries,
      totalMeals,
      totalItems: allItems.length,
      uniqueMaterials: itemMap.size,
      materialUsage,
    };
  }, [messEntries]);

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
      render: (row) => `${row.totalQuantity} ${row.unit || ''}`,
      sortable: true,
    },
    {
      key: 'occurrences',
      label: 'Times Used',
      sortable: true,
    },
    {
      key: 'datesUsed',
      label: 'Days Used',
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
                    <ul className="space-y-1">
                      {entry.breakfast.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-slate-700">
                          • {item.name} - {item.quantity} {item.unit || ''}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">No items</p>
                  )}
                  {entry.breakfast.notes && (
                    <p className="text-xs text-slate-600 mt-2 italic">
                      {entry.breakfast.notes}
                    </p>
                  )}
                </div>

                {/* Lunch */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">Lunch</h4>
                  {entry.lunch.items.length > 0 ? (
                    <ul className="space-y-1">
                      {entry.lunch.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-slate-700">
                          • {item.name} - {item.quantity} {item.unit || ''}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">No items</p>
                  )}
                  {entry.lunch.notes && (
                    <p className="text-xs text-slate-600 mt-2 italic">
                      {entry.lunch.notes}
                    </p>
                  )}
                </div>

                {/* Dinner */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">Dinner</h4>
                  {entry.dinner.items.length > 0 ? (
                    <ul className="space-y-1">
                      {entry.dinner.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-slate-700">
                          • {item.name} - {item.quantity} {item.unit || ''}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">No items</p>
                  )}
                  {entry.dinner.notes && (
                    <p className="text-xs text-slate-600 mt-2 italic">
                      {entry.dinner.notes}
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
                const breakfastItems = messEntries.flatMap(entry => 
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
                    const breakfastItems = messEntries.flatMap(entry => 
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
                const lunchItems = messEntries.flatMap(entry => 
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
                    const lunchItems = messEntries.flatMap(entry => 
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
                const dinnerItems = messEntries.flatMap(entry => 
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
                    const dinnerItems = messEntries.flatMap(entry => 
                      entry.dinner.items.map(item => item.name)
                    );
                    return dinnerItems.includes(item.name);
                  })}
                  emptyMessage="No dinner items found"
                />
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
  mealData: { items: Array<{ id?: string; name: string; quantity: string; unit?: string }>; notes?: string };
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onItemChange: (index: number, field: 'name' | 'quantity' | 'unit', value: string) => void;
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

      <div className="space-y-3 mb-3">
        {mealData.items.map((item, index) => (
          <div key={item.id || `item-${mealType}-${index}`} className="bg-white rounded-lg p-3 border border-slate-200">
            {/* Item Name Row */}
            <div className="flex gap-2 items-start mb-2">
              <input
                type="text"
                placeholder="Item name (e.g., Omelette, Rice, Bread)"
                value={item.name}
                onChange={(e) => onItemChange(index, 'name', e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              />
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
            </div>

            {/* Quantity and Unit Row */}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="text-xs text-slate-600 font-medium block mb-1">Quantity</label>
                <input
                  type="text"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => onItemChange(index, 'quantity', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-600 font-medium block mb-1">Unit</label>
                <input
                  type="text"
                  placeholder="kg, pcs, ltr, tbsp, etc"
                  value={item.unit || ''}
                  onChange={(e) => onItemChange(index, 'unit', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </div>
        ))}
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

