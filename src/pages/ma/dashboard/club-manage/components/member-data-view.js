import React from "react";
import styled from "styled-components";
import classnames from "classnames";
import { ArcheryClubService } from "services";

import SweetAlert from "react-bootstrap-sweetalert";
import { Button, ButtonBlue } from "components/ma";

const TOTAL_LIMIT = 3;
const CURRENT_PAGE = 1;

function MemberDataListView({ club }) {
  const [selectedFilter, setSelectedFilter] = React.useState("all");
  const [members, setMembers] = React.useState([]);
  const [selectedMemberId, setSelectedMemberId] = React.useState(null);

  const isMemberSelected = (id) => selectedMemberId === id;

  const getTabItemProps = (name) => ({
    className: classnames("button-filter", { "filter-active": selectedFilter === name }),
    disabled: selectedFilter === name,
    onClick: () => setSelectedFilter(name),
  });

  React.useEffect(() => {
    const fetchMemberList = async () => {
      const queryString = { club_id: club.id, limit: TOTAL_LIMIT, page: CURRENT_PAGE };
      const result = await ArcheryClubService.getMembersByClub(queryString);

      if (result.success) {
        setMembers((state) => [...state, ...result.data]);
      }
    };
    fetchMemberList();
  }, []);

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
          <SearchBoxInput className="search-box-input" placeholder="Cari archer" />{" "}
          <ButtonBlue>Cari</ButtonBlue>
        </SearchBox>
      </CardToolbarTop>

      {members.map((member) => (
        <MemberListItem key={member.id}>
          <MemberFigure>
            <AvatarPhoto>
              <img src={member.photo} />
            </AvatarPhoto>
          </MemberFigure>

          <MemberInfo>
            <h4>{member.name}</h4>
            <div>TBD: gender</div>
            <div>TBD: umur</div>
          </MemberInfo>

          <MemberActions>
            <ButtonRemove onClick={() => setSelectedMemberId(member.id)}>
              <i className="bx bx-trash" />
            </ButtonRemove>

            <AlertConfirmRemoveMember
              key={member.id}
              show={isMemberSelected(member.id)}
              member={member}
              onCancel={() => setSelectedMemberId(null)}
              onConfirm={() => handleRemoveMember(member)}
            />
          </MemberActions>
        </MemberListItem>
      ))}
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
  background-color: var(--ma-gray-400);
`;

const MemberInfo = styled.div`
  flex-grow: 1;
  padding: 1.25rem;
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
        Apakah yakin akan menghapus <strong>&quot;{member.name}&quot;</strong> dari klub?
      </p>
    </SweetAlert>
  );
}

export { MemberDataListView };
