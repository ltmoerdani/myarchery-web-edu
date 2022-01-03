import React from "react";
import styled from "styled-components";
import { useParams, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import * as AuthStore from "store/slice/authentication";
import { ArcheryClubService } from "services";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import { ButtonBlue } from "components/ma";

// TODO: pindah lokasi icon ke yang lebih proper
import IconChainLink from "pages/ma/dashboard/club-manage/components/icons-mono/chain-link";
import IconUsers from "components/ma/icons/mono/users";

const APP_URL = "https://myarchery.id";
const LANDING_PAGE_ROUTE_PATH = "/clubs/profile/";
const TOTAL_LIMIT = 3;
const CURRENT_PAGE = 1;

function PageProfile() {
  const { id: clubId } = useParams();
  const location = useLocation();
  const { isLoggedIn } = useSelector(AuthStore.getAuthenticationStore);
  const [clubDetail, setClubDetail] = React.useState(null);
  const [members, setMembers] = React.useState([]);
  const [landingPageFullURL, setLandingPageFullURL] = React.useState("");

  const { pathname } = location;

  const computeFullAddress = () => {
    if (clubDetail) {
      const parts = [clubDetail.placeName, clubDetail.address, clubDetail.detailCity?.name];
      return parts.filter((part) => Boolean(part)).join(", ");
    }
    return "";
  };

  React.useEffect(() => {
    const fetchClubData = async () => {
      const result = await ArcheryClubService.getProfile({ id: clubId });

      if (result.success) {
        setClubDetail(result.data);
      } else {
        console.log("gak sukses wkwk");
      }
    };
    fetchClubData();
  }, []);

  React.useEffect(() => {
    const fetchMemberList = async () => {
      const queryString = { club_id: clubId, limit: TOTAL_LIMIT, page: CURRENT_PAGE };
      const result = await ArcheryClubService.getMembersByClub(queryString);

      if (result.success) {
        setMembers((state) => [...state, ...result.data]);
      }
    };
    fetchMemberList();
  }, []);

  React.useEffect(() => {
    if (!clubDetail?.id) {
      return;
    }
    const theHost = process.env.NODE_ENV === "production" ? APP_URL : window.location.host;
    const theFullURL = theHost + (pathname || LANDING_PAGE_ROUTE_PATH + clubDetail.id);
    setLandingPageFullURL(theFullURL);
  }, [clubDetail?.id]);

  return (
    <ClubProfilePageWrapper>
      <MetaTags>
        <title>Profil {clubDetail?.name || "Klub"} | MyArchery.id</title>
      </MetaTags>

      <div>
        <ClubInfoBanner>
          {clubDetail?.banner && <img className="info-banner-img" src={clubDetail?.banner} />}
        </ClubInfoBanner>

        <Container fluid>
          <ClubInfo>
            <div className="info-photo">
              <div className="info-photo-container">
                <img className="info-photo-img" src={clubDetail?.logo} />
              </div>
            </div>

            <div className="info-details">
              <div className="float-end">
                {!isLoggedIn ? (
                  <ButtonBlue
                    as={Link}
                    to={{ pathname: "/archer/login", state: { from: location } }}
                    className="button-wide"
                  >
                    Gabung Klub
                  </ButtonBlue>
                ) : clubDetail?.isJoin ? (
                  <ButtonBlue className="button-wide button-leave">Keluar Klub</ButtonBlue>
                ) : (
                  <ButtonBlue className="button-wide">Gabung Klub</ButtonBlue>
                )}
              </div>

              <div className="info-head">
                <h3 className="info-name">{clubDetail?.name}</h3>
                <div className="info-member-counts">
                  <span className="info-member-counts-icon">
                    <IconUsers />
                  </span>
                  {clubDetail?.totalMember} Anggota
                </div>
              </div>

              <p>{computeFullAddress()}</p>

              {clubDetail?.description && <p>{clubDetail.description}</p>}

              <LandingPageLinkPlaceholder url={landingPageFullURL} />
            </div>
          </ClubInfo>
        </Container>
      </div>

      <SectionContent>
        <Container fluid>
          <h4>Anggota</h4>

          <MemberGrid>
            {members?.length ? (
              members.map((member) => (
                <MemberItem key={member.id}>
                  <div className="member-photo">
                    <div className="member-photo-container">
                      <img className="member-photo-img" src={member.photo} />
                    </div>
                  </div>

                  <div className="member-detail">
                    <h5>{member.name}</h5>
                    <div>Jenis kelamin</div>
                    <div>Umur</div>
                  </div>
                </MemberItem>
              ))
            ) : (
              <MemberItem
                style={{
                  backgroundColor: "var(--ma-gray-50)",
                  border: "solid 1px var(--ma-gray-100)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    // paddingTop: "1rem",
                    // paddingBottom: "1rem",
                    padding: "1rem",
                    height: 100,
                  }}
                >
                  <h5 style={{ color: "var(--ma-gray-400)" }}>Belum ada anggota</h5>
                </div>
              </MemberItem>
            )}
          </MemberGrid>
        </Container>
      </SectionContent>
    </ClubProfilePageWrapper>
  );
}

const ClubProfilePageWrapper = styled.div`
  font-family: "Inter";

  .button-wide {
    min-width: 120px;
  }

  .button-leave {
    background-color: #eef3fe;
    border: solid 1px #eef3fe;
    color: var(--ma-red);

    &:hover {
      background-color: var(--ma-red);
      border-color: var(--ma-red);
      color: #ffffff;
    }
  }
`;

const ClubInfoBanner = styled.div`
  width: 100%;
  padding-top: 42%;
  position: relative;
  overflow: hidden;
  background-color: var(--ma-blue);

  .info-banner-img {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: none;
  }
`;

const ClubInfo = styled.div`
  position: relative;
  display: flex;
  gap: 40px;

  .info-photo-container {
    position: relative;
    left: 0;
    top: -60px;

    width: 225px;
    height: 225px;
    border-radius: 50%;
    overflow: hidden;
    border: solid 5px #efefef;

    .info-photo-img {
      width: 100%;
      height: 100%;
    }
  }

  .info-details {
    flex-grow: 1;
    flex-basis: 100%;
    margin-top: 40px;

    .info-head {
      display: flex;
      align-items: baseline;
      gap: 4rem;

      .info-name {
        font-weight: 600;
      }

      .info-member-counts {
        font-size: 18px;
        font-weight: 600;

        &-icon {
          display: inline-block;
          margin-right: 0.75rem;
          transform: translateY(-4px);
        }
      }
    }
  }
`;

function LandingPageLinkPlaceholder({ url = "" }) {
  const handleClickCopyLink = () => {
    navigator.clipboard.writeText(url);
  };

  return (
    <StyledLandingPageLink onClick={handleClickCopyLink}>
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

const SectionContent = styled.div`
  margin: 40px 0;
`;

const MemberGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 1rem;
  row-gap: 2rem;
`;

const MemberItem = styled.div`
  display: flex;

  .member-photo {
    .member-photo-container {
      overflow: hidden;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background-color: var(--ma-gray-100);
    }
  }

  .member-detail {
    flex-grow: 1;
    padding: 1rem;
  }
`;

export default PageProfile;
