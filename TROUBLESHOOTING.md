# MealMuse Troubleshooting Guide

## Production Issues & Solutions

### Issue: E11000 Duplicate Key Error on Registration

**Error:**
```
MongoServerError: E11000 duplicate key error collection: mealmuse_prod.users index: userId_1 dup key: { userId: null }
```

**Date Fixed:** February 2, 2026

**Root Cause:**
Legacy database schema had a unique index on `userId` field with null values. When migrating to use MongoDB's `_id` as the primary key, the old index blocked new registrations with duplicate null conflicts.

**Solution Applied:**
1. **Deleted old test users with null userId:**
   ```javascript
   use mealmuse_prod
   db.users.deleteMany({ userId: null })
   ```

2. **Dropped the obsolete index:**
   ```javascript
   db.users.dropIndex("userId_1")
   ```

3. **Verified remaining indexes:**
   ```javascript
   db.users.getIndexes()
   // Result: _id_, email_1 (unique), tier_1
   ```

**Code Changes:**
- Updated all database calls to use `getDatabase()` helper
- Helper extracts database name from MongoDB URI automatically
- See commit: `fix: replace all client.db() calls with getDatabase() helper`

**Prevention for Future:**
- Always use explicit database names in MongoDB connections
- Test database migrations locally before production
- Document index changes in version control

---

## Common Database Issues

### 500 Error on Registration/Login

**Symptoms:**
- `Failed to load resource: the server responded with a status of 500`
- Vercel logs show MongoDB connection errors

**Checklist:**
1. ✅ Verify `MONGODB_URI` includes database name: `/mealmuse_prod?`
2. ✅ Check MongoDB Atlas IP whitelist (use `0.0.0.0/0` for dev, specific IPs for prod)
3. ✅ Verify Vercel environment variables are set
4. ✅ Test database connection locally: `npm run build`

**Fix:**
```javascript
// In lib/db.ts, database name is auto-extracted from URI
// Example valid URI:
mongodb+srv://user:pass@cluster.mongodb.net/mealmuse_prod?retryWrites=true
```

---

### 401 Unauthorized on Login

**Symptoms:**
- `POST /api/auth/callback/credentials 401 (Unauthorized)`
- User exists but login fails

**Checklist:**
1. ✅ Verify `NEXTAUTH_SECRET` is set in Vercel
2. ✅ Verify `NEXTAUTH_URL=https://mymealmuse.com` (exact domain)
3. ✅ Check database has user with correct email
4. ✅ Verify bcrypt password hash is correct

**Debug:**
Check Vercel runtime logs for actual error:
```
Project → Deployments → [latest] → Runtime Logs → Filter "Login"
```

---

### Index Conflicts

**Issue:** `E11000` or `E11001` errors on insert/update

**Solution:**
1. **List all indexes:**
   ```javascript
   db.users.getIndexes()
   db.recipes.getIndexes()
   ```

2. **Drop problematic index:**
   ```javascript
   db.users.dropIndex("index_name_1")
   ```

3. **Recreate correct indexes:**
   ```javascript
   load('mealmuse-infra/database/create-indexes.js')
   ```

---

## MongoDB Connection Testing

**Local:**
```bash
mongosh "mongodb+srv://cluster.mongodb.net/mealmuse_prod"
> use mealmuse_prod
> db.users.find()
```

**Vercel:**
Check runtime logs → Search "MongoDB" or "connection"

---

## Stripe Issues

### Webhook Signature Verification Failed

**Local Testing:**
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Copy: whsec_... to STRIPE_WEBHOOK_SECRET
```

**Production:**
- Verify endpoint URL in Stripe Dashboard
- Verify webhook secret matches environment variable
- Check Stripe logs: Developers → Webhooks → [Your endpoint] → Logs

---

### Subscription Not Updating

**Check:**
1. Stripe webhook delivery logs
2. Vercel runtime logs for `/api/stripe/webhook`
3. MongoDB `users` collection for subscription document

**Debug:**
```javascript
db.users.findOne({ email: "user@example.com" })
// Check subscription field structure
```

---

## Getting Help

**Check Logs:**
1. **Vercel:** Project → Deployments → [Latest] → Runtime Logs
2. **MongoDB Atlas:** Cluster → Performance Advisor → Slow Queries
3. **Stripe:** Developers → Webhooks → Endpoint → Logs
4. **NextAuth:** `/api/auth/signin` page has debug info

**Common Commands:**
```bash
# Check build locally
npm run build

# Type check
npm run type-check

# Check errors
npm run lint
```

---

## Schema Reference

See [database/README.md](./database/README.md) for complete schema documentation.

