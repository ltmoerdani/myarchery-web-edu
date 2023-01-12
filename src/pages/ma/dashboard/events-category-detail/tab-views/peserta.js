import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import * as AuthStore from "store/slice/authentication";
import { EventsService } from "services";

import { Table } from "reactstrap";
import { LoadingScreen } from "components";
import { Button, ButtonBlue, ButtonOutlineBlue, AvatarDefault } from "components/ma";
import { AlertSubmitError } from "../../components/alert-submit-error";
import { AlertSubmitSuccess } from "../../components/alert-submit-success";
import { FieldSelectClub } from "pages/ma/event-registration/components";
import { SelectRadio } from "pages/ma/event-registration/components/select-radio";
import { Show } from "pages/ma/event-registration/components/show-when";

import SweetAlert from "react-bootstrap-sweetalert";
import illustrationAlert from "assets/images/events/Illustration.png";

import IconGender from "components/ma/icons/mono/gender";
import IconAge from "components/ma/icons/mono/age";
import IconMail from "components/ma/icons/mono/mail";
import IconInfo from "components/ma/icons/mono/info";
import IconBadgeVerified from "components/ma/icons/color/badge-verified";

import { parseISO, isBefore, subDays } from "date-fns";
import { ParticipantContext } from "context";
import { useParams } from "react-router-dom";

function TabPeserta({ eventState, participantMembersState }) {
  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);
  const { data: participantMembers, refetchParticipantMembers } = participantMembersState;
  const { data: event } = eventState;

  const isLoadingOrder = participantMembersState.status === "loading";
  const isUserParticipant = participantMembers.participant.userId === userProfile.id;

  const dayBefore = subDays(parseISO(event.publicInformation.eventStart), 1);
  // TODO: masih lepas syarat enable, kembalikan kapan-kapan...(?)
  const shouldAllowEdit = true || isBefore(new Date(), dayBefore);

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

function BackAlert({
  onCancel,
  onConfirm,
  messageDescription,
  buttonCancelLabel,
  showAlert,
}) {
  const handleCancel = () => {
    onCancel?.();
  };
  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <SweetAlert
      show={showAlert}
      title=""
      custom
      btnSize="md"
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      style={{ width: 800, padding: "35px 88px", borderRadius: "1.25rem" }}
      customButtons={
        <span className="d-flex justify-content-center" style={{ gap: "0.5rem", width: "100%" }}>
          <React.Fragment>
            <ButtonBlue onClick={handleCancel}>{buttonCancelLabel || "Kembali"}</ButtonBlue>
          </React.Fragment>
        </span>
      }
    >
      <IllustationBackAlert />
      {messageDescription && <p className="text-muted">{messageDescription}</p>}
    </SweetAlert>
  );
}

