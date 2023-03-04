import Redis from "ioredis";
import {Conversation} from "@web/models/api";

export class CacheManager<T> {
    enabledDistributedCache: boolean;
    data: Map<string, T>;
    redis?: Redis;

    constructor() {
        this.enabledDistributedCache = process.env.ENABLED_DISTRIBUTED_MODE === 'true';
        this.data = new Map<string, T>();
        if (this.enabledDistributedCache) {
            this.redis = new Redis(process.env.REDIS_CONNECTION_STRING as string);
        }
    }

    async get(key: string): Promise<T | undefined> {
        if (this.enabledDistributedCache) {
            // TODO: Refactor it for better code quality
            return await new Promise((resolve, reject) => {
                this.redis?.get(key, (err, value) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(JSON.parse(value || ""));
                    }
                });
            });
        } else {
            return this.data.get(key);
        }
    }

    async set(key: string, value: T): Promise<void> {
        if (this.enabledDistributedCache) {
            await this.redis?.set(key, JSON.stringify(value));
        } else {
            this.data.set(key, value);
        }
    }

    async has(key: string): Promise<boolean> {
        if (this.enabledDistributedCache) {
            return await this.redis?.exists(key) === 1;
        } else {
            return this.data.has(key);
        }
    }

    async getAll(): Promise<T[]> {
        if (this.enabledDistributedCache) {
            const keys = await this.redis?.keys("*");
            const values = await Promise.all(keys?.map(async (key) => await this.get(key as string)) || []);
            return values.filter((value) => value !== undefined) as T[];
        } else {
            return Array.from(this.data.values());
        }
    }

    async delete(key: string): Promise<void> {
        if (this.enabledDistributedCache) {
            await this.redis?.del(key);
        } else {
            this.data.delete(key);
        }
    }

    async clear(): Promise<void> {
        if (this.enabledDistributedCache) {
            await this.redis?.flushall();
        } else {
            this.data.clear();
        }
    }
}

const cacheManager = new CacheManager<Conversation>();

export default cacheManager;

