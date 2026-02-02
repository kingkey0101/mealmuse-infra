# Environment Setup Guide

## Required Environment Variables

### 1. Database (MongoDB Atlas)

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mealmuse_prod
```

**Setup:**
1. Create MongoDB Atlas account
2. Create cluster: `mealmuse_prod`
3. Create database user
4. Whitelist IP addresses (or allow all: `0.0.0.0/0`)
5. Copy connection string

### 2. Authentication (NextAuth.js)

```bash
NEXTAUTH_SECRET=<random-32-char-string>
NEXTAUTH_URL=https://your-domain.vercel.app
```

**Generate secret:**
```bash
openssl rand -base64 32
```

### 3. Stripe

```bash
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_EARLY_ADOPTER=price_...
STRIPE_PRICE_ID_MONTHLY=price_...
```

**Setup:**
1. Create Stripe account
2. Create products & prices
3. Set up webhook endpoint: `https://your-domain.vercel.app/api/stripe/webhook`
4. Copy webhook signing secret
5. Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### 4. AI (Groq)

```bash
GROQ_API_KEY=gsk_...
```

**Setup:**
1. Create account at [console.groq.com](https://console.groq.com)
2. Generate API key
3. Free tier includes generous rate limits

### 5. Admin Access

```bash
ADMIN_EMAILS=admin@example.com,admin2@example.com
ADMIN_API_KEY=<random-key>
```

**Generate admin key:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Vercel Deployment

Add all environment variables in Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add each variable for Production, Preview, and Development
3. Redeploy after adding variables

## Local Development

1. Copy template:
   ```bash
   cp environment/env.template .env.local
   ```

2. Fill in all values

3. Restart dev server:
   ```bash
   npm run dev
   ```

## Security Notes

- Never commit `.env.local` or `.env` files
- Rotate secrets regularly
- Use different credentials for dev/prod
- Restrict MongoDB IP whitelist in production
- Use live Stripe keys only in production

## Validation

Test your environment setup:
```bash
npm run build
```

All environment variables are validated at build time.