const IllustationBackAlert = styled.div`
  margin-bottom: 2rem;
  width: 100%;
  min-height: 188px;
  background-image: url(${illustrationAlert});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;


function ParticipantEditorIndividual({ participantMembers, shouldAllowEdit, refetch }) {
  const {editMode, setEditMode} = React.useContext(ParticipantContext)
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
        {/* <NoticeBar>
          Batas edit <strong>daftar peserta</strong> maksimal H-1 event dilaksanakan
        </NoticeBar> */}

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
  const { order_id } = useParams()
  const {selectedParticipans, setSelectedParticipans, editMode, setEditMode} = React.useContext(ParticipantContext)
  const [teamName, setTeamName] = React.useState(participantMembers.participant.teamName || "");
  const [teamSystem, setTeamSystem] = React.useState(null)
  const [showAlert, setShowAlert] = React.useState(false);
  const [{ club }, dispatchClub] = React.useReducer(clubPickerReducer, {
    club: transformClubDataForPicker(participantMembers.club),
  });
  const isByName = participantMembers.member.some(member => member.isSelectedForTeam)
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

  const handleSetParticipant = (id) => {
    if (selectedParticipans.includes(id)) setSelectedParticipans(selectedParticipans.filter(p_id => p_id !== id))
    else setSelectedParticipans([...selectedParticipans, id])
  }

  const handleClickSave = async () => {
    let category = participantMembers.eventCategoryDetail.genderCategory
    if (teamSystem === 1 && selectedParticipans.length < 3 && category !== 'mix'){
      setShowAlert(true);
      return
    }
    if (teamSystem === 1 && selectedParticipans.length < 2 || selectedParticipans.length >= 3 && category === 'mix'){
      setShowAlert(true);
      return
    }

    try {
      dispatchSubmitStatus({ status: "loading", errors: null });
      const members = selectedParticipans.map(participant => {
        return {
          "participant_id" : participant
        }
      })
      if (isByName && category === 'male' || category === 'mix' || category === 'female') await EventsService.addParticipantEntry({
        "is_entry_by_name": 0,
        "participant_team_id": order_id,
        members
      })
      await EventsService.addParticipantEntry({
        "is_entry_by_name": parseInt(teamSystem),
        "participant_team_id": order_id,
        members
      })
      setSelectedParticipans([]);
      setTeamSystem(null);
      const payload = makeSavePayoad(
        participantMembers.participant.participantId,
        form,
        teamName,
        club?.detail?.id
      );
      await EventsService.updateEventParticipantMembers(payload);

      dispatchSubmitStatus({ status: "success" });
      setEditMode({ isOpen: false, previousData: null });
      refetch();
    } catch (error) {
      dispatchSubmitStatus({ status: "error", errors: error });
    }
  }

  const handleCancel = () => {
    setShowAlert(false);
  };

  return (
    <React.Fragment>
      {isUserParticipant && (
        <EditToolbar>
          {/* <NoticeBar>
            Batas edit <strong>daftar peserta</strong> maksimal H-1 event dilaksanakan
          </NoticeBar> */}

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
                    setSelectedParticipans([]);
                    setTeamSystem(null);
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
            <FieldSelectClub
              value={club}
              onChange={(clubValue) => dispatchClub({ name: "club", payload: clubValue })}
            >
              Nama Klub
            </FieldSelectClub>
            <div className="display-name">Atur Sistem Tim Beregu untuk mengikuti pertandingan</div>
            <SelectRadio
              options={[
                { value: 0, label: "Gunakan sistem base three berdasarkan ranking" },
                { value: 1, label: "Gunakan sistem entry by name" },
              ]}
              value={teamSystem}
              onChange={e => setTeamSystem(parseInt(e))}
            />
            <Show></Show>
          </DisplayTeamClub>
        </TeamInfoEditor>
      ) : (
        <TeamInfoEditor>
          <DisplayTeamClub>
            <div>Nama Tim</div>
            <div className="display-value">
              {isByName ? 'Sistem Entry by Name' : 'Sistem Best Three berdasarkan ranking' || <React.Fragment>&mdash;</React.Fragment>}
            </div>
          </DisplayTeamClub>

          <DisplayTeamClub>
            <div>Nama Klub</div>
            <div className="display-value">
              {participantMembers.club?.name || <React.Fragment>&mdash;</React.Fragment>}
            </div>
          </DisplayTeamClub>
        </TeamInfoEditor>
      )}

      <div>
        {Boolean(participantMembers.member.length) &&
          participantMembers.member.map((participant, index) => (
            <ParticipantMemberInfo
              key={participant.id}
              participant={participant}
              title={`Peserta ${index + 1}`}
              showOption={teamSystem}
              onSelectParticipant={handleSetParticipant}
            />
          ))}
      </div>

      <LoadingScreen loading={submitStatus.status === "loading"} />
      <AlertSubmitError isError={submitStatus.status === "error"} errors={submitStatus.errors} />
      {showAlert ? (
        <BackAlert
          showAlert={showAlert}
          buttonCancelLabel={""}
          onCancel={handleCancel}
          messageDescription={
            <React.Fragment>
              Peserta beregu putra atau putri dengan sistem entry by
              <br />
              name harus terdiri dari 3 peserta.
            </React.Fragment>
          }
        />
      ):(
        <AlertSubmitSuccess isSuccess={submitStatus.status === "success"}>
          Data peserta berhasil disimpannn
        </AlertSubmitSuccess>
      )}
    </React.Fragment>
  );
}

const EditToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  > *:first-child {
    flex-grow: 1;
  }
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

const DisplayTeamClub = styled.div`
  flex: 1 1 0%;

  > .display-value {
    font-weight: 600;
  }
  > .display-name {
    margin-top: 0.8rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
`;

// eslint-disable-next-line no-unused-vars
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

function ParticipantMemberInfo({ participant, title = "Peserta", showOption, onSelectParticipant }) {
  const [isSelectedParticipant, setIsSelectedParticipant] =  useState(false)
  const {selectedParticipans, editMode} = React.useContext(ParticipantContext)

  useEffect(() => {
    setIsSelectedParticipant(selectedParticipans.includes(participant.participantId))
  }, [selectedParticipans])

  return (
    <ParticipantCard>
      <ParticipantHeadingLabel>{title}</ParticipantHeadingLabel>
      <ParticipanContent>
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
        <ToolbarActionButtons>
          {!!showOption && (!participant.isSelectedForTeam || editMode.isOpen) && (
            <ButtonOutlineBlue
              color={isSelectedParticipant ? "outline-red" : "outline-blue"}
              disabled={
                (!isSelectedParticipant && selectedParticipans.length >= 3)
                }
              onClick={() => onSelectParticipant(participant.participantId)}
            >
              {isSelectedParticipant ? "Batalkan sebagai peserta" : "Pilih sebagai peserta"}
            </ButtonOutlineBlue>
          )}
          {!!participant.isSelectedForTeam && !editMode.isOpen && (
            <ButtonOutlineBlue color="green">Terpilih sebagai peserta</ButtonOutlineBlue>
          )}
        </ToolbarActionButtons>
      </ParticipanContent>
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

const ParticipanContent = styled.div`
  display: flex;
  justify-content: space-between;
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
  if (!initialClubData?.id) {
    return null;
  }
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
