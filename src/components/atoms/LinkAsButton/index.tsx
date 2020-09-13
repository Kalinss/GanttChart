import React from "react";
import style from "./style.module.scss";
import classNames from "classnames";
export type LinkAsButtonType = {
  link?: string;
  isDisabled: boolean;
  clickHandler?: VoidFunction;
};

export const LinkAsButton: React.FC<LinkAsButtonType> = ({
  children,
  link = "",
  isDisabled = false,
  clickHandler = () => {},
}) => {
  return (
    <div
      className={classNames(style.wrapper, isDisabled && style.disabled)}
      onClick={(e) => {
        e.preventDefault();
        if (isDisabled) return;
        clickHandler();
      }}
    >
      <a href={link}>{children}</a>
    </div>
  );
};
