import * as React from "react";
import styled from "styled-components";

import { Table } from "reactstrap";
import { AvatarDefault } from "components/ma";
import { Show } from "../components/show-when";

import IconAddress from "components/ma/icons/mono/address";
import IconGender from "components/ma/icons/mono/gender";
import IconAge from "components/ma/icons/mono/age";
import IconMail from "components/ma/icons/mono/mail";
import IconBadgeVerified from "components/ma/icons/color/badge-verified";

import { checkIsIndividu } from "../utils";

function SummaryView({ userProfile, formOrder }) {
  const { data: formData } = formOrder;
  const { category, club, participants } = formData;

  const isCategoryIndividu = checkIsIndividu(category);
  const visibleParticipants = participants.filter((member) => Boolean(member.data));

  return (
    <React.Fragment>
      <ContentCard>
        <MainCardHeader>
          <WrappedIcon>
            <IconAddress />
          </WrappedIcon>
          <MainCardHeaderText>Detail Pendaftar</MainCardHeaderText>
        </MainCardHeader>

        {userProfile ? (
          <Table responsive className="mt-3">
            <tbody>
              <tr>
                <td>Nama Pendaftar</td>
                <td width="16">:</td>
                <td>
                  <div>{userProfile?.name}</div>
                </td>
              </tr>
              <tr>
                <td>Email</td>
                <td width="16">:</td>
                <td>
                  <div>{userProfile?.email}</div>
                </td>
              </tr>
              <tr>
                <td>No. Telepon</td>
                <td width="16">:</td>
                <td>{userProfile?.phoneNumber || <span>&ndash;</span>}</td>
              </tr>
            </tbody>
          </Table>
        ) : (
          <div>Sedang memuat data pengguna...</div>
        )}
      </ContentCard>

      <Show when={club}>
        <ContentCard>
          <SplitFields>
            <SplitFieldItem>
              <ClubDetailLabel>Nama Klub</ClubDetailLabel>
              <ClubDetailValue>{club?.detail.name}</ClubDetailValue>
            </SplitFieldItem>
          </SplitFields>
        </ContentCard>
      </Show>

      <Show when={isCategoryIndividu}>
        <ParticipantCard>
          <ParticipantHeadingLabel>Data Peserta</ParticipantHeadingLabel>

          <ParticipantMediaObject>
            <MediaParticipantAvatar>
              <ParticipantAvatar>
                {userProfile?.avatar ? (
                  <img className="club-logo-img" src={userProfile?.avatar} />
                ) : (
                  <AvatarDefault fullname={userProfile?.name} />
                )}
              </ParticipantAvatar>
            </MediaParticipantAvatar>

            <MediaParticipantContent>
              <ParticipantName>
                <span>{userProfile?.name}</span>
                <span>
                  <IconBadgeVerified />
                </span>
              </ParticipantName>

              <LabelWithIcon icon={<IconMail size="20" />}>{userProfile?.email}</LabelWithIcon>

              <RowedLabel>
                <LabelWithIcon icon={<IconGender size="20" />}>
                  {(userProfile?.gender === "male" && "Laki-laki") ||
                    (userProfile?.gender === "female" && "Perempuan")}
                </LabelWithIcon>

                <LabelWithIcon icon={<IconAge size="20" />}>{userProfile?.age} Tahun</LabelWithIcon>
              </RowedLabel>
            </MediaParticipantContent>
          </ParticipantMediaObject>
        </ParticipantCard>
      </Show>

      {visibleParticipants.map((participant) => (
        <ParticipantCard key={participant.name}>
          <ParticipantHeadingLabel>Data Peserta</ParticipantHeadingLabel>

          <ParticipantMediaObject>
            <MediaParticipantAvatar>
              <ParticipantAvatar>
                {participant.data.avatar ? (
                  <img className="club-logo-img" src={participant.data.avatar} />
                ) : (
                  <AvatarDefault fullname={participant.data.name} />
                )}
              </ParticipantAvatar>
            </MediaParticipantAvatar>

            <MediaParticipantContent>
              <ParticipantName>
                <span>{participant.data.name}</span>
                <span>
                  <IconBadgeVerified />
                </span>
              </ParticipantName>

              <LabelWithIcon icon={<IconMail size="20" />}>{participant.data.email}</LabelWithIcon>

              <RowedLabel>
                <LabelWithIcon icon={<IconGender size="20" />}>
                  {(participant.data.gender === "male" && "Laki-laki") ||
                    (participant.data.gender === "female" && "Perempuan")}
                </LabelWithIcon>

                <LabelWithIcon icon={<IconAge size="20" />}>
                  {participant.data.age} Tahun
                </LabelWithIcon>
              </RowedLabel>
            </MediaParticipantContent>
          </ParticipantMediaObject>
        </ParticipantCard>
      ))}
    </React.Fragment>
  );
}

function LabelWithIcon({ icon, children }) {
  return (
    <StyledLabelWithIcon>
      <Show when={icon}>
        <span className="label-icon">{icon}</span>
      </Show>

      <span>{children}</span>
    </StyledLabelWithIcon>
  );
}

/* =================================== */
// styles

const ContentCard = styled.div`
  margin-bottom: 1rem;
  padding: 1.5rem;
  padding-bottom: 2.5rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

const MainCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const MainCardHeaderText = styled.h4`
  margin: 0;
`;

const WrappedIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: solid 1px #c4c4c4;
`;

const SplitFields = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.375rem;
`;

const SplitFieldItem = styled.div`
  flex: 1 1 13.75rem;
`;

const ClubDetailLabel = styled.h6`
  font-size: 12px;
  font-weight: 400;
`;

const ClubDetailValue = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
`;

const ParticipantCard = styled.div`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

const ParticipantHeadingLabel = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 0.25rem;
  background-color: var(--ma-blue-primary-50);
  font-size: 15px;
  font-weight: 600;
`;

const ParticipantMediaObject = styled.div`
  margin: 1.25rem 0;
  display: flex;
  gap: 1.5rem;
`;

const MediaParticipantAvatar = styled.div`
  flex-grow: 0;
`;

const ParticipantAvatar = styled.div`
  overflow: hidden;
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
`;

const MediaParticipantContent = styled.div`
  margin: auto 0;
`;

const ParticipantName = styled.h5`
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
`;

const StyledLabelWithIcon = styled.p`
  margin: 0;
  margin-bottom: 0.5rem;
  color: var(--ma-gray-500);

  .label-icon {
    margin-right: 0.5rem;
  }
`;

const RowedLabel = styled.div`
  display: flex;
  gap: 1.5rem;
`;

export { SummaryView };
