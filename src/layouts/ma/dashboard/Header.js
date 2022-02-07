import * as React from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import icon from "assets/images/myachery/icon.svg";

import ProfileMenu from "components/ma/TopNavBar";

import logoDark from "assets/images/myachery/myachery.png";
import logoLight from "assets/images/myachery/myachery.png";
import logoLightSvg from "assets/images/myachery/myachery.png";
import logo from "assets/images/myachery/myachery.png";
import { useSelector } from "react-redux";
import * as AuthStore from "store/slice/authentication";

const Header = () => {
  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);

  const statusVerifikasi = () => {
    if (userProfile?.verifyStatus == 4) {
      return (
        <div className="d-flex align-items-center p-2" style={{ backgroundColor: "#F2F8FF" }}>
          <div style={{ width: "24px", height: "24px" }}>
            <img width="100%" height="100%" src={icon} />
          </div>
          <div className="ms-2">
            <span style={{ fontWeight: "600" }}>
              Akun Anda belum terverifikasi. Silakan lengkapi data Anda.
            </span>
          </div>
          <div style={{ width: "60%" }}>
            <Link className="float-end" to="/dashboard/profile/verifikasi">
              <span>Verifikasi Sekarang</span>
            </Link>
          </div>
        </div>
      );
    }

    if (userProfile?.verifyStatus == 3) {
      return (
        <div className="d-flex align-items-center p-2" style={{ backgroundColor: "#F2F8FF" }}>
          <div style={{ width: "24px", height: "24px" }}>
            <img width="100%" height="100%" src={icon} />
          </div>
          <div className="ms-2">
            <span style={{ fontWeight: "600" }}>Akun Anda sedang dalam proses verifikasi.</span>
          </div>
          <div style={{ width: "70%" }}>
            <Link className="float-end" to="/dashboard/profile/verifikasi">
              <span>Halam Verifikasi</span>
            </Link>
          </div>
        </div>
      );
    }
  };
  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box">
              <Link to="/home" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logo} alt="" height="64" />
                </span>
                <span className="logo-lg">
                  <img src={logoDark} alt="" height="64" />
                </span>
              </Link>

              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logoLightSvg} alt="" height="64" />
                </span>
                <span className="logo-lg">
                  <img src={logoLight} alt="" height="64" />
                </span>
              </Link>
            </div>
          </div>

          <ProfileMenu />
        </div>
        <div>{statusVerifikasi()}</div>
      </header>
    </React.Fragment>
  );
};

export default withTranslation()(Header);
