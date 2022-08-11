import * as React from "react";
import styled from "styled-components";
import { useUserProfile } from "hooks/user-profile";
import { useSubmitProfile } from "../hooks/submit-profile";

import { Modal as BSModal, ModalBody } from "reactstrap";
import { ButtonBlue, Button, LoadingScreen, AlertServerError } from "components/ma";
import { toast } from "components/ma/processing-toast";
import { FieldInputText } from "../components";

function EditName({ children, title, onProfileUpdated }) {
  const [isOpen, setOpen] = React.useState(false);
  const buttonLabel = children || "ubah nama";
  return (
    <React.Fragment>
      <LinkText title={title} onClick={() => setOpen((open) => !open)}>
        {buttonLabel}
      </LinkText>
      {isOpen && (
        <EditNameModal
          toggle={() => setOpen((open) => !open)}
          onClose={() => setOpen(false)}
          onProfileUpdated={onProfileUpdated}
        />
      )}
    </React.Fragment>
  );
}

function EditNameModal({ onClose, toggle, onProfileUpdated }) {
  const { userProfile } = useUserProfile();
  const [nameValue, setNameValue] = React.useState(userProfile?.name);
  const {
    submit,
    isLoading: isSubmiting,
    isError: isErrorSubmit,
    errors: submitErrors,
  } = useSubmitProfile();

  const isDirty = nameValue !== userProfile?.name;

  const handleSubmit = () => {
    const payload = { name: nameValue };
    const options = {
      onSuccess: () => {
        onClose();
        toast.success("Berhasil memperbarui data nama lengkap");
        onProfileUpdated();
      },
    };
    submit(payload, options);
  };

  const modalProps = {
    isOpen: true,
    centered: true,
    unmountOnClose: true,
    scrollable: false,
    toggle: toggle,
  };

  if (!userProfile?.canUpdateName) {
    return (
      <Modal {...modalProps}>
        <ModalBody>
          <ModalContentLayout>
            <HeaderTitle>Nama Peserta</HeaderTitle>
            <div>
              <p>
                Telah mencapai limit untuk mengubah data nama. Anda hanya dapat mengubah nama profil
                2 kali.
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
                Nama digunakan sebagai nama peserta untuk keperluan data dan berkas cetak (ID card,
                sertifikat, dsb.)
              </SubtleFieldNote>
            </div>

            <ButtonListVertical>
              <ButtonBlue block onClick={onClose}>
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
          <HeaderTitle>Ubah Nama Peserta</HeaderTitle>
          <div>
            <p>
              Anda hanya dapat mengubah nama profil 2 kali. Pastikan nama yang dimasukkan sudah
              benar.
            </p>

            <p>
              Mengubah nama akan meminta Anda memasukkan ulang detail peserta (alamat, KTP/KK
              beserta bukti)
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
              Nama akan digunakan sebagai nama peserta untuk keperluan data dan berkas cetak (ID
              card, sertifikat, dsb.)
            </SubtleFieldNote>
          </div>

          <ButtonListVertical>
            {isDirty ? (
              <ButtonBlue block onClick={handleSubmit}>
                Simpan
              </ButtonBlue>
            ) : (
              <ButtonBlue block disabled>
                Simpan
              </ButtonBlue>
            )}

            <Button block onClick={onClose}>
              Batal
            </Button>
          </ButtonListVertical>
        </ModalContentLayout>

        <LoadingScreen loading={isSubmiting} />
        <AlertServerError isError={isErrorSubmit} errors={submitErrors} />
      </ModalBody>
    </Modal>
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

const ModalContentLayout = styled.div`
  > * + * {
    margin-top: 1.5rem;
  }
`;

const HeaderTitle = styled.h2`
  text-align: center;
  font-weight: 600;
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

export { EditName };
