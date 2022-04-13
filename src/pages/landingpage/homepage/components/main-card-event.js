import * as React from "react";
import { CategoryService } from "services";

import classnames from "classnames";
import { parseISO, format } from "date-fns";
import { id } from "date-fns/locale";

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

  const dateEventStart = eventDetail?.eventStartDatetime
    ? parseISO(eventDetail.eventStartDatetime)
    : "";
  const dateEventEnd = eventDetail?.eventEndDatetime ? parseISO(eventDetail.eventEndDatetime) : "";

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
    <div className="event-box">
      <div className="d-flex align-items-center">
        <span style={{ color: "#0D47A1", fontSize: "32px" }}>{eventDetail?.eventName}</span>

        <span
          className="p-1"
          style={{ color: "#000", backgroundColor: "#FFCF70", borderRadius: "25px" }}
        >
          {eventDetail?.eventCompetition}
        </span>
      </div>

      <div style={{ fontWeight: "600" }}>
        {eventDetail
          ? `${formatEventDate(dateEventStart)} - ${formatEventDate(dateEventEnd)}`
          : "tanggal tidak tersedia"}{" "}
        | {eventDetail?.location}
      </div>

      <div>oleh {eventDetail?.detailAdmin?.name}</div>

      <div>
        <div
          className="d-flex justify-content-center align-content-center py-3"
          style={{
            flexWrap: "wrap",
            gap: "28px",
            backgroundColor: "#E7EDF6",
            borderRadius: "5px",
            fontSize: "18px",
          }}
        >
          <span
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
          </span>

          {[2, 3, 4].map((id) => (
            <span
              key={id}
              onClick={() => {
                setSelectAge("");
                setFilterClass({});
              }}
            >
              Jenis Busur {id}
            </span>
          ))}
        </div>

        <div>
          {!loadingCategory ? (
            handleLoadCategory()
          ) : (
            <div className="d-flex justify-content-center my-4 w-100">
              <span
                onClick={() => {
                  setSelectAge(classCategory[0]);
                  hanlderSplitString(classCategory[0]);
                }}
                className="p-1 me-2 age-filter"
              >
                Label Umur 1
              </span>

              {[2, 3, 4].map((id) => (
                <span
                  key={id}
                  onClick={() => {
                    setSelectAge(id);
                    hanlderSplitString(id);
                  }}
                  className={classnames("p-1 me-2", {
                    "age-filter-active": selectAge === id,
                    "age-filter": selectAge !== id,
                  })}
                >
                  Label Umur {id}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="d-flex justify-content-center py-2" style={{ backgroundColor: "#F6F6F6" }}>
          <span style={{ color: "#0D47A1", fontSize: "18px" }}>Kuota Pertandingan</span>
        </div>

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
                <span>Tersedia: {"data.quota"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// util
function formatEventDate(date) {
  try {
    let dateObject = typeof date === "string" ? parseISO(date) : date;
    return format(dateObject, "d MMMM yyyy", { locale: id });
  } catch {
    return "Tanggal Invalid";
  }
}

export { MainCardEvent };
