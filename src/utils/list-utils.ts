export function groupBy<T, U>(list: T[], keyGetter: (_: T) => U): Array<[U, T[]]> {
    const map = new Map<U, T[]>();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return Array.from(map.entries());
}