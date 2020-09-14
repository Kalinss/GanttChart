import React from "react";
import style from "./style.module.scss";
import classNames from "classnames";
import { GanttChartDataType, GanttChartObjectType } from "../../../types";
import { LinkAsButton } from "../../atoms/LinkAsButton";
import {
    getArrayFieldById
} from "../../../utils/ganttChart";

export type GanttChartTaskInfoBoxType = {
  left: number;
  top: number;
  isActive: boolean;
  data: GanttChartObjectType;
  allTask: GanttChartObjectType[];
  createDocumentationHandler: (id: string) => void;
};

const allParentTaskIsClosed = (tasks: GanttChartDataType) =>
  tasks.every((item) => item.isReady);

const Info: React.FC<{ name: string; value: string | number }> = ({
  name,
  value,
}) => {
  return (
    <li className={style.item}>
      <span>{name}</span> <span>{value}</span>
    </li>
  );
};

const InfoList: React.FC<{
  name: string;
  data: GanttChartDataType;
  currentItem: GanttChartObjectType;
  readyClass?: string;
  notReady?: string;
}> = ({ name, data, currentItem, readyClass = "", notReady = "" }) => {
  return (
    <>
      {!!data.length && (
        <li className={style.item}>
          <span>{name}</span>
          <ul>
            {data.map((item) => (
              <li
                className={classNames(
                  style.dependence,
                  !currentItem.isTask && (item.isReady ? readyClass : notReady)
                )}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </li>
      )}
    </>
  );
};

export const GanttChartTaskInfoBox: React.FC<GanttChartTaskInfoBoxType> = ({
  left = 0,
  top = 0,
  isActive = false,
  data = null,
  allTask,
  createDocumentationHandler,
}) => {
  const dependencies = data
    ? getArrayFieldById(allTask,'dependencies', data.id! || "")
    : null;

  const parentTasks = data ? getArrayFieldById(allTask,'parentTasks', data.id! || "") : null;

  return (
    <>
      {data && (
        <div
          style={{ left: left, top: top }}
          className={classNames(style.taskInfo, isActive && style.active)}
        >
          <p className={style.name}>{data.name}</p>
          <div className={style.bottom}>
            <ul className={style.list}>
              <Info name="Продолжительность" value={data.duration!} />
              <Info name="Начальный день" value={data.start!} />
              {!!dependencies && (
                <InfoList
                  currentItem={data!}
                  data={dependencies}
                  name={"Следующие задачи:"}
                />
              )}
              {!!parentTasks && (
                <InfoList
                  currentItem={data!}
                  data={parentTasks}
                  name="Необходимо закончить:"
                  readyClass={style.positive}
                  notReady={style.negative}
                />
              )}
            </ul>
          </div>
          {!data.isTask && (
            <LinkAsButton
              clickHandler={() => {
                const result = window.confirm(
                  'Представим, что после нажатия "ок" вы автоматически перешли на новую страницу и создали документацию'
                );
                result && createDocumentationHandler(data.id);
              }}
              isDisabled={!allParentTaskIsClosed(parentTasks!)}
            >
              Создать документацию
            </LinkAsButton>
          )}
        </div>
      )}
    </>
  );
};
