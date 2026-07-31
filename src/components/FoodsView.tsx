import React, { useState, useEffect } from 'react';
import { Utensils, Search, Filter, Plus, Trash2, Edit3, Heart, Flame, Award, RefreshCw, Eye, CheckSquare, Square, AlertTriangle, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { FoodItem, UserProfile } from '../types.ts';

interface FoodsViewProps {
  currentUser: UserProfile;
  quickSearch: string;
  onSelectFood: (food: FoodItem) => void;
  onEditFood: (food: FoodItem) => void;
  onAddFood: () => void;
  onLogMeal: (food: FoodItem) => void;
  onToggleFavorite: (id: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const FoodsView: React.FC<FoodsViewProps> = ({
  currentUser,
  quickSearch,
  onSelectFood,
  onEditFood,
  onAddFood,
  onLogMeal,
  onToggleFavorite,
  showToast
}) => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Filters & Pagination State
  const [search, setSearch] = useState<string>(quickSearch || '');
  const [category, setCategory] = useState<string>('All');
  const [mealType, setMealType] = useState<string>('All');
  const [cuisine, setCuisine] = useState<string>('All');
  const [minRating, setMinRating] = useState<string>('');
  const [sort, setSort] = useState<string>('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Soft Delete / Trash Mode
  const [showDeleted, setShowDeleted] = useState<boolean>(false);
  
  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState<boolean>(false);

  useEffect(() => {
    if (quickSearch !== undefined) {
      setSearch(quickSearch);
    }
  }, [quickSearch]);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: search.trim(),
        category,
        mealType,
        cuisine,
        minRating,
        sort,
        order,
        page: String(page),
        limit: '12',
        showDeleted: showDeleted ? 'true' : 'false'
      });

      const res = await fetch(`/api/foods?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setFoods(data.data || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
          setTotalItems(data.pagination.totalItems || 0);
        }
      }
    } catch (err) {
      console.error("Failed to fetch foods:", err);
      showToast("Failed to connect to REST API", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [search, category, mealType, cuisine, minRating, sort, order, page, showDeleted]);

  // Soft Delete handler
  const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to soft-delete "${name}"? It will be moved to the trash archive.`)) return;

    try {
      const res = await fetch(`/api/foods/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Soft-deleted "${name}"`, "warning");
        fetchFoods();
      } else {
        const err = await res.json();
        showToast(err.error || "Delete failed", "error");
      }
    } catch (err) {
      showToast("Error executing soft delete", "error");
    }
  };

  // Restore handler
  const handleRestore = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/foods/restore/${id}`, { method: 'POST' });
      if (res.ok) {
        showToast(`Restored "${name}" from trash!`, "success");
        fetchFoods();
      }
    } catch (err) {
      showToast("Failed to restore item", "error");
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Soft-delete ${selectedIds.length} selected food items?`)) return;

    try {
      const res = await fetch('/api/foods/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      });
      if (res.ok) {
        showToast(`Bulk deleted ${selectedIds.length} items`, "warning");
        setSelectedIds([]);
        setBulkMode(false);
        fetchFoods();
      }
    } catch (err) {
      showToast("Bulk delete failed", "error");
    }
  };

  const toggleSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Utensils className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">Food Nutrition Database</h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {totalItems} records
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse, filter, and manage nutritional records. {currentUser.role === 'ADMIN' ? 'You have full Admin CRUD & Soft-Delete privileges.' : 'Standard mode enabled.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {currentUser.role === 'ADMIN' && (
            <>
              <button
                onClick={() => {
                  setShowDeleted(!showDeleted);
                  setPage(1);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  showDeleted
                    ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{showDeleted ? 'Viewing Trash / Deleted' : 'Trash Archive'}</span>
              </button>

              <button
                onClick={() => {
                  setBulkMode(!bulkMode);
                  setSelectedIds([]);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  bulkMode
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>{bulkMode ? 'Cancel Bulk Select' : 'Bulk Select'}</span>
              </button>

              {bulkMode && selectedIds.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow-md shadow-rose-600/20 flex items-center gap-1 animate-pulse"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Selected ({selectedIds.length})</span>
                </button>
              )}

              <button
                onClick={onAddFood}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Food Item</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          
          {/* Search Input */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search foods, ingredients, barcodes..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={category}
              onChange={e => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:border-emerald-500"
            >
              <option value="All">All Categories</option>
              <option value="Proteins & Meats">Proteins & Meats</option>
              <option value="Fruits & Vegetables">Fruits & Vegetables</option>
              <option value="Grains & Cereals">Grains & Cereals</option>
              <option value="Dairy & Alternatives">Dairy & Alternatives</option>
              <option value="Snacks & Beverages">Snacks & Beverages</option>
              <option value="Fast Food & Cheats">Fast Food & Cheats</option>
            </select>
          </div>

          {/* Meal Type Filter */}
          <div>
            <select
              value={mealType}
              onChange={e => {
                setMealType(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:border-emerald-500"
            >
              <option value="All">All Meal Types</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>
          </div>

          {/* Healthy Rating Filter */}
          <div>
            <select
              value={minRating}
              onChange={e => {
                setMinRating(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:border-emerald-500"
            >
              <option value="">Any Health Rating</option>
              <option value="5">⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
              <option value="4">⭐⭐⭐⭐+ (4 - Very Healthy)</option>
              <option value="3">⭐⭐⭐+ (3 - Moderate)</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <select
              value={`${sort}-${order}`}
              onChange={e => {
                const [newSort, newOrder] = e.target.value.split('-');
                setSort(newSort);
                setOrder(newOrder as 'asc' | 'desc');
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:border-emerald-500"
            >
              <option value="createdAt-desc">Newest Added First</option>
              <option value="calories-asc">Calories: Low to High</option>
              <option value="calories-desc">Calories: High to Low</option>
              <option value="protein-desc">Highest Protein (g)</option>
              <option value="healthyRating-desc">Highest Health Score</option>
              <option value="views-desc">Most Popular / Views</option>
              <option value="name-asc">Alphabetical (A-Z)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Foods Grid Display */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-500" />
          <p className="text-sm font-bold">Querying nutrition records...</p>
        </div>
      ) : foods.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="font-bold text-slate-800 text-lg">No Food Items Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No items match your active filters or search term "{search}". Try clearing your filters or add a new item to the database.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
              setMealType('All');
              setCuisine('All');
              setMinRating('');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foods.map((food: FoodItem) => {
              const isSelected = selectedIds.includes(food.id);
              const isDeleted = food.status === 'Deleted';

              return (
                <div
                  key={food.id}
                  onClick={() => onSelectFood(food)}
                  className={`bg-white rounded-2xl overflow-hidden border transition-all duration-200 hover:shadow-xl cursor-pointer flex flex-col justify-between group ${
                    isDeleted ? 'border-amber-300 bg-amber-50/30 opacity-80' : isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200/80 hover:border-emerald-500/50'
                  }`}
                >
                  <div>
                    {/* Card Header Image */}
                    <div className="relative h-44 bg-slate-100 overflow-hidden">
                      <img
                        src={food.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80"}
                        alt={food.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                          {food.category}
                        </span>
                        
                        {bulkMode && (
                          <button
                            type="button"
                            onClick={(e) => toggleSelect(e, food.id)}
                            className="p-1 rounded-lg bg-white/90 shadow-md"
                          >
                            {isSelected ? <CheckSquare className="w-5 h-5 text-indigo-600" /> : <Square className="w-5 h-5 text-slate-400" />}
                          </button>
                        )}
                      </div>

                      {/* Bottom Image Overlay text */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                        <span className="text-xs font-semibold drop-shadow-sm flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {food.views}
                        </span>
                        <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 fill-current text-amber-200" />
                          {food.calories} kcal
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-600 transition-colors leading-snug">
                          {food.name}
                        </h3>
                        <span className="text-xs font-black bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200/60 shrink-0">
                          {food.healthyRating}/5 ★
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {food.description}
                      </p>

                      {/* Macros Bar */}
                      <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100 text-center">
                        <div className="bg-blue-50/60 p-1.5 rounded-lg">
                          <span className="text-[9px] font-bold text-blue-700 uppercase block">Prot</span>
                          <strong className="text-xs font-black text-blue-950">{food.protein}g</strong>
                        </div>
                        <div className="bg-amber-50/60 p-1.5 rounded-lg">
                          <span className="text-[9px] font-bold text-amber-700 uppercase block">Carbs</span>
                          <strong className="text-xs font-black text-amber-950">{food.carbohydrates}g</strong>
                        </div>
                        <div className="bg-rose-50/60 p-1.5 rounded-lg">
                          <span className="text-[9px] font-bold text-rose-700 uppercase block">Fat</span>
                          <strong className="text-xs font-black text-rose-950">{food.fat}g</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(food.id);
                      }}
                      className={`p-2 rounded-xl transition-all ${
                        food.isFavorite ? 'text-rose-500 bg-rose-50 hover:bg-rose-100' : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100'
                      }`}
                      title="Favorite Item"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      {currentUser.role === 'ADMIN' && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditFood(food);
                            }}
                            className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                            title="Edit Food (Admin)"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {isDeleted ? (
                            <button
                              type="button"
                              onClick={(e) => handleRestore(e, food.id, food.name)}
                              className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-500 transition-all shadow-2xs"
                            >
                              Restore
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => handleDelete(e, food.id, food.name)}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                              title="Soft Delete (Admin)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}

                      {!isDeleted && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onLogMeal(food);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Log</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-500">
                Page {page} of {totalPages}
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 disabled:opacity-50 hover:bg-slate-100 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 disabled:opacity-50 hover:bg-slate-100 transition-colors flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};
