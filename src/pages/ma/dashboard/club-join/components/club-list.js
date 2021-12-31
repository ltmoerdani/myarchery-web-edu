import React from "react";
import styled from "styled-components";
import { ArcheryClubService } from "services";

import SweetAlert from "react-bootstrap-sweetalert";
import { Button, ButtonBlue, ButtonOutlineBlue } from "components/ma";

export function ClubList({ clubs, onJoinSuccess }) {
  const [selectedClubId, setSelectedClubId] = React.useState(null);

  const handleAgreedJoinClub = async (clubDetail) => {
    const result = await ArcheryClubService.setJoinClub({ club_id: clubDetail.id });
    if (result.success) {
      onJoinSuccess?.();
    }
    setSelectedClubId(null);
  };

  return clubs.map((club) => (
    <ClubListItem
      key={club.detail.id}
      club={club}
      isSelected={selectedClubId === club.detail.id}
      onSelected={() => setSelectedClubId(club.detail.id)}
      onCancelSelected={() => setSelectedClubId(null)}
      onConfirm={() => handleAgreedJoinClub(club.detail)}
    />
  ));
}

function ClubListItem({ club, isSelected, onSelected, onCancelSelected, onConfirm }) {
  const computeClubBasisFullAddress = (club) => {
    const infos = [club.detail.address, club.detail.city, club.detail.province];
    const byEmptyField = (info) => Boolean(info);
    return infos.filter(byEmptyField).join(", ");
  };

  return (
    <ClubListItemWrapper>
      <div className="club-logo">
        <img className="club-logo-image" src={club.detail.logo} />
      </div>

      <div className="club-list-item-content">
        <h4 className="club-name">{club.detail.name}</h4>
        <div className="club-info">
          <Address>{computeClubBasisFullAddress(club)}</Address>
          <MemberCounts>
            <BlueBullet>&#8226;</BlueBullet> Jumlah anggota terdaftar: {club.totalMember}
          </MemberCounts>
        </div>
      </div>

      <div className="club-list-item-actions">
        <ButtonOutlineBlue className="button-wide">Lihat Profil</ButtonOutlineBlue>
        {club.isJoin ? (
          <ButtonLink className="button-wide" disabled>
            &#10003; Member
          </ButtonLink>
        ) : (
          <ButtonBlue className="button-wide" onClick={() => onSelected?.(club)}>
            Gabung Klub
          </ButtonBlue>
        )}
      </div>
      <AlertConfirmJoin
        key={club.detail.id}
        show={isSelected}
        club={club.detail}
        onCancel={onCancelSelected}
        onConfirm={onConfirm}
      />
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

const ButtonLink = styled(Button)`
  &,
  &:focus,
  &:active,
  &:hover {
    background-color: transparent;
    border: solid 1px transparent;
    box-shadow: none;
    color: var(--ma-blue);
  }
`;

function AlertConfirmJoin({ show, club, onCancel, onConfirm }) {
  return (
    <SweetAlert
      show={show}
      title=""
      custom
      btnSize="md"
      onConfirm={onConfirm}
      style={{ padding: "1.25rem" }}
      customButtons={
        <span className="d-flex flex-column w-100" style={{ gap: "0.5rem" }}>
          <ButtonBlue onClick={onConfirm}>Yakin</ButtonBlue>
          <Button onClick={onCancel} style={{ color: "var(--ma-blue)" }}>
            Batalkan
          </Button>
        </span>
      }
    >
      <p>
        Apakah Anda yakin akan bergabung dengan Klub
        <br />
        <strong>&quot;{club.name}&quot;</strong>?
      </p>
    </SweetAlert>
  );
}

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
