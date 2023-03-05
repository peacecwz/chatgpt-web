# ChatGPT Web Client

ChatGPT Web Client is a powerful web-based chatbot that utilizes OpenAI's ChatGPT API to provide an interactive chat experience with an AI language model. With ChatGPT Web Client, you can have a conversation with an AI language model and access your conversation history for future reference.

## Build with

- Typescript
- NextJS
- Tailwind
- React-Syntax-Highlighter
- React-Markdown
- React-Icons
- IORedis

## Installation

To install ChatGPT Web Client on your local machine, follow these steps:

1.Clone the repository

```bash

git clone https://github.com/peacecwz/chatgpt-web-client.git

```

2.Install dependencies with npm install

```bash

npm install

```

3.Create a .env.local file and add your OpenAI API key as `OPENAI_API_KEY`

```env

OPENAI_API_KEY=<your API key here>

```

4.Run the development server with npm run dev

```bash

npm run dev

```

## Usage

- Open your web browser and navigate to http://localhost:3000
- Type a message in the input field and press enter to send
- The AI language model will respond with a message
- The chat history is saved and can be accessed by scrolling up

## Configuration

### Enable Distributed Mode

1. Add `ENABLED_DISTRIBUTED_MODE=true` environment variable into your `.env` file:

```env

ENABLED_DISTRIBUTED_MODE=true

```

2. Create or get an existing Redis Connection String. Add your Redis Connection String into your `.env` file:

```env

REDIS_CONNECTION_STRING=redis://<username>:<password>@<host>:31868

```

## Features

- [ ] Typing Effect: Add a typing effect to make the chatbot seem more human-like.
- [X] Code Highlighting: Add code highlighting support to ChatGPT messages for improved readability.
- [X] In-memory Conversation Histories: Chat histories are saved in memory and can be accessed by scrolling up in the chat window.
- [X] Distributed Conversation Histories: Chat histories can be saved to a Redis database using IORedis. Upstash can be used to deploy Redis on the cloud.
- [X] Dark Mode: ChatGPT Web Client supports a dark mode theme for comfortable usage.
- [X] Built-in OpenAI Key: A built-in OpenAI API key can be provided instead of using environment variables.
- [ ] Client-Side OpenAI Key Changes: OpenAI API key changes can be made without the need to restart the application.
- [ ] Built-in Prompts: ChatGPT Web Client can provide prompts to the user to initiate conversations.
- [ ] Auto-Completion: Use auto-completion to suggest possible responses to the user based on their message.
- [ ] Conversation History Search: Allow users to search their conversation history for specific messages or keywords.
- [ ] Speech Recognition and Synthesis: Implement speech recognition and synthesis so that users can have conversations with the AI language model using their voice.

## Contributing

If you would like to contribute to ChatGPT Web Client, please submit a pull request.

## License

This project is licensed under the terms of the MIT license.