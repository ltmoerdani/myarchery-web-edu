import * as React from "react";
import styled from "styled-components";

function EmbedYoutube({ src, title, width, height }) {
  const ratio = height / width;
  return (
    <ResponsiveYoutubeVideo style={{ "--ratio": `calc(${ratio} * 100%)` }}>
      <iframe
        width={width}
        height={height}
        src={src}
        title={title}
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
  padding-bottom: var(--ratio);
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
