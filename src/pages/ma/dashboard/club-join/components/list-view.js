import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ArcheryClubService } from "services";

import Select from "react-select";
import { Button, ButtonBlue, ButtonOutlineBlue } from "components/ma";
import { SkeletonClubItem } from "../../components/skeletons/club-item";
import { ClubList } from "./club-list";

const TOTAL_LIMIT = 3;

/**
 * - First load, data list berisi semua klub yang ada di "page" pertama
 * - Setelah hit search & set filtering, data list berisi hasil search+filternya
 */
function JoinClubDataListView() {
  const [provinceOptions, setProvinceOptions] = React.useState(null);
  const [cityOptions, setCityOptions] = React.useState(null);
  const [filterParams, setFilterParams] = React.useState({
    name: "",
    province: null,
    city: null,
  });
  const [isFilterDirty, setFilterDirty] = React.useState(false);
  const [pagination, setPagination] = React.useState({
    fetchingStatus: "idle",
    clubs: [],
    currentPage: 1,
    isLastpage: false,
  });
  const [attemptCounts, setAttemptCounts] = React.useState(0);

  const inputDOM = React.useRef(null);
  const clubLoaderDOM = React.useRef(null);

  const { fetchingStatus, clubs, isLastPage, currentPage } = pagination;
  const isLoadingClubs = fetchingStatus === "loading";
  const isFetchingError = fetchingStatus === "error";

  React.useEffect(() => {
    const fetchProvinceOptions = async () => {
      const result = await ArcheryClubService.getProvinces({ limit: 50, page: 1 });
      if (result.success) {
        const provinceOptions = result.data.map((province) => ({
          label: province.name,
          value: parseInt(province.id),
        }));
        setProvinceOptions(provinceOptions);
      } else {
        console.log(result.errors || "error getting provinces list");
      }
    };

    fetchProvinceOptions();
  }, []);

  React.useEffect(() => {
    if (!filterParams?.province?.value) {
      return;
    }

    const fetchCityOptions = async () => {
      const result = await ArcheryClubService.getCities({
        province_id: filterParams.province.value,
      });

      if (result.success) {
        const cityOptions = result.data.map((city) => ({
          label: city.name,
          value: parseInt(city.id),
        }));
        setCityOptions(cityOptions);
      } else {
        console.log(result.errors || "error getting cities list");
      }
    };

    fetchCityOptions();
  }, [filterParams.province]);

  React.useEffect(() => {
    fetchClubs();
  }, [attemptCounts]);

  React.useEffect(() => {
    if (isLoadingClubs || !clubLoaderDOM.current || isLastPage) {
      return;
    }
    const option = { root: null, rootMargin: "-40px", threshold: 1 };
    const handleOnOverlapping = (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setAttemptCounts((counts) => counts + 1);
      }
    };
    const observer = new IntersectionObserver(handleOnOverlapping, option);
    observer.observe(clubLoaderDOM.current);

    return () => {
      // Berhenti ngemonitor target ketika dia di-unmounted
      // supaya gak fetch dobel-dobel
      observer.disconnect();
    };
  }, [isLoadingClubs, isLastPage]);

  const fetchClubs = async () => {
    setPagination((state) => ({ ...state, fetchingStatus: "loading" }));

    const queryStrings = {
      limit: TOTAL_LIMIT,
      page: currentPage,
      name: filterParams?.name || undefined,
      province: filterParams?.province?.value || undefined,
      city: filterParams?.city?.value || undefined,
    };

    const result = await ArcheryClubService.get(queryStrings);

    if (result.success) {
      setPagination((state) => ({
        fetchingStatus: "success",
        clubs: currentPage > 1 ? [...state.clubs, ...result.data] : result.data,
        currentPage: state.currentPage + 1,
        isLastPage: result.data.length < TOTAL_LIMIT,
      }));
    } else {
      setPagination((state) => ({ ...state, fetchingStatus: "error" }));
    }
  };

  const updateSearchFiltering = (param, value) => {
    setFilterDirty((isDirty) => !isDirty || true);
    setFilterParams((query) => ({
      ...query,
      [param]: value,
    }));
  };

  const doInitialFetchClubs = () => {
    setPagination({ clubs: [], currentPage: 1, isLastPage: false });
    setAttemptCounts((counts) => counts + 1);
  };

  const handleResetFiltering = () => {
    if (!isFilterDirty) {
      inputDOM.current.focus();
      return;
    }
    setFilterParams({ name: "", province: null, city: null });
    setFilterDirty(false);
    inputDOM.current.focus();

    doInitialFetchClubs();
  };

  const handleSubmitSearch = () => {
    if (!isFilterDirty) {
      inputDOM.current.focus();
      return;
    }
    doInitialFetchClubs();
  };

  return (
    <StyledListView>
      <ListViewHeader>
        <SearchNameInput
          ref={inputDOM}
          placeholder="Cari klub"
          value={filterParams.name}
          onChange={(ev) => updateSearchFiltering("name", ev.target.value)}
        />
        <SelectParam
          name="province"
          placeholder="Provinsi/Wilayah"
          options={provinceOptions}
          value={filterParams.province}
          onChange={(value) => updateSearchFiltering("province", value)}
        />
        <SelectParam
          name="city"
          placeholder="Kota"
          options={cityOptions}
          value={filterParams.city}
          onChange={(value) => updateSearchFiltering("city", value)}
          disabled={!filterParams.province}
        />

        <ButtonBlue onClick={handleSubmitSearch}>Cari</ButtonBlue>
        {isFilterDirty && <ButtonLink onClick={handleResetFiltering}>Reset Filter</ButtonLink>}
      </ListViewHeader>

      {clubs && (
        <React.Fragment>
          {filterParams.name && !clubs.length && (
            <SuggestionBar>
              <div className="suggestion-bar-content">
                Tambahkan{" "}
                <span style={{ color: "var(--ma-blue)" }}>&quot;{filterParams.name}&quot;</span>{" "}
                sebagai klub baru
              </div>

              <div className="suggestion-bar-actions">
                <ButtonOutlineBlue
                  as={Link}
                  to={`/dashboard/clubs/new?suggestedName=${filterParams.name}`}
                  className="button-wide"
                >
                  Buat Klub
                </ButtonOutlineBlue>
              </div>
            </SuggestionBar>
          )}

          <ClubList clubs={clubs} onJoinSuccess={() => doInitialFetchClubs()} />
          {!isLastPage && !isFetchingError && (
            <div ref={clubLoaderDOM}>
              <SkeletonClubItem />
            </div>
          )}
        </React.Fragment>
      )}

      {!isLoadingClubs && isFetchingError && (
        <ListBottomEnd>
          <div className="content-with-button">
            Ada error!
            <ButtonRetry onClick={() => setAttemptCounts((counts) => counts + 1)}>
              OK, coba lagi
            </ButtonRetry>
          </div>
        </ListBottomEnd>
      )}

      {!clubs?.length && !isLoadingClubs && <ListBottomEnd>Belum ada klub</ListBottomEnd>}
    </StyledListView>
  );
}

