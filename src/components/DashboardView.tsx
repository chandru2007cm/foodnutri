import React from 'react';
import { Utensils, Flame, Award, Heart, Plus, Sparkles, Droplets, TrendingUp, ArrowRight, Activity, ShieldCheck, Clock, Eye } from 'lucide-react';
import { FoodItem, UserProfile } from '../types.ts';

interface DashboardViewProps {
  stats: any;
  currentUser: UserProfile;
  onSelectTab: (tab: string) => void;
  onSelectFood: (food: FoodItem) => void;
  onToggleFavorite: (id: string) => void;
  onAddWater: (ml: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  currentUser,
  onSelectTab,
  onSelectFood,
  onToggleFavorite,
  onAddWater
}) => {
  if (!stats) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Activity className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-500" />
        <p className="font-bold">Loading dashboard analytics & nutrition database...</p>
      </div>
    );
  }

  const { totalFoods, totalCategories, totalViews, mostViewed = [], recentFoods = [], dailyCaloriesConsumed = 0, dailyCalorieGoal = 2000, macrosConsumed = { protein: 0, carbs: 0, fat: 0 }, waterIntakeML = 0, waterGoalML = 2500 } = stats;

  const calPercent = Math.min(100, Math.round((dailyCaloriesConsumed / dailyCalorieGoal) * 100));
  const waterPercent = Math.min(100, Math.round((waterIntakeML / waterGoalML) * 100));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-700/60">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-teal-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
              <span>Full-Stack AI Nutrition Studio</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Welcome back, {currentUser.name}! 👋
            </h1>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              Your personalized AI nutrition hub. Track daily macros, explore our rich food database with RESTful CRUD capabilities, and generate customized meal plans powered by Google Gemini Vision.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectTab('foods')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2"
            >
              <Utensils className="w-4 h-4" />
              <span>Explore Food DB</span>
            </button>
            <button
              onClick={() => onSelectTab('ai-studio')}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-extrabold text-xs transition-all border border-white/15 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Vision & Planner</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Analytics Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Calorie Intake Card */}
        <div 
          onClick={() => onSelectTab('diary')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Daily Calorie Intake</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5 fill-current text-amber-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{dailyCaloriesConsumed}</span>
            <span className="text-xs font-bold text-slate-400">/ {dailyCalorieGoal} kcal</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-3">
            <div 
              style={{ width: `${calPercent}%` }}
              className={`h-full transition-all duration-500 ${dailyCaloriesConsumed > dailyCalorieGoal ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 to-emerald-500'}`}
            />
          </div>
          <p className="text-[11px] font-semibold text-slate-500 mt-2 flex items-center justify-between">
            <span>Goal progress</span>
            <span className="font-bold text-slate-800">{calPercent}%</span>
          </p>
        </div>

        {/* Hydration / Water Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hydration Tracker</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Droplets className="w-5 h-5 fill-current text-blue-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{waterIntakeML}</span>
            <span className="text-xs font-bold text-slate-400">/ {waterGoalML} ml</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-3">
            <div style={{ width: `${waterPercent}%` }} className="h-full bg-blue-500 transition-all duration-500" />
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onAddWater(250)}
              className="flex-1 py-1 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors border border-blue-200/60"
            >
              +250 ml
            </button>
            <button
              onClick={() => onAddWater(500)}
              className="flex-1 py-1 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors border border-blue-200/60"
            >
              +500 ml
            </button>
          </div>
        </div>

        {/* Database Stats Card */}
        <div 
          onClick={() => onSelectTab('foods')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Database Items</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalFoods}</span>
            <span className="text-xs font-bold text-slate-400">active foods</span>
          </div>
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Across <strong>{totalCategories}</strong> distinct categories</span>
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
            <span>Manage database</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Total Views & System Health */}
        <div 
          onClick={() => onSelectTab('reports')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Engagement</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalViews}</span>
            <span className="text-xs font-bold text-slate-400">total views</span>
          </div>
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>REST API & MySQL ready</span>
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600">
            <span>Export SQL & Code</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>

      {/* Macronutrient Summary Grid */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-600" />
          <span>Today's Macronutrient Consumption</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50/70 border border-blue-200/80 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Protein Consumed</span>
              <p className="text-2xl font-black text-blue-950 mt-1">{macrosConsumed.protein || 0}g</p>
              <p className="text-[11px] text-blue-600 font-medium mt-0.5">Essential for muscle repair & enzymes</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
              P
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Carbohydrates Consumed</span>
              <p className="text-2xl font-black text-amber-950 mt-1">{macrosConsumed.carbs || 0}g</p>
              <p className="text-[11px] text-amber-600 font-medium mt-0.5">Primary brain & muscle fuel source</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
              C
            </div>
          </div>

          <div className="bg-rose-50/70 border border-rose-200/80 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Healthy Fats Consumed</span>
              <p className="text-2xl font-black text-rose-950 mt-1">{macrosConsumed.fat || 0}g</p>
              <p className="text-[11px] text-rose-600 font-medium mt-0.5">Vital for hormone synthesis & cell health</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
              F
            </div>
          </div>
        </div>
      </div>

      {/* Most Viewed & Recent Foods Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Most Viewed Foods */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-600" />
              <h3 className="font-extrabold text-slate-900 text-base">Most Popular Database Items</h3>
            </div>
            <button onClick={() => onSelectTab('foods')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {mostViewed.map((food: FoodItem) => (
              <div
                key={food.id}
                onClick={() => onSelectFood(food)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={food.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80"}
                    alt={food.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">{food.name}</h4>
                    <p className="text-xs text-slate-500">{food.category} • <span className="font-semibold text-slate-700">{food.calories} kcal</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-200/60 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {food.views}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Added Foods */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-slate-900 text-base">Recently Added Nutrition Records</h3>
            </div>
            <button onClick={() => onSelectTab('foods')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {recentFoods.map((food: FoodItem) => (
              <div
                key={food.id}
                onClick={() => onSelectFood(food)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={food.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80"}
                    alt={food.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">{food.name}</h4>
                    <p className="text-xs text-slate-500">{food.cuisine} • <span className="font-semibold text-slate-700">{food.calories} kcal</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200/60 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    {food.healthyRating}/5
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
