import {ChatCompletionRequestMessage} from "openai/api";

export type Conversation = {
    id: string;
    name: string;
    messages: ChatCompletionRequestMessage[];
};

export type ConversationRequest = {
    conversationId: string;
    text: string;
}

export type ConversationResponse = {
    result?: string;
    error?: {
        message: string;
    }
}
