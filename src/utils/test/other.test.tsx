import {minNumber,maxNumber} from "../other";


describe("minNumber, функция",()=>{
    it('должна вернуть правильный элемент массива',()=>{
        expect(minNumber([4,5,6,7,8,3])).toBe(3)
    })
});
describe("maxNumber, функция",()=>{
    it('должна вернуть правильный элемент массива',()=>{
        expect(maxNumber([4,5,6,7,8,3])).toBe(8)
    })
})