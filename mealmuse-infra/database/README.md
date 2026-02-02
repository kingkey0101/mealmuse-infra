# MongoDB Database Schema

## Collections

### users
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (bcrypt hashed, required),
  createdAt: Date,
  subscription: {
    tier: String, // "free" | "premium"
    status: String, // "active" | "canceled" | "past_due"
    stripeCustomerId?: String,
    stripeSubscriptionId?: String,
    currentPeriodEnd?: Date,
    cancelAtPeriodEnd?: Boolean
  },
  favorites: [String] // Array of recipe _id
}
```

**Indexes:**
- `email` (unique)
- `subscription.stripeCustomerId` (for webhook lookups)

### recipes
```javascript
{
  _id: ObjectId,
  title: String (required),
  cuisine: String | [String],
  skill: String, // "beginner" | "intermediate" | "advanced"
  dietary?: [String],
  cookingTime?: Number, // minutes
  ingredients: [
    {
      name: String,
      amount?: String,
      unit?: String
    }
    // OR String (legacy format)
  ],
  steps: [String],
  equipment: [String],
  userId?: String, // User who created (null for seeded recipes)
  spoonacularId?: Number, // For seeded recipes
  status?: String, // "pending" | "approved" | "rejected"
  createdAt: Date,
  updatedAt?: Date
}
```

**Indexes:**
- `userId` (for user's recipes)
- `spoonacularId` (for seeded recipes)
- `status` (for admin approvals)

### ai_interactions
```javascript
{
  _id: ObjectId,
  userId: String,
  type: String, // "chef_chat" | "recipe_generation" | "ingredient_analysis" | "rewrite"
  userQuery: String,
  aiResponse: String,
  extractedKeywords: [String],
  extractedTags: [String],
  model: String, // "llama-3.1-8b-instant"
  created_at: Date,
  conversationHistory?: [Object],
  topic?: String,
  feedbackScore?: Number,
  userSavedRecipe?: Boolean,
  userRatedHelpful?: Boolean
}
```

**Indexes:**
- `userId, created_at` (for user history)
- `type` (for analytics)

### shopping_lists
```javascript
{
  _id: ObjectId,
  userId: String (required),
  items: [
    {
      name: String,
      quantity: Number,
      unit: String,
      checked: Boolean,
      addedAt: Date
    }
  ],
  updatedAt: Date
}
```

**Indexes:**
- `userId` (unique - one list per user)

## Setup Instructions

### 1. Create Database
```javascript
use mealmuse_prod
```

### 2. Create Indexes
```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ "subscription.stripeCustomerId": 1 })

// Recipes
db.recipes.createIndex({ userId: 1 })
db.recipes.createIndex({ spoonacularId: 1 })
db.recipes.createIndex({ status: 1 })

// AI Interactions
db.ai_interactions.createIndex({ userId: 1, created_at: -1 })
db.ai_interactions.createIndex({ type: 1 })

// Shopping Lists
db.shopping_lists.createIndex({ userId: 1 }, { unique: true })
```

### 3. Seed Data

See [seed-recipes.js](./seed-recipes.js) for seeding initial recipes.

## Migrations

See [migrations/](./migrations/) folder for schema updates.

## Backup Strategy

**MongoDB Atlas:**
- Continuous backup enabled
- Point-in-time recovery available
- Daily snapshot retention: 7 days

**Manual Backup:**
```bash
mongodump --uri="mongodb+srv://..." --out=backup/
```

**Restore:**
```bash
mongorestore --uri="mongodb+srv://..." backup/
```
