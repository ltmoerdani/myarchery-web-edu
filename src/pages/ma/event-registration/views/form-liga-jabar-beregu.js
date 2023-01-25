import * as React from "react";

import deleteLogo from "../../../../assets/icons/delete_icon.png";
import styled from "styled-components";
import IconAddress from "components/ma/icons/mono/address";
import backLogo from "../../../../assets/icons/big-icon.png";
import warningIcon from "../../../../assets/icons/warning_icon.png";

import { useEventDetail } from "pages/landingpage/homepage/hooks/event-detail";
import { Link, useHistory, useParams } from "react-router-dom";
import { useUserProfile } from "hooks/user-profile";
import { EventsService, GeneralService } from "services";
import { ButtonBlueOutline } from "components/ma";
import { ButtonBlue } from "components/ma";
import { SelectOption } from "../components/select-option";
import { SelectCity } from "../components/select-city";
import { FieldInputText } from "../components";
import { TicketViewCard } from "./ticket-view-card";

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
      if (!response.success) alert("Failed")
      else setStep(1)
    })
  }

  const handleAddParticipan = () => {
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

  return step ? <TicketViewCard onBack={() => setStep(0)} totalMembers={listTeams.length}/> : (<section>
      <Container>
        <div className="mt-3 d-flex justify-content-between align-items-center">
          <MainCardHeader>
            <img src={backLogo} onClick={() => history.goBack()} height={40} role="button" />
            <h3 className="mt-2">Pendaftaran Liga 1 Jawa Barat 2023</h3>
          </MainCardHeader>
          <ButtonBlue as={Link} to={`/event-registration/regular/${eventDetail?.eventSlug}`}>Daftar Individu di Sini</ButtonBlue>
        </div>

        <div className="mt-3">
          <div className="d-flex justify-content-center bg-white px-4 py-3 row rounded">
            <MainCardHeader>
              <WrappedIcon>
                <IconAddress />
              </WrappedIcon>
              <MainCardHeaderText>Kontingen</MainCardHeaderText>
            </MainCardHeader>
            <Rule />
            <div className="mt-3">
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
          <div className="mt-3">
            <div className="d-flex justify-content-center bg-white px-4 py-3 row rounded">
              <div>
                <MainCardHeader>
                  <WrappedIcon>
                    <IconAddress />
                  </WrappedIcon>
                  <MainCardHeaderText>Detail Penanggung Jawab</MainCardHeaderText>
                </MainCardHeader>
              </div>
              <Rule />
                <div>
                  <div className="d-flex align-items-center col" style={{ gap: "16px" }}>
                    <div style={{ width: '100%' }}>
                      <FieldInputText
                      label="Nama"
                      placeholder="Masukkan nama penanggung jawab"
                      value={userProfile?.name}
                      disabled
                      />
                    </div>
                    <div style={{ width: '100%' }}>
                      <FieldInputText
                      label="Nomor WhatsApp"
                      placeholder="Masukkan nomor whatsapp aktif"
                      value={userProfile?.phoneNumber}
                      disabled
                      />
                    </div>
                    <div style={{ width: '100%' }}>
                      <FieldInputText
                      label="Email"
                      placeholder="Masukkan email"
                      value={userProfile?.email}
                      disabled
                      />
                    </div>
                  </div>
                </div>
            </div>
          </div>
        ) : (
          <div>Sedang memuat data pengguna...</div>
        )}

        <div className="my-3">
          <div className="d-flex justify-content-center bg-white px-4 py-3 row rounded">
            <MainCardHeader>
              <WrappedIcon>
                <IconAddress />
              </WrappedIcon>
              <MainCardHeaderText>Detail Peserta</MainCardHeaderText>
            </MainCardHeader>
            <Rule />
            <div>
              <div className="d-flex align-items-center col rounded px-3" style={{ backgroundColor: '#F2F8FF' }}>
                <img src={warningIcon} height={30} />
                <span className="py-2" style={{ marginLeft: '15px', fontWeight: 'bold' }}>Pendaftaran dapat dilakukan apabila sudah menyelesaikan pembayaran individu. <span style={{ fontWeight: 'normal' }}> Untuk pengisian data beregu, masukkan jumlah regu yang didaftarkan jika mengirim lebih dari 1 regu. Biaya pendaftaran beregu Putra/Putri (Rp350.000) dan Beregu Campuran (Rp250.000).</span></span>
              </div>
            </div>
            <div>

              {listTeams.map((team, index) => (
                <div className="d-flex rounded col" style={{ gap: '16px'}} key={index}>
                  <Box style={{marginTop: '20px'}}>
                    <label>Kategori</label>
                    <SelectOption
                      options={listCategory}
                      placeholder="Input Data"
                      onChange={({value}) => handleChangeInput(value, index, "category_id")}
                    />
                    {
                      error&&team.category_id.length <= 0 ? <LabelError>Kategori Harus Diisi</LabelError> : null
                    }
                  </Box>
                  <Box>
                    <FieldInputText
                      label="Jumlah Regu yang Didaftarkan"
                      placeholder="Jumlah Regu"
                      value={team.count_team}
                      onChange={(value) => handleChangeInput(value, index, "count_team")}
                    />
                    {
                      error&&team.count_team.length <= 0 ? <LabelError>Jumlah Regu Harus Diisi</LabelError> : null
                    }
                  </Box>
                  <img src={deleteLogo} style={{ marginTop:'35px' }} role="button" height={16} onClick={() => handleRemoveData(team)} />
                </div>
              ))}
            </div>
            <div className="d-flex flex-row-reverse">
              <ButtonAdd>
                <ButtonBlueOutline onClick={handleAddParticipan}>Tambah Peserta</ButtonBlueOutline>
              </ButtonAdd>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between my-3">
          <ButtonBlueOutline>Batalkan</ButtonBlueOutline>
          <ButtonBlue onClick={handleSubmitForm}>Kirim</ButtonBlue>
        </div>
      </Container>
    </section>
  )
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
  margin: 1rem;
`;

const Container = styled.div`
  margin-right: 5rem;
  margin-left: 5rem;
`;

const Box = styled.div`
  width: 100%;
`;

const ButtonAdd = styled.div`
  width: 8rem;
  margin-top: 1rem;
`;

const LabelError = styled.label`
  color: #E11900;
`;