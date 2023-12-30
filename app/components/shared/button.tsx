import { type } from "os";

import React from "react";
import { Link, LinkProps } from "@remix-run/react";

export type ButtonProps = {
  isAction?: boolean;
  isLink?: boolean;
  size: "xs"|"small"|"medium"|"large";
  theme?: "primary"|"secondary"|"gray"|"white";
  type?: "button"|"submit"|"reset";
};

const SIZE_CLASSES = {
  xs: "px-2 py-1 text-xs rounded-sm",
  small: "px-4 py-1 text-sm rounded-sm",
  medium: "px-4 py-2 text-md rounded-md",
  large: "px-6 py-3 text-lg rounded-lg",
}

const THEME_CLASSES = {
  primary: "bg-gradient-to-r from-primary-700 to-primary-600 border-primary-800 hover:border-primary-700 hover:bg-primary-700 focus:ring focus:ring-primary-200",
  secondary: "bg-gradient-to-r from-secondary-900 to-secondary-800 border-secondary-800 hover:border-secondary-700 hover:bg-secondary-700 focus:ring focus:ring-secondary-200",
  gray: "bg-gray-400 border-gray-500 hover:border-gray-400 hover:bg-gray-300 focus:ring focus:ring-gray-200",
  white: "bg-white border-white hover:border-gray-300 hover:bg-gray-100 focus:ring focus:ring-gray-200",

}

export const Button: React.FC<
  ButtonProps & (React.ButtonHTMLAttributes<HTMLButtonElement>) // | LinkProps
> = ({ children, isLink, isAction, size, type, theme, className, ...props }) => {

  theme = theme ??  "primary";
  
  const sizeClasses = SIZE_CLASSES[size];  
  let textColor = "white";
  let colorClasses = THEME_CLASSES[theme];
  if (theme === "gray") {
    textColor = "gray-800";
  }
  let classNames = `${className || ""} ${sizeClasses} border  text-center text-md font-medium text-${textColor} ${colorClasses} shadow-sm transition-all disabled:cursor-not-allowed disabled:border-${theme}-300 disabled:bg-${theme}-300`;

  


  // if (isAction) {
  //   classNames += " bg-green-300 text-gray-600 text-sm font-semi-bold";
  // }

  const Component = "button"; // isLink ? Link : "button";
  // TODO: Figure out how to use dynamic component here without TS complaining
  return (
    <Component className={classNames} type={type || "button"}  {...props}>
      {children}
    </Component>
  );
};

export default Button;