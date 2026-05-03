# Election Process Education Assistant

An interactive AI-powered platform that educates users about election processes, voting procedures, timelines, and civic participation in an engaging, accessible manner.

## Features
- **Interactive Chat Interface**: Chat with Claude AI for real-time answers to election-related questions.
- **Election Timeline Visualizer**: Interactive timeline showing key election milestones.
- **Knowledge Base Explorer**: Categorized topics on election processes.
- **Interactive Quiz System**: AI-generated quizzes to test knowledge.

## Tech Stack
- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL, Anthropic Claude API
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Zustand
- **Deployment**: Docker, Google Cloud Run, GitHub Actions

## Setup Instructions
Please refer to the READMEs in the respective directories:
- [Backend Setup](./backend/README.md)
- [Frontend Setup](./frontend/README.md)

## Deployment
1. Run `./create-gcp-resources.sh` to provision Google Cloud resources.
2. Push to the `main` branch to trigger GitHub Actions deployment.

## Project Structure
- `backend/`: Node.js Express API
- `frontend/`: React Vite SPA
- `.github/workflows/`: CI/CD configuration
- `docker-compose.yml`: Local development environment
