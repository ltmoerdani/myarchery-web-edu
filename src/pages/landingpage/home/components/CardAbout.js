import React from 'react'
import {Col} from 'reactstrap'

function CardAbout({src, title, content, className}) {
    return (
        <React.Fragment>
           <Col md={4} sm={12} className={className}>
                <div>
                    <div>
                        <img src={src} />
                    </div>
                    <div>
                        <h4>{title}</h4>
                        <div style={{width: '75%', margin: '0 auto'}}>
                            <p>{content}</p>
                        </div>
                    </div>
                </div>
            </Col>
        </React.Fragment>
    )
}

export default CardAbout
