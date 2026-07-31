import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { FoodsView } from './components/FoodsView.tsx';
import { DiaryView } from './components/DiaryView.tsx';
import { AiStudioView } from './components/AiStudioView.tsx';
import { ReportsView } from './components/ReportsView.tsx';
import { FoodDetailModal } from './components/FoodDetailModal.tsx';
import { AddEditFoodModal } from './components/AddEditFoodModal.tsx';
import { LogMealModal } from './components/LogMealModal.tsx';
import { FoodItem, UserProfile, DiaryEntry } from './types.ts';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function App() {
  // Navigation & User State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [quickSearch, setQuickSearch] = useState<string>('');

  // We simulate role switching between Admin (Alex Vance) and User (Sarah Jenkins)
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: "usr-admin-1",
    name: "Alex Vance",
    email: "alex.vance@nutrigenius.ai",
    role: "ADMIN",
    token: "jwt-sim-token-admin-98a7c6f5",
    dailyCalorieGoal: 2200,
    waterGoalML: 3000,
    weightKG: 75,
    heightCM: 180,
    activityLevel: "Very Active",
    fitnessGoal: "Gain Muscle",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  });

  // Data State
  const [dashboardStats, setDashboardStats] = useState<any | null>(null);
  const [diary, setDiary] = useState<DiaryEntry[]>([]);
  const [waterIntakeML, setWaterIntakeML] = useState<number>(1250);

  // Modals State
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [foodToEdit, setFoodToEdit] = useState<FoodItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [foodToLog, setFoodToLog] = useState<FoodItem | null>(null);

  // Toast State
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => {
      setToast(prev => (prev?.msg === msg ? null : prev));
    }, 4000);
  };

  // Fetch Dashboard Stats & Diary
  const fetchDashboardStats = async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const data = await res.json();
        setDashboardStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    }
  };

  const fetchDiary = async () => {
    try {
      const res = await fetch(`/api/diary?userId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setDiary(data);
        } else if (data && Array.isArray(data.diary)) {
          setDiary(data.diary);
          if (typeof data.waterIntakeML === 'number') {
            setWaterIntakeML(data.waterIntakeML);
          }
        } else {
          setDiary([]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch diary:", err);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchDiary();
  }, [currentUser]);

  // Handle Role Switch
  const handleSwitchUserRole = () => {
    if (currentUser.role === 'ADMIN') {
      const standardUser: UserProfile = {
        id: "usr-user-1",
        name: "Sarah Jenkins",
        email: "sarah.j@nutrigenius.ai",
        role: "USER",
        token: "jwt-sim-token-user-12b34c56",
        dailyCalorieGoal: 1800,
        waterGoalML: 2500,
        weightKG: 62,
        heightCM: 165,
        activityLevel: "Moderate",
        fitnessGoal: "Maintain Weight",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
      };
      setCurrentUser(standardUser);
      showToast("Switched to Standard User mode (Sarah Jenkins)", "info");
    } else {
      const adminUser: UserProfile = {
        id: "usr-admin-1",
        name: "Alex Vance",
        email: "alex.vance@nutrigenius.ai",
        role: "ADMIN",
        token: "jwt-sim-token-admin-98a7c6f5",
        dailyCalorieGoal: 2200,
        waterGoalML: 3000,
        weightKG: 75,
        heightCM: 180,
        activityLevel: "Very Active",
        fitnessGoal: "Gain Muscle",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
      };
      setCurrentUser(adminUser);
      showToast("Switched to Admin mode (Alex Vance - Full CRUD)", "success");
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = async (foodId: string) => {
    try {
      const res = await fetch(`/api/foods/${foodId}/favorite`, { method: 'POST' });
      if (res.ok) {
        const updated = await res.json();
        showToast(updated.isFavorite ? "Added item to Favorites ❤️" : "Removed item from Favorites", "info");
        fetchDashboardStats();
        // Update local selectedFood if open
        if (selectedFood && selectedFood.id === foodId) {
          setSelectedFood(updated);
        }
      }
    } catch (err) {
      showToast("Error updating favorites", "error");
    }
  };

  // Add Water
  const handleAddWater = async (ml: number) => {
    setWaterIntakeML(prev => prev + ml);
    showToast(`Logged +${ml}ml of water! Stay hydrated 💧`, "success");
    try {
      await fetch('/api/water', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, ml })
      });
      fetchDashboardStats();
    } catch (err) {
      console.error("Water sync error:", err);
    }
  };

  // Save Food (Admin CRUD Add or Edit)
  const handleSaveFood = async (payload: Partial<FoodItem>) => {
    const isEdit = !!payload.id;
    const url = isEdit ? `/api/foods/${payload.id}` : '/api/foods';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast(isEdit ? "Successfully updated food item!" : "New food item created in database!", "success");
        setFoodToEdit(null);
        setIsAddModalOpen(false);
        fetchDashboardStats();
      } else {
        const err = await res.json();
        showToast(err.error || "Save operation failed", "error");
      }
    } catch (err) {
      showToast("Error connecting to server", "error");
    }
  };

  // Confirm Log Meal to Diary
  const handleConfirmLogMeal = async (foodId: string, mealType: string, servings: number) => {
    try {
      const res = await fetch('/api/diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          foodId,
          mealType,
          servings
        })
      });
      if (res.ok) {
        showToast(`Logged meal to ${mealType} diary! 🍽️`, "success");
        fetchDiary();
        fetchDashboardStats();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to log meal", "error");
      }
    } catch (err) {
      showToast("Error connecting to server", "error");
    }
  };

  // Delete Diary Entry
  const handleDeleteDiaryEntry = async (entryId: string) => {
    try {
      const res = await fetch(`/api/diary/${entryId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast("Removed food entry from daily diary", "info");
        fetchDiary();
        fetchDashboardStats();
      }
    } catch (err) {
      showToast("Failed to delete diary entry", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
      
      {/* Navbar with Admin / User Toggle */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'foods') setQuickSearch('');
        }}
        currentUser={currentUser}
        onSwitchRole={handleSwitchUserRole}
        quickSearch={quickSearch}
        setQuickSearch={setQuickSearch}
        caloriesConsumed={dashboardStats?.dailyCaloriesConsumed || 0}
      />

      {/* Main Body Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {currentTab === 'dashboard' && (
          <DashboardView
            stats={dashboardStats}
            currentUser={currentUser}
            onSelectTab={setCurrentTab}
            onSelectFood={(food) => setSelectedFood(food)}
            onToggleFavorite={handleToggleFavorite}
            onAddWater={handleAddWater}
          />
        )}

        {currentTab === 'foods' && (
          <FoodsView
            currentUser={currentUser}
            quickSearch={quickSearch}
            onSelectFood={(food) => setSelectedFood(food)}
            onEditFood={(food) => setFoodToEdit(food)}
            onAddFood={() => setIsAddModalOpen(true)}
            onLogMeal={(food) => setFoodToLog(food)}
            onToggleFavorite={handleToggleFavorite}
            showToast={showToast}
          />
        )}

        {currentTab === 'diary' && (
          <DiaryView
            diary={diary}
            currentUser={currentUser}
            waterIntakeML={waterIntakeML}
            onDeleteEntry={handleDeleteDiaryEntry}
            onAddWater={handleAddWater}
            onOpenLogModal={() => setCurrentTab('foods')}
            onSelectTab={setCurrentTab}
          />
        )}

        {currentTab === 'ai-studio' && (
          <AiStudioView
            currentUser={currentUser}
            onSaveRecognizedFood={(food) => handleSaveFood(food)}
            onLogMeal={(food) => setFoodToLog(food)}
            showToast={showToast}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsView
            currentUser={currentUser}
            onSelectTab={setCurrentTab}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-slate-700">AI-Powered Food Nutrition Analysis System</span>
            <span>• React 19 + Express + MySQL & Spring Boot Engine</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600 font-semibold">
            <button onClick={() => setCurrentTab('reports')} className="hover:text-emerald-600 transition-colors">Download Code (.ZIP)</button>
            <span>•</span>
            <button onClick={() => setCurrentTab('ai-studio')} className="hover:text-emerald-600 transition-colors">Gemini Vision API</button>
            <span>•</span>
            <span>RESTful MVC Architecture</span>
          </div>
        </div>
      </footer>

      {/* --- MODALS --- */}
      
      {/* Food Detail Modal */}
      <FoodDetailModal
        food={selectedFood}
        onClose={() => setSelectedFood(null)}
        onToggleFavorite={handleToggleFavorite}
        currentUser={currentUser}
        onEdit={(food) => setFoodToEdit(food)}
        onLogMeal={(food) => setFoodToLog(food)}
      />

      {/* Add / Edit Food Modal (Admin CRUD) */}
      {(isAddModalOpen || foodToEdit) && (
        <AddEditFoodModal
          foodToEdit={foodToEdit}
          onClose={() => {
            setFoodToEdit(null);
            setIsAddModalOpen(false);
          }}
          onSave={handleSaveFood}
        />
      )}

      {/* Log Meal to Diary Modal */}
      <LogMealModal
        food={foodToLog}
        onClose={() => setFoodToLog(null)}
        onConfirm={handleConfirmLogMeal}
      />

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className={`px-5 py-3.5 rounded-2xl shadow-xl border flex items-center gap-3 backdrop-blur-md ${
            toast.type === 'success' ? 'bg-emerald-900/90 text-white border-emerald-500' :
            toast.type === 'error' ? 'bg-rose-900/90 text-white border-rose-500' :
            toast.type === 'warning' ? 'bg-amber-900/90 text-white border-amber-500' :
            'bg-slate-900/90 text-white border-slate-700'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
            
            <p className="text-xs sm:text-sm font-bold">{toast.msg}</p>
            
            <button onClick={() => setToast(null)} className="p-1 text-white/70 hover:text-white rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
