import * as React from "react";
import styled from "styled-components";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toastr from "toastr";
import { ArcherService } from "services";
import * as AuthenticationStore from "store/slice/authentication";

import { AvField, AvForm } from "availity-reactstrap-validation";
import { Input } from "reactstrap";
import { DateInput } from "components";
import { ButtonBlue, LoadingScreen } from "components/ma";

import { errorsUtil } from "utils";

const LOGIN_ROUTE_DEFAULT = "/archer/login";
const LOGIN_ROUTE_WITH_REDIRECT_PARAM = LOGIN_ROUTE_DEFAULT + "?path=";

// ! Legacy, need refactoring...
function RegistrationForm() {
  const { isLoggedIn } = useSelector(AuthenticationStore.getAuthenticationStore);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get("path");

  const [gender, setGender] = React.useState("");
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [isSubmiting, setSubmiting] = React.useState(false);

  React.useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const path = location.state?.from?.pathname || redirectPath;

    if (!path) {
      history.push("/dashboard");
    } else {
      history.push(path);
    }
  }, [isLoggedIn]);

  const getValueRadio = (e) => setGender(e.target.value);
  const getValueDateOfBirth = (e) => setDateOfBirth(e.value);

  const handleValidSubmit = async (event, values) => {
    const payload = {
      ...values,
      gender: gender,
      date_of_birth: dateOfBirth,
    };

    setSubmiting(true);
    const result = await ArcherService.register(payload);

    setSubmiting(false);
    if (result.success) {
      if (result.data) {
        dispatch(AuthenticationStore.login(result.data));
        const verificationPageURL = "/archer/register-verification?email=" + values.email;
        history.push(verificationPageURL);
      }
    } else {
      _displayErrorToasts(result);
    }
  };

  return (
    <React.Fragment>
      <AvForm
        className="form-horizontal"
        onValidSubmit={(e, v) => {
          handleValidSubmit(e, v);
        }}
      >
        <FieldSpacer>
          <div>
            <AvField
              name="name"
              label="Nama Peserta"
              className="form-control"
              placeholder="Masukkan nama lengkap, contoh: Mahfuzon Akhiar"
              type="text"
              required
              errorMessage="Nama wajib diisi"
            />
            <FieldInstructionText>
              Masukkan nama peserta jika Anda mewakili peserta, atau masukkan nama Anda jika tidak
              mewakili siapa pun
            </FieldInstructionText>
          </div>

          <div>
            <DateInput
              name="date_of_birth"
              label="Tanggal Lahir"
              onChange={(e) => getValueDateOfBirth(e)}
            />
            <FieldInstructionText>
              Masukkan tanggal lahir dari nama yang didaftarkan pada kolom Nama Peserta
            </FieldInstructionText>
          </div>

          <div>
            <div style={{ marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "13px", fontWeight: "500" }}>Jenis Kelamin</span>
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
                  id="flexRadioDefault2"
                />

                <label
                  style={{ fontSize: "14px" }}
                  className="form-check-label ms-2 pt-1"
                  htmlFor="flexRadioDefault2"
                >
                  Wanita
                </label>
              </div>
            </div>
          </div>

          <div>
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

          <div>
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

          <div>
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
        </FieldSpacer>

        <div className="mt-3">
          <ButtonBlue block type="submit">
            Daftar
          </ButtonBlue>
        </div>

        <div className="mt-5 text-center">
          <p>
            Sudah punya akun?{" "}
            <TextLink
              to={
                redirectPath ? LOGIN_ROUTE_WITH_REDIRECT_PARAM + redirectPath : LOGIN_ROUTE_DEFAULT
              }
              className="fw-medium"
            >
              Masuk di sini
            </TextLink>
          </p>
        </div>
      </AvForm>

      <LoadingScreen loading={isSubmiting} />
    </React.Fragment>
  );
}

/* ======================================== */
// styles

const FieldSpacer = styled.div`
  > * + * {
    margin-top: 1rem;
  }
`;

const EnhancedField = styled(AvField)`
  &.form-control.is-invalid {
    background-image: none;
  }
`;

const TextLink = styled(Link)`
  color: var(--ma-blue);
`;

const FieldInstructionText = styled.div`
  margin-top: 0.375rem;
  color: var(--ma-gray-500);
  font-size: 90%;
`;

/* ======================================== */
// utils

function _displayErrorToasts(resultObject) {
  const errors = errorsUtil.interpretServerErrors(resultObject);
  const messages = _makeErrorMessageList(errors);
  for (const message of messages) {
    toastr.error(message);
  }
}

function _makeErrorMessageList(errors) {
  if (errors && typeof errors === "string") {
    return [errors];
  }

  if (errors) {
    const messages = [];
    for (const field in errors) {
      for (const message of errors[field]) {
        messages.push(message);
      }
    }

    if (messages.length) {
      return messages;
    }
  }

  return ["Error tidak diketahui."];
}

export { RegistrationForm };
