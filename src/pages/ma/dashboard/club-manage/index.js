import React from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import classnames from "classnames";
import { useWizardView } from "hooks/wizard-view";
import { ArcheryClubService } from "services";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import { ButtonBlue, WizardView, WizardViewContent } from "components/ma";
import { ClubProfileDataView } from "./components/club-data-view";
import { MemberDataListView } from "./components/member-data-view";

import IconTabProfile from "./components/icons-colored/tab-profile";
import IconTabMembers from "./components/icons-colored/tab-members";
import IconChainLink from "./components/icons-mono/chain-link";

const tabList = [
  { step: 1, label: "Profil", icon: "profile" },
  { step: 2, label: "Data Anggota", icon: "members" },
];

function PageClubManage() {
  const breadcrumbCurrentPageLabel = "Data Anggota";

  const { clubId } = useParams();
  const [clubDetail, setClubDetail] = React.useState(null);
  const { currentStep, goToStep } = useWizardView(tabList);

  const getTabClassNames = (id) => classnames({ "tab-selected": currentStep === id });

  React.useEffect(() => {
    const fetchClubData = async () => {
      const result = await ArcheryClubService.getProfile({ id: clubId });

      if (result.success) {
        setClubDetail({
          ...result.data,
          province: {
            label: result.data.detailProvince?.name,
            value: parseInt(result.data.detailProvince?.id) || undefined,
          },
          city: {
            label: result.data.detailCity?.name,
            value: parseInt(result.data.detailCity?.id) || undefined,
          },
        });
      } else {
        console.log("gak sukses wkwk");
      }
    };
    fetchClubData();
  }, []);

  return (
    <ClubManagePageWrapper>
      <MetaTags>
        <title>{clubDetail?.name || "Manage Klub"} | MyArchery.id</title>
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
            <img className="club-logo-image" src={clubDetail?.logo} />
          </div>

          <div className="club-info-content">
            <h4 className="club-name">{clubDetail?.name}</h4>
            <div className="club-info">
              <LandingPageLinkPlaceholder url={clubDetail?.landingPageUrl} />
            </div>
          </div>

          <div className="club-info-actions">
            <ButtonBlue as={Link} to="#" className="button-wide">
              Lihat Klub
            </ButtonBlue>
          </div>
        </div>

        <div>
          <CardTabs>
            <CardTabItem className={getTabClassNames(1)} onClick={() => goToStep(1)}>
              <span className="icon">
                <IconTabProfile />
              </span>
              <span>Profil Klub</span>
            </CardTabItem>
            <CardTabItem className={getTabClassNames(2)} onClick={() => goToStep(2)}>
              <span className="icon">
                <IconTabMembers />
              </span>
              <span>Data Anggota</span>
            </CardTabItem>{" "}
          </CardTabs>

          <CardViewPanel>
            <WizardView currentStep={currentStep}>
              <WizardViewContent>
                <ClubProfileDataView club={clubDetail} />
              </WizardViewContent>

              <WizardViewContent>
                <MemberDataListView club={clubDetail} />
              </WizardViewContent>
            </WizardView>
          </CardViewPanel>
        </div>
      </Container>
    </ClubManagePageWrapper>
  );
}

const ClubManagePageWrapper = styled.div`
  margin: 40px 0;
  font-family: "Inter";

  .button-wide {
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
      padding-top: 0.5rem;
    }

    .club-info-actions {
      flex-shrink: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.75rem;
    }
  }
`;

function LandingPageLinkPlaceholder({ url = "" }) {
  return (
    <StyledLandingPageLink onClick={() => alert(url)}>
      <StyledLinkInput value={url} placeholder="https://myarchery.id" disabled readOnly />
      <span className="icon-copy">
        <IconChainLink />
      </span>
    </StyledLandingPageLink>
  );
}

const StyledLandingPageLink = styled.div`
  position: relative;
  width: 300px;
  cursor: pointer;

  .icon-copy {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: calc(14px + 1.5rem);
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: rgba(238, 243, 254, 0.5);
    color: var(--ma-blue);
  }
`;

const StyledLinkInput = styled.input`
  padding: 0.47rem 0.75rem;
  width: 100%;
  background-color: #eef3fe;
  border-radius: 4px;
  border: solid 1px #eef3fe;
  color: var(--ma-gray-600);
  cursor: pointer;
  transition: box-shadow 0.15s ease-in-out;

  &:hover {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  }
`;

const CardTabs = styled.div`
  display: flex;
`;

const CardTabItem = styled.button`
  overflow: hidden;
  min-width: 12rem;
  padding: 10px;
  border: none;
  border-radius: 8px 8px 0 0;
  background-color: hotpink;
  background-color: #eef3fe;

  display: flex;
  gap: 0.75rem;
  align-items: center;

  color: var(--ma-gray-400);
  font-weight: 600;

  &.tab-selected {
    background-color: #ffffff;
    color: var(--ma-txt-black);

    > .icon {
      opacity: 1;
    }
  }

  > .icon {
    opacity: 0.5;
  }
`;

const CardViewPanel = styled.div`
  position: relative;

  min-height: 12.5rem;
  border-radius: 8px;
  border-top-left-radius: 0;
  border: 0px solid rgb(246, 246, 246);
  box-shadow: rgb(18 38 63 / 3%) 0px 0.75rem 1.5rem;
  background-color: #ffffff;
  background-clip: border-box;
`;

export default PageClubManage;
