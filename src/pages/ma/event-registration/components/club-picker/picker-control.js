import * as React from "react";
import styled from "styled-components";
import { ArcheryClubService } from "services";

import Select from "react-select";
import { Modal, ModalBody } from "reactstrap";
import { Button, ButtonBlue, ButtonOutlineBlue, AvatarClubDefault } from "components/ma";

import IconCheck from "components/ma/icons/mono/check";

import classnames from "classnames";

const TOTAL_LIMIT = 10;

function PickerControl({ toggle, onClosed, value = {}, onChange }) {
  const modalProps = { isOpen: true, size: "xl", toggle, onClosed };

  const [clubs, updateClubs] = React.useReducer(clubsReducer, {
    status: "idle",
    page: 1,
    attempts: 0,
    data: null,
    errors: null,
  });
  const [searchParams, updateSearchParams] = React.useReducer(searchParamsReducer, {
    name: "",
    province: null,
    city: null,
  });
  const { provinces, cities } = useAdministrativeAreaFilters(searchParams.province?.value);

  const { page, attempts, data: clubsData } = clubs;

  React.useEffect(() => {
    refetchClubs();
  }, [attempts]);

  const refetchClubs = async () => {
    updateClubs({ status: "loading", errors: null });
    const queryStrings = {
      limit: TOTAL_LIMIT,
      page: page,
      name: searchParams?.name || undefined,
      province: searchParams?.province?.value || undefined,
      city: searchParams?.city?.value || undefined,
    };
    const result = await ArcheryClubService.get(queryStrings);
    if (result.success) {
      updateClubs({ status: "success", data: result.data });
    } else {
      updateClubs({ status: "error", errors: result.errors });
    }
  };

  return (
    <StyledBSModal {...modalProps}>
      <StyledBSModalBody>
        <ListViewHeader>
          <ColumnSearchBox>
            <SearchNameInput
              placeholder="Cari klub"
              onChange={(ev) => updateSearchParams({ name: ev.target.value })}
            />
          </ColumnSearchBox>

          <ColumnSelectFilter>
            <SelectFilter
              placeholder="Pilih Provinsi"
              options={provinces}
              value={searchParams.province}
              onChange={(option) => updateSearchParams({ province: option, city: null })}
            />
            <SelectFilter
              placeholder={searchParams.province ? "Pilih Kota" : "Pilih provinsi terlebih dulu"}
              options={cities}
              value={searchParams.city}
              onChange={(option) => updateSearchParams({ city: option })}
              disabled={!searchParams.province}
            />
          </ColumnSelectFilter>

          <ActionButtonsGroup>
            <ButtonSearch onClick={() => updateClubs({ type: "REFETCH" })}>Cari</ButtonSearch>
            <ButtonCancel onClick={() => onClosed()}>Tutup</ButtonCancel>
          </ActionButtonsGroup>
        </ListViewHeader>

        <ListViewBody>
          {Boolean(clubsData?.length) &&
            clubsData.map((club) => (
              <ClubItem
                key={club.id}
                className={classnames({
                  "club-disabled": !club.isJoin,
                  "club-selected": club.detail.id === value?.detail.id,
                })}
              >
                <input
                  type="radio"
                  name="club"
                  id={`radio-club-${club.detail.id}`}
                  className="club-item-radio"
                  value={club.detail.id}
                  checked={club.detail.id === value?.detail.id}
                  onChange={() => onChange?.(club)}
                  disabled={!club.isJoin}
                />
                <ClubItemBody
                  htmlFor={`radio-club-${club.detail.id}`}
                  className={classnames({ "club-disabled": !club.isJoin })}
                >
                  <MediaLogo>
                    <AvatarClubDefault />
                    {club.detail.id === value?.detail.id && (
                      <ClubSelected>
                        <IconCheck size="36" />
                      </ClubSelected>
                    )}
                  </MediaLogo>

                  <MediaContent>
                    <h4 className="club-name">{club.detail.name}</h4>
                    <div className="club-info">
                      <Address>
                        {computeClubBasisFullAddress({
                          address: club.detail.address,
                          city: club.detail.detailCity?.name,
                          province: club.detail.detailProvince?.name,
                        })}
                      </Address>

                      <MemberCounts>
                        <BlueBullet>&#8226;</BlueBullet> Jumlah anggota terdaftar:{" "}
                        {club.totalMember}
                      </MemberCounts>
                    </div>
                  </MediaContent>
                </ClubItemBody>

                <ClubActionButtonsGroup>
                  <ButtonLanding>Lihat Profil</ButtonLanding>
                  {club.isJoin ? (
                    <ButtonAsMemberStatus disabled>&#10003; Member</ButtonAsMemberStatus>
                  ) : (
                    <ButtonJoin>Gabung Klub</ButtonJoin>
                  )}
                </ClubActionButtonsGroup>
              </ClubItem>
            ))}
        </ListViewBody>
      </StyledBSModalBody>
    </StyledBSModal>
  );
}

const StyledBSModal = styled(Modal)`
  .modal-content {
    border-radius: 1.25rem;
    overflow: hidden;
  }
`;

const StyledBSModalBody = styled(ModalBody)`
  padding: 0;
  min-height: 90vh;
  font-family: "Inter", sans-serif;
`;

