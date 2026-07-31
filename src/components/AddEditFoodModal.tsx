import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Flame } from 'lucide-react';
import { FoodItem } from '../types.ts';

interface AddEditFoodModalProps {
  foodToEdit: FoodItem | null;
  onClose: () => void;
  onSave: (food: Partial<FoodItem>) => void;
}

export const AddEditFoodModal: React.FC<AddEditFoodModalProps> = ({
  foodToEdit,
  onClose,
  onSave
}) => {
  const isEditing = !!foodToEdit;

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Proteins & Meats');
  const [calories, setCalories] = useState('300');
  const [protein, setProtein] = useState('20');
  const [carbs, setCarbs] = useState('30');
  const [fat, setFat] = useState('10');
  const [fiber, setFiber] = useState('5');
  const [sugar, setSugar] = useState('5');
  const [sodium, setSodium] = useState('150');
  const [cuisine, setCuisine] = useState('American');
  const [mealType, setMealType] = useState('Dinner');
  const [healthyRating, setHealthyRating] = useState('4');
  const [description, setDescription] = useState('');
  const [ingredientsStr, setIngredientsStr] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [barcode, setBarcode] = useState('');

  useEffect(() => {
    if (foodToEdit) {
      setName(foodToEdit.name);
      setCategory(foodToEdit.category);
      setCalories(String(foodToEdit.calories));
      setProtein(String(foodToEdit.protein));
      setCarbs(String(foodToEdit.carbohydrates));
      setFat(String(foodToEdit.fat));
      setFiber(String(foodToEdit.fiber || 0));
      setSugar(String(foodToEdit.sugar || 0));
      setSodium(String(foodToEdit.sodium || 0));
      setCuisine(foodToEdit.cuisine);
      setMealType(foodToEdit.mealType);
      setHealthyRating(String(foodToEdit.healthyRating));
      setDescription(foodToEdit.description);
      setIngredientsStr(foodToEdit.ingredients.join(', '));
      setImageUrl(foodToEdit.imageUrl || '');
      setBarcode(foodToEdit.barcode || '');
    }
  }, [foodToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const ingredients = ingredientsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const payload: Partial<FoodItem> = {
      ...(isEditing && { id: foodToEdit.id }),
      name: name.trim(),
      category,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbohydrates: Number(carbs) || 0,
      fat: Number(fat) || 0,
      fiber: Number(fiber) || 0,
      sugar: Number(sugar) || 0,
      sodium: Number(sodium) || 0,
      cuisine,
      mealType,
      healthyRating: Number(healthyRating) || 3,
      description: description.trim() || 'No description provided.',
      ingredients: ingredients.length > 0 ? ingredients : ['General dietary ingredients'],
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      barcode: barcode.trim() || `89012345${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Available'
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              {isEditing ? 'Edit Food Item (Admin CRUD)' : 'Add New Food Item (Admin CRUD)'}
            </h2>
            <p className="text-xs text-slate-300">
              {isEditing ? `Modify database record ID: ${foodToEdit.id}` : 'Create a new nutrition record in the system database'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Food Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Organic Quinoa Salad"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:border-emerald-500"
              >
                <option value="Proteins & Meats">Proteins & Meats</option>
                <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                <option value="Grains & Cereals">Grains & Cereals</option>
                <option value="Dairy & Alternatives">Dairy & Alternatives</option>
                <option value="Snacks & Beverages">Snacks & Beverages</option>
                <option value="Fast Food & Cheats">Fast Food & Cheats</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Calories *</label>
              <input
                type="number"
                required
                value={calories}
                onChange={e => setCalories(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm font-bold text-emerald-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Protein (g) *</label>
              <input
                type="number"
                step="0.1"
                required
                value={protein}
                onChange={e => setProtein(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm font-bold text-blue-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Carbs (g) *</label>
              <input
                type="number"
                step="0.1"
                required
                value={carbs}
                onChange={e => setCarbs(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm font-bold text-amber-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Fat (g) *</label>
              <input
                type="number"
                step="0.1"
                required
                value={fat}
                onChange={e => setFat(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm font-bold text-rose-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Fiber (g)</label>
              <input type="number" step="0.1" value={fiber} onChange={e => setFiber(e.target.value)} className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Sugar (g)</label>
              <input type="number" step="0.1" value={sugar} onChange={e => setSugar(e.target.value)} className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Sodium (mg)</label>
              <input type="number" step="1" value={sodium} onChange={e => setSodium(e.target.value)} className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cuisine</label>
              <input type="text" value={cuisine} onChange={e => setCuisine(e.target.value)} placeholder="American, Mediterranean..." className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Meal Type</label>
              <select value={mealType} onChange={e => setMealType(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm">
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
                <option value="Any">Any / All-Day</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Healthy Rating (1-5)</label>
              <select value={healthyRating} onChange={e => setHealthyRating(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold text-indigo-600">
                <option value="5">5 - Exceptional</option>
                <option value="4">4 - Very Healthy</option>
                <option value="3">3 - Moderate / Average</option>
                <option value="2">2 - Indulgence / Limit</option>
                <option value="1">1 - Cheat / Avoid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description & Health Benefits</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the nutritional profile and dietary advantages..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ingredients (comma-separated)</label>
            <input
              type="text"
              value={ingredientsStr}
              onChange={e => setIngredientsStr(e.target.value)}
              placeholder="Quinoa, Olive Oil, Avocado, Tomatoes..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Image URL (optional)</label>
              <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">UPC / Barcode (optional)</label>
              <input type="text" value={barcode} onChange={e => setBarcode(e.target.value)} placeholder="8901234500000" className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-mono" />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold">
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Create Food Item'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
