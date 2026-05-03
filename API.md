# API Documentation

## Base URL
`/api/v1`

## Chat Endpoints

### `POST /chat/message`
Send a message to the AI assistant.
- **Body:** `{ "message": "string", "conversationId": "uuid?", "country": "string?" }`
- **Response:** `{ "status": "success", "data": { "response": "string", "conversationId": "uuid", "sources": ["string"], "messageId": "uuid" } }`

### `GET /chat/conversations/:userId`
Get all conversations for a user.
- **Response:** `{ "status": "success", "data": { "conversations": [...] } }`

### `GET /chat/conversation/:conversationId`
Get details of a specific conversation.
- **Response:** `{ "status": "success", "data": { "conversation": {...} } }`

### `DELETE /chat/conversation/:conversationId`
Delete a conversation.
- **Response:** `204 No Content`

## Quiz Endpoints

### `POST /quiz/generate`
Generate an AI quiz.
- **Body:** `{ "topic": "string", "difficulty": "easy|medium|hard", "count": number }`
- **Response:** `{ "status": "success", "data": { "quizId": "uuid", "questions": [...] } }`

### `POST /quiz/submit`
Submit quiz answers.
- **Body:** `{ "quizId": "uuid", "answers": [...] }`
- **Response:** `{ "status": "success", "data": { "score": number, "feedback": [...] } }`

## Timeline Endpoints

### `GET /timeline/:country`
Get timeline events.
- **Query:** `?state=string&year=number`
- **Response:** `{ "status": "success", "data": { "events": [...], "upcomingDeadlines": [...] } }`

## Topics Endpoints

### `GET /topics`
Get all topics.
- **Query:** `?category=string&difficulty=string&search=string`
- **Response:** `{ "status": "success", "data": { "topics": [...] } }`

### `GET /topics/:topicId`
Get topic details.
- **Response:** `{ "status": "success", "data": { "topic": {...} } }`
