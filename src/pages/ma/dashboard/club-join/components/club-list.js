import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { ButtonBlue, ButtonOutlineBlue } from "components/ma";

export function ClubList({ clubs }) {
  return clubs.map((club) => <ClubListItem key={club.id} club={club} />);
}

function ClubListItem({ club }) {
  const computeClubBasisFullAddress = (club) => {
    const infos = [club.address, club.city, club.province];
    const byEmptyField = (info) => Boolean(info);
    return infos.filter(byEmptyField).join(", ");
  };

  return (
    <ClubListItemWrapper>
      <div className="club-logo">
        <Link to={`/dashboard/clubs/detail/${club.id}`}>
          <img className="club-logo-image" src={club.logo} />
        </Link>
      </div>

      <div className="club-list-item-content">
        <h4 className="club-name">{club.name}</h4>
        <div className="club-info">
          <span>{computeClubBasisFullAddress(club)}</span>
          <span>Jumlah anggota terdaftar: &mdash;</span>
        </div>
      </div>

      <div className="club-list-item-actions">
        <ButtonOutlineBlue className="button-wide">Lihat Profil</ButtonOutlineBlue>
        <ButtonBlue className="button-wide">Gabung Klub</ButtonBlue>
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
    background-color: #eef3fe;
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
    gap: 0.75rem;
  }
`;
