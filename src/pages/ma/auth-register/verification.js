import * as React from "react";
import styled from "styled-components";
import { useLocation, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCountDown } from "./hooks/count-down";
import { useSubmitVerificationCode } from "./hooks/submit-verification-code";
import { useSubmitResendVerificationCode } from "./hooks/submit-resend-verification-code";
import * as AuthenticationStore from "store/slice/authentication";

import { Link } from "react-router-dom";
import OtpInput from "react-otp-input";
import {
  ButtonBlue,
  Button,
  LoadingScreen,
  AlertServerError,
  AlertSubmitSuccess,
} from "components/ma";
import { Show } from "../event-registration/components/show-when";
import { PageWrapper } from "./components/page-wrapper";

import { getUnixTime, fromUnixTime, isPast } from "date-fns";

import bgAbstractTop from "assets/images/auth/auth-illustration-abstract-top.png";
import bgAbstractBottom from "assets/images/auth/auth-illustration-abstract-bottom.png";
import bgIllustrationPeople from "assets/images/auth/auth-illustration-people.svg";
import imgMyArcheryLogoWhite from "assets/images/auth/auth-logo-myarchery-untrimmed.png";

const CODE_DIGITS_COUNT = 5;

function PageAuthRegisterVerification() {
  const { isLoggedIn } = useSelector(AuthenticationStore.getAuthenticationStore);
  const { search, pathname } = useLocation();
  const history = useHistory();
  const [code, setCode] = React.useState();
  const timestampAtFirstRender = React.useMemo(() => getUnixTime(new Date()), []);

  const qs = new URLSearchParams(search);

  const email = qs.get("email");
  const expiresAt = qs.get("expiresAt") || timestampAtFirstRender;
  const isInputValid = code?.toString?.().length === CODE_DIGITS_COUNT;
  const resendAllowed = React.useMemo(() => isPast(fromUnixTime(expiresAt)), [expiresAt]);

  const {
    submit,
    isLoading: isSubmiting,
    isError,
    errors,
  } = useSubmitVerificationCode({ email: email, code: code });

  const {
    submit: resendCode,
    isLoading: isResendingCode,
    isSuccess: isSuccessResendingCode,
    isError: isErrorResendingCode,
    errors: errorsResendingCode,
  } = useSubmitResendVerificationCode({ email: email });

  // Redirect ketika dia masih ter-auth sebagai user
  React.useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const path = location.state?.from?.pathname || "/dashboard";
    if (!path) {
      history.push("/dashboard");
    } else {
      history.push(path);
    }
  }, [isLoggedIn]);

  return (
    <PageWrapper pageTitle="Verifikasi Akun MyArchery">
      <SplitLayoutContainer>
        <ContainerLeft>
          <ContentFloating>
            <MyArcheryHeadlineLogo>
              <Link to="/">
                <img src={imgMyArcheryLogoWhite} alt="MyArchery Logo White" />
              </Link>
            </MyArcheryHeadlineLogo>

            <MainContent>
              <MyArcheryName>MyArchery</MyArcheryName>
              <HeadlineDescription>
                Buat akun Anda sekarang. Temukan dan ikuti berbagai macam event panahan di
                MyArchery.
              </HeadlineDescription>
            </MainContent>
          </ContentFloating>
        </ContainerLeft>

        <ContainerRight>
          <Show when={!email}>
            <ScreenInvalidEmail />
          </Show>

          <Show when={email}>
            <FormAreaContainer>
              <div>
                <FormAreaHeading>Masukkan Kode</FormAreaHeading>
                <FormAreaDescription>Kode telah dikirimkan ke email {email}</FormAreaDescription>
              </div>

              <div>
                <InputOTPCode value={code} onChange={setCode} />
              </div>

              <SplitSides>
                <div>
                  <ButtonResendCode
                    disabled={!resendAllowed}
                    onClick={() => {
                      resendCode({
                        onSuccess: (data) => {
                          const qs = new URLSearchParams(search);
                          data.timeVerified && qs.set("expiresAt", data.timeVerified);
                          history.replace(pathname + "?" + qs.toString());
                        },
                      });
                    }}
                  />
                </div>
                <div>
                  <TextCountDown expiresAt={expiresAt} />
                </div>
              </SplitSides>

              <ButtonListVertical>
                <ButtonBlue
                  block
                  onClick={() =>
                    submit({
                      onSuccess: () => history.push("/archer/register-success"),
                    })
                  }
                  disabled={!isInputValid}
                >
                  Verifikasi
                </ButtonBlue>
                <Button block as={Link} to="/home">
                  Batal
                </Button>
              </ButtonListVertical>

              <LoadingScreen loading={isSubmiting || isResendingCode} />
              <AlertServerError isError={isError} errors={errors} />
              <AlertServerError isError={isErrorResendingCode} errors={errorsResendingCode} />
              <AlertSubmitSuccess isSuccess={isSuccessResendingCode}>
                Kode telah dikirimkan ulang ke email {email}.<br />
                Silakan periksa inbox serta folder spam.
              </AlertSubmitSuccess>
            </FormAreaContainer>
          </Show>
        </ContainerRight>
      </SplitLayoutContainer>
    </PageWrapper>
  );
}

