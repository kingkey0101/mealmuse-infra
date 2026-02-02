// MongoDB Index Creation Script
// Run this in MongoDB Atlas shell or with mongosh

use mealmuse_prod;

print("Creating indexes for MealMuse database...");

// Users collection
print("Creating users indexes...");
db.users.createIndex({ email: 1 }, { unique: true, name: "email_unique" });
db.users.createIndex(
  { "subscription.stripeCustomerId": 1 },
  { name: "stripe_customer_lookup" }
);
print("✓ Users indexes created");

// Recipes collection
print("Creating recipes indexes...");
db.recipes.createIndex({ userId: 1 }, { name: "user_recipes" });
db.recipes.createIndex({ spoonacularId: 1 }, { name: "seeded_recipes" });
db.recipes.createIndex({ status: 1 }, { name: "recipe_status" });
db.recipes.createIndex({ createdAt: -1 }, { name: "recent_recipes" });
print("✓ Recipes indexes created");

// AI Interactions collection
print("Creating ai_interactions indexes...");
db.ai_interactions.createIndex(
  { userId: 1, created_at: -1 },
  { name: "user_interaction_history" }
);
db.ai_interactions.createIndex({ type: 1 }, { name: "interaction_type" });
print("✓ AI Interactions indexes created");

// Shopping Lists collection
print("Creating shopping_lists indexes...");
db.shopping_lists.createIndex({ userId: 1 }, { unique: true, name: "user_list_unique" });
print("✓ Shopping Lists indexes created");

print("\n✅ All indexes created successfully!");

// Show all indexes
print("\n📊 Index Summary:");
print("\nUsers:");
db.users.getIndexes().forEach((idx) => print(`  - ${idx.name}`));
print("\nRecipes:");
db.recipes.getIndexes().forEach((idx) => print(`  - ${idx.name}`));
print("\nAI Interactions:");
db.ai_interactions.getIndexes().forEach((idx) => print(`  - ${idx.name}`));
print("\nShopping Lists:");
db.shopping_lists.getIndexes().forEach((idx) => print(`  - ${idx.name}`));
