import React from "react";
//i18n
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import logolight from "../../assets/images/myachery/logo-myarchery.png";
import ProfileMenuArcher from "../../components//TopbarDropdown/ProfileMenuArcher";
import styled from "styled-components";

const Header = styled.header`
  background-color: #0d47a1;
`;

const HeaderForm = (props) => {
  return (
    <React.Fragment>
      <Header>
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box">
              <Link to="/dashboard" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logolight} alt="" height="55" />
                </span>
                <span className="logo-lg">
                  <img src={logolight} alt="" height="55" />
                </span>
              </Link>

              <Link to="/dashboard" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logolight} alt="" height="55" />
                </span>
                <span className="logo-lg">
                  <img src={logolight} alt="" height="55" />
                </span>
              </Link>
            </div>

            <button
              type="button"
              className="btn btn-sm px-3 font-size-16 d-lg-none header-item"
              data-toggle="collapse"
              onClick={() => {
                props.toggleLeftmenu(!props.leftMenu);
              }}
              data-target="#topnav-menu-content"
            >
              <i className="fa fa-fw fa-bars" />
            </button>
          </div>

          <div className="d-flex">
            <ProfileMenuArcher />
          </div>
        </div>
      </Header>
    </React.Fragment>
  );
};

export default withTranslation()(HeaderForm);