function ScreenInvalidEmail() {
  return (
    <FormAreaContainer>
      <div>
        <FormAreaHeading>Email tidak valid</FormAreaHeading>
      </div>

      <div>
        <p>
          Ke halaman{" "}
          <TextLink to="/archer/login" className="fw-medium">
            login
          </TextLink>{" "}
          atau{" "}
          <TextLink to="/archer/register" className="fw-medium">
            buat akun
          </TextLink>
          .
        </p>
      </div>
    </FormAreaContainer>
  );
}

function InputOTPCode({ value, onChange }) {
  return (
    <InputOTPWrapper>
      <OtpInput
        value={value}
        onChange={onChange}
        numInputs={5}
        shouldAutoFocus
        containerStyle="otp-container"
        inputStyle="otp-input-field"
      />
    </InputOTPWrapper>
  );
}

function ButtonResendCode({ label = "Kirim ulang kode", disabled, onClick }) {
  if (disabled) {
    return (
      <ResendDisabled title="Permintaan kirim ulang kode dapat dilakukan bila kode telah expired">
        {label}
      </ResendDisabled>
    );
  }
  return (
    <ResendLink
      href="#"
      onClick={(ev) => {
        ev.preventDefault();
        onClick?.();
      }}
    >
      {label}
    </ResendLink>
  );
}

function TextCountDown({ expiresAt, onTimeout }) {
  const duration = useCountDown({ endTimestamp: expiresAt, onTimeout: onTimeout });
  return <span>{_formatTimer(duration)}</span>;
}

/* =============================== */
// styles

const SplitLayoutContainer = styled.div`
  @media (min-width: 960px) {
    display: flex;
    flex-direction: row;
    min-height: 100vh;
  }
`;

const ContainerLeft = styled.div`
  flex: 1 0 0;
  background-color: var(--ma-blue);
  color: #ffffff;

  background-image: url(${bgIllustrationPeople}), url(${bgAbstractBottom}), url(${bgAbstractTop});
  background-repeat: no-repeat, no-repeat, no-repeat;
  background-position: bottom right, bottom left, top right;
  background-size: contain, auto, auto;

  @media (min-width: 600px) {
    background-size: auto, auto, auto;
  }
`;

const ContainerRight = styled.div`
  flex: 1 0 0;
  background-color: #ffffff;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentFloating = styled.div`
  padding: 1rem 1.5rem;
  background-color: rgba(13, 71, 161, 0.9);

  @media (min-width: 600px) {
    padding-bottom: 2rem;
  }

  @media (min-width: 960px) {
    padding: 0;
    margin: 2rem auto;
    width: min-content;
    background-color: transparent;

    > * + * {
      margin-top: 6.5rem;
    }
  }

  @media (min-width: 1440px) {
    margin: 2rem 6.5rem;
  }
