# Groq AI Infrastructure

## Overview

MealMuse uses [Groq](https://console.groq.com) for AI-powered features with the `llama-3.1-8b-instant` model.

## Features Using AI

1. **AI Chef Chat** - Conversational cooking assistant
2. **Recipe Generator** - Generate recipes from ingredients
3. **Ingredient Analyzer** - Analyze what you can make
4. **Recipe Rewriter** - Improve existing recipes

## Setup

### 1. Get API Key

1. Sign up at [console.groq.com](https://console.groq.com)
2. Create API key
3. Add to environment:
   ```bash
   GROQ_API_KEY=gsk_...
   ```

### 2. Rate Limits

**Free Tier:**
- 30 requests/minute
- 14,400 requests/day
- Sufficient for development and small production

**Paid Tier:**
- Higher limits available
- Contact Groq for enterprise pricing

## API Client

Located in: `lib/huggingface.ts` (legacy name, uses Groq)

### Key Functions

```typescript
// AI Chef Chat
export async function aiChefChat(
  message: string,
  context?: string
): Promise<string>

// Recipe Generation
export async function generateRecipe(
  ingredients: string[],
  preferences?: {
    cuisine?: string;
    skill?: string;
    dietary?: string[];
  }
): Promise<Recipe>

// Ingredient Analysis
export async function analyzeIngredients(
  ingredients: string[]
): Promise<{
  possibleRecipes: string[];
  suggestions: string[];
}>

// Recipe Rewriting
export async function rewriteRecipe(
  originalRecipe: Recipe,
  instructions: string
): Promise<Recipe>
```

## Error Handling

### Rate Limiting
```typescript
try {
  const response = await groqClient.chat(...)
} catch (error) {
  if (error.status === 429) {
    // Rate limited - retry with exponential backoff
  }
}
```

### Fallback Strategy
- Graceful degradation for AI features
- Show error message to user
- Log failures for monitoring

## Prompt Engineering

### Chef Chat System Prompt
```
You are an expert chef and cooking instructor...
- Provide practical cooking advice
- Be concise and friendly
- Include measurements and timing
```

### Recipe Generation Prompt
```
Generate a {skill} level {cuisine} recipe using: {ingredients}
- Format as JSON with ingredients, steps, equipment
- Include cooking time
- Provide clear instructions
```

## Monitoring

Track AI usage in `ai_interactions` collection:
- Total requests per user
- Popular features
- Response quality (feedback scores)
- Token usage

## Cost Optimization

1. **Cache common responses** (future)
2. **Limit free tier usage** - require premium for AI features
3. **Set max tokens** to control costs
4. **Batch requests** when possible

## Alternative Models

Currently using: `llama-3.1-8b-instant`

Consider upgrading to:
- `llama-3.1-70b` for better quality
- `mixtral-8x7b` for multilingual support
- OpenAI GPT-4 for premium users

## Testing

### Local Testing
```bash
# Set API key
export GROQ_API_KEY=gsk_...

# Test endpoint
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How do I make pasta?"}'
```

### Mock Responses (Development)
Set `MOCK_AI=true` to use mock responses during development.

## Security

- Never expose `GROQ_API_KEY` client-side
- Rate limit API endpoints
- Validate all user inputs
- Sanitize AI responses before displaying
- Monitor for abuse/spam

## Future Improvements

- [ ] Add response caching with Redis
- [ ] Implement streaming responses
- [ ] Add conversation memory
- [ ] Support image inputs (recipe photos)
- [ ] Multi-language support