const StyledListView = styled.div`
  position: relative;

  /* card-like container */
  overflow: hidden;
  width: 100%;
  min-height: 320px;
  border-radius: 4px;
  border: 0px solid rgb(246, 246, 246);
  box-shadow: rgb(18 38 63 / 3%) 0px 0.75rem 1.5rem;
  background-color: #ffffff;
  background-clip: border-box;

  .button-wide {
    min-width: 120px;

    &:disabled:hover {
      box-shadow: none;
      cursor: default;
    }
  }

  .button-light {
    background-color: #eef3fe;
    border: solid 1px #eef3fe;
    color: var(--ma-blue);
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
  }

  color: var(--ma-blue);
  &:hover {
    text-decoration: underline;
    color: #2684ff;
  }
`;

const SearchNameInput = styled.input`
  padding: 0.47rem 0.75rem;
  width: 300px;
  border-radius: 4px;
  border: solid 1px var(--ma-gray-100);
  background-color: var(--ma-gray-100);
  transition: all 0.25s;

  &:focus {
    border-color: #2684ff;
    box-shadow: 0 0 0 1px #2684ff;
    background-color: var(--ma-gray-50);
  }
`;

function SelectParam({ name, placeholder, options, value, onChange, disabled }) {
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

const ListViewHeader = styled.div`
  padding: 1.5rem;
  display: flex;
  gap: 0.5rem;

  .filterbox-params {
    min-width: 600px;
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }
`;

const SuggestionBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1.25rem;

  &:hover {
    background-color: #eef3fe;
  }

  .suggestion-bar-content {
    padding-top: 8px;
  }
`;

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

const ButtonRetry = styled(Button)`
  background-color: #eef3fe;
  font-size: 0.75rem;
  color: var(--ma-blue);

  &:hover {
    border: solid 1px var(--ma-blue);
    background-color: var(--ma-blue);
    color: #ffffff;
  }
`;

// util
// eslint-disable-next-line no-unused-vars
function deDuplicateData(dirtyData) {
  const uniqueIds = new Set();
  return dirtyData.filter((club) => {
    return !uniqueIds.has(club.detail.id) && uniqueIds.add(club.detail.id);
  });
}

export { JoinClubDataListView };
