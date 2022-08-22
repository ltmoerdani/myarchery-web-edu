import * as React from "react";

function HeavyImage({
  onRegisterQueue,
  src,
  onLoad,
  onError,
  isPending = false,
  fallback = null,
  ...imgProps
}) {
  React.useEffect(() => {
    onRegisterQueue?.();
  }, []);

  if (isPending) {
    return fallback || <span>Loading</span>;
  }

  return <img src={src} onLoad={onLoad} onError={onError} {...imgProps} />;
}

export { HeavyImage };
