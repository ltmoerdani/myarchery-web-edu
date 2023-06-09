import * as React from "react";
import styled from "styled-components";

import MenuItemCard from "./MenuItemCard";
import UserProfileCard from "./UserProfileCard";

import fileText from "assets/icons/event-menu-file-text.svg";
import panah from "assets/icons/event-menu-panah.svg";
import target from "assets/icons/target-club.svg";
import shoppingBag from "assets/icons/shopping-bag.svg";
// import userProfilePlus from "assets/icons/user-plus.svg";

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
  {
    id: 4,
    icon: shoppingBag,
    title: "Transaksi",
    description: "Daftar event yang Anda ikuti. Temukan berbagai event panahan di myarchery.id",
    computeLink: () => "/dashboard/list-transaction",
  },
  // {
  //   id: 5,
  //   icon: userProfilePlus,
  //   title: "Pengaturan Acara",
  //   description: "Bantalan, Run Down, BIB, Dokumen (ID Card dan Sertifikat), FAQ, Official",
  //   computeLink: () => "/dashboard/list-transaction",
  // },
];

const MenuGridWrapperTop = styled.div`
  margin-bottom: 1.5rem;
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
`;

const MenuGridWrapper = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
`;

function DashboardMenus() {
  return (
    <React.Fragment>
      <MenuGridWrapperTop>
        <UserProfileCard to="/dashboard/profile" />
        <MenuItemCard menu={menuItems[0]} href="/dashboard/certificates" />
        <MenuItemCard menu={menuItems[1]} href="/dashboard/clubs" />
      </MenuGridWrapperTop>

      <MenuGridWrapper>
        {/* <MenuItemCard menu={menuItems[4]} href="/dashboard/clubs" /> */}
        <MenuItemCard
          menu={{
            id: 3,
            icon: panah,
            title: "Event Saya",
            description:
              "Event-event yang Anda ikuti. Temukan berbagai event panahan di myarchery.id",
          }}
          href="/dashboard/events"
        />
        <MenuItemCard menu={menuItems[3]} href={menuItems[3].computeLink?.()} />
      </MenuGridWrapper>
    </React.Fragment>
  );
}

export default DashboardMenus;
