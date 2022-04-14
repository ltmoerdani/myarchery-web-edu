import React from "react";
import styled from "styled-components";
import classnames from "classnames";
import { useParams, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import * as AuthStore from "store/slice/authentication";
import { ArcheryClubService } from "services";

import MetaTags from "react-meta-tags";
import SweetAlert from "react-bootstrap-sweetalert";
import { Container } from "reactstrap";
import { Button, ButtonBlue, AvatarDefault, AvatarClubDefault } from "components/ma";
import { SkeletonMemberGridItem } from "./components/member-grid-item";

// TODO: pindah lokasi icon ke yang lebih proper
import IconChainLink from "pages/ma/dashboard/club-manage/components/icons-mono/chain-link";
import IconUsers from "components/ma/icons/mono/users";
import IconGender from "components/ma/icons/mono/gender";

const APP_URL = "https://myarchery.id";
const LANDING_PAGE_ROUTE_PATH = "/clubs/profile/";
const TOTAL_LIMIT = 3;
const CURRENT_PAGE = 1;

function PageProfile() {
  const { id: clubId } = useParams();
  const location = useLocation();
  const { isLoggedIn } = useSelector(AuthStore.getAuthenticationStore);
  const [clubDetail, setClubDetail] = React.useState(null);
  const [landingPageFullURL, setLandingPageFullURL] = React.useState("");
  const [whichConfirmDialog, setWhichConfirmDialog] = React.useState(null);
  const [membershipAttempts, setMembershipAttempts] = React.useState(0);
  const [paginatedMembers, setPaginatedMembers] = React.useState({
    fetchingStatus: "idle",
    members: [],
    currentPage: 1,
    isLastPage: false,
    attemptCounts: 0,
  });
  const [filterParams, setFilterParams] = React.useState({ name: "", gender: "all" });

  const membersLoaderDOM = React.useRef(null);
  const { members, fetchingStatus, currentPage, isLastPage, attemptCounts } = paginatedMembers;
  const isLoadingMembers = fetchingStatus === "loading";

  const { pathname } = location;
  const shoulShowConfirmJoin = whichConfirmDialog === "join";
  const shoulShowConfirmLeave = whichConfirmDialog === "leave";

  const getTabItemProps = (name) => ({
    className: classnames("button-filter", { "filter-active": filterParams.gender === name }),
    disabled: filterParams.gender === name,
    onClick: () => {
      setFilterParams((params) => ({ ...params, gender: name }));
      doInitialFetchMembers();
    },
  });

  const increaseAttemptCounts = () => {
    setPaginatedMembers((state) => ({ ...state, attemptCounts: state.attemptCounts + 1 }));
  };

  const doInitialFetchMembers = () => {
    setPaginatedMembers((state) => {
      return {
        fetchingStatus: state.fetchingStatus,
        attemptCounts: state.attemptCounts + 1,
        members: [],
        currentPage: 1,
        isLastPage: false,
      };
    });
  };

  const handleChangeSearchBox = (ev) => {
    setFilterParams((params) => ({ ...params, name: ev.target.value }));
  };

  const handleClickSearchByName = () => doInitialFetchMembers();

  const computeFullAddress = () => {
    if (clubDetail) {
      const parts = [clubDetail.placeName, clubDetail.address, clubDetail.detailCity?.name];
      return parts
        .filter((part) => Boolean(part))
        .join(", ")
        .toLowerCase();
    }
    return "";
  };

  const handleClickJoin = () => setWhichConfirmDialog("join");
  const handleCancelJoin = () => setWhichConfirmDialog(null);
  const handleAgreedJoin = async () => {
    const result = await ArcheryClubService.setJoinClub({ club_id: clubDetail.id });
    if (result.success) {
      setMembershipAttempts((counts) => counts + 1);
      doInitialFetchMembers();
    }
    setWhichConfirmDialog(null);
  };

  const handleClickLeave = () => setWhichConfirmDialog("leave");
  const handleCancelLeaveClub = () => setWhichConfirmDialog(null);
  const handleAgreedLeaveClub = async () => {
    const result = await ArcheryClubService.setLeaveClub({ club_id: clubDetail?.id });
    if (result.success) {
      setMembershipAttempts((counts) => counts + 1);
      doInitialFetchMembers();
    }
    setWhichConfirmDialog(null);
  };

  React.useEffect(() => {
    const fetchClubData = async () => {
      const result = await ArcheryClubService.getProfile({ club_id: clubId });
      if (result.success) {
        setClubDetail(result.data);
      }
    };

    fetchClubData();
  }, [membershipAttempts]);

  React.useEffect(() => {
    const fetchMemberList = async () => {
      setPaginatedMembers((state) => ({ ...state, fetchingStatus: "loading" }));
      const queryString = {
        club_id: clubId,
        limit: TOTAL_LIMIT,
        page: currentPage || CURRENT_PAGE,
        name: filterParams.name || undefined,
        gender: filterParams.gender === "all" ? undefined : filterParams.gender,
      };
      const result = await ArcheryClubService.getMembersByClub(queryString);

      if (result.success) {
        setPaginatedMembers((state) => ({
          ...state,
          fetchingStatus: "success",
          members: currentPage > 1 ? [...state.members, ...result.data] : result.data,
          currentPage: state.currentPage + 1,
          isLastPage: result.data.length < TOTAL_LIMIT,
        }));
      } else {
        setPaginatedMembers((state) => ({ ...state, fetchingStatus: "error" }));
      }
    };

    fetchMemberList();
  }, [attemptCounts]);

  React.useEffect(() => {
    if (isLoadingMembers || !membersLoaderDOM.current || isLastPage) {
      return;
    }
    const option = { root: null, rootMargin: "0px", threshold: 1.0 };
    const handleOnOverlapping = (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        increaseAttemptCounts();
      }
    };
    const observer = new IntersectionObserver(handleOnOverlapping, option);
    observer.observe(membersLoaderDOM.current);

    return () => {
      // Berhenti ngemonitor target ketika dia di-unmounted
      // supaya gak fetch dobel-dobel
      observer.disconnect();
    };
  }, [isLoadingMembers, isLastPage]);

  // URL landing page
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
                {clubDetail?.logo ? (
                  <img className="info-photo-img" src={clubDetail?.logo} />
                ) : (
                  <AvatarClubDefaultLarge />
                )}
              </div>
            </div>

            <div className="info-details">
              <div className="info-head">
                <div className="info-meta">
                  <h3 className="info-name">{clubDetail?.name}</h3>
                </div>

                <div className="info-buttons-group">
                  <div className="info-member-counts">
                    <span className="info-member-counts-icon">
                      <IconUsers />
                    </span>
                    {clubDetail?.totalMember} Anggota
                  </div>

                  {!isLoggedIn ? (
                    <ButtonBlue
                      as={Link}
                      to={{ pathname: "/archer/login", state: { from: location } }}
                      className="button-wide"
                    >
                      Gabung Klub
                    </ButtonBlue>
                  ) : (
                    <React.Fragment>
                      {clubDetail?.isJoin ? (
                        clubDetail?.isAdmin ? (
                          <ButtonBlue
                            as={Link}
                            to={`/dashboard/clubs/detail/${clubDetail?.id || clubId}`}
                            className="button-wide"
                          >
                            Edit Klub
                          </ButtonBlue>
                        ) : (
                          <React.Fragment>
                            <ButtonBlue
                              className="button-wide button-leave"
                              onClick={handleClickLeave}
                            >
                              Keluar Klub
                            </ButtonBlue>

                            {clubDetail && (
                              <AlertConfirmLeave
                                show={shoulShowConfirmLeave}
                                club={clubDetail}
                                onCancel={handleCancelLeaveClub}
                                onConfirm={handleAgreedLeaveClub}
                              />
                            )}
                          </React.Fragment>
                        )
                      ) : (
                        <React.Fragment>
                          <ButtonBlue className="button-wide" onClick={handleClickJoin}>
                            Gabung Klub
                          </ButtonBlue>

                          {clubDetail && (
                            <AlertConfirmJoin
                              show={shoulShowConfirmJoin}
                              club={clubDetail}
                              onCancel={handleCancelJoin}
                              onConfirm={handleAgreedJoin}
                            />
                          )}
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  )}
                </div>
              </div>

              <div className="info-body">
                <p className="info-address">{computeFullAddress()}</p>

                {clubDetail?.description && (
                  <DescriptionContent>{clubDetail.description}</DescriptionContent>
                )}
              </div>

              <LandingPageLinkPlaceholder url={landingPageFullURL} />
            </div>
          </ClubInfo>
        </Container>
      </div>

      <SectionContent>
        <Container fluid>
          <h4 className="mb-4">Anggota</h4>

          <MemberToolbar className="mb-5">
            <SearchBox>
              <SearchBoxInput
                className="search-box-input"
                placeholder="Cari archer"
                onChange={handleChangeSearchBox}
              />{" "}
              <ButtonBlue className="button-wide" onClick={handleClickSearchByName}>
                Cari
              </ButtonBlue>
            </SearchBox>

            <FilterTabs className="filter-tabs">
              <ButtonBlue {...getTabItemProps("all")}>Semua</ButtonBlue>
              <Button {...getTabItemProps("female")}>Perempuan</Button>
              <Button {...getTabItemProps("male")}>Laki-Laki</Button>
            </FilterTabs>
          </MemberToolbar>

          <MemberGrid>
            {members?.length
              ? members.map((member) => (
                  <MemberItem key={member.id}>
                    <div className="member-photo">
                      <div className="member-photo-container">
                        {member.avatar ? (
                          <img className="member-photo-img" src={member.avatar} />
                        ) : (
                          <AvatarDefault fullname={member.name} />
                        )}
                      </div>
                    </div>

                    <div className="member-detail">
                      <h5>{member.name}</h5>
                      <div>
                        <span className="info-icon">
                          <IconGender size="20" />
                        </span>
                        {member.gender ? (
                          <React.Fragment>
                            {member.gender === "male" ? "Laki-laki" : "Perempuan"}
                          </React.Fragment>
                        ) : (
                          <React.Fragment>&mdash;</React.Fragment>
                        )}
                      </div>
                    </div>
                  </MemberItem>
                ))
              : !isLoadingMembers && (
                  <MemberItem>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "1rem",
                        height: 100,
                      }}
                    >
                      <h5 style={{ color: "var(--ma-gray-400)" }}>Belum ada anggota</h5>
                    </div>
                  </MemberItem>
                )}

            {!isLastPage && (
              <div ref={membersLoaderDOM}>
                <SkeletonMemberGridItem />
              </div>
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
  padding-top: 30%;
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
  flex-wrap: wrap;
  justify-content: center;
  gap: 0 40px;
  margin-bottom: 5rem;

  .info-photo-container {
    flex-grow: 1;
    position: relative;
    left: 0;
    top: -60px;

    width: 225px;
    height: 225px;
    border-radius: 50%;
    overflow: hidden;
    background-color: var(--ma-gray-200);
    border: solid 5px #efefef;

    .info-photo-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .info-details {
    flex-grow: 1;
    flex-basis: 40%;
    margin-top: 40px;

    @media (max-width: 580px) {
      margin-top: -2rem;
    }

    .info-head {
      display: flex;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 0.5rem 6rem;
      margin-bottom: 2.5rem;

      @media (max-width: 580px) {
        margin-bottom: 4rem;
      }

      .info-meta {
        flex-grow: 1;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        @media (max-width: 580px) {
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .info-name {
          font-weight: 600;
        }
      }

      .info-buttons-group {
        flex-grow: 1;
        flex-basis: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 2rem 1rem;

        @media (max-width: 580px) {
          flex-direction: column;
          align-items: center;
        }
      }

      .info-member-counts {
        flex-basis: auto;
        font-size: 18px;
        font-weight: 600;

        &-icon {
          display: inline-block;
          margin-right: 0.75rem;
          transform: translateY(-4px);
        }
      }
    }

    .info-body {
      max-width: 520px;

      .info-address {
        margin-bottom: 2rem;
        text-transform: capitalize !important;
        font-weight: 600;
      }
    }
  }
`;

const AvatarClubDefaultLarge = styled(AvatarClubDefault)`
  font-size: 4rem;
`;

const DescriptionContent = styled.p`
  white-space: pre-wrap;
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
  margin-top: 2rem;
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

const MemberToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem 8rem;
`;

const MemberGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
      background-color: var(--ma-gray-200);

      .member-photo-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .member-detail {
    flex-grow: 1;
    padding: 1rem;

    .info-icon {
      margin-right: 0.5rem;
    }
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

function AlertConfirmLeave({ show, club, onCancel, onConfirm }) {
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
          <Button onClick={onConfirm} style={{ color: "var(--ma-red)" }}>
            Yakin
          </Button>
          <ButtonBlue onClick={onCancel}>Batalkan</ButtonBlue>
        </span>
      }
    >
      <h4>
        Apakah Anda yakin akan keluar dari Klub <strong>&quot;{club.name}&quot;</strong>?
      </h4>
      <p>
        <br />
        Anda akan tetap terdaftar sebagai perwakilan klub dalam event yang sudah diikuti. Anda harus
        bergabung ulang untuk menjadi bagian dari klub.
      </p>
    </SweetAlert>
  );
}

const FilterTabs = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: auto;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;

  @media (max-width: 778px) {
    justify-content: flex-start;
  }

  .button-filter {
    background-color: transparent;
    border-radius: 8px;
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
    cursor: default;

    &:hover {
      background-color: #eef3fe;
      box-shadow: none;
    }
  }
`;

const SearchBox = styled.div`
  flex-grow: 1;
  display: flex;
  gap: 0.875rem;

  @media (max-width: 520px) {
    flex-direction: column;
  }
`;

const SearchBoxInput = styled.input`
  padding: 0.47rem 0.75rem;
  width: 100%;
  border-radius: 4px;
  border: none;
  border: solid 1px var(--ma-gray-100);
  background-color: var(--ma-gray-100);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    border-color: #2684ff;
    background-color: var(--ma-gray-50);
    box-shadow: 0 0 0 1px #2684ff;
  }
`;

export default PageProfile;
