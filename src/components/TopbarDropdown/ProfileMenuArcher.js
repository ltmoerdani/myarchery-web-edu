import React, { useEffect, useState } from "react";
//i18n
import { withTranslation } from "react-i18next";
// import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
// users
import user1 from "../../assets/images/users/avatar-man.png";
import { useDispatch } from "react-redux";
import * as AuthenticationStore from "store/slice/authentication";
import { ArcherService } from "services";

const ProfileMenuArcher = (props) => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);

  const dispatch = useDispatch();
  const [username, setusername] = useState("Admin");

  useEffect(() => {
    const getAuthUser = async () => {
      const { data, success } = await ArcherService.profile();
      if (success) {
        setusername(data.name);
        dispatch(AuthenticationStore.profile(data));
      }
      if (localStorage.getItem("authUser")) {
        if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
          const obj = JSON.parse(localStorage.getItem("authUser"));
          setusername(obj.displayName);
        } else if (
          process.env.REACT_APP_DEFAULTAUTH === "fake" ||
          process.env.REACT_APP_DEFAULTAUTH === "jwt"
        ) {
          const obj = JSON.parse(localStorage.getItem("authUser"));
          setusername(obj.username);
        }
      }
    };
    getAuthUser();
  }, [props.success]);

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item "
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
            className="rounded-circle header-profile-user"
            src={user1}
            alt="Header Avatar"
          />
          <span
            style={{ color: `${props.color ? props.color : "#ffffff"}` }}
            className="d-none d-xl-inline-block ms-2 me-1"
          >
            {username}
          </span>
          <i
            className="mdi mdi-chevron-down d-none d-xl-inline-block"
            style={{ color: `${props.color ? props.color : "#ffffff"}` }}
          />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag="a" href="/dashboard/profile">
            {" "}
            <i className="bx bx-user font-size-16 align-middle me-1" />
            {props.t("Profile")}{" "}
          </DropdownItem>

          <div className="dropdown-divider" />
          <a href="/logout" className="dropdown-item">
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
            <span>{props.t("Logout")}</span>
          </a>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default withTranslation()(ProfileMenuArcher);
