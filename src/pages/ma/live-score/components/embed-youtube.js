import * as React from "react";
import styled from "styled-components";

const WIDTH = 560;
const HEIGHT = 315;
const ratio = HEIGHT / WIDTH;

function EmbedYoutube() {
  return (
    <ResponsiveYoutubeVideo>
      <iframe
        width={WIDTH}
        height={HEIGHT}
        src="https://www.youtube.com/embed/IFXGIXFq-EA"
        title="Gold Final Standart Bow U-12 - Pro Jakarta Open 2022"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </ResponsiveYoutubeVideo>
  );
}

const ResponsiveYoutubeVideo = styled.div`
  position: relative;
  overflow: hidden;
  padding-bottom: calc(${ratio} * 100%);
  margin-bottom: 2.5rem;
  background-color: var(--ma-primary-blue-50);

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

export { EmbedYoutube };
