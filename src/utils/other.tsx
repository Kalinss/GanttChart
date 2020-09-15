export const minNumber = (arr: number[]) =>  arr.reduce((acc, item) => (item < acc ? item : acc), arr[0]);
export const maxNumber = (arr:number[])=> arr.reduce((acc, item) => (item > acc ? item : acc), arr[0]);

