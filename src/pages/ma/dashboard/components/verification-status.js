import * as React from "react";
import styled from "styled-components";
import { useUserProfile } from "hooks/user-profile";

import { Link } from "react-router-dom";

import icon from "assets/images/myachery/icon.svg";

function StatusVerifikasi({ verifyStatus, reasonRejected }) {
  const { userProfile } = useUserProfile();
  const hasAvatar = Boolean(userProfile?.avatar);

  // Memastikan nilai yang dicek integer
  verifyStatus = verifyStatus ? parseInt(verifyStatus) : verifyStatus;

  if (verifyStatus === 4) {
    return (
      <div className="my-4">
        <NotificationBannerContainer>
          <div>
            <span className="d-inline-block" style={{ width: "24px", height: "24px" }}>
              <img style={{ minWidth: "100%", minheight: "100%" }} src={icon} />
            </span>

            <span className="ms-2 fw-bold">
              Akun Anda belum terverifikasi. Silakan lengkapi data Anda.
            </span>
          </div>

          <div>
            <Link to="/dashboard/profile/verifikasi">Verifikasi Sekarang</Link>
          </div>
        </NotificationBannerContainer>
      </div>
    );
  }

  if (verifyStatus === 3) {
    return (
      <div className="my-4">
        <NotificationBannerContainer>
          <div>
            <span className="d-inline-block" style={{ width: "24px", height: "24px" }}>
              <img style={{ minWidth: "100%", minheight: "100%" }} src={icon} />
            </span>

            <span className="ms-2 fw-bold">Akun Anda sedang dalam proses verifikasi.</span>
          </div>

          <div>
            <Link to="/dashboard/profile/verifikasi">Halaman Verifikasi</Link>
          </div>
        </NotificationBannerContainer>
      </div>
    );
  }

  if (verifyStatus === 2) {
    return (
      <div className="my-4">
        <NotificationBannerWarningContainer>
          <div>
            <span className="d-inline-block" style={{ width: "24px", height: "24px" }}>
              <img style={{ minWidth: "100%", minheight: "100%" }} src={icon} />
            </span>

            {reasonRejected ? (
              <span className="ms-2 fw-bold">
                Proses verifikasi ditolak karena {reasonRejected}, silahkan ajukan lagi.
              </span>
            ) : (
              <span className="ms-2 fw-bold">Proses verifikasi ditolak, silahkan ajukan lagi.</span>
            )}
          </div>

          <div>
            <Link to="/dashboard/profile/verifikasi">Halaman Verifikasi</Link>
          </div>
        </NotificationBannerWarningContainer>
      </div>
    );
  }

  if (verifyStatus === 1 && !hasAvatar) {
    return (
      <div className="my-4">
        <NotificationBannerWarningContainer>
          <div>
            <span className="d-inline-block" style={{ width: "24px", height: "24px" }}>
              <img style={{ minWidth: "100%", minheight: "100%" }} src={icon} />
            </span>

            <span className="ms-2 ">
              Terdapat pembaharuan dalam ketentuan foto profil. Klik Halaman Verifikasi untuk
              informasi lebih lanjut.
            </span>
          </div>

          <div>
            <Link to="/dashboard/profile">Halaman Edit Profil</Link>
          </div>
        </NotificationBannerWarningContainer>
      </div>
    );
  }

  return null;
}

const NotificationBannerContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #f2f8ff;

  > *:nth-child(1) {
    flex-grow: 1;
  }

  > *:nth-child(2) {
    flex-shrink: 0;
  }
`;

const NotificationBannerWarningContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #fdf0ef;

  > *:nth-child(1) {
    flex-grow: 1;
  }

  > *:nth-child(2) {
    flex-shrink: 0;
  }
`;

export { StatusVerifikasi };
