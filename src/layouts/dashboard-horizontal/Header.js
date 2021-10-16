import React, { useState } from "react";
//i18n
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import logoDark from "../../assets/images/myachery/myachery.png";
import logoLight from "../../assets/images/myachery/myachery.png";
import logoLightSvg from "../../assets/images/myachery/myachery.png";
import logo from "../../assets/images/myachery/myachery.png";
// import NotificationDropdown from "../../components//TopbarDropdown/NotificationDropdown";
import ProfileMenu from "../../components//TopbarDropdown/ProfileMenu";
// Import menuDropdown
// import LanguageDropdown from "../../components/TopbarDropdown/LanguageDropdown";

const Header = props => {
  const [isSearch, setSearch] = useState(false);

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box">
              <Link to="/dashboard" className="logo logo-dark">
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

            <button
              type="button"
              className="btn btn-sm px-3 font-size-16 d-lg-none header-item"
              data-toggle="collapse"
              onClick={() => {
                props.openLeftMenuCallBack(!props.isMenuOpened);
              }}
              data-target="#topnav-menu-content"
            >
              <i className="fa fa-fw fa-bars" />
            </button>

            <form className="app-search d-none d-lg-block">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                />
                <span className="bx bx-search-alt" />
              </div>
            </form>
          </div>

          <div className="d-flex">
            <div className="dropdown d-inline-block d-lg-none ms-2">
              <button
                type="button"
                className="btn header-item noti-icon "
                id="page-header-search-dropdown"
                onClick={() => setSearch(!isSearch)}
              >
                <i className="mdi mdi-magnify" />
              </button>
              <div
                className={
                  isSearch
                    ? "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show"
                    : "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                }
                aria-labelledby="page-header-search-dropdown"
              >
                <form className="p-3">
                  <div className="form-group m-0">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={props.t("Search") + "..."}
                        aria-label="Recipient's username"
                      />
                      <div className="input-group-append">
                        <button className="btn btn-primary" type="submit">
                          <i className="mdi mdi-magnify" />
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* <LanguageDropdown /> */}

            {/* <NotificationDropdown /> */}

            <ProfileMenu />
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default withTranslation()(Header);
