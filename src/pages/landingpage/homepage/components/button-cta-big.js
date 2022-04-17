import styled from "styled-components";

const ButtonCTABig = styled.button`
  &,
  &:focus,
  &:active {
    display: inline-block;
    width: 100%;
    padding: 0.47rem 0.75rem;
    border: solid 1px var(--ma-blue);
    border-radius: 0.5rem;
    box-shadow: none;
    background-color: var(--ma-blue);

    color: #ffffff;
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    line-height: 1.5;
    text-align: center;
    vertical-align: middle;

    cursor: pointer;
    user-select: none;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }

  &:hover {
    background-color: #0f53bb;
    border: solid 1px #0f53bb;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
    color: #ffffff;
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

export { ButtonCTABig };
