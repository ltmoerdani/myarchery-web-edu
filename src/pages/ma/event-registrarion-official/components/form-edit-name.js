import {
  ButtonBlue,
  Button,
  LoadingScreen,
  AlertServerError,
} from "components/ma";
import React from "react";
import { Modal as BSModal, ModalBody } from "reactstrap";
import styled from "styled-components";
import { FieldInputText } from "../components";
import { useSubmitProfile } from "../hooks/submit-profile";
import { toast } from "components/ma/processing-toast";

const ContentModal = (props) => {
  const { userProfile, isModal, handlerModal, onProfileUpdated } = props;
  const [nameValue, setNameValue] = React.useState(userProfile?.name);

  const isDirty = nameValue !== userProfile?.name;

  const {
    submit,
    isLoading: isSubmiting,
    isError: isErrorSubmit,
    errors: submitErrors,
  } = useSubmitProfile();

  const handlerSubmit = () => {
    const payload = { name: nameValue };
    const options = {
      onSuccess: () => {
        handlerModal();
        toast.success("Berhasil memperbarui data nama lengkap");
        onProfileUpdated();
      },
    };
    submit(payload, options);
  };

  const modalProps = {
    isOpen: isModal,
    centered: true,
    unmountOnClose: true,
    scrollable: false,
    toggle: handlerModal,
  };

  if (!userProfile?.canUpdateName) {
    return (
      <Modal {...modalProps}>
        <ModalBody>
          <ModalContentLayout>
            <HeaderTitle>Ubah Nama Official</HeaderTitle>
            <div>
              <p>
                Telah mencapai limit untuk mengubah data nama. Anda hanya dapat
                mengubah nama profil 2 kali.
              </p>
            </div>
            <div>
              <FieldInputText
                placeholder="Masukkan nama lengkap"
                name="fullname"
                disabled
                value={nameValue}
              />
              <SubtleFieldNote>
                Nama akan digunakan sebagai nama official untuk keperluan data
                dan berkas cetak (ID card, dsb.)
              </SubtleFieldNote>
            </div>

            <ButtonListVertical>
              <ButtonBlue block onClick={handlerModal}>
                Tutup
              </ButtonBlue>
            </ButtonListVertical>
          </ModalContentLayout>
          <LoadingScreen loading={isSubmiting} />
          <AlertServerError isError={isErrorSubmit} errors={submitErrors} />
        </ModalBody>
      </Modal>
    );
  }

  return (
    <Modal {...modalProps}>
      <ModalBody>
        <ModalContentLayout>
          <HeaderTitle>Ubah Nama Official</HeaderTitle>
          <div>
            <p>
              Anda hanya dapat mengubah nama profil 2 kali. Pastikan nama yang
              dimasukkan sudah benar.
            </p>

            <p>
              Mengubah nama akan meminta Anda memasukkan ulang detail peserta
              (alamat, KTP/KK beserta bukti)
            </p>
          </div>
          <div>
            <FieldInputText
              placeholder="Masukkan nama lengkap"
              name="fullname"
              value={nameValue}
              onChange={setNameValue}
              isFocus
              onFocus={(ev) => ev.target.select()}
            />
            <SubtleFieldNote>
              Nama akan digunakan sebagai nama official untuk keperluan data dan
              berkas cetak (ID card, dsb.)
            </SubtleFieldNote>
          </div>
          <ButtonListVertical>
            {isDirty ? (
              <ButtonBlue block onClick={handlerSubmit}>
                Simpan
              </ButtonBlue>
            ) : (
              <ButtonBlue block disabled>
                Simpan
              </ButtonBlue>
            )}
            <Button block onClick={handlerModal}>
              Batal
            </Button>
          </ButtonListVertical>
        </ModalContentLayout>
        <LoadingScreen loading={isSubmiting} />
        <AlertServerError isError={isErrorSubmit} errors={submitErrors} />
      </ModalBody>
    </Modal>
  );
};

function FormEditName(props) {
  const { children, userProfile, onProfileUpdated } = props;
  const [isModal, setIsModal] = React.useState(false);
  const [titleText, setTitleText] = React.useState("");

  const labelButton = children || "Modal";

  const handlerModal = () => {
    const status = isModal ? false : true;
    setIsModal(status);
  };

  // component
  const _renderEditNameTitle = (limitCount) => {
    if (!limitCount) {
      return "Telah melebihi limit, tidak dapat lagi mengubah data.";
    }
    return `Tersisa kesempatan mengubah data ${limitCount} kali.`;
  };

  // useEffect
  React.useEffect(() => {
    setTitleText(_renderEditNameTitle(userProfile?.canUpdateName));
  }, [userProfile]);

  return (
    <>
      <LinkText title={titleText} onClick={handlerModal}>
        {labelButton}
      </LinkText>
      <ContentModal
        userProfile={userProfile}
        onClose={handlerModal}
        handlerModal={handlerModal}
        isModal={isModal}
        onProfileUpdated={onProfileUpdated}
      />
    </>
  );
}

const LinkText = styled.button`
  padding: 0;
  border: none;
  background-color: unset;

  color: var(--ma-blue);
  font-weight: 600;

  &:hover,
  &:focus {
    color: var(--ma-blue);
    text-decoration: underline !important;
  }
`;

const Modal = styled(BSModal)`
  max-width: 360px;
`;

const HeaderTitle = styled.h2`
  text-align: center;
  font-weight: 600;
`;

const ModalContentLayout = styled.div`
  > * + * {
    margin-top: 1.5rem;
  }
`;

const SubtleFieldNote = styled.div`
  color: var(--ma-gray-400);
  font-size: 0.9em;
`;

const ButtonListVertical = styled.div`
  > * + * {
    margin-top: 0.5rem;
  }
`;

export { FormEditName };
