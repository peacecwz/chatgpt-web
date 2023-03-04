import cacheManager from "@web/utils/cache";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'DELETE') {
        return res.status(405).end();
    }

    const conversationId = req.query.id as string;

    if (!conversationId) {
        await cacheManager.clear();

        return res.status(200).json({
            result: "Conversation cleared",
        });
    }

    if (!await cacheManager.has(conversationId)) {
        return res.status(404).json({
            error: {
                message: "Conversation not found",
            }
        });
    }

    await cacheManager.delete(conversationId);

    return res.status(200).json({
        result: "Conversation deleted",
    });
}
