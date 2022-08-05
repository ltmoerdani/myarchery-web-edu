import * as React from "react";
import MetaTags from "react-meta-tags";

function PageWrapper({ children, pageTitle }) {
  return (
    <React.Fragment>
      <MetaTags>
        {pageTitle ? <title>{pageTitle} | MyArchery.id</title> : <title>MyArchery.id</title>}
      </MetaTags>
      {children}
    </React.Fragment>
  );
}

export { PageWrapper };
