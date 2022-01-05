import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const MenuItemContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  overflow: hidden;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 0.25rem 0.5rem rgb(18 38 63 / 5%);

  transition: all 0.4s;

  .menu-body {
    flex-grow: 1;
    z-index: 10;
    padding: 1.25rem;
    padding-bottom: 0;

    .menu-icon {
      --icon-radius: 50px;
      width: var(--icon-radius);
      height: var(--icon-radius);

      .menu-icon-img {
        position: relative;
        z-index: 10;
        width: 100%;
        height: 100%;
      }

      /* Pulse effect, for icon */
      &::before {
        content: " ";
        position: absolute;
        width: var(--icon-radius);
        height: var(--icon-radius);
        border-radius: var(--icon-radius);
        background-color: #fff971;
        transform: scale(0);
        transition: all 0.4s;
      }
    }
  }

  .menu-footer {
    flex-shrink: 0;
    padding: 1.25rem;
    padding-top: 0.5rem;

    /* Extends link surface to entire card container block */
    .menu-link::before {
      content: " ";
      position: absolute;
      z-index: 10;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }

  /* Pulse effect blue */
  &::before {
    --radius: 300px;

    content: " ";
    position: absolute;
    width: var(--radius);
    height: var(--radius);
    border-radius: var(--radius);
    background-color: #0d47a1;

    opacity: 0;
    transform: translate(-40%, -50%) scale(0);
    transition: all 0.4s;
  }

  &:hover {
    box-shadow: 0 0.25rem 2rem rgb(18 38 63 / 10%);
    transform: translateY(-0.05rem);
    transition: all 0.4s;

    &::before {
      opacity: 0.08;
      transform: translate(-40%, -50%) scale(1);
    }

    .menu-icon::before {
      transform: scale(1.4);
    }
  }
`;

export default function MenuItemCard({ menu, href = "#" }) {
  return (
    <MenuItemContainer>
      <div className="menu-body">
        <div className="menu-icon mb-3">
          <img className="menu-icon-img" src={menu.icon} />
        </div>

        <h3>{menu.title}</h3>
        <p>{menu.description}</p>
      </div>

      <div className="menu-footer">
        <div className="float-end">
          <Link className="menu-link" to={href || "#"}>
            <i className="bx bx-right-arrow-alt fs-3" style={{ color: "var(--ma-blue)" }} />
          </Link>
        </div>
      </div>
    </MenuItemContainer>
  );
}
