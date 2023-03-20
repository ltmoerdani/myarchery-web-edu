import * as React from "react";

import deleteLogo from "../../../../assets/icons/delete_icon.png";
import styled from "styled-components";
import IconAddress from "components/ma/icons/mono/address";
import backLogo from "../../../../assets/icons/big-icon.png";
import warningIcon from "../../../../assets/icons/warning_icon.png";
import SweetAlert from "react-bootstrap-sweetalert";
import IconAlertTriangle from "components/ma/icons/mono/alert-triangle";

import { useEventDetail } from "pages/landingpage/homepage/hooks/event-detail";
import { Link, useHistory, useParams } from "react-router-dom";
import { useUserProfile } from "hooks/user-profile";
import { EventsService, GeneralService } from "services";
import { ButtonBlueOutline } from "components/ma";
import { ButtonBlue } from "components/ma";
import { SelectOption } from "../components/select-option";
import { SelectCity } from "../components/select-city";
import { TicketViewCard } from "./ticket-view-card";
import { FieldInputTextLigaJabar } from "../components/field-input-text-ligajabar";

function FormLigaJabarBeregu() {
  const { userProfile } = useUserProfile();
  const { slug } = useParams();
  const { data: eventDetail } = useEventDetail(slug);

  let history = useHistory();

  const [step, setStep] = React.useState(0)
  const [listTeams, setlistTeams] = React.useState([
    {
      category_id: '',
      count_team: '',
    }
  ])

  const [listCategory, setListCategory] = React.useState([])
  const [cityId, setCityId] = React.useState(null)

  const [error, setError] = React.useState(false)
  const [price, setPrice] = React.useState('')

  const handleChangeInput = (value, index, key) => {
    const tempArray = [...listTeams]
    if (!value.type) {
      tempArray[index][key] = value
      setlistTeams(tempArray)
    }
  }

  React.useEffect(() => {
  }, [listTeams])

  const handleRemoveData = (selectedParticipan) => {
    if(listTeams.length === 1) return

    setlistTeams(listTeams.filter(team => team !== selectedParticipan))
  }

  const [showAlert, setShowAlert] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const handleConfirm = () => {
    setShowAlert(false);
  };


  const handleSubmitForm = async () => {
    listTeams.map(team => (
      team.category_id.length === 0 ? setError(true) : null,
      team.count_team.length === 0 ? setError(true) : null
    ))

    cityId.length === 0 ? setError(true) : null

    await EventsService.addMemberKontingenTeam({
      "event_id": 79,
      "city_id": cityId,
      "list_teams": listTeams
    }).then((response) => {
      if (!response.success){
        setShowAlert(true)
        setMessage(response.message)
      }
      else
        setStep(1)
        setPrice(response.data.totalPrice)
    })

  }

  const handleAddTeam = () => {
    setlistTeams(
      [
        ...listTeams,
        {
          category_id: '',
          count_team: '',
        }
      ]
    )
  }


  React.useEffect(() => {
    const getCategory = async () => {
      const {data: lists} = await GeneralService.getListCategory({event_id: 79})
      let listCategory = lists.filter(filterCategory => filterCategory.categoryTeam === 'Team')
      setListCategory(listCategory.map(list => {
        return {
          value : list.id,
          label: list.labelCategory
        }
      }))
    }
    getCategory()
  }, [listTeams])

  return step ? <TicketViewCard onBack={() => setStep(0)} totalMembers={listTeams.length} totalPrice={price} /> : (<section>
      <Container>
        <div className="container">
          <div className="mt-3 row">
            <div className="col-md">
              <MainCardHeader>
                <img src={backLogo} onClick={() => history.goBack()} height={35} role="button" />
                <h3 className="mt-2">Pendaftaran Liga 1 Jawa Barat 2023</h3>
              </MainCardHeader>
            </div>
            <div className="col col-md-auto">
              <ButtonBlue as={Link} to={`/event-registration/regular/${eventDetail?.eventSlug}`}>Daftar Individu di Sini</ButtonBlue>
            </div>
          </div>
        </div>

        <div className="my-3">
          <div className="container bg-white justify-content-center px-4 py-3 rounded">
            <MainCardHeader>
              <WrappedIcon>
                <IconAddress />
              </WrappedIcon>
              <MainCardHeaderText>Kontingen</MainCardHeaderText>
            </MainCardHeader>
            <Rule />
            <div className="col-ld">
              <label>Pilih Kontingen</label>
              <SelectCity
                placeholder= "Pilih Kontingen"
                provinceId={32}
                onChange={({value}) => setCityId(value)}
              />
              {
                error&&cityId <= 0 ? <LabelError>Kontingen Harus Diisi</LabelError> : null
              }
            </div>
          </div>
        </div>

        {userProfile ? (
          <div className="my-3">
            <div className="container bg-white justify-content-center px-4 py-3 rounded">
              <MainCardHeader>
                <WrappedIcon>
                  <IconAddress />
                </WrappedIcon>
                <MainCardHeaderText>Detail Penanggung Jawab</MainCardHeaderText>
              </MainCardHeader>
              <Rule />
              <div className="row">
                <div className="col-lg">
                  <FieldInputTextLigaJabar
                    label="Nama"
                    placeholder="Masukkan nama penanggung jawab"
                    value={userProfile?.name}
                    disabled
                  />
                </div>
                <div className="col-lg">
                  <FieldInputTextLigaJabar
                    label="Nomor WhatsApp"
                    placeholder="Masukkan nomor whatsapp aktif"
                    value={userProfile?.phoneNumber}
                    disabled
                  />
                </div>
                <div className="col-lg">
                  <FieldInputTextLigaJabar
                    label="Email"
                    placeholder="Masukkan email"
                    value={userProfile?.email}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>Sedang memuat data pengguna...</div>
        )}

        <div className="my-3">
          <div className="container bg-white justify-content-center px-4 py-3 rounded">
            <MainCardHeader>
              <WrappedIcon>
                <IconAddress />
              </WrappedIcon>
              <MainCardHeaderText>Detail Peserta</MainCardHeaderText>
            </MainCardHeader>
            <Rule />
            <div className="container">
              <div className="row rounded px-3 pt-2 align-items-center" style={{ backgroundColor: '#F2F8FF' }}>
                <div className="col col-md-auto">
                  <img src={warningIcon} height={30} />
                </div>
                <div className="col-md">
                  <span className="py-2" style={{ fontWeight: 'bold' }}>Pendaftaran dapat dilakukan apabila sudah menyelesaikan pembayaran individu. <span style={{ fontWeight: 'normal' }}> Untuk pengisian data beregu, masukkan jumlah regu yang didaftarkan jika mengirim lebih dari 1 regu. Biaya pendaftaran beregu Putra/Putri (Rp350.000) dan Beregu Campuran (Rp250.000).</span></span>
                </div>
              </div>
            </div>

            {listTeams.map((team, index) => (
              <div className="row" key={index}>
                <div className="col-lg">
                  <div className="row mt-4">
                    <div className="col-lg">
                      <label>Kategori</label>
                      <SelectOption
                        options={listCategory}
                        placeholder="Input Data"
                        onChange={({value}) => handleChangeInput(value, index, "category_id")}
                      />
                      {
                        error&&team.category_id.length <= 0 ? <LabelError>Kategori Harus Diisi</LabelError> : null
                      }
                    </div>
                    <div className="col-lg">
                      <FieldInputTextLigaJabar
                        label="Jumlah Regu yang Didaftarkan"
                        placeholder="Jumlah Regu"
                        value={team.count_team}
                        onChange={(value) => handleChangeInput(value, index, "count_team")}
                      />
                      {
                        error&&team.count_team.length <= 0 ? <LabelError>Jumlah Regu Harus Diisi</LabelError> : null
                      }
                    </div>
                  </div>
                </div>
                <div className="col-auto d-flex align-items-center">
                  <img src={deleteLogo} role="button" height={16} onClick={() => handleRemoveData(team)} />
                </div>
              </div>
            ))}

            <div className="d-flex flex-row-reverse">
              <ButtonAdd>
                <ButtonBlueOutline onClick={handleAddTeam}>Tambah Peserta</ButtonBlueOutline>
              </ButtonAdd>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between px-4 my-3">
          <ButtonBlueOutline>Batalkan</ButtonBlueOutline>
          <ButtonBlue onClick={handleSubmitForm}>Kirim</ButtonBlue>
        </div>
        {showAlert ? (
          <ErrorMessage
            showAlert={showAlert}
            messageDescription={message}
            onConfirm={handleConfirm}
          />
        ) : null }
      </Container>
    </section>
  )
}

function ErrorMessage({ onConfirm, showAlert, messageDescription }) {

  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <React.Fragment>
      <SweetAlert
        show={showAlert}
        title=""
        custom
        btnSize="md"
        onConfirm={handleConfirm}
        style={{ padding: "1.25rem" }}
        customButtons={
          <ButtonBlue onClick={handleConfirm}>Cek Kembali</ButtonBlue>
        }
      >
        <p style={{ color: "var(--ma-orange-300)" }}>
          <IconAlertTriangle size="36" />
        </p>
        {messageDescription && <p>{messageDescription}</p>}

      </SweetAlert>
    </React.Fragment>
  );
}

export { FormLigaJabarBeregu };

const MainCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
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

const MainCardHeaderText = styled.h4`
  margin: 0;
`;

const Rule = styled.hr`
`;

const Container = styled.div`
  margin-right: 5rem;
  margin-left: 5rem;
`;

const ButtonAdd = styled.div`
  width: 8rem;
  margin-top: 1rem;
`;

const LabelError = styled.label`
  color: #E11900;
`;