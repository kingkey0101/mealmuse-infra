# Stripe Configuration

## Products & Pricing

### Early Adopter (Limited Time)
- **Price ID**: `STRIPE_PRICE_ID_EARLY_ADOPTER`
- **Amount**: $X.99/month
- **Features**: All premium features
- **Availability**: First 50 users only

### Premium Monthly
- **Price ID**: `STRIPE_PRICE_ID_MONTHLY`
- **Amount**: $X.99/month
- **Features**: All premium features

## Webhook Configuration

### Endpoint URL
```
https://your-domain.vercel.app/api/stripe/webhook
```

### Events to Subscribe
```
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
checkout.session.completed
invoice.payment_succeeded
invoice.payment_failed
```

### Setup Steps

1. **Create Webhook in Stripe Dashboard**
   - Go to Developers → Webhooks
   - Add endpoint with URL above
   - Select events listed above
   - Copy webhook signing secret

2. **Add to Environment Variables**
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

3. **Test Locally with Stripe CLI**
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

## Subscription Flow

### 1. User Clicks "Upgrade to Premium"
```javascript
// Frontend calls: /api/stripe/create-checkout
// Backend creates Checkout Session
// Redirects to Stripe hosted page
```

### 2. User Completes Payment
```javascript
// Stripe fires: checkout.session.completed
// Webhook handler updates user:
{
  subscription: {
    tier: "premium",
    status: "active",
    stripeCustomerId: "cus_...",
    stripeSubscriptionId: "sub_...",
    currentPeriodEnd: Date
  }
}
```

### 3. Subscription Renewal
```javascript
// Stripe fires: invoice.payment_succeeded
// Webhook updates currentPeriodEnd
```

### 4. Cancellation
```javascript
// User clicks "Cancel" → /api/stripe/portal
// Stripe fires: customer.subscription.updated
// Webhook sets: cancelAtPeriodEnd = true
```

### 5. Subscription Ended
```javascript
// Stripe fires: customer.subscription.deleted
// Webhook updates:
{
  tier: "free",
  status: "canceled"
}
```

## Testing

### Test Cards
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0027 6000 3184
```

### Test Webhook
```bash
stripe trigger customer.subscription.created
```

## Customer Portal

Users can manage their subscription via Stripe Customer Portal:
```
https://your-domain.vercel.app/api/stripe/portal
```

Features:
- Update payment method
- Cancel subscription
- View invoices
- Update billing info

## Monitoring

- **Failed Payments**: Check Stripe Dashboard → Payments → Failed
- **Webhooks**: Check Developers → Webhooks → [Your endpoint] → Logs
- **Subscriptions**: Check Customers → Subscriptions

## Security

- Verify webhook signatures in `/api/stripe/webhook`
- Use `STRIPE_WEBHOOK_SECRET` for validation
- Never trust client-side subscription status
- Always verify server-side with Stripe API
