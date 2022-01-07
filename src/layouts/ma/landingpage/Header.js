import * as React from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";


import ProfileMenu from "components/ma/TopNavBar";
import TopNavBarLanding from "components/ma/TopNavBarLanding";
import { getAuthenticationStore } from "store/slice/authentication";


import logoDark from "assets/images/myachery/myachery.png";
import logoLight from "assets/images/myachery/myachery.png";
import logoLightSvg from "assets/images/myachery/myachery.png";
import logo from "assets/images/myachery/myachery.png";



const Header = () => {
  let { isLoggedIn } = useSelector(getAuthenticationStore);
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
          {!isLoggedIn ? 
          <TopNavBarLanding />
          :
          <ProfileMenu />
        }


        </div>
      </header>
    </React.Fragment>
  );
};

export default withTranslation()(Header);
