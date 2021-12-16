import React from "react";

function PageDashboard() {
  return (
    <div style={{ margin: "40px 0" }}>
      <MetaTags>
        <title>Dashboard | MyArchery.id</title>
      </MetaTags>

      <Container fluid>
        <div className="dashboard-greeting mb-5">
          <h1 style={{ fontFamily: "Inter", fontWeight: 500, color: "#000000" }}>
            Halo, Mary Jane
          </h1>
          <p style={{ fontFamily: "Inter" }}>Selamat datang di myarchery.id</p>
        </div>
      </Container>
    </div>
  );
}

export default PageDashboard;
