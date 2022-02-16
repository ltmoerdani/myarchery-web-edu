import React, {useState} from "react";
import { Container } from "reactstrap";
import MetaTags from "react-meta-tags";
import { BreadcrumbDashboard } from "../../components/breadcrumb";
import styled from "styled-components";
import icon from "assets/images/myachery/icon.svg";

const VerifikasiResume = ({name, dateOfBirth, gender, photoID, selfieID, nik}) => {
  const [isOpenKTP, setIsOpenKTP] = useState(false);
  const [isOpenKK, setIsOpenKK] = useState(false);

  const toggleIsOpenKTP = () => {
    setIsOpenKTP(!isOpenKTP);
  };
  const toggleIsOpenKK = () => {
    setIsOpenKK(!isOpenKK);
  };

  const breadcrumpCurrentPageLabel = "Ajukan Data";
  return (
    <ProfileWrapper>
      <React.Fragment>
        <MetaTags>
          <title>Profil Archer Verifikasi | MyArchery.id</title>
        </MetaTags>
        <Container fluid>
          <BreadcrumbDashboard to="/dashboard">
            {breadcrumpCurrentPageLabel}
          </BreadcrumbDashboard>
          <div className="card-club-form">
            <span className="font-size-18" style={{ fontWeight: "600" }}>
              Resume Data Peserta
            </span>
            <div>
              <div
                className="d-flex align-items-center p-2 mt-3"
                style={{ backgroundColor: "#F2F8FF" }}
              >
                <div style={{ width: "24px", height: "24px" }}>
                  <img width="100%" height="100%" src={icon} />
                </div>
                <div className="ms-2">
                  <span style={{ fontWeight: "600" }}>
                    Foto profil, nomor handphone dan nama klub tetap dapat diubah setelah pengajuan
                    atau terverifikasi
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <table className="w-100">
                <tr>
                  <td className="py-2" style={{ width: "20%" }}>
                    Nama Lengkap
                  </td>
                  <td>:</td>
                  <td>{name}</td>
                </tr>
                <tr>
                  <td className="py-2">Tanggal Lahir</td>
                  <td>:</td>
                  <td>{dateOfBirth}</td>
                </tr>
                <tr>
                  <td className="py-2">Jenis Kelamin</td>
                  <td>:</td>
                  <td>{gender === 'male' ? "Pria" : "Wanita"}</td>
                </tr>
                <tr>
                  <td className="py-2">NIK</td>
                  <td>:</td>
                  <td>{nik}</td>
                </tr>
                <tr>
                  <td className="py-2">Foto KTP/KK</td>
                  <td>:</td>
                  <td className="w-100">
                    <div onClick={toggleIsOpenKTP} style={{ color: "#0D47A1", fontWeight: "600", cursor: 'pointer' }}>
                      Lihat
                    </div>
                  </td>
                </tr>
                {/* <tr>
                  <td className="py-2">Foto Selfie dengan KTP/KK</td>
                  <td>:</td>
                  <td className="w-100">
                    <div onClick={toggleIsOpenKK} style={{ color: "#0D47A1", fontWeight: "600", cursor: 'pointer' }}>
                      Lihat
                    </div>
                  </td>
                </tr> */}
              </table>
            </div>
          </div>
        </Container>
        <div>
          {isOpenKTP ? (
            <div
              onClick={toggleIsOpenKTP}
              style={{
                position: "fixed",
                top: "0",
                left: "0",
                height: "100vh",
                width: "100vw",
                backgroundColor: "rgba(0,0,0,0.7)",
                cursor: "pointer",
                zIndex: "100",
              }}
            >
              <img
                src={photoID}
                alt={"photo ID"}
                style={{
                  height: "50%",
                  width: "auto",
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%,-50%)",
                }}
              />
            </div>
          ) : null}
        </div>
        <div>
          {isOpenKK ? (
            <div
              onClick={toggleIsOpenKK}
              style={{
                position: "fixed",
                top: "0",
                left: "0",
                height: "100vh",
                width: "100vw",
                backgroundColor: "rgba(0,0,0,0.7)",
                cursor: "pointer",
                zIndex: "100",
              }}
            >
              <img
                src={selfieID}
                alt={"selfieID"}
                style={{
                  height: "50%",
                  width: "auto",
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%,-50%)",
                }}
              />
            </div>
          ) : null}
        </div>
      </React.Fragment>
    </ProfileWrapper>
  );
};

const ProfileWrapper = styled.div`
  margin: 40px 0;
  font-family: "Inter";

  .card-club-form {
    position: relative;

    padding: 2rem;
    border-radius: 4px;
    border: 0px solid rgb(246, 246, 246);
    box-shadow: rgb(18 38 63 / 3%) 0px 0.75rem 1.5rem;
    background-color: #ffffff;
    background-clip: border-box;

    .club-form-action {
      display: flex;
      justify-content: flex-end;
      margin-top: 1.5rem;

      .button-submit-create {
        padding-left: 2rem;
        padding-right: 2rem;
      }
    }
  }
`;

export default VerifikasiResume;
