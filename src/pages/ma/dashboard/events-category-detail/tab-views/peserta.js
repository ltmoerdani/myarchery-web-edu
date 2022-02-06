import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import * as AuthStore from "store/slice/authentication";

import { Table } from "reactstrap";
import { ButtonOutlineBlue, AvatarDefault } from "components/ma";

import IconGender from "components/ma/icons/mono/gender";
import IconAge from "components/ma/icons/mono/age";
import IconMail from "components/ma/icons/mono/mail";
import IconInfo from "components/ma/icons/mono/info";
import IconBadgeVerified from "components/ma/icons/color/badge-verified";

function TabPeserta({ participantMembersState }) {
  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);
  const { data: participantMembers } = participantMembersState;

  const isLoadingOrder = participantMembersState.status === "loading";
  const isUserParticipant = participantMembers.participant.userId === userProfile.id;

  return (
    <PanelContainer>
      {!participantMembers && isLoadingOrder ? (
        <div>Sedang memuat data lomba...</div>
      ) : (
        participantMembers && (
          <React.Fragment>
            <Table responsive>
              <tbody>
                <tr>
                  <td width="200">Nama Pendaftar</td>
                  <td width="16">:</td>
                  <td>
                    <div>{participantMembers.participant.name}</div>
                  </td>
                </tr>

                <tr>
                  <td>Email</td>
                  <td width="16">:</td>
                  <td>
                    <div>{participantMembers.participant.email}</div>
                  </td>
                </tr>

                <tr>
                  <td>No. Telepon</td>
                  <td width="16">:</td>
                  <td>{participantMembers.participant.phoneNumber || <span>&ndash;</span>}</td>
                </tr>
              </tbody>
            </Table>

            {participantMembers.participant.type === "team" ? (
              <ParticipantEditorTeam
                participantMembers={participantMembers}
                isUserParticipant={isUserParticipant}
              />
            ) : (
              <ParticipantEditorIndividual participantMembers={participantMembers} />
            )}
          </React.Fragment>
        )
      )}
    </PanelContainer>
  );
}

const PanelContainer = styled.div`
  padding: 1.5rem;
  > * + * {
    margin-top: 2.25rem;
  }
`;

function ParticipantEditorIndividual({ participantMembers }) {
  return (
    <React.Fragment>
      <TeamInfoEditor>
        {participantMembers.club?.name && (
          <DisplayJumlahPeserta>
            <div>Nama Klub</div>
            <div className="display-value">{participantMembers.club.name}</div>
          </DisplayJumlahPeserta>
        )}
      </TeamInfoEditor>

      <div>
        {participantMembers.member.length && (
          <ParticipantMemberInfo participant={participantMembers.member[0]} />
        )}
      </div>
    </React.Fragment>
  );
}

function ParticipantEditorTeam({ participantMembers, isUserParticipant }) {
  return (
    <React.Fragment>
      <EditToolbar>
        <NoticeBar>
          Batas edit <strong>daftar peserta</strong> maksimal H-1 event dilaksanakan
        </NoticeBar>
        <div>{isUserParticipant && <ButtonOutlineBlue>Ubah Peserta</ButtonOutlineBlue>}</div>
      </EditToolbar>

      <TeamInfoEditor>
        <div>
          <label>Nama Tim</label>
          <input placeholder="Nama Tim" />
        </div>

        <div>
          <label>Nama Klub</label>
          <input placeholder="Nama Tim" />
        </div>

        <DisplayJumlahPeserta>
          <div>Jumlah Peserta</div>
          <div className="display-value">
            {participantMembers.member.length || <React.Fragment>&ndash;</React.Fragment>} dari 5
          </div>
        </DisplayJumlahPeserta>
      </TeamInfoEditor>

      <div>
        {participantMembers.member.length &&
          participantMembers.member.map((participant, index) => (
            <ParticipantMemberInfo
              key={participant.id}
              participant={participant}
              title={`Peserta ${index + 1}`}
            />
          ))}
      </div>
    </React.Fragment>
  );
}

const EditToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const TeamInfoEditor = styled.div`
  display: flex;
  gap: 1.75rem;
`;

const DisplayJumlahPeserta = styled.div`
  > .display-value {
    font-weight: 600;
  }
`;

function NoticeBar({ children }) {
  return (
    <StyledNoticeBar>
      <span>
        <IconInfo />
      </span>
      <span>{children}</span>
    </StyledNoticeBar>
  );
}

const StyledNoticeBar = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: var(--ma-blue-primary-50);
  color: var(--ma-blue);
`;

function ParticipantMemberInfo({ participant, title = "Peserta" }) {
  return (
    <ParticipantCard>
      <ParticipantHeadingLabel>{title}</ParticipantHeadingLabel>

      <ParticipantMediaObject>
        <MediaParticipantAvatar>
          <ParticipantAvatar>
            {participant.avatar ? (
              <img className="avatar-img" src={participant.avatar} />
            ) : (
              <AvatarDefault fullname={participant.name} />
            )}
          </ParticipantAvatar>
        </MediaParticipantAvatar>

        <MediaParticipantContent>
          <ParticipantName>
            <span>{participant.name}</span>
            <span>
              <IconBadgeVerified />
            </span>
          </ParticipantName>

          <LabelWithIcon icon={<IconMail size="20" />}>{participant.email}</LabelWithIcon>

          <RowedLabel>
            <LabelWithIcon icon={<IconGender size="20" />}>
              {(participant.gender === "male" && "Laki-laki") ||
                (participant.gender === "female" && "Perempuan")}
            </LabelWithIcon>

            <LabelWithIcon icon={<IconAge size="20" />}>{participant.age} Tahun</LabelWithIcon>
          </RowedLabel>
        </MediaParticipantContent>
      </ParticipantMediaObject>
    </ParticipantCard>
  );
}

const ParticipantCard = styled.div`
  margin-bottom: 2.5rem;
`;

const ParticipantHeadingLabel = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 0.25rem;
  background-color: var(--ma-blue-primary-50);
  font-size: 15px;
  font-weight: 600;
  text-transform: capitalize;
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

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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

const RowedLabel = styled.div`
  display: flex;
  gap: 1.5rem;
`;

function LabelWithIcon({ icon, children }) {
  return (
    <StyledLabelWithIcon>
      {icon && <span className="label-icon">{icon}</span>}
      <span>{children}</span>
    </StyledLabelWithIcon>
  );
}

const StyledLabelWithIcon = styled.p`
  margin: 0;
  margin-bottom: 0.5rem;
  color: var(--ma-gray-500);

  .label-icon {
    margin-right: 0.5rem;
  }
`;

export { TabPeserta };
