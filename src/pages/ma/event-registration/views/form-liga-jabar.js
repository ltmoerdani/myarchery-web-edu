import * as React from "react";

import deleteLogo from "../../../../assets/icons/delete_icon.png";
import styled from "styled-components";
import IconAddress from "components/ma/icons/mono/address";
import backLogo from "../../../../assets/icons/big-icon.png";
import warningIcon from "../../../../assets/icons/warning_icon.png";
import uploadIcon from "../../../../assets/icons/upload_icon.png";

import { useHistory } from "react-router-dom";
import { useUserProfile } from "hooks/user-profile";
import { EventsService, GeneralService } from "services";
import { ButtonBlueOutline } from "components/ma";
import { ButtonBlue } from "components/ma";
import { SelectOption } from "../components/select-option";
import { SelectCity } from "../components/select-city";
import { FieldInputText } from "../components";
import { TicketViewCard } from "./ticket-view-card";

function FormLigaJabar() {
  const { userProfile } = useUserProfile();

  let history = useHistory();

  const [step, setStep] = React.useState(0)
  const [listMembers, setListMembers] = React.useState([
    {
      category_id: '',
      name: '',
      email: '',
      phone_number: '',
      gender: '',
      date_of_birth: '',
      binaan_later: null,
      ktp_kk: null,
    }
  ])

  const [listCategory, setListCategory] = React.useState([])
  const [cityId, setCityId] = React.useState(null)
  const fileRef = React.useRef(null)
  const fileRef2 = React.useRef(null)

  const [error, setError] = React.useState(false)

  const handleChangeInput = (value, index, key) => {
    const tempArray = [...listMembers]
    if (!value.type) {
      tempArray[index][key] = value
      setListMembers(tempArray)
    }
    else new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(value)
    }).then(data => {
      tempArray[index][key] = { name: value.name, base64: data}
      setListMembers(tempArray)
    })
  }

  React.useEffect(() => {
  }, [listMembers])

  const handleRemoveData = (selectedParticipan) => {
    if(listMembers.length === 1) return

    setListMembers(listMembers.filter(participan => participan !== selectedParticipan))
  }

  const checkEmail =  /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/
  const checkPhoneNumber = /^[+]?[(]?[0-9]{3}[)]?[-\s]?[0-9]{3}[-\s]?[0-9]{4,6}$/

  const handleSubmitForm = async () => {
    listMembers.map(member => (
      member.name.length === 0 ? setError(true) : null,
      member.email.length === 0 ? setError(true) : null,
      member.phone_number.length === 0 ? setError(true) : null,
      member.gender.length === 0 ? setError(true) : null,
      member.date_of_birth.length === 0 ? setError(true) : null,
      member.category_id.length === 0 ? setError(true) : null,
      member.ktp_kk === null ? setError(true) : null,
      member.binaan_later === 0 ? setError(true) : null,

      checkEmail.test(member.email) === false ? setError(true) : null,
      checkPhoneNumber.test(member.phone_number) === false ? setError(true) : null
    ))

    cityId.length === 0 ? setError(true) : null

    await EventsService.addMemberKontingenIndividu({
      "event_id": 79,
      "city_id": cityId,
      "responsible_name": userProfile.name,
      "responsible_phone_number": userProfile.phoneNumber,
      "responsible_email": userProfile.email,
      "list_members": listMembers.map(member => { return { ...member, binaan_later: member.binaan_later?.base64, ktp_kk: member.ktp_kk?.base64 } })
    }).then((response) => {
      if (!response.success) alert("Failed")
      else setStep(1)
    })
  }

  const handleAddParticipan = () => {
    setListMembers(
      [
        ...listMembers,
        {
          category_id: '',
          name: '',
          email: '',
          phone_number: '',
          gender: '',
          date_of_birth: '',
          binaan_later: null,
          ktp_kk: null,
        }
      ]
    )
  }


  React.useEffect(() => {
    const getCategory = async () => {
      const {data: lists} = await GeneralService.getListCategory({event_id: 79})
      const listCategoryIndividu = lists.filter(filterCategory => filterCategory.categoryTeam === 'Individual')
      setListCategory(listCategoryIndividu.map(list => {
        return {
          value : list.id,
          label: list.labelCategory
        }
      }))
    }
    getCategory()
  }, [])

  const gender = [
    {
      value: "male",
      label: "Laki-laki"
    },
    {
      value: "female",
      label: "Perempuan"
    },
  ]

  return step ? <TicketViewCard onBack={() => setStep(0)} totalMembers={listMembers.length}/> : (<section>
      <Container>
        <div className="mt-3 d-flex justify-content-between align-items-center">
          <MainCardHeader>
            <img src={backLogo} onClick={() => history.goBack()} height={40} role="button" />
            <h3 className="mt-2">Pendaftaran Liga 1 Jawa Barat 2023</h3>
          </MainCardHeader>
          <ButtonBlue>Daftar Beregu di Sini</ButtonBlue>
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
                <span className="py-2" style={{ marginLeft: '15px' }}>Silakan daftarkan peserta menggunakan form berikut. Anda dapat mendaftarkan peserta lebih dari satu kategori.<span style={{ fontWeight: 'bold' }}> Setiap peserta harus menggunakan email yang berbeda.</span> Untuk menambah peserta, klik “Tambah Peserta”. Atlet di bawah 17 tahun, silakan upload Kartu Keluarga / Akte Lahir.</span>
              </div>
            </div>
              {listMembers.map((participan, index) => (
                <div key={index}>
                  <div className="d-flex rounded col" style={{ gap: '16px'}}>
                    <div>
                      <FieldInputText
                      label="Nama"
                      value={participan.name}
                      onChange={(value) => handleChangeInput(value, index, "name")}
                      placeholder="Input Data"
                      />
                      {
                        error&&participan.name.length <= 0 ? <LabelError>Nama Harus Diisi</LabelError> : null
                      }
                    </div>
                    <div>
                      <FieldInputText
                      label="Email"
                      placeholder="Input Data"
                      value={participan.email}
                      onChange={(value) => handleChangeInput(value, index, "email")}
                      />
                      {
                        error&&participan.email.length <= 0 ? <LabelError>Email Harus Diisi</LabelError> : null ||
                        error&&checkEmail.test(participan.email) === false ? <LabelError>Format Email Salah</LabelError> : null
                      }
                    </div>
                    <div>
                      <FieldInputText
                      label="No WhatsApp"
                      placeholder="Input Data"
                      value={participan.phone_number}
                      onChange={(value) => handleChangeInput(value, index, "phone_number")}
                      />
                      {
                        error&&participan.phone_number.length <= 0 ? <LabelError>Nomer WA Harus Diisi</LabelError> : null ||
                        error&&checkPhoneNumber.test(participan.phone_number) === false  && participan.email.length >= 14 ? <LabelError>Format Nomor Salah</LabelError> : null
                      }
                    </div>
                    <ContentOption>
                      <label>Gender</label>
                      <SelectOption
                        placeholder="Input Data"
                        options={gender}
                        onChange={({value}) => handleChangeInput(value, index, "gender")}
                      />
                      {
                        error&&participan.gender.length <= 0 ? <LabelError>Gender Harus Diisi</LabelError> : null
                      }
                    </ContentOption>
                    <ContentOption>
                      <label>Tanggal Lahir</label>
                      <input
                        className="form-control"
                        type="date"
                        value={participan.date_of_birth}
                        onChange={(e) => handleChangeInput(e.target.value, index, "date_of_birth")}
                      />
                      {
                        error&&participan.date_of_birth.length <= 0 ? <LabelError>Tanggal Lahir Harus Diisi</LabelError> : null
                      }
                    </ContentOption>
                    <img src={deleteLogo} style={{ marginTop:'50px' }} role="button" height={16} onClick={() => handleRemoveData(participan)} />
                  </div>

                  <div className="d-flex rounded col" style={{ gap: '16px', marginRight: '25px'}}>
                    <CategoryOption>
                      <label>Kategori</label>
                      <SelectOption
                        options={listCategory}
                        placeholder="Input Data"
                        onChange={({value}) => handleChangeInput(value, index, "category_id")}
                      />
                      {
                        error&&participan.category_id.length <= 0 ? <LabelError>Kategori Harus Diisi</LabelError> : null
                      }
                    </CategoryOption>
                    <div style={{ width: '100%' }}>
                      <label>Upload KTP/KK</label>
                      <InputFile onClick={() => fileRef2.current.click()}>
                        <div className="d-flex justify-content-between">
                          <input
                            type="file"
                            ref={fileRef2}
                            onChange={(e) => handleChangeInput(e.target.files[0], index, "ktp_kk")}
                          />
                          <span>{participan.ktp_kk? participan.ktp_kk.name :"Input Data"}</span>
                          <img src={uploadIcon} height={15} />
                        </div>
                      </InputFile>
                      {
                        error&&participan.ktp_kk === null ? <LabelError>KTP/KK harus diisi</LabelError> : null
                      }
                    </div>
                    <div style={{ width: '100%' }}>
                      <label>Upload Surat Binaan</label>
                      <InputFile onClick={() => fileRef.current.click()}>
                        <div className="d-flex justify-content-between">
                          <input
                            type="file"
                            ref={fileRef}
                            onChange={(e) => handleChangeInput(e.target.files[0], index, "binaan_later")}
                          />
                          <span>{participan.binaan_later? participan.binaan_later.name :"Input Data"}</span>
                          <img src={uploadIcon} height={15} />
                        </div>
                      </InputFile>
                      {
                        error&&participan.binaan_later === null ? <LabelError>Surat Binaan Harus Diisi</LabelError> : null
                      }
                    </div>
                  </div>
                </div>
              ))}
            <div className="d-flex flex-row-reverse">
              <ButtonAdd>
                <ButtonBlueOutline onClick={handleAddParticipan} >Tambah Peserta</ButtonBlueOutline>
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

export { FormLigaJabar };

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

const ContentOption = styled.div`
  margin-top: 20px;
  width: 250px;
`;

const CategoryOption = styled.div`
  width: 100%;
`;

const ButtonAdd = styled.div`
  width: 8rem;
  margin-top: 1rem;
`;

const LabelError = styled.label`
  color: #E11900;
`;

const InputFile = styled.div`
  display: block;
  cursor: pointer;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-weight: 400;
  line-height: 1.5;
  color: #6a7187;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
`;