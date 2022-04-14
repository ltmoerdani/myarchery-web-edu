import * as React from "react";
import styled from "styled-components";

import IconFile from "components/ma/icons/mono/file";

import classnames from "classnames";
import { datetime } from "utils";

function DetailInTabs({ eventDetail, dataFAQ }) {
  const [selectedTab, setSelectedTab] = React.useState("desc");

  const dateEventStart = datetime.formatFullDateLabel(eventDetail?.eventStartDatetime);
  const dateEventEnd = datetime.formatFullDateLabel(eventDetail?.eventEndDatetime);

  const dataFAQShowOnly = dataFAQ?.filter((faqItem) => !faqItem.isHide);

  return (
    <div>
      <Tabs>
        <TabItem
          onClick={() => setSelectedTab("desc")}
          className={classnames({ "tab-active": selectedTab === "desc" })}
        >
          {selectedTab === "desc" && <IconFile size="20" />}
          <span>Deskripsi</span>
        </TabItem>

        <TabItem
          onClick={() => setSelectedTab("faq")}
          className={classnames({ "tab-active": selectedTab === "faq" })}
        >
          {selectedTab === "faq" && <IconFile size="20" />}
          <span>FAQ</span>
        </TabItem>
      </Tabs>

      <TabContent>
        <div>
          <ContentSheetHeader>
            <span>
              <IconFile size="20" />
            </span>
            <span>Deskripsi</span>
          </ContentSheetHeader>

          <ContentSheetBody className={classnames({ "tab-active": selectedTab === "desc" })}>
            <SectionContent>
              <SectionHeading>Deskripsi</SectionHeading>
              <DescriptionContent>{eventDetail?.description}</DescriptionContent>
            </SectionContent>

            <SectionContent>
              <SectionHeading>Waktu &amp; Tempat</SectionHeading>
              <table>
                <tbody>
                  <tr>
                    <td style={{ minWidth: 120 }}>Tanggal Event</td>
                    <td style={{ minWidth: "0.5rem" }}>:</td>
                    <td>
                      {eventDetail ? (
                        <React.Fragment>
                          {dateEventStart} &ndash; {dateEventEnd}
                        </React.Fragment>
                      ) : (
                        "tanggal tidak tersedia"
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td>Lokasi</td>
                    <td>:</td>
                    <td>{eventDetail?.location}</td>
                  </tr>

                  <tr>
                    <td>Kota</td>
                    <td>:</td>
                    <td>{eventDetail?.detailCity?.name}</td>
                  </tr>

                  <tr>
                    <td>Lapangan</td>
                    <td>:</td>
                    <td>{eventDetail?.locationType}</td>
                  </tr>
                </tbody>
              </table>
            </SectionContent>

            {Boolean(eventDetail?.moreInformation?.length) &&
              eventDetail?.moreInformation?.map((information) => {
                return (
                  <SectionContent key={information.id}>
                    <SectionHeading>{information?.title}</SectionHeading>
                    <DescriptionContent>{information?.description}</DescriptionContent>
                  </SectionContent>
                );
              })}
          </ContentSheetBody>
        </div>

        {dataFAQ ? (
          <div>
            <ContentSheetHeader>
              <span>
                <IconFile size="20" />
              </span>
              <span>FAQ</span>
            </ContentSheetHeader>

            <ContentSheetBody className={classnames({ "tab-active": selectedTab === "faq" })}>
              <SectionContent>
                <SectionHeading>FAQ</SectionHeading>

                {dataFAQShowOnly?.length ? (
                  <QuestionsList>
                    {dataFAQShowOnly.map((data) => (
                      <li key={data.id}>
                        <SectionContent>
                          <QuestionHeading>{data?.question}</QuestionHeading>
                          <AnswerContent>{data?.answer}</AnswerContent>
                        </SectionContent>
                      </li>
                    ))}
                  </QuestionsList>
                ) : (
                  <EmptyFAQ>Penyelengara tidak menyediakan FAQ.</EmptyFAQ>
                )}
              </SectionContent>
            </ContentSheetBody>
          </div>
        ) : (
          <div>Data FAQ belum tersedia.</div>
        )}
      </TabContent>
    </div>
  );
}

const Tabs = styled.div`
  display: none;

  @media (min-width: 562px) {
    display: flex;
    gap: 0.75rem;
  }
`;

const TabItem = styled.button`
  display: flex;
  gap: 0.75rem;
  align-items: center;

  min-width: 12.75rem;
  min-height: 3.25rem;
  padding: 1rem;
  border: none;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  background-color: #ffffff;

  text-align: left;
  color: var(--ma-blue);
  font-weight: 600;

  &.tab-active {
    background-color: var(--ma-blue);
    color: #ffffff;
  }
`;

const DescriptionContent = styled.p`
  white-space: pre-wrap;
`;

const TabContent = styled.div`
  > * + * {
    margin-top: 1.5rem;
  }

  @media (min-width: 562px) {
    > * + * {
      margin: 0;
    }
  }
`;

const ContentSheetHeader = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;

  padding: 1rem 1.5rem;
  padding-bottom: 0;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  background-color: #ffffff;

  color: var(--ma-gray-500);
  font-size: 0.875rem;
  font-weight: 600;

  @media (min-width: 562px) {
    display: none;
  }
`;

const ContentSheetBody = styled.div`
  padding: 2rem;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;

  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.12);
  background-color: #ffffff;
  color: var(--ma-text-black);

  > * + * {
    margin-top: 1.75rem;
  }

  @media (min-width: 562px) {
    display: none;
    border-top-right-radius: 0.5rem;

    &.tab-active {
      display: block;
    }
  }
`;

const SectionContent = styled.div`
  > * + * {
    margin-top: 0.5rem;
  }
`;

const SectionHeading = styled.h4`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--ma-txt-black);
`;

const EmptyFAQ = styled.div`
  color: var(--ma-gray-400);
`;

const QuestionHeading = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: var(--ma-txt-black);
`;

const AnswerContent = styled.p`
  margin-bottom: 0;
`;

const QuestionsList = styled.ol`
  counter-reset: question-number-counter;
  list-style: none;
  margin-top: 1.25rem;
  padding: 0;

  > * + * {
    margin-top: 1.25rem;
  }

  li {
    counter-increment: question-number-counter;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;

    &::before {
      content: counter(question-number-counter) ".";
      margin: 0;
      color: var(--ma-txt-black);
      font-size: 1rem;
      font-weight: 600;
      line-height: 1.2;
    }
  }
`;

export { DetailInTabs };
