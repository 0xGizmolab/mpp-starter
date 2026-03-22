# MPP Example: AWS Lambda

AWS Lambda function with MPP payment gating.

## Structure

```
src/
  index.ts    # Lambda handler with routing
  mpp-config.ts
```

## Deployment

Use AWS SAM, Serverless Framework, or CDK to deploy.

## Endpoints (via API Gateway)

- `GET /health` — Health check
- `GET /free` — Free endpoint  
- `GET /paid` — Payment-gated endpoint
