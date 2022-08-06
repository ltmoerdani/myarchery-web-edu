import * as React from "react";
import styled from "styled-components";
import { useUserProfile } from "hooks/user-profile";

import { Link } from "react-router-dom";
import { ButtonOutlineBlue } from "components/ma";
import Avatar from "./Avatar";

import icon_green from "assets/images/myachery/success-icon.svg";

function UserProfileCard({ to }) {
  const { userProfile } = useUserProfile();

  return (
    <CardMenuProfileContainer>
      <div className="profile-body">
        <div className="profile-avatar">
          <Avatar imageSrc={userProfile?.avatar} />
        </div>

        <div className="profile-detail">
          <h3 className="mt-3">{userProfile?.name || "Archer"}</h3>
          <p className="mt-4 d-flex flex-column">
            <span>Email</span>
            <span className="fw-bold">{userProfile?.email || "memuat..."}</span>{" "}
          </p>
        </div>
      </div>

      <div className="profile-footer d-flex align-items-center justify-content-between">
        <div>
          <VerifiedBadge userProfile={userProfile} />
        </div>

        <div className="float-end">
          <ButtonOutlineBlue rounded as={Link} to={to}>
            Edit Profil
          </ButtonOutlineBlue>
        </div>
      </div>
    </CardMenuProfileContainer>
  );
}

function VerifiedBadge({ userProfile }) {
  if (userProfile?.verifyStatus == 1) {
    return (
      <Link style={{ color: "#000" }} to="/dashboard/profile/verifikasi">
        <div className="d-flex align-items-center px-2 py-1 rounded-pill">
          <div>
            <img src={icon_green} className="me-2" />
          </div>
          <div>
            <span>{userProfile?.statusVerify}</span>
          </div>
        </div>
      </Link>
    );
  }

  return null;
}

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

export default UserProfileCard;
