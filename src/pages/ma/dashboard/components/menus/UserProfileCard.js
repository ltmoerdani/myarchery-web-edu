import * as React from "react";
import styled from "styled-components";

import { useSelector } from "react-redux";
import * as AuthStore from "store/slice/authentication";

import { Link } from "react-router-dom";
import { ButtonOutlineBlue } from "components/ma";
import Avatar from "./Avatar";

const CardMenuProfileContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  overflow: hidden;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 0.25rem 0.5rem rgb(18 38 63 / 5%);
  transition: all 0.4s;

  .profile-body {
    z-index: 10;
    flex: 1 0 auto;

    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 1.25rem;

    padding: 1.25rem;
    padding-bottom: 0;

    .profile-avatar {
      flex-shrink: 0;

      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    .profile-detail {
      overflow-x: hidden;
      flex-grow: 1;
    }
  }

  .profile-footer {
    padding: 1.25rem;
    padding-top: 0.5rem;
  }

  &:hover {
    box-shadow: 0 0.25rem 2rem rgb(18 38 63 / 10%);
    transform: translateY(-0.05rem);
    transition: all 0.4s;
  }

  /* Pulse effect, blue rings */
  &::before,
  &::after {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: var(--radius);
    height: var(--radius);
    border-radius: var(--radius);
    background-color: none;
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
    transition: all 0.4s;
  }

  &::before {
    --radius: 300px;
    border: solid 2px var(--ma-blue);
  }

  &::after {
    --radius: 70px;
    border: solid 1px #3d7cde;
  }

  &:hover {
    &::before,
    &::after {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

function UserProfileCard() {
  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);
  return (
    <CardMenuProfileContainer>
      <div className="profile-body">
        <div className="profile-avatar">
          <Avatar imageSrc="" />
        </div>

        <div className="profile-detail">
          <h3 className="mt-3">{userProfile?.name || "Archer"}</h3>
          <p className="mt-4 d-flex flex-column">
            <span>Email</span>
            <span className="fw-bold">{userProfile?.email || "memuat..."}</span>{" "}
          </p>
        </div>
      </div>

      <div className="profile-footer">
        <div className="float-end">
          <ButtonOutlineBlue rounded as={Link} to="#">
            Edit Profil
          </ButtonOutlineBlue>
        </div>
      </div>
    </CardMenuProfileContainer>
  );
}

export default UserProfileCard;
