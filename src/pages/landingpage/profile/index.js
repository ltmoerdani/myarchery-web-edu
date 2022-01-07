import React, {useState, useEffect} from 'react'
import { MetaTags } from 'react-meta-tags'
import { Container, Card, CardBody, Row, Col } from 'reactstrap'
import HeaderForm from 'layouts/landingpage/HeaderForm'
import { ImageUpload, TextInput, NumberInput, EmailInput, DateInput } from 'components'
import { ArcherService } from 'services'

function ProfileArcher() {
    const [file, setFile] = useState(null)
    const [base64URL, setBase64URL] = useState("");
    const [profile, setProfile] = useState({})

    const getBase64 = (file) => {
        return new Promise((resolve) => {
          let fileInfo
          let baseURL = ""
          let reader = new FileReader
    
          reader.readAsDataURL(file)
          reader.onload = () => {
            baseURL = reader.result
            resolve(baseURL)
          }
          console.log(fileInfo)
        })
      }
    
      const handlerFileInputChange = (e) => {
        let go = e.target.files[0]
        console.log(e.target.files[0])
        getBase64(e.target.files[0]).then((result) => {
          go['base64'] = result
          setFile(go)
          console.log(file)
          setBase64URL(result)
        }).catch((err) => {
          console.log(err)
        })
      }

      console.log(base64URL)

      const handleChange = ({ key, value }) => {
          console.log(key, value)
          
      };

      const getDataProfileUser = async() => {
        const {message, errors, data} = await ArcherService.profile()
        if (message === 'Success'){
            if (data) {
                setProfile(data)
            }
        } else {
            console.log(errors)
        }

      }

      useEffect(() => {
        getDataProfileUser();
      }, [])
    return (
        <React.Fragment>
            <MetaTags>
                <title>Dashboard - Profile | MyAchery</title>
            </MetaTags>
            <HeaderForm />
            <Container fluid>
                <Card className="mt-4">
                    <CardBody>
                        <Row>
                            <Col md={4}>
                                <ImageUpload 
                                    // label="Avatar"
                                    name="avatar"
                                    thumbnail
                                    base64={handlerFileInputChange}
                                />
                            </Col>
                            <Col>
                             <TextInput 
                                label="User Name"
                                name="name"
                                value={profile?.name}
                             />
                             <EmailInput 
                                label="Email"
                                name="email"
                                value={profile?.email}
                                disabled
                             />
                            <NumberInput
                                label="Phone Number"
                                name="phoneNumber"
                                value={profile?.phoneNumber}
                            />
                            <TextInput 
                                label="Place of Birth"
                                name="placeOfBirth"
                                value={profile?.placeOfBirth}
                            />
                            <DateInput 
                                label="Date of Birth"
                                name="dateOfBirth"
                                onChange={handleChange}
                                value={profile?.dateOfBirth}
                            />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>
        </React.Fragment>
    )
}

export default ProfileArcher
