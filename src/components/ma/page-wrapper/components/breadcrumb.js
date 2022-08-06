import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import IconChevronLeft from "components/ma/icons/mono/chevron-left";

function Breadcrumb({ label, to }) {
  if (!to) {
    return null;
  }

  return (
    <BreadcrumbWrapper>
      <ButtonBack as={Link} to={to}>
        <IconChevronLeft size="16" />
      </ButtonBack>

      <Label as={Link} to={to}>
        <span>{label || "Kembali"}</span>
      </Label>
    </BreadcrumbWrapper>
  );
}

const BreadcrumbWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
`;

const ButtonBack = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  background-color: #ffffff;

  color: var(--ma-blue);
  font-size: 1rem;
  font-weight: 600;

  transition: background-color 0.35s, color 0.15s;

  ${BreadcrumbWrapper}:hover & {
    background-color: var(--ma-blue);
    color: #ffffff;
  }
`;

const Label = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  color: var(--ma-gray-600);

  ${BreadcrumbWrapper}:hover & {
    color: var(--ma-blue);
  }
`;

export { Breadcrumb };
