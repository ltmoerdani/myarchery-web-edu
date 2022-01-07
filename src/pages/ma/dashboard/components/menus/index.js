import * as React from "react";
import styled from "styled-components";

import MenuItemCard from "./MenuItemCard";
import UserProfileCard from "./UserProfileCard";

import fileText from "assets/icons/event-menu-file-text.svg";
import panah from "assets/icons/event-menu-panah.svg";
import target from "assets/icons/target-club.svg";

const menuItems = [
  {
    id: 1,
    icon: fileText,
    title: "Sertifikat",
    description: "Sertifikat yang telah Anda dapatkan",
    computeLink: () => "",
  },
  {
    id: 2,
    icon: target,
    title: "Klub Saya",
    description: "Klub-klub yang Anda ikuti. Temukan berbagai klub panahan di myarchery.id",
    computeLink: () => "/dashboard/clubs",
  },
  {
    id: 3,
    icon: panah,
    title: "Event Saya",
    description: "Event-event yang Anda ikuti. Temukan berbagai event panahan di myarchery.id",
    computeLink: () => "",
  },
];

const MenuGridWrapper = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
`;

function DashboardMenus() {
  return (
    <MenuGridWrapper>
      <UserProfileCard />
      {menuItems.map((menu) => (
        <MenuItemCard key={menu.id} menu={menu} href={menu.computeLink?.()} />
      ))}
    </MenuGridWrapper>
  );
}

export default DashboardMenus;
