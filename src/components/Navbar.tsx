import React from 'react';
import { Utensils, Search, Bell, ShieldAlert, ShieldCheck, Sparkles, User as UserIcon, LogOut, RefreshCw, Download, LayoutDashboard, BookOpen, BarChart3 } from 'lucide-react';
import { UserProfile } from '../types.ts';

interface NavbarProps {
  currentUser: UserProfile;
  onSwitchRole: (newRole: 'ADMIN' | 'USER') => void;
  quickSearch: string;
  setQuickSearch: (val: string) => void;
  onSelectTab: (tab: string) => void;
  caloriesConsumed: number;
  currentTab?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSwitchRole,
  quickSearch,
  setQuickSearch,
  onSelectTab,
  caloriesConsumed,
  currentTab = 'dashboard'
}) => {
  const isOverGoal = caloriesConsumed > currentUser.dailyCalorieGoal;
  const caloriePercent = Math.min(100, Math.round((caloriesConsumed / currentUser.dailyCalorieGoal) * 100));

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'foods', label: 'Foods DB & CRUD', icon: Utensils },
    { id: 'diary', label: 'Food Diary', icon: BookOpen },
    { id: 'ai-studio', label: 'AI Assistant', icon: Sparkles },
    { id: 'reports', label: 'Reports & Export', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Brand & Title - Strictly as requested */}
        <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => onSelectTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md text-white">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">NutriGenius</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">AI Studio</span>
            </div>
            <p className="text-xs text-slate-600 font-semibold">Food Nutrition Analysis & CRUD</p>
          </div>
        </div>

        {/* Search Tool - Strictly as requested */}
        <div className="flex-1 max-w-xl relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={quickSearch}
            onChange={(e) => {
              setQuickSearch(e.target.value);
              if (e.target.value) onSelectTab('foods');
            }}
            placeholder="Quick search food, calories, category, cuisine..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200/80 rounded-full text-sm text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all shadow-inner font-medium"
          />
          {quickSearch && (
            <button
              onClick={() => setQuickSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Secondary Navigation Tab Bar & Secondary Controls */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: Role Switcher, Calorie Meter & User Profile */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Calorie Quick Meter */}
            <div 
              onClick={() => onSelectTab('diary')}
              className="hidden md:flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2.5 py-1 cursor-pointer hover:bg-slate-100 transition-colors shadow-2xs"
              title="Click to view Daily Food Diary"
            >
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-semibold text-slate-500 leading-tight">Daily Intake</span>
                <span className={`text-[11px] font-bold leading-tight ${isOverGoal ? 'text-rose-600' : 'text-slate-800'}`}>
                  {caloriesConsumed} / {currentUser.dailyCalorieGoal} <span className="font-normal text-[9px] text-slate-400">kcal</span>
                </span>
              </div>
              <div className="w-6 h-6 rounded-full bg-slate-200 relative overflow-hidden flex items-center justify-center">
                <div 
                  className={`absolute bottom-0 left-0 right-0 transition-all duration-500 ${isOverGoal ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ height: `${caloriePercent}%` }}
                />
                <span className="relative z-10 text-[8px] font-extrabold text-slate-800">{caloriePercent}%</span>
              </div>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg border border-slate-300/60">
              <button
                onClick={() => onSwitchRole('USER')}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                  currentUser.role === 'USER'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
                title="Standard User Mode"
              >
                <ShieldCheck className="w-3 h-3 text-blue-500" />
                <span className="hidden sm:inline">User</span>
              </button>
              <button
                onClick={() => onSwitchRole('ADMIN')}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                  currentUser.role === 'ADMIN'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
                title="Admin Mode"
              >
                <ShieldAlert className="w-3 h-3 text-amber-300" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <img
                src={currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-emerald-500 shadow-2xs"
              />
              <span className="text-[11px] font-bold text-slate-700 hidden lg:inline max-w-[90px] truncate">{currentUser.name}</span>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
