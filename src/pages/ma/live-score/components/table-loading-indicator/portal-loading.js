import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";

const DEFAULT_DELAY = 1500;

function FullPageLoadingIndicator({ isLoading, delay = DEFAULT_DELAY }) {
  const portalRef = React.useRef(null);
  const [isShowingLoading, setShowingLoading] = React.useState(false);

  React.useEffect(() => {
    const portalTargetDOM = document.createElement("div");
    portalRef.current = portalTargetDOM;

    portalTargetDOM.setAttribute("id", "loading-screen-dot");
    document.body.appendChild(portalTargetDOM);

    return function () {
      portalTargetDOM.remove();
    };
  }, []);

  React.useEffect(() => {
    if (isLoading) {
      setShowingLoading(true);
    }

    setTimeout(() => {
      setShowingLoading(false);
    }, delay);
  }, [isLoading]);

  if (!isShowingLoading || !portalRef.current) {
    return null;
  }

  return ReactDOM.createPortal(
    <FullpageContainer>
      <FullViewportLoading>
        <div className="spinner-grow" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </FullViewportLoading>
    </FullpageContainer>,
    portalRef.current
  );
}

const FullpageContainer = styled.div`
  pointer-events: none;
  position: fixed;
  z-index: 50;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const FullViewportLoading = styled.div`
  pointer-events: none;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export { FullPageLoadingIndicator };
