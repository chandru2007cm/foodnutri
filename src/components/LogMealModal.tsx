import React, { useState } from 'react';
import { X, Flame, CheckCircle2, Utensils } from 'lucide-react';
import { FoodItem } from '../types.ts';

interface LogMealModalProps {
  food: FoodItem | null;
  onClose: () => void;
  onConfirm: (foodId: string, mealType: string, servings: number) => void;
}

export const LogMealModal: React.FC<LogMealModalProps> = ({
  food,
  onClose,
  onConfirm
}) => {
  if (!food) return null;

  const [mealType, setMealType] = useState<string>(food.mealType !== 'Any' ? food.mealType : 'Lunch');
  const [servings, setServings] = useState<number>(1);

  const totalCalories = Math.round(food.calories * servings);
  const totalProtein = Math.round(food.protein * servings * 10) / 10;
  const totalCarbs = Math.round(food.carbohydrates * servings * 10) / 10;
  const totalFat = Math.round(food.fat * servings * 10) / 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(food.id, mealType, servings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Utensils className="w-5 h-5" />
            <h2 className="text-lg font-extrabold">Log Food to Daily Diary</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            <img
              src={food.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80"}
              alt={food.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{food.name}</h3>
              <p className="text-xs text-slate-500">{food.category} • {food.calories} kcal/serving</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select Meal Category *</label>
            <div className="grid grid-cols-2 gap-2">
              {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMealType(type)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    mealType === type
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {mealType === type && <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{type}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Number of Servings (1 serving = default portion)</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.25"
                min="0.25"
                max="10"
                value={servings}
                onChange={e => setServings(Math.max(0.25, Number(e.target.value)))}
                className="w-24 px-3 py-2 border border-slate-300 rounded-xl text-base font-extrabold text-slate-900 text-center"
              />
              <div className="flex gap-1.5 flex-1">
                {[0.5, 1, 1.5, 2].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setServings(num)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      servings === num ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {num}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200/80 p-4 rounded-2xl">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2">Calculated Total Intake</span>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <span className="text-[10px] text-emerald-700 block">Calories</span>
                <strong className="text-base font-extrabold text-emerald-900 flex items-center justify-center gap-0.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" />
                  {totalCalories}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-blue-700 block">Protein</span>
                <strong className="text-sm font-bold text-blue-900">{totalProtein}g</strong>
              </div>
              <div>
                <span className="text-[10px] text-amber-700 block">Carbs</span>
                <strong className="text-sm font-bold text-amber-900">{totalCarbs}g</strong>
              </div>
              <div>
                <span className="text-[10px] text-rose-700 block">Fat</span>
                <strong className="text-sm font-bold text-rose-900">{totalFat}g</strong>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold">
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Log Meal</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
