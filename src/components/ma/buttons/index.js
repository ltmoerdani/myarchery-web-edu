import * as React from "react";
import styled from "styled-components";
import { Button as BSButton } from "reactstrap";

const ButtonWrapper = styled.button`
  &,
  &:focus,
  &:active {
    display: inline-block;
    min-width: var(--button-width, 6.5rem);
    padding: 0.47rem 0.75rem;
    border: solid 1px var(--button-outline-color, var(--ma-gray-100));
    border-radius: var(--button-corner, 0.5rem);
    box-shadow: none;
    background-color: var(--button-bg-color, var(--ma-gray-100));

    color: var(--button-font-color, var(--ma-blue));
    text-decoration: none;
    line-height: 1.5;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;

    cursor: pointer;
    user-select: none;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }

  &:hover {
    background-color: var(--button-bg-color-hover, var(--ma-gray-50));
    border: solid 1px
      var(var(--button-outline-color-hover, --button-outline-color), var(--ma-gray-100));
    box-shadow: 0 1px 1px var(--button-shadow-color-hover, rgba(0, 0, 0, 0.15));
    color: var(--button-font-color-hover, var(--ma-blue));
    text-decoration: var(--button-underline-hover, none) !important;
  }

  &:disabled {
    cursor: default;
    background-color: var(--ma-gray-200);
    border: solid 1px var(--ma-gray-200);
    color: var(--ma-gray-400);

    &:hover {
      box-shadow: none;
    }
  }
`;

const variantStyles = {
  blue: {
    "--button-bg-color": "var(--ma-blue)",
    "--button-bg-color-hover": "#0f53bb",
    "--button-outline-color": "var(--ma-blue)",
    "--button-font-color": "#ffffff",
    "--button-font-color-hover": "#ffffff",
  },
  red: {
    "--button-bg-color": "var(--ma-red)",
    "--button-bg-color-hover": "#cf1730",
    "--button-outline-color": "var(--ma-red)",
    "--button-font-color": "#ffffff",
    "--button-font-color-hover": "#ffffff",
  },
  outline: {
    "--button-bg-color": "none",
    "--button-outline-color": "var(--ma-gray-400)",
    "--button-font-color": "var(--ma-gray-500)",
    "--button-font-color-hover": "var(--ma-gray-600)",
  },
  "outline-blue": {
    "--button-bg-color": "none",
    "--button-bg-color-hover": "var(--ma-blue)",
    "--button-outline-color": "var(--ma-blue)",
    "--button-font-color": "var(--ma-blue)",
    "--button-font-color-hover": "#ffffff",
  },
  "ghost-blue": {
    "--button-bg-color": "none",
    "--button-bg-color-hover": "var(--ma-blue)",
    "--button-outline-color": "none",
    "--button-outline-color-hover": "var(--ma-blue)",
    "--button-font-color": "var(--ma-blue)",
    "--button-font-color-hover": "#ffffff",
  },
  // TODO: button link (?)
};

function ButtonBase({ corner, color, style, flexible = false, block = false, ...props }) {
  const withPx = (number) => {
    return number ? `${number}px` : undefined;
  };

  const propsNew = {
    ...props,
    style: {
      ...variantStyles[color],
      "--button-corner": withPx(corner),
      ...style,
    },
  };

  if (flexible) {
    propsNew.style = { ...propsNew.style, "--button-width": 0 };
  }

  if (block) {
    propsNew.style = { ...propsNew.style, "--button-width": "100%" };
  }

  return <ButtonWrapper {...propsNew} />;
}

function Button(props) {
  return <ButtonBase {...props} />;
}

function ButtonBlue(props) {
  return <ButtonBase color="blue" {...props} />;
}

function ButtonRed(props) {
  return <ButtonBase color="red" {...props} />;
}

function ButtonOutline(props) {
  return <ButtonBase color="outline" {...props} />;
}

function ButtonOutlineBlue(props) {
  return <ButtonBase color="outline-blue" {...props} />;
}

function ButtonGhostBlue(props) {
  return <ButtonBase color="ghost-blue" {...props} />;
}

function ButtonSmallBlue(props) {
  return <ButtonBase color="blue" {...props} style={{ padding: "0.2rem 0.5rem" }} />;
}

function ButtonSmallOutlineBlue(props) {
  return <ButtonBase color="outline-blue" {...props} style={{ padding: "0.2rem 0.5rem" }} />;
}

const ButtonBlueOutline = styled(BSButton)`
  &,
  &:focus,
  &:active {
    background-color: #ffffff;
    border: solid 1px var(--ma-blue);
    border-radius: 2rem;
    color: var(--ma-blue) !important;
    box-shadow: none;
  }

  &:hover {
    background-color: var(--ma-blue);
    color: #ffffff !important;
  }
`;

export {
  Button,
  ButtonBlue,
  ButtonRed,
  ButtonBlueOutline,
  ButtonOutline,
  ButtonOutlineBlue,
  ButtonGhostBlue,
  ButtonSmallBlue,
  ButtonSmallOutlineBlue,
};
