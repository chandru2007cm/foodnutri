export type HealthGoal = 'Lose Weight' | 'Maintain Weight' | 'Gain Muscle' | 'Improve Energy' | 'Heart Health' | 'Diabetes Management';
export type ActivityLevel = 'Sedentary' | 'Lightly Active' | 'Moderate' | 'Very Active' | 'Athlete';
export type DietType = 'Balanced' | 'Low-Carb' | 'Keto' | 'Vegan' | 'Vegetarian' | 'Paleo' | 'Mediterranean' | 'Gluten-Free' | 'High-Protein';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  token: string;
  dailyCalorieGoal: number;
  waterGoalML: number;
  weightKG: number;
  heightCM: number;
  activityLevel: string;
  fitnessGoal: string;
  avatar: string;
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  cholesterol?: number;
  vitamins?: string[];
  minerals?: string[];
  ingredients: string[];
  description: string;
  cuisine: string;
  mealType: string;
  healthyRating: number;
  views: number;
  isFavorite?: boolean;
  status: 'Available' | 'Deleted' | 'Draft';
  createdAt: string;
  updatedAt: string;
  barcode?: string;
  imageUrl?: string;
  allergens?: string[];
  preparationTimeMinutes?: number;
  costPerServingUSD?: number;
  glycemicIndex?: string;
  ecoScore?: string;
}

export interface DiaryEntry {
  id: string;
  userId: string;
  foodId: string;
  foodName: string;
  mealType: string;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
  timestamp: string;
}

export type FoodDiaryEntry = DiaryEntry;

export interface SystemLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  type: 'INFO' | 'WARNING' | 'SECURITY';
}

export interface Recommendation {
  id: string;
  userId?: string;
  title: string;
  category: string;
  description: string;
  matchScore?: number;
  calories?: number;
  tags?: string[];
  imageUrl?: string;
  reason?: string;
}
