import * as React from "react";
import styled from "styled-components";
import { useUserProfile } from "hooks/user-profile";

import { Modal as BSModal, ModalBody } from "reactstrap";
import { ButtonBlue, Button } from "components/ma";
import { FieldInputText } from "../components";

function EditName({ children }) {
  const [isOpen, setOpen] = React.useState(false);
  const buttonLabel = children || "ubah nama";
  return (
    <React.Fragment>
      <LinkText onClick={() => setOpen((open) => !open)}>{buttonLabel}</LinkText>
      {isOpen && (
        <EditNameModal toggle={() => setOpen((open) => !open)} onClose={() => setOpen(false)} />
      )}
    </React.Fragment>
  );
}

function EditNameModal({ onClose, toggle }) {
  const { userProfile } = useUserProfile();
  return (
    <Modal isOpen centered unmountOnClose scrollable={false} toggle={toggle}>
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
              value={userProfile?.name}
              isFocus
              onFocus={(ev) => ev.target.select()}
            />
            <SubtleFieldNote>
              Nama akan digunakan sebagai nama peserta untuk keperluan data dan berkas cetak (ID
              card, sertifikat, dsb.)
            </SubtleFieldNote>
          </div>

          <ButtonListVertical>
            <ButtonBlue block onClick={onClose}>
              Simpan
            </ButtonBlue>

            <Button block onClick={onClose}>
              Batal
            </Button>
          </ButtonListVertical>
        </ModalContentLayout>
      </ModalBody>
    </Modal>
  );
}

const LinkText = styled.button`
  padding: 0;
  border: none;
  background-color: unset;

  color: var(--ma-blue);

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
