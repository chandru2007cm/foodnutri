import React from 'react';
import { Utensils, Flame, Trash2, Plus, Droplets, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { DiaryEntry, UserProfile } from '../types.ts';

interface DiaryViewProps {
  diary: DiaryEntry[];
  currentUser: UserProfile;
  waterIntakeML: number;
  onDeleteEntry: (id: string) => void;
  onAddWater: (ml: number) => void;
  onOpenLogModal: () => void;
  onSelectTab: (tab: string) => void;
}

export const DiaryView: React.FC<DiaryViewProps> = ({
  diary,
  currentUser,
  waterIntakeML,
  onDeleteEntry,
  onAddWater,
  onOpenLogModal,
  onSelectTab
}) => {
  const totalCalories = diary.reduce((acc, d) => acc + d.calories, 0);
  const totalProtein = Math.round(diary.reduce((acc, d) => acc + d.protein, 0) * 10) / 10;
  const totalCarbs = Math.round(diary.reduce((acc, d) => acc + d.carbs, 0) * 10) / 10;
  const totalFat = Math.round(diary.reduce((acc, d) => acc + d.fat, 0) * 10) / 10;

  const isOverGoal = totalCalories > currentUser.dailyCalorieGoal;
  const calPercent = Math.min(100, Math.round((totalCalories / currentUser.dailyCalorieGoal) * 100));
  const waterPercent = Math.min(100, Math.round((waterIntakeML / currentUser.waterGoalML) * 100));

  const mealCategories = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">Daily Food & Hydration Diary</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your daily nutrition progress, review meal portions, and log hydration towards your daily target.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('foods')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Utensils className="w-4 h-4 text-emerald-400" />
            <span>Browse Food DB</span>
          </button>
        </div>
      </div>

      {/* Progress Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Calorie & Macro Target Progress */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 fill-current" />
              <span>Calorie Intake Progress</span>
            </h2>
            <span className={`text-xs font-black px-3 py-1 rounded-full ${isOverGoal ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
              {isOverGoal ? 'Goal Exceeded' : `${currentUser.dailyCalorieGoal - totalCalories} kcal remaining`}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">{totalCalories}</span>
            <span className="text-sm font-bold text-slate-400">/ {currentUser.dailyCalorieGoal} kcal goal</span>
          </div>

          <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
            <div
              style={{ width: `${calPercent}%` }}
              className={`h-full transition-all duration-500 ${isOverGoal ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 to-emerald-500'}`}
            />
          </div>

          {/* Macro breakdown */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
            <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-200/60 text-center">
              <span className="text-[10px] font-bold text-blue-700 uppercase block">Protein</span>
              <strong className="text-lg font-black text-blue-950">{totalProtein}g</strong>
            </div>
            <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/60 text-center">
              <span className="text-[10px] font-bold text-amber-700 uppercase block">Carbohydrates</span>
              <strong className="text-lg font-black text-amber-950">{totalCarbs}g</strong>
            </div>
            <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-200/60 text-center">
              <span className="text-[10px] font-bold text-rose-700 uppercase block">Fat</span>
              <strong className="text-lg font-black text-rose-950">{totalFat}g</strong>
            </div>
          </div>
        </div>

        {/* Hydration Widget */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-500 fill-current" />
                <span>Hydration Tracker</span>
              </h2>
              <span className="text-xs font-black bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {waterPercent}% of target
              </span>
            </div>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900">{waterIntakeML}</span>
              <span className="text-sm font-bold text-slate-400">/ {currentUser.waterGoalML} ml goal</span>
            </div>

            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden mt-6">
              <div style={{ width: `${waterPercent}%` }} className="h-full bg-blue-500 transition-all duration-500" />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-600 block mb-2">Quick Log Water:</span>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => onAddWater(250)}
                className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-extrabold transition-all border border-blue-200"
              >
                +250 ml (Glass)
              </button>
              <button
                onClick={() => onAddWater(500)}
                className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-extrabold transition-all border border-blue-200"
              >
                +500 ml (Bottle)
              </button>
              <button
                onClick={() => onAddWater(1000)}
                className="py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-blue-500/20"
              >
                +1 Liter
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Categorized Meal Lists */}
      <div className="space-y-6">
        {mealCategories.map(cat => {
          const catEntries = diary.filter(d => d.mealType === cat || (cat === 'Snack' && !['Breakfast', 'Lunch', 'Dinner'].includes(d.mealType)));
          const catCal = catEntries.reduce((acc, d) => acc + d.calories, 0);

          return (
            <div key={cat} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    {cat[0]}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{cat}</h3>
                    <p className="text-xs text-slate-400">{catEntries.length} item(s) logged</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-extrabold text-slate-800 bg-slate-100 px-3 py-1 rounded-xl">
                    {catCal} kcal
                  </span>
                  <button
                    onClick={() => onSelectTab('foods')}
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                </div>
              </div>

              {catEntries.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs italic">
                  No foods logged for {cat} yet today. Click "+ Add" or Browse Food DB to log a meal.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {catEntries.map(entry => (
                    <div key={entry.id} className="py-3.5 flex items-center justify-between gap-4 group">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{entry.foodName}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          <strong>{entry.servings}</strong> serving(s) • Logged at {entry.timestamp || 'Today'}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <span className="text-sm font-black text-slate-900 block">{entry.calories} kcal</span>
                          <span className="text-[10px] text-slate-400 block">
                            P: {entry.protein}g • C: {entry.carbs}g • F: {entry.fat}g
                          </span>
                        </div>

                        <button
                          onClick={() => onDeleteEntry(entry.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-80 group-hover:opacity-100"
                          title="Remove from diary"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
