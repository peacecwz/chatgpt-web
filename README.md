# ChatGPT Web Client

A web client that utilizes OpenAI's ChatGPT API to provide an interactive chat experience with an AI language model.

## Build with

- Typescript
- NextJS
- Tailwind
- React-Syntax-Highlighter
- React-Markdown
- React-Icons
- IORedis

## Installation

- Clone the repository
- Install dependencies with npm install
- Create a .env.local file and add your OpenAI API key as NEXT_PUBLIC_OPENAI_API_KEY
- Run the development server with npm run dev

## Usage

- Open your web browser and navigate to http://localhost:3000
- Type a message in the input field and press enter to send
- The AI language model will respond with a message
- The chat history is saved and can be accessed by scrolling up

## Features

- [X] In-memory Conversation Histories
- [X] Distributed Conversation Histories (You can use Upstash for Redis)
- [X] Dark Mode
- [ ] Built-in OpenAI Key
- [ ] Client-Side OpenAI Key Changes
- [ ] Built-in Prompts

## License

This project is licensed under the terms of the MIT license.