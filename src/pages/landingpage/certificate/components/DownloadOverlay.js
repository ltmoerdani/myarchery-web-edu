import styled from "styled-components";

const DownloadOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  transition: all 0.15s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.8);

    .tombol-download {
      visibility: visible;
    }
  }

  .tombol-download {
    visibility: hidden;
    margin-bottom: 60px;
  }
`;

export default DownloadOverlay;
