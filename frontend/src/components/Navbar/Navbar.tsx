import { FC } from "react"

import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav } from "react-bootstrap";


const Navbara: FC = () => {
    return (
        <Navbar expand="lg" className="bg-body-tertiary" sticky="top">
            <Container>
                <Nav>
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="about">Sobre nosotros</Nav.Link>
                    <Nav.Link href="contact">Contacto</Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Link href="login">Iniciar Sesión</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default Navbara