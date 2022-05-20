import * as React from "react";
import styled from "styled-components";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArcherService } from "services";
import * as AuthenticationStore from "store/slice/authentication";

import { AvForm, AvGroup, AvField, AvInput, AvFeedback } from "availity-reactstrap-validation";
import SweetAlert from "react-bootstrap-sweetalert";
import { ButtonBlue } from "components/ma";

const REGISTER_ROUTE_DEFAULT = "/archer/register";
const REGISTER_ROUTE_WITH_REDIRECT_PARAM = REGISTER_ROUTE_DEFAULT + "?path=";

const LOGIN_ROUTE_DEFAULT = "/archer/login";
const LOGIN_ROUTE_WITH_REDIRECT_PARAM = LOGIN_ROUTE_DEFAULT + "?path=";

// ! Legacy, need refactoring...
function LoginForm() {
  const { isLoggedIn } = useSelector(AuthenticationStore.getAuthenticationStore);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get("path");

  const [loginErrors, setLoginErrors] = React.useState();
  const [showPassword, setShowPassword] = React.useState(false);
  const [faild, setFaild] = React.useState(false);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    // ! Legacy, need refactoring...
    const pathFrom = location.state?.from?.pathname || null;

    if (isLoggedIn) {
      if (!redirectPath) {
        if (!pathFrom) {
          history.push("/archer/dashboard");
        } else {
          history.push(pathFrom);
        }
      } else {
        history.push(redirectPath);
      }
    } else {
      if (pathFrom && redirectPath && redirectPath !== "/archer/logout") {
        history.push(LOGIN_ROUTE_WITH_REDIRECT_PARAM + pathFrom);
      }
    }
  }, [isLoggedIn]);

  const onFaildClikOk = () => setFaild(false);

  const handleValidSubmit = async (event, values) => {
    const { data, errors, message, success } = await ArcherService.login(values);
    if (success) {
      if (data) {
        dispatch(AuthenticationStore.login(data));
      }
    } else {
      setLoginErrors(errors);
      setMessage(message);
      setFaild(true);
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
        <div className="mb-3">
          <AvField
            name="email"
            label="Email"
            className="form-control"
            placeholder="Masukkan email"
            type="email"
            required
            errorMessage="Email wajib diisi"
          />
          {loginErrors?.email ? (
            <div className="validated-response">{loginErrors?.email.join(", ")}</div>
          ) : null}
        </div>

        <div className="mb-3 ">
          {/* TODO: Hapus nanti setelah semua ini beres */}
          <AvGroup>
            <span>
              <label htmlFor="password" className="me-2">
                Kata Sandi
              </label>
              <span onClick={() => setShowPassword(!showPassword)}>
                {!showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                    <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                  </svg>
                )}
              </span>
            </span>
            <AvInput
              name="password"
              id="password"
              required
              type={!showPassword ? "password" : "text"}
              placeholder="Masukkan Kata Sandi"
            />
            <AvFeedback>Kata sandi wajib diisi</AvFeedback>
          </AvGroup>
        </div>

        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="customControlInline" />
          <label
            className="form-check-label"
            htmlFor="customControlInline"
            style={{ lineHeight: "20px", fontSize: "14px" }}
          >
            Ingat Saya
          </label>
          <div className="float-end">
            <Link to="/archer/forgot-password">
              <span style={{ color: "#0D47A1", fontSize: "14px", lineHeight: "19.6px" }}>
                Lupa sandi
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-3">
          <ButtonBlue block type="submit">
            Masuk
          </ButtonBlue>
        </div>

        <div className="mt-4 text-center"></div>
        <div className="mt-5 text-center">
          <p>
            Belum punya akun?{" "}
            <TextLink
              to={
                redirectPath != null
                  ? REGISTER_ROUTE_WITH_REDIRECT_PARAM + redirectPath
                  : REGISTER_ROUTE_DEFAULT
              }
              className="fw-medium"
            >
              Daftar di sini
            </TextLink>
          </p>
        </div>
      </AvForm>

      <SweetAlert
        title=""
        show={faild}
        custom
        btnSize="md"
        reverseButtons={true}
        confirmBtnText="Ya"
        confirmBtnBsStyle="outline-primary"
        cancelBtnBsStyle="primary"
        onConfirm={onFaildClikOk}
        style={{ padding: "30px 40px" }}
      >
        <p className="text-muted">{message}</p>
      </SweetAlert>
    </React.Fragment>
  );
}

const TextLink = styled(Link)`
  color: var(--ma-blue);
`;

export { LoginForm };
