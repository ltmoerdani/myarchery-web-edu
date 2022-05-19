import * as React from "react";
import styled from "styled-components";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArcherService } from "services";
import * as AuthenticationStore from "store/slice/authentication";

import { AvField, AvForm } from "availity-reactstrap-validation";
import { Input } from "reactstrap";
import { DateInput } from "components";
import { ButtonBlue } from "components/ma";

const LOGIN_ROUTE_DEFAULT = "/archer/login";
const LOGIN_ROUTE_WITH_REDIRECT_PARAM = "/archer/login?path=";

// ! Legacy, need refactoring...
function RegistrationForm() {
  const { isLoggedIn } = useSelector(AuthenticationStore.getAuthenticationStore);
  const dispatch = useDispatch();
  const history = useHistory();
  const { search } = useLocation();
  const redirectPath = new URLSearchParams(search).get("path");

  const [gender, setGender] = React.useState("");
  const [dateOfBirth, setDateOfBirth] = React.useState("");

  const handleValidSubmit = async (event, values) => {
    let payload = { ...values };
    payload["gender"] = gender;
    payload["date_of_birth"] = dateOfBirth;
    const { data, errors, success } = await ArcherService.register(payload);
    if (success) {
      if (data) {
        dispatch(AuthenticationStore.login(data));
      }
    } else {
      const err = Object.keys(errors).map((err) => err);

      if (err[0] == "email") {
        toastr.error(errors?.email[0]);
      }
      if (err[1] == "password" || err[0] == "password" || err[2] == "password") {
        toastr.error(errors?.password[0]);
      }
      if (err[1] == "gender" || err[0] == "gender") {
        toastr.error(errors?.gender[0]);
      }
    }
  };

  React.useEffect(() => {
    if (isLoggedIn) {
      path =
        props.location.state && props.location.state.from && props.location.state.from.pathname
          ? props.location.state.from.pathname
          : path;

      if (path == null) {
        history.push("/archer/dashboard");
      } else {
        history.push(path);
      }
    }
  }, [isLoggedIn]);

  const getValueRadio = (e) => setGender(e.target.value);
  const getValueDateOfBirth = (e) => setDateOfBirth(e.value);

  return (
    <AvForm
      className="form-horizontal"
      onValidSubmit={(e, v) => {
        handleValidSubmit(e, v);
      }}
    >
      <div className="mb-2">
        <AvField
          name="name"
          label="Nama Profile"
          className="form-control"
          placeholder="Masukkan nama profile"
          type="text"
          required
          errorMessage="Nama wajib diisi"
        />
      </div>

      <div className="mb-2">
        <DateInput
          name="date_of_birth"
          label="Tanggal Lahir"
          onChange={(e) => getValueDateOfBirth(e)}
        />
      </div>

      <div className="mb-2">
        <div style={{ marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "13px", fontWeight: "500" }}>Jenis kelamin</span>
        </div>

        <div className="d-flex">
          <div className="form-check ms-2">
            <Input
              required
              onChange={(e) => getValueRadio(e)}
              style={{ width: "22px", height: "22px", border: "1px solid #0D47A1" }}
              value="male"
              className="form-check-input"
              type="radio"
              name="gender"
              id="flexRadioDefault1"
            />

            <label
              style={{ fontSize: "14px" }}
              className="form-check-label ms-2 pt-1"
              htmlFor="flexRadioDefault1"
            >
              Pria
            </label>
          </div>

          <div className="form-check ms-5">
            <Input
              required
              onChange={(e) => getValueRadio(e)}
              style={{ width: "22px", height: "22px", border: "1px solid #0D47A1" }}
              value="female"
              className="form-check-input"
              type="radio"
              name="gender"
              id="flexRadioDefault1"
            />

            <label
              style={{ fontSize: "14px" }}
              className="form-check-label ms-2 pt-1"
              htmlFor="flexRadioDefault1"
            >
              Wanita
            </label>
          </div>
        </div>
      </div>

      <div className="mb-2">
        <AvField
          name="email"
          label="Email"
          className="form-control"
          placeholder="Masukkan email"
          type="email"
          required
          errorMessage="Email wajib diisi"
        />
      </div>

      <div className="mb-2">
        {/* TODO: pasang toggle show password */}
        <EnhancedField
          name="password"
          label="Kata Sandi"
          type="password"
          required
          placeholder="Masukkan kata sandi"
          errorMessage="Kata sandi wajib diisi"
        />
      </div>

      <div className="mb-2">
        {/* TODO: pasang toggle show password */}
        <EnhancedField
          name="password_confirmation"
          label="Konfirmasi Kata Sandi"
          type="password"
          required
          placeholder="Masukkan konfirmasi kata sandi"
          errorMessage="Konfirmasi kata sandi wajib diisi"
        />
      </div>

      <div className="mt-3">
        <ButtonBlue block type="submit">
          Daftar
        </ButtonBlue>
      </div>

      <div className="mt-5 text-center">
        <p>
          Sudah punya akun?{" "}
          <TextLink
            to={redirectPath ? LOGIN_ROUTE_WITH_REDIRECT_PARAM + redirectPath : LOGIN_ROUTE_DEFAULT}
            className="fw-medium"
          >
            Masuk di sini
          </TextLink>
        </p>
      </div>
    </AvForm>
  );
}

const EnhancedField = styled(AvField)`
  &.form-control.is-invalid {
    background-image: none;
  }
`;

const TextLink = styled(Link)`
  color: var(--ma-blue);
`;

export { RegistrationForm };
