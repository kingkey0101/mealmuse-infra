# MealMuse Infrastructure

Infrastructure, deployment scripts, and DevOps configuration for MealMuse.

## Repository Structure

```
mealmuse-infra/
├── aws/                    # AWS Lambda & API Gateway
├── database/              # MongoDB schemas & migrations
├── stripe/                # Stripe webhook & subscription config
├── ai/                    # Groq AI infrastructure
├── deployment/            # Deployment scripts
└── environment/           # Environment templates
```

## Quick Links

- [AWS Lambda Setup](./aws/README.md)
- [Database Setup](./database/README.md)
- [Stripe Configuration](./stripe/README.md)
- [AI Infrastructure](./ai/README.md)
- [Deployment Guide](./deployment/README.md)

## Tech Stack

- **Backend Runtime**: AWS Lambda (Node.js)
- **Frontend**: Next.js 16 (Vercel)
- **Database**: MongoDB Atlas
- **Payments**: Stripe
- **AI**: Groq (Llama 3.1)
- **Auth**: NextAuth.js

## Environment Variables

See [environment/README.md](./environment/README.md) for complete environment setup.

## Deployment

```bash
# Deploy Lambda functions
cd deployment
./deploy-lambda.ps1

# Deploy to Vercel
vercel --prod
```

## Support

For documentation, see [mealmuse-docs](https://github.com/kingkey0101/mealmuse-docs)
