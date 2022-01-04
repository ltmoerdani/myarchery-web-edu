import React from "react";
import styled from "styled-components";
import classnames from "classnames";
import { ArcheryClubService } from "services";

import SweetAlert from "react-bootstrap-sweetalert";
import { Button, ButtonBlue, ButtonOutline } from "components/ma";
import { SkeletonClubItem } from "../../components/skeletons/club-item";

import IconAge from "components/ma/icons/mono/age";
import IconGender from "components/ma/icons/mono/gender";

const TOTAL_LIMIT = 3;
const CURRENT_PAGE = 1;

function MemberDataListView({ club }) {
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
  const [selectedMemberId, setSelectedMemberId] = React.useState(null);

  const isMemberSelected = (id) => selectedMemberId === id;

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

  React.useEffect(() => {
    if (isLoadingMembers || !membersLoaderDOM.current || isLastPage) {
      return;
    }
    const option = { root: null, rootMargin: "-40px", threshold: 1 };
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

  React.useEffect(() => {
    const fetchMemberList = async () => {
      setPaginatedMembers((state) => ({ ...state, fetchingStatus: "loading" }));
      const queryString = {
        club_id: club.id,
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

  const handleRemoveMember = async (member) => {
    const queryString = { club_id: club.id, member_id: member.id };
    const result = await ArcheryClubService.removeUserFromClub(queryString);
    if (result.success) {
      console.log("Success removing member from club");
    } else {
      console.log("Error/failed removing member from club");
    }
    setSelectedMemberId(null);
  };

  return (
    <React.Fragment>
      <CardToolbarTop>
        <FilterTabs className="filter-tabs">
          <ButtonBlue {...getTabItemProps("all")}>Semua</ButtonBlue>
          <Button {...getTabItemProps("female")}>Perempuan</Button>
          <Button {...getTabItemProps("male")}>Laki-Laki</Button>
        </FilterTabs>

        <SearchBox>
          <SearchBoxInput
            className="search-box-input"
            placeholder="Cari archer"
            onChange={handleChangeSearchBox}
          />{" "}
          <ButtonBlue onClick={handleClickSearchByName}>Cari</ButtonBlue>
        </SearchBox>
      </CardToolbarTop>

      {members.length
        ? members.map((member) => (
            <MemberListItem key={member.id}>
              <MemberFigure>
                <AvatarPhoto>
                  {member.avatar && <img className="avatar-img" src={member.avatar} />}
                </AvatarPhoto>
              </MemberFigure>

              <MemberInfo>
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
                <div>
                  <span className="info-icon">
                    <IconAge size="20" />
                  </span>
                  {member.age ? `${member.age} tahun` : <React.Fragment>&mdash;</React.Fragment>}
                </div>
              </MemberInfo>

              <MemberActions>
                {!member.isAdmin ? (
                  <ButtonRemove onClick={() => setSelectedMemberId(member.id)}>
                    <i className="bx bx-trash" />
                  </ButtonRemove>
                ) : (
                  <ButtonLinkAdmin disabled>Admin</ButtonLinkAdmin>
                )}

                <AlertConfirmRemoveMember
                  key={member.id}
                  show={isMemberSelected(member.id)}
                  member={member}
                  onCancel={() => setSelectedMemberId(null)}
                  onConfirm={() => handleRemoveMember(member)}
                />
              </MemberActions>
            </MemberListItem>
          ))
        : !isLoadingMembers && <ListBottomEnd>Belum ada anggota</ListBottomEnd>}

      {!isLastPage && (
        <div ref={membersLoaderDOM}>
          <SkeletonClubItem />
        </div>
      )}
    </React.Fragment>
  );
}

const CardToolbarTop = styled.div`
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;

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
  display: flex;
  gap: 0.5rem;
`;

const SearchBoxInput = styled.input`
  padding: 0.47rem 0.75rem;
  width: 300px;
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

const MemberListItem = styled.div`
  display: flex;
  &:hover {
    background-color: #eef3fe;
  }
`;

const MemberFigure = styled.div`
  padding: 1.25rem;
  flex-shrink: 1;
`;

const AvatarPhoto = styled.div`
  min-width: 5rem;
  min-height: 5rem;
  border-radius: 50%;
  background-color: var(--ma-gray-200);

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MemberInfo = styled.div`
  flex-grow: 1;
  padding: 1.25rem;

  .info-icon {
    margin-right: 0.5rem;
  }
`;

const MemberActions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.25rem;
`;

const ButtonRemove = styled(Button)`
  &,
  &:active,
  &:focus {
    color: var(--ma-red);
  }

  &:hover {
    border: solid 1px var(--ma-red);
    background-color: var(--ma-red);
    color: #ffffff;
  }
`;

function AlertConfirmRemoveMember({ show, member, onCancel, onConfirm }) {
  return (
    <SweetAlert
      show={show}
      title="Perhatian"
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
        Apakah yakin akan menghapus anggota <strong>&quot;{member.name}&quot;</strong> dari klub?
      </p>
    </SweetAlert>
  );
}

const ListBottomEnd = styled.div`
  padding: 1.25rem;
  min-height: calc(80px + 1.25rem * 2);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  color: var(--ma-gray-400);

  .content-with-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
`;

const ButtonLinkAdmin = styled(ButtonOutline)`
  &:disabled {
    border-color: transparent;
    &:hover {
      background-color: transparent;
      box-shadow: none;
    }
  }
`;

export { MemberDataListView };
