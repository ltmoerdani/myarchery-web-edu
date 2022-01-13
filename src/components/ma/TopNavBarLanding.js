import React, {useState} from 'react'
import styled from "styled-components";
import {
    Dropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
  } from "reactstrap";

const ButtonShadow = styled.button`
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    border-radius: 5px;
    color: #0D47A1;
    &:hover {
        background-color: #0D47A1;
        color: #FFF
    }
`

const ButtonOne = styled.button`
    border-color: #0D47A1;
    color: #0D47A1;
    &:hover {
        background-color: #0D47A1;
        color: #FFF
    }
`

function TopNavBarLanding() {
    const [menu, setMenu] = useState(false);

    return (
        <React.Fragment>
            <div className='d-none d-lg-flex my-auto'>
                <div>
                    <a href="/archer/register">
                        <ButtonOne className='me-2 btn'>Buat Akun</ButtonOne>
                    </a>
                </div>
                <div>
                    <div>
                        <a href="/archer/login">
                            <ButtonShadow className='btn'>Masuk</ButtonShadow>
                        </a>
                    </div>
                </div>
            </div>

            <Dropdown isOpen={menu} toggle={() => setMenu(!menu)} className="d-inline-block d-lg-none">
                <DropdownToggle className="btn header-item " id="page-header-user-dropdown" tag="button">
                    <span className='bx bx-menu'></span>
                </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem className="dropdown-item">
                <div>
                    <a href="/archer/register">
                        <ButtonOne className='me-2 btn'>Buat Akun</ButtonOne>
                    </a>
                </div>
                <div className='mt-2'>
                    <div>
                        <a href="/archer/login">
                            <ButtonShadow className='btn px-4'>Masuk</ButtonShadow>
                        </a>
                    </div>
                    </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

        </React.Fragment>
    )
}

export default TopNavBarLanding