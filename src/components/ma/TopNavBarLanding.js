import React from 'react'
import styled from "styled-components";

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
    return (
        <React.Fragment>
            <div className='d-flex'>
                <div>
                    <ButtonOne className='me-2 btn'>Buat Akun</ButtonOne>
                </div>
                <div>
                    <div>
                        <ButtonShadow className='btn'>Masuk</ButtonShadow>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default TopNavBarLanding
