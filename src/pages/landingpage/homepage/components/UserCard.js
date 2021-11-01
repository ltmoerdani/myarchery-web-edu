import React from 'react'
import user1 from "../../../../assets/images/users/avatar-man.png"

function UserCard({pos}) {
    return (
        <div>
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                    {pos}
                    <img className="rounded-circle header-profile-user ms-2" width="45.77px" height="45.77px" src={user1} />
                    </div>
                    <div>
                        <div className="font-size-16">ASEP</div>
                        <span style={{lineHeight: '1px'}}>Focus Archery</span>
                    </div>
                    <h5>200</h5>
                </div>
                <hr />
        </div>
    )
}

export default UserCard
