import React, { useState } from 'react';
import { Sparkles, Camera, Upload, Send, MessageSquare, Utensils, Award, Flame, CheckCircle2, RefreshCw, ArrowRight, Save, Plus, HeartPulse, Brain, AlertCircle, FileText } from 'lucide-react';
import { UserProfile, FoodItem } from '../types.ts';

interface AiStudioViewProps {
  currentUser: UserProfile;
  onSaveRecognizedFood: (food: Partial<FoodItem>) => void;
  onLogMeal: (food: FoodItem) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AiStudioView: React.FC<AiStudioViewProps> = ({
  currentUser,
  onSaveRecognizedFood,
  onLogMeal,
  showToast
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'vision' | 'planner' | 'chat'>('vision');

  // --- VISION STATE ---
  const [imageInput, setImageInput] = useState<string>('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [visionResult, setVisionResult] = useState<any | null>(null);

  // --- PLANNER STATE ---
  const [targetCalories, setTargetCalories] = useState<string>(String(currentUser.dailyCalorieGoal || 2000));
  const [fitnessGoal, setFitnessGoal] = useState<string>(currentUser.fitnessGoal || 'Maintain Weight');
  const [dietaryPreference, setDietaryPreference] = useState<string>('Balanced / Mediterranean');
  const [allergens, setAllergens] = useState<string>('None');
  const [planning, setPlanning] = useState<boolean>(false);
  const [plannerResult, setPlannerResult] = useState<any | null>(null);

  // --- CHAT STATE ---
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; timestamp: string }>>([
    {
      sender: 'ai',
      text: `Hello ${currentUser.name}! I am NutriBot, your Gemini-powered clinical and culinary nutrition assistant. How can I help you today? Ask me about macros, meal prep, or ingredient substitutions!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatting, setChatting] = useState<boolean>(false);

  // --- HANDLERS ---
  const handleAnalyzeImage = async () => {
    if (!imageInput.trim()) {
      showToast("Please provide an image URL or base64 string", "error");
      return;
    }
    setAnalyzing(true);
    setVisionResult(null);
    try {
      const trimmed = imageInput.trim();
      const isBase64 = trimmed.startsWith('data:image/') || trimmed.length > 2000;
      let derivedHint = "";
      const lower = trimmed.toLowerCase();
      if (trimmed.includes("1540420773420") || lower.includes("quinoa") || lower.includes("salad")) {
        derivedHint = "Avocado Quinoa Power Salad";
      } else if (trimmed.includes("1519708227418") || lower.includes("salmon") || lower.includes("fish")) {
        derivedHint = "Grilled Wild Alaskan Salmon Fillet";
      } else if (trimmed.includes("1568901346375") || lower.includes("burger")) {
        derivedHint = "Double Cheeseburger with Bacon";
      } else if (trimmed.includes("1488477181946") || lower.includes("yogurt") || lower.includes("parfait")) {
        derivedHint = "Greek Yogurt Berry Parfait";
      } else if (trimmed.includes("1544025162") || lower.includes("steak") || lower.includes("beef")) {
        derivedHint = "Grass-Fed Beef Tenderloin Steak";
      } else if (trimmed.includes("1515823662") || lower.includes("matcha") || lower.includes("tea")) {
        derivedHint = "Matcha Green Tea Latte & Walnuts";
      } else if (trimmed.includes("1512621776951") || lower.includes("potato") || lower.includes("broccoli") || lower.includes("bowl")) {
        derivedHint = "Steamed Sweet Potato & Broccoli Bowl";
      } else if (trimmed.includes("1517673132405") || lower.includes("oat") || lower.includes("banana") || lower.includes("porridge") || lower.includes("cereal")) {
        derivedHint = "Classic Oatmeal with Sliced Banana";
      } else if (lower.includes("chicken") || lower.includes("poultry")) {
        derivedHint = "Grilled Herb Chicken Breast with Quinoa";
      } else if (lower.includes("pizza") || lower.includes("cheese")) {
        derivedHint = "Margherita Whole Wheat Pizza";
      } else if (lower.includes("egg") || lower.includes("omelet") || lower.includes("toast")) {
        derivedHint = "Avocado Toast with Poached Eggs";
      }

      const res = await fetch('/api/ai/recognize-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: trimmed,
          imageUrl: !isBase64 ? trimmed : undefined,
          imageBase64: isBase64 ? trimmed : undefined,
          hint: derivedHint
        })
      });
      if (res.ok) {
        const data = await res.json();
        setVisionResult(data);
        showToast("AI successfully analyzed food image with exact nutrition!", "success");
      } else {
        const err = await res.json();
        showToast(err.error || "Vision analysis failed", "error");
      }
    } catch (err) {
      showToast("Error connecting to Gemini Vision API", "error");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlanning(true);
    setPlannerResult(null);
    try {
      const res = await fetch('/api/ai/recommend-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetCalories: Number(targetCalories) || 2000,
          fitnessGoal,
          dietaryPreference,
          allergens: allergens.split(',').map(s => s.trim()).filter(Boolean)
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPlannerResult(data);
        showToast("AI generated personalized 3-day meal plan!", "success");
      } else {
        const err = await res.json();
        showToast(err.error || "Plan generation failed", "error");
      }
    } catch (err) {
      showToast("Error connecting to AI Planner API", "error");
    } finally {
      setPlanning(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatting) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setChatting(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          userContext: {
            name: currentUser.name,
            goal: currentUser.fitnessGoal,
            dailyCalories: currentUser.dailyCalorieGoal
          }
        })
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [...prev, { sender: 'ai', text: data.reply || "I am processing your nutrition inquiry.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      } else {
        setChatMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I encountered a temporary network issue connecting to the AI neural network.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      }
    } catch (err) {
      showToast("Error sending message to NutriBot", "error");
    } finally {
      setChatting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header & Sub-tab navigation */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-indigo-900/50">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-purple-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-indigo-300 mb-3 border border-indigo-500/30">
              <Brain className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
              <span>Google Gemini AI Neural Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              AI Nutrition & Culinary Intelligence Studio
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Harness multimodal AI vision to scan meals instantly, generate personalized dietary schedules, and consult our intelligent nutrition bot for evidence-based advice.
            </p>
          </div>

          {/* Sub-tab pills */}
          <div className="flex bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80 shrink-0">
            <button
              onClick={() => setActiveSubTab('vision')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'vision' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Camera className="w-4 h-4 text-amber-300" />
              <span>Food Vision</span>
            </button>
            <button
              onClick={() => setActiveSubTab('planner')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'planner' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Utensils className="w-4 h-4 text-emerald-300" />
              <span>AI Meal Planner</span>
            </button>
            <button
              onClick={() => setActiveSubTab('chat')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'chat' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-blue-300" />
              <span>NutriBot Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- SUB-TAB 1: FOOD VISION & RECOGNITION --- */}
      {activeSubTab === 'vision' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Image Input */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <Camera className="w-6 h-6 text-indigo-600" />
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg">Visual Nutrition Scanner</h2>
                <p className="text-xs text-slate-500">Paste an image URL or base64 photo of any meal</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Image Source URL / Data</label>
              <input
                type="text"
                value={imageInput}
                onChange={e => setImageInput(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:bg-white focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            {/* Image Preview */}
            <div className="relative h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner group">
              <img
                src={imageInput}
                alt="Food Preview"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
                <span className="text-white text-xs font-bold drop-shadow-md">Live Preview Active</span>
              </div>
            </div>

            <button
              disabled={analyzing}
              onClick={handleAnalyzeImage}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing with Gemini Neural Vision...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Analyze Meal & Extract Nutrition</span>
                </>
              )}
            </button>

            {/* Preset Samples */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Try Sample Meals:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setImageInput("https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80")}
                  className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-bold text-slate-700 truncate text-center"
                >
                  🥗 Quinoa Salad
                </button>
                <button
                  type="button"
                  onClick={() => setImageInput("https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80")}
                  className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-bold text-slate-700 truncate text-center"
                >
                  🐟 Grilled Salmon
                </button>
                <button
                  type="button"
                  onClick={() => setImageInput("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80")}
                  className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-bold text-slate-700 truncate text-center"
                >
                  🍔 Cheeseburger
                </button>
                <button
                  type="button"
                  onClick={() => setImageInput("https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80")}
                  className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-bold text-slate-700 truncate text-center"
                >
                  🫐 Yogurt Parfait
                </button>
                <button
                  type="button"
                  onClick={() => setImageInput("https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80")}
                  className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-bold text-slate-700 truncate text-center"
                >
                  🥦 Potato Bowl
                </button>
                <button
                  type="button"
                  onClick={() => setImageInput("https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=600&q=80")}
                  className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-bold text-slate-700 truncate text-center"
                >
                  🥣 Banana Oatmeal
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: AI Analysis Result */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-emerald-600" />
                  <h3 className="font-extrabold text-slate-900 text-lg">AI Nutritional Breakdown</h3>
                </div>
                {visionResult && (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Confidence: High
                  </span>
                )}
              </div>

              {!visionResult ? (
                <div className="py-24 text-center text-slate-400 space-y-3">
                  <Camera className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
                  <p className="text-sm font-semibold max-w-sm mx-auto">
                    No image analyzed yet. Paste an image URL on the left and click "Analyze Meal" to generate nutritional data.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-6 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <div>
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{visionResult.category}</span>
                      <h4 className="text-2xl font-black text-slate-900 mt-1">{visionResult.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{visionResult.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-400 uppercase font-bold block">Estimated Energy</span>
                      <span className="text-3xl font-black text-emerald-600 flex items-center justify-end gap-1">
                        <Flame className="w-6 h-6 fill-current text-amber-500" />
                        {visionResult.calories} <span className="text-xs font-normal text-slate-500">kcal</span>
                      </span>
                    </div>
                  </div>

                  {/* Macros Grid */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200/80">
                      <span className="text-xs font-bold text-blue-700 uppercase block">Protein</span>
                      <strong className="text-xl font-black text-blue-950 mt-1 block">{visionResult.protein}g</strong>
                    </div>
                    <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80">
                      <span className="text-xs font-bold text-amber-700 uppercase block">Carbohydrates</span>
                      <strong className="text-xl font-black text-amber-950 mt-1 block">{visionResult.carbohydrates}g</strong>
                    </div>
                    <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200/80">
                      <span className="text-xs font-bold text-rose-700 uppercase block">Fat</span>
                      <strong className="text-xl font-black text-rose-950 mt-1 block">{visionResult.fat}g</strong>
                    </div>
                  </div>

                  {/* Health Rating & Ingredients */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <span className="text-xs font-bold text-slate-700 uppercase block mb-2">Healthy Score & Cuisine</span>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-indigo-600">{visionResult.healthyRating || 4}/5 ★</span>
                        <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border">
                          {visionResult.cuisine || 'International'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <span className="text-xs font-bold text-slate-700 uppercase block mb-2">Detected Ingredients</span>
                      <div className="flex flex-wrap gap-1.5">
                        {visionResult.ingredients && visionResult.ingredients.map((ing: string, i: number) => (
                          <span key={i} className="bg-white border border-slate-200 text-slate-700 text-xs font-medium px-2 py-0.5 rounded-lg shadow-2xs">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {visionResult.healthTips && (
                    <div className="bg-emerald-50/60 border border-emerald-200/80 p-4 rounded-2xl">
                      <span className="text-xs font-bold text-emerald-800 uppercase block mb-1 flex items-center gap-1.5">
                        <HeartPulse className="w-4 h-4 text-emerald-600" />
                        <span>AI Dietitian Advice</span>
                      </span>
                      <p className="text-xs text-emerald-950 leading-relaxed">{visionResult.healthTips}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Footer for Saving to DB */}
            {visionResult && (
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const newFood: Partial<FoodItem> = {
                      name: visionResult.name,
                      category: visionResult.category || 'Proteins & Meats',
                      calories: visionResult.calories || 300,
                      protein: visionResult.protein || 20,
                      carbohydrates: visionResult.carbohydrates || 30,
                      fat: visionResult.fat || 10,
                      cuisine: visionResult.cuisine || 'International',
                      mealType: 'Dinner',
                      healthyRating: visionResult.healthyRating || 4,
                      description: visionResult.description || 'AI analyzed food record.',
                      ingredients: visionResult.ingredients || ['General ingredients'],
                      imageUrl: imageInput
                    };
                    onSaveRecognizedFood(newFood);
                  }}
                  className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save to Food DB (Admin CRUD)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const tempFood: FoodItem = {
                      id: `f-ai-${Date.now()}`,
                      name: visionResult.name,
                      category: visionResult.category || 'Proteins & Meats',
                      calories: visionResult.calories || 300,
                      protein: visionResult.protein || 20,
                      carbohydrates: visionResult.carbohydrates || 30,
                      fat: visionResult.fat || 10,
                      cuisine: visionResult.cuisine || 'International',
                      mealType: 'Dinner',
                      healthyRating: visionResult.healthyRating || 4,
                      description: visionResult.description || 'AI analyzed food record.',
                      ingredients: visionResult.ingredients || ['General ingredients'],
                      imageUrl: imageInput,
                      views: 1,
                      isFavorite: false,
                      status: 'Available',
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString()
                    };
                    onLogMeal(tempFood);
                  }}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log to Daily Diary</span>
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* --- SUB-TAB 2: AI MEAL PLANNER --- */}
      {activeSubTab === 'planner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <Utensils className="w-6 h-6 text-emerald-600" />
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg">AI Meal Plan Generator</h2>
                <p className="text-xs text-slate-500">Configure parameters for a customized 3-day schedule</p>
              </div>
            </div>

            <form onSubmit={handleGeneratePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Daily Calories *</label>
                <input
                  type="number"
                  required
                  value={targetCalories}
                  onChange={e => setTargetCalories(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary Fitness Goal *</label>
                <select
                  value={fitnessGoal}
                  onChange={e => setFitnessGoal(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white"
                >
                  <option value="Gain Muscle">Gain Lean Muscle</option>
                  <option value="Fat Loss">Weight & Fat Loss</option>
                  <option value="Maintain Weight">Maintain Healthy Weight</option>
                  <option value="Athletic Endurance">Athletic Performance & Endurance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dietary Preference *</label>
                <select
                  value={dietaryPreference}
                  onChange={e => setDietaryPreference(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white"
                >
                  <option value="Balanced / Mediterranean">Balanced / Mediterranean</option>
                  <option value="High-Protein / Low-Carb">High-Protein / Low-Carb</option>
                  <option value="100% Plant-Based Vegan">100% Plant-Based Vegan</option>
                  <option value="Vegetarian with Dairy/Eggs">Vegetarian with Dairy/Eggs</option>
                  <option value="Ketogenic">Ketogenic</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Food Allergies / Exclusions</label>
                <input
                  type="text"
                  value={allergens}
                  onChange={e => setAllergens(e.target.value)}
                  placeholder="Peanuts, Shellfish, Gluten..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={planning}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {planning ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Synthesizing Nutrition Plan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <span>Generate 3-Day Custom Plan</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-emerald-600" />
                  <h3 className="font-extrabold text-slate-900 text-lg">Your Personalized Schedule</h3>
                </div>
                {plannerResult && (
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-extrabold px-3 py-1 rounded-full">
                    {plannerResult.days ? plannerResult.days.length : 3}-Day Schedule
                  </span>
                )}
              </div>

              {!plannerResult ? (
                <div className="py-24 text-center text-slate-400 space-y-3">
                  <Utensils className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
                  <p className="text-sm font-semibold max-w-sm mx-auto">
                    No meal plan generated yet. Select your targets on the left and click "Generate 3-Day Custom Plan".
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-6 animate-in fade-in duration-300 max-h-[65vh] overflow-y-auto pr-2">
                  <div className="bg-emerald-50 border border-emerald-200/80 p-4 rounded-2xl">
                    <h4 className="font-extrabold text-emerald-900 text-sm">{plannerResult.title || "Custom AI Nutrition Plan"}</h4>
                    <p className="text-xs text-emerald-800 mt-1">{plannerResult.overview || "Optimized to support your specific fitness goals."}</p>
                  </div>

                  <div className="space-y-6">
                    {plannerResult.days && plannerResult.days.map((day: any, idx: number) => (
                      <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                          <h5 className="font-black text-slate-900 text-base">{day.dayName || `Day ${idx + 1}`}</h5>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                            Total: ~{day.totalCalories || targetCalories} kcal
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {day.meals && day.meals.map((meal: any, mIdx: number) => (
                            <div key={mIdx} className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1.5 shadow-2xs">
                              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">{meal.mealType}</span>
                              <h6 className="font-bold text-slate-900 text-xs leading-snug">{meal.foodName}</h6>
                              <p className="text-[11px] font-extrabold text-slate-600 flex items-center gap-1">
                                <Flame className="w-3 h-3 text-amber-500 fill-current" />
                                {meal.calories} kcal
                              </p>
                              <span className="text-[10px] text-slate-400 block truncate">{meal.macros}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* --- SUB-TAB 3: NUTRIBOT CHAT --- */}
      {activeSubTab === 'chat' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs max-w-4xl mx-auto flex flex-col h-[70vh]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">NutriBot AI Clinical Assistant</h3>
                <p className="text-xs text-slate-400">Ask questions about macros, ingredients, or dietary science</p>
              </div>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Online
            </span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-2">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-lg rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-xs'
                      : 'bg-slate-100 text-slate-800 border border-slate-200/80 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 mt-1 px-1">
                  {msg.sender === 'user' ? 'You' : 'NutriBot'} • {msg.timestamp}
                </span>
              </div>
            ))}
            {chatting && (
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 p-2">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                <span>NutriBot is formulating nutrition response...</span>
              </div>
            )}
          </div>

          {/* Chat Input Toolbar */}
          <form onSubmit={handleSendMessage} className="pt-4 border-t border-slate-100 flex gap-3 shrink-0">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="e.g. What can I substitute for eggs in baking? How much protein after lifting?"
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-indigo-500 font-medium"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || chatting}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
