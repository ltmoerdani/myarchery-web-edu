import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { ButtonOutlineBlue, AvatarClubDefault } from "components/ma";

export function ClubList({ clubs }) {
  return clubs.map((club) => <ClubListItem key={club.id} club={club} />);
}

function ClubListItem({ club }) {
  const computeClubBasisFullAddress = (club) => {
    const infos = [club.address, club.detailCity?.name, club.detailProvince?.name];
    const byEmptyField = (info) => Boolean(info);
    return infos.filter(byEmptyField).join(", ");
  };

  return (
    <ClubListItemWrapper>
      <div className="club-logo">
        {club.logo ? <img className="club-logo-image" src={club.logo} /> : <AvatarClubDefault />}
      </div>

      <div className="club-list-item-content">
        <div className="d-flex align-items-start">
          <h4 className="club-name">{club.name}</h4>
          {club.isAdmin ? (
            <span
              style={{
                marginLeft: "1rem",
                display: "inline-block",
                padding: "0.15rem 0.5rem",
                borderRadius: "2em",
                backgroundColor: "var(--ma-blue-300)",
                fontSize: 12,
                color: "#ffffff",
              }}
            >
              Super Admin
            </span>
          ) : (
            <span
              style={{
                marginLeft: "1rem",
                display: "inline-block",
                padding: "0.15rem 0.5rem",
                borderRadius: "2em",
                backgroundColor: "var(--ma-orange-300)",
                fontSize: 12,
                color: "#ffffff",
              }}
            >
              Anggota
            </span>
          )}
        </div>
        <div className="club-info">
          <Address>{computeClubBasisFullAddress(club)}</Address>
          <MemberCounts>
            <BlueBullet>&#8226;</BlueBullet> Jumlah anggota terdaftar: {club.totalMember}
          </MemberCounts>
        </div>
      </div>

      <div className="club-list-item-actions">
        {club.isAdmin ? (
          <ButtonOutlineBlue
            as={Link}
            to={`/dashboard/clubs/detail/${club.id}`}
            className="button-wide"
          >
            Atur Klub
          </ButtonOutlineBlue>
        ) : (
          <ButtonOutlineBlue
            as="a"
            href={`/clubs/profile/${club.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="button-wide"
          >
            Lihat Profil
          </ButtonOutlineBlue>
        )}
      </div>
    </ClubListItemWrapper>
  );
}

const ClubListItemWrapper = styled.div`
  position: relative;
  padding: 1.25rem;

  display: flex;
  gap: 1.25rem;

  &:hover {
    background-color: rgba(238, 243, 254, 0.5);
  }

  .club-logo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    border: solid 1px #eeeeee;
    background-color: var(--ma-gray-400);

    &-image {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  .club-list-item-content {
    flex-grow: 1;
    padding-top: 0.875rem;

    .club-name {
      color: var(--ma-blue);
    }

    .club-info {
      display: flex;
      gap: 5rem;
    }
  }

  .club-list-item-actions {
    flex-shrink: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Address = styled.span`
  flex-basis: 50%;
  display: inline-block;
`;

const MemberCounts = styled.span`
  flex-basis: 50%;
  position: relative;
  display: inline-block;
  padding-left: 2.5rem;
`;

const BlueBullet = styled.span`
  position: absolute;
  top: -0.4rem;
  left: 0;
  display: inline-block;
  color: var(--ma-blue);
  font-size: 1.25rem;
`;
