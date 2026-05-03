# Architecture

## Overview
The Election Process Education Assistant is a full-stack web application designed to be deployed on Google Cloud Platform.

## Components
1. **Frontend (React/Vite)**
   - SPA architecture with React Router
   - Tailwind CSS for styling
   - Zustand for state management
   - Axios for API communication
   - Hosted on Google Cloud Run via Nginx container

2. **Backend (Node.js/Express)**
   - RESTful API
   - Prisma ORM for database access
   - Integrates with Anthropic Claude API for AI features
   - JWT authentication
   - Hosted on Google Cloud Run

3. **Database (PostgreSQL)**
   - Hosted on Google Cloud SQL
   - Stores user profiles, chat history, quiz results, and timeline events.

4. **AI Integration**
   - Uses Anthropic's Claude 3.5 Sonnet model for conversational responses and quiz generation.

## Data Flow
User -> Frontend -> Backend API -> Prisma -> PostgreSQL Database
Backend API -> Anthropic Claude API
