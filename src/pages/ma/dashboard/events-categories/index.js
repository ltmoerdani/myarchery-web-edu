import React from "react";
import styled from "styled-components";
import { useParams, Link } from "react-router-dom";
import { OrderEventService } from "services";

import MetaTags from "react-meta-tags";
import CurrencyFormat from "react-currency-format";
import { Container } from "reactstrap";
import { ButtonBlue, ButtonOutline, ButtonOutlineBlue, ButtonRed } from "components/ma";
import { BreadcrumbDashboard } from "../components/breadcrumb";

import IconUsers from "components/ma/icons/mono/users";
import IconUser from "components/ma/icons/mono/user";

function PageEventCategories() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);

  const { event, eventCategories, categoriesState } = usePageData(eventId);

  const isLoadingEvents = categoriesState.status === "loading";
  const isErrorEvents = categoriesState.status === "error";

  const setSerieCategory = async (memberId, categoryId, status) => {
    const result = await OrderEventService.setSerieCategory({
      member_id: memberId,
      category_id: categoryId,
      status,
    });
    if (result.success) {
      window.location = "";
    }
  };

  return (
    <PageWrapper>
      <MetaTags>
        {event ? (
          <title>{event.eventName} | MyArchery.id</title>
        ) : (
          <title>Event Saya | MyArchery.id</title>
        )}
      </MetaTags>

      <Container fluid>
        <BreadcrumbDashboard to="/dashboard/events">
          {event?.publicInformation.eventName || "Event"}
        </BreadcrumbDashboard>

        {!eventCategories && isLoadingEvents ? (
          <div>Sedang mempersiapkan data kategori lomba Anda...</div>
        ) : isErrorEvents || !eventCategories ? (
          <div>Error mengambil data kategori lomba Anda.</div>
        ) : !eventCategories?.length ? (
          <div>Belum mengikuti kategori lomba</div>
        ) : (
          <EventsList>
            {eventCategories.map((eventCategory) => {
              return (
                <EventItem key={eventCategory.id}>
                  <ItemHeader>
                    {eventCategory.categoryType.toLowerCase() === "individual" && (
                      <TeamTypeLabel className="text-blue">
                        <span>
                          <IconUser />
                        </span>
                        <span>Individu</span>
                      </TeamTypeLabel>
                    )}
                    {eventCategory.categoryType.toLowerCase() === "team" && (
                      <TeamTypeLabel className="text-yellow">
                        <span>
                          <IconUsers />
                        </span>
                        <span>Tim</span>
                      </TeamTypeLabel>
                    )}

                    <InvoiceNo>{eventCategory.detailParticipant.orderId || ""}</InvoiceNo>
                  </ItemHeader>

                  <ItemMediaObject>
                    <div>
                      {event.publicInformation.eventBanner ? (
                        <PosterThumb>
                          <img src={event.publicInformation.eventBanner} />
                        </PosterThumb>
                      ) : (
                        <PosterThumb>&nbsp;</PosterThumb>
                      )}
                    </div>

                    <ItemContent>
                      <DetailBar>
                        <DetailCol>
                          <DetailItem>
                            <div>Kategori</div>
                            <DetailValue>
                              {eventCategory.competitionCategoryDetail.label}
                            </DetailValue>
                          </DetailItem>

                          <div>
                            <div>Detail Kategori</div>
                            <DetailValue>
                              <CategoryLabel category={eventCategory} />
                            </DetailValue>
                          </div>

                          {eventCategory.type === "team" && (
                            <div>
                              <div>Nama Tim</div>
                              <DetailValue>
                                {eventCategory.teamName || <React.Fragment>&mdash;</React.Fragment>}
                              </DetailValue>
                            </div>
                          )}
                        </DetailCol>

                        <DetailCol>
                          <DetailItem>
                            <div>Biaya Pendaftaran</div>
                            <DetailValue>
                              <TotalFee>{eventCategory?.fee || ""}</TotalFee>
                            </DetailValue>
                          </DetailItem>
                        </DetailCol>
                      </DetailBar>
                      {eventCategory?.haveSeries == 1 ? (
                        <div>
                          {eventCategory.canUpdateSeries == 1 &&
                          eventCategory.canJoinSeries == 1 &&
                          (eventCategory.joinSerieCategoryId == 0 ||
                            eventCategory.joinSerieCategoryId == eventCategory.id) ? (
                            eventCategory.joinSerieCategoryId == eventCategory.id ? (
                              <ButtonRed
                                onClick={() => {
                                  setSerieCategory(
                                    eventCategory.detailParticipant.memberId,
                                    eventCategory.id,
                                    0
                                  );
                                }}
                              >
                                batalkan sebagai pemeringkatan series
                              </ButtonRed>
                            ) : (
                              <ButtonOutlineBlue
                                onClick={() => {
                                  setSerieCategory(
                                    eventCategory.detailParticipant.memberId,
                                    eventCategory.id,
                                    1
                                  );
                                }}
                              >
                                pilih sebagai pemeringkatan series
                              </ButtonOutlineBlue>
                            )
                          ) : (
                            <ButtonOutline>
                              {eventCategory.joinSerieCategoryId == eventCategory.id
                                ? "pemeringkatan series dikuti"
                                : "pilih sebagai pemeringkatan series"}
                            </ButtonOutline>
                          )}
                          <br></br>
                          <label style={{ color: "red" }}>
                            {eventCategory.canJoinSeries != 1
                              ? "*domisili tidak memenuhi syarat untuk mengikuti pemeringkatan series"
                              : eventCategory.canUpdateSeries != 1
                              ? "*penentuan kategori untuk series sudah ditutup"
                              : eventCategory.joinSerieCategoryId != 0 &&
                                eventCategory.joinSerieCategoryId != eventCategory.id
                              ? "*hanya bisa memilih 1 kategori untuk pemeringkatan"
                              : ""}
                          </label>
                        </div>
                      ) : null}
                      <ItemFooter>
                        <StatusList></StatusList>

                        <ActionButtons>
                          <ButtonBlue
                            as={Link}
                            to={`/dashboard/events/${eventId}/category/${eventCategory.detailParticipant.idParticipant}`}
                          >
                            Lihat Detail
                          </ButtonBlue>
                        </ActionButtons>
                      </ItemFooter>
                    </ItemContent>
                  </ItemMediaObject>
                </EventItem>
              );
            })}
          </EventsList>
        )}
      </Container>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  margin: 40px 0;
  font-family: "Inter";
`;

const EventsList = styled.div`
  > * + * {
    margin-top: 1.25rem;
  }
`;

const EventItem = styled.div`
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TeamTypeLabel = styled.div`
  display: flex;
  justify-content: center;
  align-self: center;
  gap: 0.5rem;

  padding: 0.5rem;
  width: 9.75rem;
  border-bottom-right-radius: 40px;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);
  line-height: 1.75;
  font-weight: 600;
  text-transform: capitalize;

  &.text-blue {
    color: var(--ma-blue);
  }
  &.text-yellow {
    color: var(--ma-yellow);
  }
`;

const InvoiceNo = styled.div`
  padding: 1.25rem;
  padding-bottom: 0;
  color: var(--ma-gray-400);
  text-transform: uppercase;
`;

const ItemMediaObject = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1.25rem;
`;

const PosterThumb = styled.div`
  width: 12.25rem;
  height: 7.1875rem;
  border-radius: 0.75rem;
  overflow: hidden;
  background-color: var(--ma-gray-100);

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ItemContent = styled.div`
  flex: 1 1 360px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
`;

const DetailBar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  background-color: var(--ma-gray-100);
`;

const DetailCol = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 0.5rem 1.25rem;
`;

const DetailItem = styled.div`
  min-width: 6.25rem;
`;

const DetailValue = styled.div`
  font-weight: 600;
  text-transform: capitalize;
`;

const ItemFooter = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StatusList = styled.div`
  flex: 1 1 auto;
  color: var(--ma-gray-500);
`;

const ActionButtons = styled.div`
  flex: 1 1 auto;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 0.5rem;
`;

function usePageData(eventId) {
  const [categoriesState, dispatchCategoriesState] = React.useReducer(
    (state, action) => ({ ...state, ...action }),
    { status: "idle", data: null, errors: null }
  );

  React.useEffect(() => {
    const fetchMyEventCategoriesList = async () => {
      dispatchCategoriesState({ status: "loading", errors: null });
      const result = await OrderEventService.getEventCategoriesByAuthUser({ event_id: eventId });
      if (result.success) {
        dispatchCategoriesState({ status: "success", data: result.data });
      } else {
        dispatchCategoriesState({ status: "error", errors: result.errors });
      }
    };

    fetchMyEventCategoriesList();
  }, []);

  const { categoryDetail: eventCategories, eventDetail: event } = categoriesState.data || {};

  return {
    event,
    eventState: { status: categoriesState.status, errors: categoriesState.errors, data: event },
    eventCategories,
    categoriesState,
  };
}

function CategoryLabel({ category }) {
  if (category?.categoryLabel) {
    return category.categoryLabel;
  }

  const { ageCategoryDetail, competitionCategoryDetail, distanceDetail } = category || {};
  if (!ageCategoryDetail?.label || !competitionCategoryDetail?.label || !distanceDetail?.label) {
    return <React.Fragment>&mdash;</React.Fragment>;
  }

  return (
    <React.Fragment>
      {ageCategoryDetail.label} - {competitionCategoryDetail.label} - {distanceDetail.label}
    </React.Fragment>
  );
}

function TotalFee({ children }) {
  const feeNumber = children ? Number(children) : 0;
  return (
    <CurrencyFormat
      displayType={"text"}
      value={feeNumber}
      prefix="Rp&nbsp;"
      thousandSeparator={"."}
      decimalSeparator={","}
      decimalScale={2}
      fixedDecimalScale
    />
  );
}

export default PageEventCategories;
