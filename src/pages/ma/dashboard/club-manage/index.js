import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import { Button, ButtonBlue } from "components/ma";

function PageClubManage() {
  const breadcrumbCurrentPageLabel = "Data Anggota";

  // const { clubId } = useParams();

  return (
    <ClubManagePageWrapper>
      <MetaTags>
        <title>Manage Klub | MyArchery.id</title>
      </MetaTags>

      <Container fluid>
        <div className="dashboard-breadcrumb">
          <Link to="/dashboard/clubs">
            <span className="breadcrumb__back-button">&lsaquo;</span>
          </Link>{" "}
          <span>{breadcrumbCurrentPageLabel}</span>
        </div>

        <div className="club-info-header mb-5">
          <div className="club-logo">
            <img className="club-logo-image" src={"club?.logo"} />
          </div>

          <div className="club-info-content">
            <h4 className="club-name">{"club?.name"}</h4>
            <div className="club-info">
              <span>copy landing page link</span>
            </div>
          </div>

          <div className="club-info-actions">
            <ButtonBlue as={Link} to="#" className="club-dashboard-button button-light">
              Lihat Klub
            </ButtonBlue>
            <ButtonBlue as={Link} to="#" className="club-dashboard-button">
              Edit Klub
            </ButtonBlue>
          </div>
        </div>

        <div className="d-flex justify-content-between my-3">
          <div className="filter-tabs">
            <ButtonBlue className="button-filter filter-active">Semua</ButtonBlue>
            <Button className="button-filter">Perempuan</Button>
            <Button className="button-filter">Laki-laki</Button>
          </div>

          <div className="search-box">
            <input className="search-box-input" placeholder="Cari archer" />{" "}
            <ButtonBlue>Cari</ButtonBlue>
          </div>
        </div>

        <div className="card-dashboard">
          <div className="loading-list-data">
            <h5>Sedang memuat data...</h5>
          </div>
        </div>
      </Container>
    </ClubManagePageWrapper>
  );
}

const ClubManagePageWrapper = styled.div`
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

  .club-info-header {
    position: relative;
    margin: 0 -1.5rem;
    padding: 1.25rem;

    display: flex;
    gap: 1.25rem;

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

    .club-info-content {
      flex-grow: 1;
      padding-top: 0.875rem;
    }

    .club-info-actions {
      flex-shrink: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.75rem;
    }
  }

  .filter-tabs {
    display: flex;
    gap: 0.5rem;

    .button-filter {
      background-color: transparent;
      border: solid 1px transparent;
      color: #495057;

      &:hover {
        box-shadow: none;
        background-color: var(--ma-gray-100);
      }
    }

    .filter-active {
      background-color: #eef3fe;
      border: solid 1px #eef3fe;
      color: var(--ma-blue);

      &:hover {
        background-color: #eef3fe;
        box-shadow: none;
        opacity: 0.5;
      }
    }
  }

  .search-box-input {
    padding: 0.47rem 0.75rem;
    width: 300px;
    border-radius: 4px;
    border: none;
    border: solid 1px var(--ma-gray-100);
    background-color: var(--ma-gray-100);
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

    &:focus {
      border-color: #2684ff;
      box-shadow: 0 0 0 1px #2684ff;
    }
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
  }

  .loading-list-data {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export default PageClubManage;
