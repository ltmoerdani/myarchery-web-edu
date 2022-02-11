import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import * as AuthStore from "store/slice/authentication";
import { EventsService } from "services";

import { Table } from "reactstrap";
import { LoadingScreen } from "components";
import { Button, ButtonBlue, ButtonOutlineBlue, AvatarDefault } from "components/ma";
import { AlertSubmitError } from "../../components/alert-submit-error";
import { AlertSubmitSuccess } from "../../components/alert-submit-success";
import {
  FieldSelectEmailMember,
  FieldSelectClub,
  FieldInputText,
} from "pages/ma/event-registration/components";

import IconGender from "components/ma/icons/mono/gender";
import IconAge from "components/ma/icons/mono/age";
import IconMail from "components/ma/icons/mono/mail";
import IconInfo from "components/ma/icons/mono/info";
import IconBadgeVerified from "components/ma/icons/color/badge-verified";

import { parseISO, isBefore, subDays } from "date-fns";

function TabPeserta({ eventState, participantMembersState }) {
  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);
  const { data: participantMembers, refetchParticipantMembers } = participantMembersState;
  const { data: event } = eventState;

  const isLoadingOrder = participantMembersState.status === "loading";
  const isUserParticipant = participantMembers.participant.userId === userProfile.id;

  const dayBefore = subDays(parseISO(event.publicInformation.eventStart), 1);
  const shouldAllowEdit = isBefore(new Date(), dayBefore);

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
                shouldAllowEdit={shouldAllowEdit}
                participantMembers={participantMembers}
                isUserParticipant={isUserParticipant}
                refetch={refetchParticipantMembers}
              />
            ) : (
              <ParticipantEditorIndividual
                shouldAllowEdit={shouldAllowEdit}
                participantMembers={participantMembers}
                refetch={refetchParticipantMembers}
              />
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

function ParticipantEditorIndividual({ participantMembers, shouldAllowEdit, refetch }) {
  const [editMode, setEditMode] = React.useState({ isOpen: false, previousData: null });
  const [{ club }, dispatchForm] = React.useReducer(clubPickerReducer, {
    club: transformClubDataForPicker(participantMembers.club),
  });
  const [submitStatus, dispatchSubmitStatus] = React.useReducer(
    (state, action) => ({ ...state, ...action }),
    { status: "idle", errors: null }
  );

  React.useEffect(() => {
    dispatchForm({ type: "RESET_FORM", payload: { club } });
  }, [participantMembers, club]);

  const handleClickSave = async () => {
    dispatchSubmitStatus({ status: "loading", errors: null });
    const payload = {
      participant_id: participantMembers.participant.participantId,
      club_id: club?.detail?.id || 0,
    };
    const result = await EventsService.updateEventParticipantMembers(payload);
    if (result.success) {
      dispatchSubmitStatus({ status: "success" });
      setEditMode({ isOpen: false, previousData: null });
      refetch();
    } else {
      dispatchSubmitStatus({ status: "error", errors: result.errors || result.message });
    }
  };

  return (
    <React.Fragment>
      <EditToolbar>
        <NoticeBar>
          Batas edit <strong>daftar peserta</strong> maksimal H-1 event dilaksanakan
        </NoticeBar>

        {shouldAllowEdit &&
          (editMode.isOpen ? (
            <ToolbarActionButtons>
              <Button
                onClick={() => {
                  dispatchForm({ type: "RESET_FORM", payload: editMode.previousData });
                  setEditMode({ isOpen: false, previousData: null });
                }}
              >
                Batal
              </Button>

              <ButtonBlue onClick={handleClickSave}>Simpan</ButtonBlue>
            </ToolbarActionButtons>
          ) : (
            <ToolbarActionButtons>
              <ButtonOutlineBlue
                onClick={() => setEditMode({ isOpen: true, previousData: { club } })}
              >
                Ubah Peserta
              </ButtonOutlineBlue>
            </ToolbarActionButtons>
          ))}
      </EditToolbar>

      {shouldAllowEdit && editMode.isOpen ? (
        <ShortFieldWrapper>
          <FieldSelectClub
            value={club || null}
            onChange={(clubValue) => dispatchForm({ name: "club", payload: clubValue })}
          >
            Nama Klub
          </FieldSelectClub>
        </ShortFieldWrapper>
      ) : (
        <TeamInfoEditor>
          {participantMembers.club?.name && (
            <DisplayTeamClub>
              <div>Nama Klub</div>
              <div className="display-value">{participantMembers.club.name}</div>
            </DisplayTeamClub>
          )}
        </TeamInfoEditor>
      )}

      <div>
        {Boolean(participantMembers.member.length) && (
          <ParticipantMemberInfo participant={participantMembers.member[0]} />
        )}
      </div>

      <LoadingScreen loading={submitStatus.status === "loading"} />
      <AlertSubmitError isError={submitStatus.status === "error"} errors={submitStatus.errors} />
      <AlertSubmitSuccess isSuccess={submitStatus.status === "success"}>
        Data peserta berhasil disimpan
      </AlertSubmitSuccess>
    </React.Fragment>
  );
}

function ParticipantEditorTeam({
  participantMembers,
  isUserParticipant,
  refetch,
  shouldAllowEdit,
}) {
  const [editMode, setEditMode] = React.useState({ isOpen: false, previousData: null });
  const [teamName, setTeamName] = React.useState(participantMembers.participant.teamName || "");
  const [{ club }, dispatchClub] = React.useReducer(clubPickerReducer, {
    club: transformClubDataForPicker(participantMembers.club),
  });
  const [form, dispatchForm] = React.useReducer(
    emailFormReducer,
    mapMembersToState(participantMembers.member)
  );
  const [submitStatus, dispatchSubmitStatus] = React.useReducer(
    (state, action) => ({ ...state, ...action }),
    { status: "idle", errors: null }
  );

  React.useEffect(() => {
    dispatchForm({ type: "RESET_FORM", payload: mapMembersToState(participantMembers.member) });
  }, [participantMembers]);

  React.useEffect(() => {
    setTeamName(participantMembers.participant.teamName || "");
  }, [participantMembers]);

  React.useEffect(() => {
    dispatchClub({ type: "RESET_FORM", payload: { club } });
  }, [participantMembers, club]);

  const handleClickSave = async () => {
    dispatchSubmitStatus({ status: "loading", errors: null });
    const payload = makeSavePayoad(
      participantMembers.participant.participantId,
      form,
      teamName,
      club?.detail?.id
    );
    const result = await EventsService.updateEventParticipantMembers(payload);
    if (result.success) {
      dispatchSubmitStatus({ status: "success" });
      setEditMode({ isOpen: false, previousData: null });
      refetch();
    } else {
      dispatchSubmitStatus({ status: "error", errors: result.errors || result.message });
    }
  };

  return (
    <React.Fragment>
      {isUserParticipant && (
        <EditToolbar>
          <NoticeBar>
            Batas edit <strong>daftar peserta</strong> maksimal H-1 event dilaksanakan
          </NoticeBar>

          {shouldAllowEdit &&
            (editMode.isOpen ? (
              <ToolbarActionButtons>
                <Button
                  onClick={() => {
                    dispatchForm({ type: "RESET_FORM", payload: editMode.previousData.form });
                    dispatchClub({
                      type: "RESET_FORM",
                      payload: { club: editMode.previousData.club },
                    });
                    setTeamName(editMode.previousData.teamName);
                    setEditMode({ isOpen: false, previousData: null });
                  }}
                >
                  Batal
                </Button>

                <ButtonBlue onClick={handleClickSave}>Simpan</ButtonBlue>
              </ToolbarActionButtons>
            ) : (
              <ToolbarActionButtons>
                <ButtonOutlineBlue
                  onClick={() => {
                    setEditMode({ isOpen: true, previousData: { form, club, teamName } });
                  }}
                >
                  Ubah Peserta
                </ButtonOutlineBlue>
              </ToolbarActionButtons>
            ))}
        </EditToolbar>
      )}

      {shouldAllowEdit && editMode.isOpen ? (
        <TeamInfoEditor>
          <DisplayTeamClub>
            <FieldInputText
              placeholder="Masukkan Nama Tim"
              value={teamName}
              onChange={(value) => setTeamName(value)}
            >
              Nama Tim
            </FieldInputText>
          </DisplayTeamClub>

          <DisplayTeamClub>
            <FieldSelectClub
              value={club}
              onChange={(clubValue) => dispatchClub({ name: "club", payload: clubValue })}
            >
              Nama Klub
            </FieldSelectClub>
          </DisplayTeamClub>
        </TeamInfoEditor>
      ) : (
        <TeamInfoEditor>
          <DisplayTeamClub>
            <div>Nama Tim</div>
            <div className="display-value">
              {participantMembers.participant.teamName || <React.Fragment>&mdash;</React.Fragment>}
            </div>
          </DisplayTeamClub>

          <DisplayTeamClub>
            <div>Nama Klub</div>
            <div className="display-value">
              {participantMembers.club.name || <React.Fragment>&mdash;</React.Fragment>}
            </div>
          </DisplayTeamClub>

          <DisplayJumlahPeserta>
            <div>Jumlah Peserta</div>
            <div className="display-value">
              {participantMembers.member.length || <React.Fragment>&ndash;</React.Fragment>} dari 5
            </div>
          </DisplayJumlahPeserta>
        </TeamInfoEditor>
      )}

      {shouldAllowEdit && editMode.isOpen ? (
        <EmailFieldsList
          form={form}
          dispatchForm={dispatchForm}
          formData={{
            category: { id: participantMembers.eventCategoryDetail.id },
            club: { detail: { id: participantMembers.club.id } },
          }}
        />
      ) : (
        <div>
          {Boolean(participantMembers.member.length) &&
            participantMembers.member.map((participant, index) => (
              <ParticipantMemberInfo
                key={participant.id}
                participant={participant}
                title={`Peserta ${index + 1}`}
              />
            ))}
        </div>
      )}

      <LoadingScreen loading={submitStatus.status === "loading"} />
      <AlertSubmitError isError={submitStatus.status === "error"} errors={submitStatus.errors} />
      <AlertSubmitSuccess isSuccess={submitStatus.status === "success"}>
        Data peserta berhasil disimpan
      </AlertSubmitSuccess>
    </React.Fragment>
  );
}

const EditToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const ToolbarActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
`;

const TeamInfoEditor = styled.div`
  display: flex;
  gap: 1.25rem;
`;

function EmailFieldsList({ form, dispatchForm, formData }) {
  const names = Object.keys(form);
  return (
    <GridInputEmailMember>
      {names.map((name, index) => (
        <FieldSelectEmailMember
          key={name}
          name={name}
          placeholder="Pilih email peserta"
          value={form[name] || null}
          formData={formData}
          onChange={(profile) => dispatchForm({ name: name, payload: profile })}
          // errors={formErrors[participant.name]}
        >
          Peserta {index + 1}
        </FieldSelectEmailMember>
      ))}
    </GridInputEmailMember>
  );
}

const GridInputEmailMember = styled.div`
  display: grid;
  gap: 0 1.25rem;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
`;

const DisplayTeamClub = styled.div`
  flex: 1 1 0%;

  > .display-value {
    font-weight: 600;
  }
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

const ShortFieldWrapper = styled.div`
  max-width: 30rem;
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

function transformClubDataForPicker(initialClubData) {
  return { detail: { name: initialClubData.name, id: initialClubData.id } };
}

function clubPickerReducer(state, action) {
  if (action.type === "RESET_FORM") {
    return { ...action.payload };
  }
  return { ...state, [action.name]: action.payload };
}

function emailFormReducer(state, action) {
  if (action.type === "RESET_FORM") {
    return { ...action.payload };
  }
  return { ...state, [action.name]: action.payload };
}

function mapMembersToState(participantMembers) {
  const state = {};
  for (let index = 0; index < 5; index++) {
    state[`member-email-${index + 1}`] = participantMembers[index];
  }
  return state;
}

function makeSavePayoad(participantId, membersForm, teamName, clubId) {
  const userIds = Object.keys(membersForm)
    .map((name) => membersForm[name]?.userId || membersForm[name]?.id) // nama key gak konsisten cok, cok
    .filter((id) => Boolean(id));

  return {
    participant_id: participantId,
    team_name: teamName,
    club_id: clubId,
    user_id: userIds,
  };
}

export { TabPeserta };
