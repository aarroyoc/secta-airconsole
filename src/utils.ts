export function getRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


export function shuffleInPlace<T>(array: T[]): T[] {
    // if it's 1 or 0 items, just return
    if (array.length <= 1) return array;

    // For each index in array
    for (let i = 0; i < array.length; i++) {

        // choose a random not-yet-placed item to place there
        // must be an item AFTER the current item, because the stuff
        // before has all already been placed
        const randomChoiceIndex = getRandom(i, array.length - 1);

        // place our random choice in the spot by swapping
        [array[i], array[randomChoiceIndex]] = [array[randomChoiceIndex], array[i]];
    }

    return array;
}

export function delay(ms: number): Promise<any> {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}