`;

const MyArcheryHeadlineLogo = styled.div`
  height: 4rem;
  text-align: center;

  img {
    max-height: 100%;
    object-fit: cover;
  }

  @media (min-width: 960px) {
    height: fit-content;
    text-align: left;
  }
`;

const MainContent = styled.div`
  margin-left: auto;
  margin-right: auto;
  text-align: center;

  @media (min-width: 600px) {
    max-width: min-content;
    padding-bottom: 2rem;

    position: relative;
    z-index: 0;

    &::before,
    &::after {
      content: " ";
      position: absolute;
      z-index: -1;
      bottom: 0;
      left: 0;

      display: block;
      background-color: #ffffff;
      height: 3px;
    }

    &::before {
      width: 100%;
      margin-bottom: 1rem;
    }

    &::after {
      left: 30%;
      right: 30%;
    }
  }

  @media (min-width: 960px) {
    text-align: left;

    &::after {
      left: 0;
      width: 40%;
    }
  }
`;

const MyArcheryName = styled.h1`
  color: var(--ma-secondary);
  font-size: 2rem;
  font-weight: 800;
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: 0.09em;

  @media (min-width: 600px) {
    font-size: 4rem;
  }
`;

const HeadlineDescription = styled.p`
  font-size: 1rem;

  @media (min-width: 600px) {
    font-size: 1.125rem;
  }

  @media (min-width: 960px) {
    font-size: 1.25rem;
  }
`;

const FormAreaContainer = styled.div`
  flex-grow: 1;
  max-width: 25rem;
  margin: 2rem 1rem;
  text-align: center;

  > * + * {
    margin-top: 2.25rem;
  }

  @media (min-width: 600px) {
    margin: 4rem 1rem;
  }

  @media (min-width: 960px) {
    margin: 0;
    padding-top: 4rem;
    padding-bottom: 2rem;
  }
`;

const FormAreaHeading = styled.h2`
  color: var(--ma-blue);
  font-size: 2rem;
  font-weight: 600;
`;

const FormAreaDescription = styled.p`
  color: var(--ma-gray-600);
  font-size: 1rem;

  @media (min-width: 600px) {
    font-size: 1.125rem;
  }

  @media (min-width: 960px) {
    font-size: 1.25rem;
  }
`;

const TextLink = styled(Link)`
  color: var(--ma-blue);
`;

const InputOTPWrapper = styled.div`
  width: 100%;
  margin: 0 auto;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  .otp-container {
    gap: 0.75rem;
  }

  .otp-input-field {
    flex-grow: 1;

    width: 4rem !important;
    padding: 0.47rem 0.75rem;
    border: 1px solid var(--ma-gray-200);
    border-radius: 0.5rem;
    background-color: #fff;

    font-size: 24px;
    color: #495057;

    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

    &:focus {
      border-color: #2684ff;
      box-shadow: 0 0 0 1px #2684ff;
    }
  }
`;

const SplitSides = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
`;

const ResendDisabled = styled.span`
  color: var(--ma-gray-400);
  font-weight: 600;
  cursor: not-allowed;
  user-select: none;
`;

const ResendLink = styled.a`
  color: var(--ma-blue);
  font-weight: 600;

  &:hover {
    color: var(--ma-blue);
    text-decoration: underline !important;
  }
`;

const ButtonListVertical = styled.div`
  > * + * {
    margin-top: 0.5rem;
  }
`;

function _formatTimer(duration) {
  if (!duration) {
    return undefined;
  }
  const hours = _getDigits(duration.hours);
  const minutes = _getDigits(duration.minutes);
  const seconds = _getDigits(duration.seconds);
  return `${hours}:${minutes}:${seconds}`;
}

function _getDigits(number = 0) {
  if (!number) {
    return "00";
  }
  const numberAsString = number.toString();
  return numberAsString.length > 1 ? numberAsString : "0" + numberAsString;
}

export default PageAuthRegisterVerification;
