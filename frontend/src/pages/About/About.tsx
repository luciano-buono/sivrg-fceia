import { FC } from "react"
import { Container, Card } from "react-bootstrap";

const About: FC = () => {
    return (
        <Container className='d-flex flex-wrap flex-column justify-content-center align-content-center pt-2'>
            <Card className='d-flex justify-content-center h-100 w-100'>
                <Card.Body>
                    <h1> Sobre nosotros </h1>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default About