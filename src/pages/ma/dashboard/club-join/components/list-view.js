import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
// import { ArcheryClubService } from "services";

import Select from "react-select";
import { Button, ButtonBlue, ButtonOutlineBlue } from "components/ma";
import { ClubList } from "./club-list";

import { MockClubService } from "./mock/api-club";

const FETCHING_LIMIT = 3;

/**
 * - First load, data list berisi semua klub yang ada di "page" pertama
 * - Setelah hit search & set filtering, data list berisi hasil search+filternya
 */
function JoinClubDataListView() {
  const [filterParams, setFilterParams] = React.useState({
    name: "",
    province: null,
    city: null,
  });
  const [clubs, setClubs] = React.useState(null);
  const [clubsFetchingErrors, setClubsFetchingErrors] = React.useState(null);
  const [isLoadingClubs, setLoadingClubs] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [isLastPage, setIsLastPage] = React.useState(false);
  const [shouldExpandError, setExpandError] = React.useState(false);
  const inputDOM = React.useRef(null);

  const fetchClubs = async (params) => {
    setLoadingClubs(true);
    setClubsFetchingErrors(null);

    let queryStrings = null;
    if (params) {
      queryStrings = {
        name: params.name || undefined,
        province: params.province || undefined,
        city: params.city || undefined,
      };
    }
    // TODO: pindah ke service yang asli kalau sudah selesai
    // const clubs = await ArcheryClubService.getUserClubs(queryStrings);
    const clubs = await MockClubService.getUserClubs(queryStrings);
    setLoadingClubs(false);

    if (clubs.success) {
      setClubs((previous) => {
        if (!previous) {
          return clubs.data;
        }
        return [...previous, ...clubs.data];
      });

      if (clubs.data.length < FETCHING_LIMIT) {
        setIsLastPage(true);
      } else {
        setCurrentPage((current) => current + 1);
      }
    } else {
      setClubsFetchingErrors({
        errors: clubs?.errors || {},
        message: clubs?.message || "Error tidak diketahui",
      });
    }
  };

  React.useEffect(() => {
    fetchClubs();
  }, []);

  const updateSearchFiltering = (param, value) => {
    setFilterParams((query) => ({
      ...query,
      [param]: value,
    }));
  };

  const handleResetFiltering = () => {
    if (!filterParams.name && !filterParams.province && !filterParams.city) {
      inputDOM.current.focus();
      return;
    }
    setFilterParams({ name: "", province: null, city: null });
    inputDOM.current.focus();

    if (currentPage > 0) {
      return;
    }
    setClubs(null);
    setCurrentPage(0);
    setIsLastPage(false);
    fetchClubs();
  };

  const handleSubmitSearch = () => {
    if (!filterParams.name && !filterParams.province && !filterParams.city) {
      inputDOM.current.focus();
      return;
    }
    setClubs(null);
    setCurrentPage(0);
    setIsLastPage(false);
    fetchClubs({
      name: filterParams.name,
      province: filterParams.province?.value,
      city: filterParams.city?.value,
    });
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
          options={[{ value: "Jawa Tengah", label: "Jawa Tengah" }]}
          value={filterParams.province}
          onChange={(value) => updateSearchFiltering("province", value)}
        />
        <SelectParam
          name="city"
          placeholder="Kota"
          options={[{ value: "Semarang", label: "Semarang" }]}
          value={filterParams.city}
          onChange={(value) => updateSearchFiltering("city", value)}
        />

        <ButtonBlue onClick={handleSubmitSearch}>Cari</ButtonBlue>
        {(filterParams.name || filterParams.province || filterParams.city) && (
          <ButtonLink onClick={handleResetFiltering}>Reset Filter</ButtonLink>
        )}
      </ListViewHeader>

      {clubs && (
        <React.Fragment>
          {false && (
            <SuggestionBar>
              <div className="suggestion-bar-content">
                Tambahkan{" "}
                <span style={{ color: "var(--ma-blue)" }}>&quot;{filterParams.name}&quot;</span>{" "}
                sebagai klub baru
              </div>

              <div className="suggestion-bar-actions">
                <ButtonOutlineBlue as={Link} to="/dashboard/clubs/new" className="button-wide">
                  Buat Klub
                </ButtonOutlineBlue>
              </div>
            </SuggestionBar>
          )}

          <ClubList clubs={clubs} />
        </React.Fragment>
      )}

      {isLoadingClubs ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: 80, padding: "1.25rem" }}
        >
          <h5>Sedang memuat data...</h5>
        </div>
      ) : (
        clubsFetchingErrors && (
          <React.Fragment>
            <div style={{ padding: "1.5rem" }}>
              <div className="p-5" style={{ backgroundColor: "var(--ma-gray-50)" }}>
                <h5>Gagal memuat data klub</h5>
                <button
                  className="border-0 px-2 py-1 mb-3 rounded-2"
                  style={{ backgroundColor: "var(--ma-gray-200)" }}
                  onClick={() => setExpandError((expanded) => !expanded)}
                >
                  detail
                </button>
                {shouldExpandError && (
                  <pre>{JSON.stringify(clubsFetchingErrors.message, null, 2)}</pre>
                )}
              </div>
            </div>
          </React.Fragment>
        )
      )}
      {!isLastPage ? (
        <button onClick={() => fetchClubs()}>
          &#40;Current page: {currentPage}&#41; Load More{" "}
        </button>
      ) : (
        <span>This is last page!</span>
      )}
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

function SelectParam({ name, placeholder, options, value, onChange }) {
  return (
    <Select
      styles={{ container: (provided) => ({ ...provided, minWidth: "240px" }) }}
      name={name}
      placeholder={placeholder}
      isClearable
      options={options}
      value={value}
      onChange={onChange}
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

export { JoinClubDataListView };
