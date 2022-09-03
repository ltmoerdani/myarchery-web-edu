import * as React from "react";
import styled from "styled-components";

import { EmbedYoutube } from "./embed-youtube";

function TopBannerWidget({ type, ...props }) {
  switch (type) {
    case "youtube": {
      return <EmbedYoutube {...props} />;
    }

    case "image-static": {
      return (
        <ImageStaticBanner>
          <img {...props} />
        </ImageStaticBanner>
      );
    }

    default: {
      return null;
    }
  }
}

const ImageStaticBanner = styled.div`
  overflow: hidden;
  margin-bottom: 2.5rem;
  background-color: var(--ma-primary-blue-50);

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

export { TopBannerWidget };
