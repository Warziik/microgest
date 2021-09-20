type CacheType = {
    data: any;
    cachedAt: number;
}

export class Cache {
    private static cache: Record<string, CacheType> = {};

    public static set(key: string, value: Record<string, any>): void {
        this.cache[key] = {
            data: value,
            cachedAt: new Date().getTime()
        };
    }

    public static get(key: string): Promise<Record<string, any> | null> {
        return new Promise((resolve) => {
            resolve(this.cache[key] && this.cache[key].cachedAt + 15 * 60 * 1000 > new Date().getTime() ? this.cache[key].data : null);
        });
    }

    public static invalidate(key: string): void {
        delete this.cache[key];
    }
}