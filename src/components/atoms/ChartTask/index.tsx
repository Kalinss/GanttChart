import React,{useState,useRef,useEffect} from "react";
import style from "./style.module.scss";
import classNames from "classnames";

export type ChartTaskData = {
  name: string;
  startPosition: number;
  height: number;
  width: number;
  duration: number;
  id: string;
  startDay: number;
  clickHandler?: (id: string) => void;
};


export const ChartTask: React.FC<ChartTaskData> = React.memo(({
  name,
  startPosition,
  height,
  width,
  duration,
  startDay,
  id,
  clickHandler = () => {},
}) => {

    const [isProlapse,setProlapse] = useState(false);

    const textField = useRef<null|HTMLDivElement>(null);
    useEffect(()=>{
        setProlapse(width - textField.current!.clientWidth <20);
    },[width]);
    return (
    <div
      onClick ={()=>{clickHandler(id)}}
      style={{ transform: `translateX(${startPosition}px)` }}
      className={style.chartTask}
    >
      <div
        style={{ height: height, width: width - 4 }}
        className={style.container}
      >
        <div
          className={classNames(style.pull, style.pullLeft)}
          data-id={id}
          data-type="leftPull"
          data-start={startDay}
          data-duration={duration}
        />
        <p ref={textField} className={classNames(style.name,isProlapse&&style.absolute)}>{name}</p>
        <div
          className={classNames(style.pull, style.pullRight)}
          data-id={id}
          data-type="rightPull"
          data-start={startDay}
          data-duration={duration}
        />
      </div>
    </div>
  );
});
