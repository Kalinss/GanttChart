export const throttle = (cb:any,ms:number)=>{
    let time:any = 0;
    return (...arg:any)=>{
        let now = new Date();
        //@ts-ignore
        if(now - time >= ms){
            cb(...arg);
            time = now;
        }
    }
};