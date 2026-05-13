import recipes from "@/data/recipes.json";

export type Recipe = {
  id: string;
  name: string;
  desc: string;
  tags: string[];
  image: string;
  minutes: number;
};

export const allRecipes: Recipe[] = recipes as Recipe[];

export function getRecipe(id: string): Recipe | undefined {
  return allRecipes.find((r) => r.id === id);
}
