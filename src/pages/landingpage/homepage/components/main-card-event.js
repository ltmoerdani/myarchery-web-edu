import * as React from "react";
import styled from "styled-components";
import { CategoryService } from "services";

import classnames from "classnames";
import { datetime } from "utils";

function MainCardEvent({ eventDetail }) {
  const [loadingCategory, setLoadingCategory] = React.useState(false);

  const [category, setCategory] = React.useState([]);
  const [listCategory, setListCategory] = React.useState([]);
  const [selectClass, setSelectClass] = React.useState("");
  const [filteClass, setFilterClass] = React.useState({});
  const [selectAge, setSelectAge] = React.useState("");

  //

  React.useEffect(() => {
    const getCategoryEvent = async (id) => {
      const { data } = await CategoryService.getCategoryv2({ event_id: id });
      if (data) {
        setCategory(data);
        setLoadingCategory(true);
      }
    };

    getCategoryEvent(eventDetail?.id);
  }, [eventDetail?.id]);

  //

  React.useEffect(() => {
    const getListCategoryEvent = async (id) => {
      const { data } = await CategoryService.getCategoryv2({
        event_id: id,
        competition_category_id: selectClass ? selectClass : "",
      });
      if (data) {
        setListCategory(data);
        setLoadingCategory(true);
      }
    };

    getListCategoryEvent(eventDetail?.id);
  }, [eventDetail?.id]);

  //

  const dateEventStart = datetime.formatFullDateLabel(eventDetail?.eventStartDatetime);
  const dateEventEnd = datetime.formatFullDateLabel(eventDetail?.eventEndDatetime);

  //

  let classCategory = [];
  let classCategoryList = [];
  let firsArrayCategory = [];
  let firtsclassCategory = [];

  classCategory = selectClass ? [...new Set(classCategoryList)] : [...new Set(firtsclassCategory)];

  for (let i = 0; i < firsArrayCategory.length; i++) {
    firtsclassCategory[i] = firsArrayCategory[i].classCategory;
  }

  for (let i = 0; i < listCategory.length; i++) {
    classCategoryList[i] = listCategory[i].classCategory;
  }

  let arrCategory = [];

  for (let i = 0; i < category.length; i++) {
    arrCategory[i] = category[i].competitionCategoryId;
  }

  for (let i = 0; i < listCategory.length; i++) {
    if (listCategory[i].competitionCategoryId === arrCategory[0]) {
      firsArrayCategory.push(listCategory[i]);
    }
  }

  let categoryArr = [...new Set(arrCategory)];
  let arrData = !selectClass ? firsArrayCategory : listCategory;
  let computeData = [];
  let computeDataFirst = [];

  let arrAge = classCategory[0]?.split(" - ") || [];

  for (let i = 0; i < arrData.length; i++) {
    if (filteClass.age_category_id === arrData[i].ageCategoryId) {
      computeData.push(arrData[i]);
    }
    if (arrAge[0] === arrData[i].ageCategoryId) {
      computeDataFirst.push(arrData[i]);
    }
  }

  const screenLoading = () => {
    return (
      <div style={{ height: "50vh" }} className="d-flex justify-content-center align-items-center">
        <div className="spinner-grow" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  };

  const handleLoadCategory = () => {
    return <div>{screenLoading()}</div>;
  };

  const hanlderSplitString = (data) => {
    if (data) {
      let arr = data.split(" - ");
      let payload = { ...filteClass };
      payload["age_category_id"] = arr[0];
      payload["distance_id"] = arr[1];
      setFilterClass(payload);
    }
  };

  return (
    <ContentSheet>
      <VerticalSpaced>
        <div>
          <EventHeadingGroup>
            <div>
              <EventNameHeading>{eventDetail?.eventName}</EventNameHeading>
            </div>
            <div>
              <CompetitionTypeLabel>{eventDetail?.eventCompetition}</CompetitionTypeLabel>
            </div>
          </EventHeadingGroup>

          <SubHeadingInfo>
            <span>
              {eventDetail ? (
                <React.Fragment>
                  {dateEventStart} &ndash; {dateEventEnd}
                </React.Fragment>
              ) : (
                "tanggal tidak tersedia"
              )}
            </span>
            <span>|</span>
            <span>{eventDetail?.location}</span>
          </SubHeadingInfo>

          <div>oleh {eventDetail?.detailAdmin?.name}</div>
        </div>

        <CompetitionCategoryBar>
          <CompetitionCategoryItem
            onClick={() => {
              setSelectClass(categoryArr[0]);
              setSelectAge("");
              setFilterClass({});
            }}
            className={classnames({
              "filter-category-active": selectClass === "" || selectClass === categoryArr[0],
              "filter-category": selectClass !== "" && selectClass !== categoryArr[0],
            })}
          >
            {categoryArr[0]}
          </CompetitionCategoryItem>

          {["Recurve", "Nasional", "Barebow"].map((busur) => (
            <CompetitionCategoryItem
              key={busur}
              onClick={() => {
                setSelectAge("");
                setFilterClass({});
              }}
              className="filter-category"
            >
              {busur}
            </CompetitionCategoryItem>
          ))}
        </CompetitionCategoryBar>

        {!loadingCategory ? (
          handleLoadCategory()
        ) : (
          <AgeCategoryBar>
            <AgeCategoryItem
              onClick={() => {
                setSelectAge(classCategory[0]);
                hanlderSplitString(classCategory[0]);
              }}
              className="age-filter-active"
            >
              Umum - 50 Meter
            </AgeCategoryItem>

            {["U12 - 50 Meter"].map((age) => (
              <AgeCategoryItem
                key={age}
                onClick={() => {
                  setSelectAge(age);
                  hanlderSplitString(age);
                }}
                className={classnames("p-1 me-2", {
                  "age-filter-active": selectAge === age,
                  "age-filter": selectAge !== age,
                })}
              >
                {age}
              </AgeCategoryItem>
            ))}
          </AgeCategoryBar>
        )}

        <div>
          <QuotaHeading>Kuota Pertandingan</QuotaHeading>

          <div
            className="d-flex mt-2 justify-content-between"
            style={{ overflowX: "auto", gap: "5px" }}
          >
            {[1, 2, 3, 4].map((id) => (
              <div
                key={id}
                className="px-3 py-2"
                style={{
                  border: "1px solid #EEEEEE",
                  borderRadius: "5px",
                  textAlign: "center",
                }}
              >
                <div className="py-2 text-category">
                  <span>{"Label Kategori"}</span>
                </div>

                <div
                  className="py-1 px-2"
                  style={{ backgroundColor: "#AEDDC2", borderRadius: "25px" }}
                >
                  <span>Tersedia: {"10"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </VerticalSpaced>
    </ContentSheet>
  );
}

const ContentSheet = styled.div`
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.12);
  background-color: #ffffff;
  color: var(--ma-text-black);
`;

const VerticalSpaced = styled.div`
  > * + * {
    margin-top: 1.5rem;
  }
`;

const EventHeadingGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;

  > *:last-child {
    flex-shrink: 0;
  }
`;

const EventNameHeading = styled.h1`
  color: var(--ma-blue);
  font-size: 1.875rem;
  font-weight: 600;
`;

const CompetitionTypeLabel = styled.div`
  margin-top: 0.5rem;
  min-width: max-content;
  padding: 0.125rem 0.75rem;
  color: var(--ma-text-black);
  background-color: #ffcf70;
  border-radius: 1.5rem;
`;

const SubHeadingInfo = styled.div`
  font-size: 1.125rem;
  font-weight: 600;

  > * + * {
    margin-left: 0.625rem;
  }
`;

const CompetitionCategoryBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.75rem;

  padding: 0.75rem;
  background-color: var(--ma-primary-blue-50);
  border-radius: 0.5rem;
  font-size: 1.125rem;
`;

const CompetitionCategoryItem = styled.button`
  border: none;
  background-color: transparent;
  padding: 0;
  margin: 0;

  color: #90aad4;
  font-weight: 600;
  cursor: pointer;

  transition: all 0.5s;

  &.filter-category-active {
    border-bottom: 2px solid #ffb420;

    color: var(--ma-blue);
    font-weight: 600;
    cursor: pointer;

    transform: translateY(-0.25rem);
  }
`;

const AgeCategoryBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
`;

const AgeCategoryItem = styled.button`
  background-color: transparent;
  border: none;
  padding: 0.125rem 0.625rem;
  color: var(--ma-gray);
  font-size: 1.125rem;
  font-weight: 600;

  &.age-filter-active {
    border-radius: 0.5rem;
    border: 1px solid #ffb420;
    background-color: #fff8e9;
    color: #ffb420;
    font-size: 18px;
  }
`;

const QuotaHeading = styled.div`
  display: flex;
  justify-content: center;
  padding: 0.375rem;
  background-color: var(--ma-gray-50);

  color: var(--ma-blue);
  font-size: 1.125rem;
  font-weight: 600;
`;

export { MainCardEvent };
