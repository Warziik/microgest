let emojiSupportCache: boolean | null = null;

export function emojiSupport(): boolean {
    if (emojiSupportCache !== null) return emojiSupportCache;

    const canvas = document.createElement("canvas");
    canvas.height = 10;
    canvas.width = canvas.height * 2;
    const ctx = canvas.getContext("2d");
    if (ctx !== null) {
        ctx.fillText("🇬🇧", 0, canvas.height);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i] !== data[i + 1] || data[i] !== data[i + 2]) {
                emojiSupportCache = true;
                return emojiSupportCache;
            }
        }
    }
    emojiSupportCache = false;
    return emojiSupportCache;
}

