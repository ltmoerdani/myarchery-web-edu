import * as React from "react";
import styled from "styled-components";

import MenuItemCard from "./MenuItemCard";
import UserProfileCard from "./UserProfileCard";

import fileText from "assets/icons/event-menu-file-text.svg";
import panah from "assets/icons/event-menu-panah.svg";
import targetPanah from "assets/icons/event-menu-target-panah.svg";

const menuItems = [
  {
    id: 1,
    icon: fileText,
    title: "Sertifikat",
    description: "Sertifikat yang telah Anda dapatkan",
    computeLink: (eventId) => `/dashboard/certificate/new?event_id=${eventId}`,
  },
  {
    id: 2,
    icon: panah,
    title: "Pertandingan",
    description: "Event-event yang Anda ikuti. Temukan berbagai event panahan di myarchery.id",
    computeLink: () => "",
  },
  {
    id: 3,
    icon: targetPanah,
    title: "Klub Saya",
    description: "Daftar klub yang Anda ikuti. Temukan berbagai klub panahan di myacrhery.id",
    computeLink: () => `/dashboard/clubs`

  }
];

const MenuGridWrapper = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr;

  @media (min-width: 680px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

function DashboardMenus() {
  return (
    <MenuGridWrapper>
      <UserProfileCard />
      {menuItems.map((menu) => (
        <MenuItemCard key={menu.id} menu={menu} href={menu.computeLink} />
      ))}
    </MenuGridWrapper>
  );
}

export default DashboardMenus;
