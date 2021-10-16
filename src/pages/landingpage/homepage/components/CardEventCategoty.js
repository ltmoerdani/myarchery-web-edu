/* eslint-disable no-unused-vars */
import React from 'react'
import {Card, CardBody, Button}  from "reactstrap"
// eslint-disable-next-line no-unused-vars
import { Link, useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import * as ArcherStore from "store/slice/archer"



// eslint-disable-next-line no-unused-vars
function CardEventCategoty({title, price, quota, eventData, slug, isLoggedIn }) {
    const dispatch = useDispatch()
    const history = useHistory()
    const {data} = useSelector(ArcherStore.getArcherStore)
    const handleSetEventDetail = () => {
        dispatch(ArcherStore.setEvent(eventData))
        if (data) {
            if (isLoggedIn) {
                history.push(`/event/register/process/${slug}`)
            }
            history.push(`/archer/login?path=/event/register/process/${slug}`)
        }
    }
    return (
        <div>
            <Card>
                <CardBody>
                    <div className="d-md-flex justify-content-between">
                        <div>
                            <h4>{title}</h4>
                            <div>{price}</div>
                        </div>
                        <div className="my-4 my-md-0">
                            <span style={{background: `${quota ? 'red' : 'green'}`, color: 'white'}} className="rounded-pill">{quota ? 'Full Booked' : 'On Sale'}</span>
                        </div>
                        <div>
                                <Button onClick={handleSetEventDetail} color="primary">Daftar</Button>
                            {/* <Link to={isLoggedIn ? `/event/register/process/${slug}` : `/archer/login?path=/event/register/process/${slug}`}>
                            </Link> */}
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}

export default CardEventCategoty
