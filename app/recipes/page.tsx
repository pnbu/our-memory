import { allRecipes } from "@/lib/recipes";
import { RecipeCard } from "./RecipeCard";

export default function RecipesPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold">今天吃什么</h1>
        <p className="text-muted text-sm mt-1">点一道想吃的，厨师会收到通知 🍳</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allRecipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </div>
    </div>
  );
}
