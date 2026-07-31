import React from 'react';
import { X, Flame, Award, Heart, Share2, Barcode, CheckCircle2, Clock, DollarSign, Leaf } from 'lucide-react';
import { FoodItem, UserProfile } from '../types.ts';

interface FoodDetailModalProps {
  food: FoodItem | null;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  currentUser: UserProfile;
  onEdit?: (food: FoodItem) => void;
  onLogMeal?: (food: FoodItem) => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  food,
  onClose,
  onToggleFavorite,
  currentUser,
  onEdit,
  onLogMeal
}) => {
  if (!food) return null;

  const totalMacros = food.protein + food.carbohydrates + food.fat;
  const proteinPct = totalMacros > 0 ? Math.round((food.protein / totalMacros) * 100) : 33;
  const carbsPct = totalMacros > 0 ? Math.round((food.carbohydrates / totalMacros) * 100) : 33;
  const fatPct = totalMacros > 0 ? Math.round((food.fat / totalMacros) * 100) : 34;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Banner / Image */}
        <div className="relative h-64 bg-slate-100">
          <img
            src={food.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"}
            alt={food.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-black/30" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                {food.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 drop-shadow-md">
                {food.name}
              </h2>
              <p className="text-slate-200 text-sm mt-1 flex items-center gap-2">
                <span>{food.cuisine} Cuisine</span>
                <span>•</span>
                <span>{food.mealType}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(food.id)}
                className={`p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                  food.isFavorite ? 'bg-rose-500 text-white' : 'bg-white/30 text-white hover:bg-white/50'
                }`}
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[calc(85vh-16rem)] overflow-y-auto space-y-6">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="text-center p-2">
              <span className="text-xs text-slate-500 font-semibold uppercase">Calories</span>
              <p className="text-xl font-extrabold text-emerald-600 flex items-center justify-center gap-1 mt-0.5">
                <Flame className="w-5 h-5 fill-current text-amber-500" />
                {food.calories}
              </p>
            </div>
            <div className="text-center p-2 border-l border-slate-200">
              <span className="text-xs text-slate-500 font-semibold uppercase">Healthy Score</span>
              <p className="text-xl font-extrabold text-indigo-600 flex items-center justify-center gap-1 mt-0.5">
                <Award className="w-5 h-5 text-indigo-500" />
                {food.healthyRating}/5
              </p>
            </div>
            <div className="text-center p-2 border-l border-slate-200">
              <span className="text-xs text-slate-500 font-semibold uppercase">Prep Time</span>
              <p className="text-xl font-extrabold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                <Clock className="w-4 h-4 text-slate-500" />
                {food.preparationTimeMinutes || 15} <span className="text-xs font-normal text-slate-400">min</span>
              </p>
            </div>
            <div className="text-center p-2 border-l border-slate-200">
              <span className="text-xs text-slate-500 font-semibold uppercase">Cost / Serving</span>
              <p className="text-xl font-extrabold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                {food.costPerServingUSD ? food.costPerServingUSD.toFixed(2) : "4.50"}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Description & Benefits</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{food.description}</p>
          </div>

          {/* Macronutrients Breakdown */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Macronutrients (per serving)</h3>
            
            {/* Visual Macro Bar */}
            <div className="h-4 w-full rounded-full overflow-hidden flex shadow-inner bg-slate-200 mb-4">
              <div style={{ width: `${proteinPct}%` }} className="bg-blue-500" title={`Protein: ${food.protein}g`} />
              <div style={{ width: `${carbsPct}%` }} className="bg-amber-500" title={`Carbohydrates: ${food.carbohydrates}g`} />
              <div style={{ width: `${fatPct}%` }} className="bg-rose-500" title={`Fat: ${food.fat}g`} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50/70 border border-blue-200 p-3 rounded-xl">
                <div className="flex justify-between items-center text-xs font-bold text-blue-800">
                  <span>Protein</span>
                  <span>{proteinPct}%</span>
                </div>
                <p className="text-lg font-extrabold text-blue-900 mt-1">{food.protein}g</p>
              </div>
              <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl">
                <div className="flex justify-between items-center text-xs font-bold text-amber-800">
                  <span>Carbs</span>
                  <span>{carbsPct}%</span>
                </div>
                <p className="text-lg font-extrabold text-amber-900 mt-1">{food.carbohydrates}g</p>
              </div>
              <div className="bg-rose-50/70 border border-rose-200 p-3 rounded-xl">
                <div className="flex justify-between items-center text-xs font-bold text-rose-800">
                  <span>Fat</span>
                  <span>{fatPct}%</span>
                </div>
                <p className="text-lg font-extrabold text-rose-900 mt-1">{food.fat}g</p>
              </div>
            </div>
          </div>

          {/* Micronutrients & Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Vitamins & Minerals</h4>
              <div className="flex flex-wrap gap-1.5">
                {food.vitamins && food.vitamins.map((v, i) => (
                  <span key={i} className="bg-white border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium shadow-2xs">
                    {v}
                  </span>
                ))}
                {food.minerals && food.minerals.map((m, i) => (
                  <span key={i} className="bg-white border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium shadow-2xs">
                    {m}
                  </span>
                ))}
                {(!food.vitamins || food.vitamins.length === 0) && (!food.minerals || food.minerals.length === 0) && (
                  <span className="text-xs text-slate-400 italic">Standard dietary micronutrients</span>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Additional Specifications</h4>
              <ul className="text-xs text-slate-600 space-y-1.5">
                <li className="flex justify-between"><span>Fiber:</span> <strong className="text-slate-900">{food.fiber || 0}g</strong></li>
                <li className="flex justify-between"><span>Sugar:</span> <strong className="text-slate-900">{food.sugar || 0}g</strong></li>
                <li className="flex justify-between"><span>Sodium:</span> <strong className="text-slate-900">{food.sodium || 0}mg</strong></li>
                <li className="flex justify-between"><span>Glycemic Index:</span> <strong className="text-slate-900">{food.glycemicIndex || "Low"}</strong></li>
                <li className="flex justify-between"><span>Eco Score:</span> <strong className="text-emerald-600 font-bold">{food.ecoScore || "A"}</strong></li>
              </ul>
            </div>
          </div>

          {/* Ingredients List */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {food.ingredients && food.ingredients.map((ing, i) => (
                <span key={i} className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-200/80 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Barcode Footer */}
          {food.barcode && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-500">
              <div className="flex items-center gap-2 font-mono">
                <Barcode className="w-5 h-5 text-slate-700" />
                <span>UPC/EAN: {food.barcode}</span>
              </div>
              <span>Database ID: {food.id}</span>
            </div>
          )}

        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          
          <div className="flex items-center gap-3">
            {currentUser.role === 'ADMIN' && onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(food);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors shadow-sm"
              >
                Edit Food (Admin)
              </button>
            )}
            {onLogMeal && (
              <button
                onClick={() => {
                  onClose();
                  onLogMeal(food);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2"
              >
                <span>Log to Daily Diary</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
