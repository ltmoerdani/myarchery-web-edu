import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import { ButtonBlue } from "components/ma";

import illustrationEmptyState from "assets/images/illustrations/create-club-empty-state.png";

function PageClubHome() {
  const [clubs, setClubs] = React.useState(null);
  const breadcrumpCurrentPageLabel = "Klub Saya";

  React.useEffect(() => {
    setClubs([]);
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

        <div className="card-dashboard">
          {!clubs ? (
            <div>Sedang memuat data...</div>
          ) : (
            <React.Fragment>
              <div className="ilustration-container"></div>
              <div className="empty-state-message">
                Anda belum memiliki klub
                <br />
                Silakan membuat klub
              </div>
              <div className="empty-state-action-buttons">
                <ButtonBlue
                  as={Link}
                  className="empty-state-button button-light"
                  to="/dashboard/clubs/new"
                >
                  Buat Klub
                </ButtonBlue>
                <ButtonBlue as={Link} className="empty-state-button">
                  Gabung Klub
                </ButtonBlue>
              </div>
            </React.Fragment>
          )}
        </div>
      </Container>
    </ClubPageWrapper>
  );
}

const ClubPageWrapper = styled.div`
  margin: 40px 0;
  font-family: "Inter";

  .button-light {
    background-color: #eef3fe;
    border: solid 1px #eef3fe;
    color: var(--ma-blue);
  }

  .card-dashboard {
    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    gap: 1.25rem;

    padding: 3rem;
    padding-bottom: 3.5rem;
    min-height: 320px;
    border-radius: 4px;
    border: 0px solid rgb(246, 246, 246);
    box-shadow: rgb(18 38 63 / 3%) 0px 0.75rem 1.5rem;
    background-color: #ffffff;
    background-clip: border-box;

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

      .empty-state-button {
        min-width: 120px;
      }
    }
  }
`;

export default PageClubHome;
