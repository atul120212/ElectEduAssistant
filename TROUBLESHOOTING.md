# Troubleshooting Guide

## Database Connection Issues
If you encounter `P1001` or connection errors in Prisma:
- Ensure PostgreSQL is running.
- Verify `DATABASE_URL` in `.env`.
- Check if Cloud SQL Proxy is running when deploying.

## Claude API Errors
- Ensure `ANTHROPIC_API_KEY` is set correctly.
- Check rate limits and quota on Anthropic console.

## CORS Issues
- Verify `CORS_ORIGIN` matches your frontend URL.

## Frontend Build Errors
- Ensure you have run `npm install` and using Node 18+.
- Clear `node_modules` and `.vite` cache if issues persist.