const ListViewHeader = styled.div`
  padding: 1.5rem;
  display: flex;
  gap: 0.75rem 1.25rem;
  flex-wrap: wrap;
`;

const ColumnSearchBox = styled.div`
  flex: 2 1 auto;
`;

const ColumnSelectFilter = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;

  > * {
    flex: 1 1 0%;
  }
`;

const ActionButtonsGroup = styled.div`
  flex: 1 3 0%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 0.5rem;
`;

const SearchNameInput = styled.input`
  display: block;
  padding: 0.47rem 0.75rem;
  width: 100%;
  border-radius: 4px;
  border: solid 1px var(--ma-gray-50);
  background-color: var(--ma-gray-50);
  transition: all 0.25s;

  &::placeholder {
    color: var(--ma-gray-400);
    opacity: 1;
  }

  &:focus {
    border-color: #2684ff;
    box-shadow: 0 0 0 1px #2684ff;
    background-color: var(--ma-gray-50);
  }
`;

function SelectFilter({ name, placeholder, options, value, onChange, disabled }) {
  return (
    <Select
      styles={{ container: (provided) => ({ ...provided, minWidth: "240px" }) }}
      name={name}
      placeholder={placeholder}
      isClearable
      options={options}
      value={value}
      onChange={onChange}
      isDisabled={disabled}
    />
  );
}

const ButtonSearch = styled(ButtonBlue)`
  min-width: 88px;
`;

const ButtonCancel = styled(Button)`
  min-width: 88px;
  color: var(--ma-blue);

  &:hover {
    color: var(--ma-blue);
  }
`;

const ClubSelected = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 0 3px var(--ma-blue) inset;
  color: var(--ma-blue);
`;

const ButtonLanding = styled(ButtonOutlineBlue)`
  min-width: 7.5rem;
`;

const ButtonJoin = styled(ButtonBlue)`
  min-width: 7.5rem;
`;

const ButtonAsMemberStatus = styled(Button)`
  min-width: 7.5rem;
  &,
  &:hover,
  &:disabled {
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;
    color: var(--ma-blue);
    cursor: default;
  }
`;

const ListViewBody = styled.div``;

const ClubItem = styled.div`
  position: relative;
  overflow: hidden;
  padding: 1.5rem 1.25rem;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem 1rem;

  &:hover {
    background-color: rgba(238, 243, 254, 0.5);
  }

  &.club-disabled:hover {
    background-color: unset;
  }

  &.club-selected {
    background-color: var(--ma-blue-primary-50);
  }

  .club-item-radio {
    position: absolute;
    top: 0;
    left: -2000px;
  }
`;

const ClubItemBody = styled.label`
  margin: 0;
  display: flex;
  gap: 1.5rem;
  cursor: pointer;

  &.club-disabled {
    cursor: not-allowed;
  }

  ${ClubItem} > & {
    flex: 3 1 0%;
  }
`;

const MediaLogo = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: solid 1px #eeeeee;
  background-color: var(--ma-gray-400);
`;

const MediaContent = styled.div`
  flex-grow: 1;
  padding-top: 0.875rem;
  font-weight: 400;

  .club-name {
    color: var(--ma-blue);
  }

  .club-info {
    display: flex;
    gap: 5rem;
  }
`;

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

const ClubActionButtonsGroup = styled(ActionButtonsGroup)`
  flex: 1 0 0%;
  align-items: center;
`;

function clubsReducer(state, action) {
  if (action.type === "REFETCH") {
    return { ...state, attempts: state.attempts + 1 };
  }
  return { ...state, ...action };
}

function searchParamsReducer(state, action) {
  return { ...state, ...action };
}

function areasReducer(state, action) {
  return { ...state, ...action };
}

function useAdministrativeAreaFilters(provinceId) {
  const [areas, dispatch] = React.useReducer(areasReducer, {
    provinces: [],
    cities: [],
    status: "idle",
    errors: null,
  });

  const { provinces, cities, status } = areas;
  const isLoading = status === "loading";

  React.useEffect(() => {
    const fetchProvinces = async () => {
      dispatch({ status: "loading", errors: null });
      const result = await ArcheryClubService.getProvinces({ limit: 50, page: 1 });
      if (result.success) {
        dispatch({
          status: "success",
          provinces: result.data.map((province) => ({
            value: parseInt(province.id),
            label: province.name,
          })),
        });
      } else {
        dispatch({ status: "error", errors: result.errors });
      }
    };

    fetchProvinces();
  }, []);

  React.useEffect(() => {
    if (!provinceId) {
      return;
    }

    const fetchCities = async () => {
      dispatch({ status: "loading", errors: null });
      const result = await ArcheryClubService.getCities({ province_id: provinceId });
      if (result.success) {
        dispatch({
          status: "success",
          cities: result.data.map((city) => ({ value: city.id, label: city.name })),
        });
      } else {
        dispatch({ status: "error", errors: result.errors });
      }
    };

    fetchCities();
  }, [provinceId]);

  return { provinces, cities, isLoading };
}

const computeClubBasisFullAddress = ({ address, city, province }) => {
  const infos = [address, city, province];
  const byEmptyField = (info) => Boolean(info);
  return infos.filter(byEmptyField).join(", ");
};

export { PickerControl };
