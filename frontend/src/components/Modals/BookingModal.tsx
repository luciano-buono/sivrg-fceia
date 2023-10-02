import { TextInput } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { FC } from 'react';
import { Modal, Row, Card, Button } from 'react-bootstrap';

const BookingModal: FC<{ show: boolean; handleClose: () => void }> = ({ show, handleClose }) => {
  const form = useForm({
    initialValues: {
      name: '',
      lastname: '',
      email: '',
      date: null,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Turnos</Modal.Title>
      </Modal.Header>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Modal.Body>
          <TextInput withAsterisk label="Nombres" placeholder="" {...form.getInputProps('firstname')} />
          <TextInput withAsterisk label="Apellido" placeholder="" {...form.getInputProps('lastname')} />
          <TextInput withAsterisk label="Email" placeholder="your@email.com" {...form.getInputProps('email')} />
          <div className="pt-3"> Seleccione una fecha:</div>
          <Row className="w-100 d-flex justify-content-center pt-4">
            <Card style={{ width: '300px' }} className="d-flex flex-wrap justify-content-center">
              <Card.Body>
                <DatePicker {...form.getInputProps('date')} />
              </Card.Body>
            </Card>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default BookingModal;
