import type {NextApiRequest, NextApiResponse} from 'next'
import {Configuration, OpenAIApi} from "openai";
import cacheManager from "@web/utils/cache";
import {Conversation, ConversationRequest} from "@web/models/api";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        return res.status(200).json(await cacheManager.getAll());
    }

    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const authorizationKey = req.headers.authorization?.split(' ')[1] || OPENAI_API_KEY;

    if (!authorizationKey) {
        return res.status(500).json({
            error: {
                message: "OpenAI API key not configured, please follow instructions in README.md",
            }
        });
    }

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const body = req.body as ConversationRequest;

    if (!body || !body.text) {
        res.status(400).json({
            error: {
                message: "Please enter a valid text",
            }
        });
        return;
    }

    if (!await cacheManager.has(body.conversationId)) {
        await cacheManager.set(body.conversationId, {
            id: body.conversationId,
            name: body.text.slice(0, 20),
            messages: [],
        });
    }

    try {
        const conversation = await cacheManager.get(body.conversationId);
        if (!conversation) {
            return res.status(500).json({
                error: {
                    message: "Unable to find conversation",
                }
            });
        }

        conversation.messages.push({
            role: "user",
            content: body.text,
        })

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            temperature: 0.6,
            messages: conversation?.messages || [],
        });

        const text = completion.data.choices[0].message?.content
        if (text) {
            conversation.messages.push({
                role: "system",
                content: text,
            });
            await cacheManager.set(body.conversationId, conversation);
        }

        return res.status(200).json({
            ...await cacheManager.get(body.conversationId),
            id: body.conversationId,
        });
    } catch (error: any) {
        if (error.response) {
            console.error(error.response.status, error.response.data);
            return res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            return res.status(500).json({
                error: {
                    message: 'An error occurred during your request.',
                }
            });
        }
    }
}
