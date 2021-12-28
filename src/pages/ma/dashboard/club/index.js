import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ArcheryClubService } from "services";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import { ButtonBlue, ButtonOutlineBlue } from "components/ma";

import illustrationEmptyState from "assets/images/illustrations/create-club-empty-state.png";

function PageClubHome() {
  const [clubs, setClubs] = React.useState(null);
  const breadcrumpCurrentPageLabel = "Klub Saya";

  React.useEffect(() => {
    const fetchClubs = async () => {
      const clubs = await ArcheryClubService.getMyClubs();
      if (clubs?.success) {
        setClubs(clubs.data);
      }
    };
    fetchClubs();
  }, []);

  return (
    <ClubPageWrapper>
      <MetaTags>
        <title>Klub Saya | MyArchery.id</title>
      </MetaTags>

      <Container fluid>
        <div className="dashboard-breadcrumb">
          <Link to="/dashboard">
            <span className="breadcrumb__back-button">&lsaquo;</span>
          </Link>{" "}
          <span>{breadcrumpCurrentPageLabel}</span>
        </div>

        {!clubs ? (
          <div className="card-dashboard list-empty">
            <h5>Sedang memuat data...</h5>
          </div>
        ) : clubs?.length ? (
          <ClubList clubs={clubs} />
        ) : (
          <ClubListEmptyState />
        )}
      </Container>
    </ClubPageWrapper>
  );
}

function ClubListEmptyState() {
  return (
    <div className="card-dashboard list-empty">
      <div className="ilustration-container"></div>
      <div className="empty-state-message">
        Anda belum memiliki klub
        <br />
        Silakan membuat klub
      </div>
      <div className="empty-state-action-buttons">
        <ButtonBlue
          as={Link}
          className="club-dashboard-button button-light"
          to="/dashboard/clubs/new"
        >
          Buat Klub
        </ButtonBlue>
        <ButtonBlue as={Link} className="club-dashboard-button">
          Gabung Klub
        </ButtonBlue>
      </div>
    </div>
  );
}

function ClubList({ clubs }) {
  const computeClubBasisFullAddress = (club) => {
    const infos = [club.address, club.city, club.province];
    const byEmptyField = (info) => Boolean(info);
    return infos.filter(byEmptyField).join(", ");
  };

  return (
    <div className="card-dashboard list-data">
      <div className="list-data-action-buttons">
        <ButtonBlue
          as={Link}
          className="club-dashboard-button button-light"
          to="/dashboard/clubs/new"
        >
          Buat Klub
        </ButtonBlue>
        <ButtonBlue as={Link} className="club-dashboard-button">
          Gabung Klub
        </ButtonBlue>
      </div>
      {clubs?.map((club) => (
        <div key={club.id} className="club-list-item">
          <div className="club-logo">
            <img className="club-logo-image" src={club.logo} />
          </div>

          <div className="club-list-item-content">
            <h4 className="club-name">{club.name}</h4>
            <div className="club-info">
              <span>{computeClubBasisFullAddress(club)}</span>
              <span>Jumlah anggota terdaftar: &mdash;</span>
            </div>
          </div>

          <div className="club-list-item-actions">
            <ButtonOutlineBlue className="club-dashboard-button">
              {"Lihat Profil" || "Atur Klub"}
            </ButtonOutlineBlue>
          </div>
        </div>
      ))}
    </div>
  );
}

const ClubPageWrapper = styled.div`
  margin: 40px 0;
  font-family: "Inter";

  .club-dashboard-button {
    min-width: 120px;
  }

  .button-light {
    background-color: #eef3fe;
    border: solid 1px #eef3fe;
    color: var(--ma-blue);
  }

  .card-dashboard {
    position: relative;

    padding: 3rem;
    padding-bottom: 3.5rem;
    min-height: 320px;
    border-radius: 4px;
    border: 0px solid rgb(246, 246, 246);
    box-shadow: rgb(18 38 63 / 3%) 0px 0.75rem 1.5rem;
    background-color: #ffffff;
    background-clip: border-box;

    &.list-data {
      padding: 1.5rem;

      .list-data-action-buttons {
        margin-bottom: 1.25rem;
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
      }

      .club-list-item {
        position: relative;
        margin: 0 -1.5rem;
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
        }
      }
    }

    &.list-empty {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: stretch;
      gap: 1.25rem;

      text-align: center;

      .ilustration-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 300px;

        background-image: url(${illustrationEmptyState});
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
      }

      .empty-state-message {
        font-size: 1rem;
      }

      .empty-state-action-buttons {
        display: flex;
        justify-content: center;
        gap: 1.25rem;
      }
    }
  }
`;

export default PageClubHome;
