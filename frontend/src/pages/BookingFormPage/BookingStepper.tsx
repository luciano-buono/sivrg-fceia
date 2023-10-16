import { useState } from 'react';
import { Stepper, Button, Group, Code } from '@mantine/core';
import { Card, Container } from 'react-bootstrap';

import { notifications } from '@mantine/notifications';
import StepChofer from './StepChofer';
import StepVehiculo from './StepVehiculo';
import StepFecha from './StepFecha';
import { BookingFormProvider, useBookingForm } from '../../contexts/BookingFormContext';
import StepProducto from './StepProducto';

const BookingStepper = () => {
  const [active, setActive] = useState(0);

  const form = useBookingForm({
    initialValues: {
      chofer_id: '',
      empresa_id: '',
      producto_id: '',
      bookingDate: null,
      cantidad_estimada: 0,
    },

    validate: (values) => {
      if (active === 0) {
        return {
          chofer_id: values.chofer_id === '' ? 'Busque o cree un chofer' : null,
        };
      }
      return {};
    },
  });
  const handleSubmit = (values: any) => {
    notifications.show({
      title: 'Turno agendado!',
      color: 'green',
      message: 'Se ha agengado su turno con éxito',
    });
  };

  const nextStep = () =>
    setActive((current) => {
      if (form.validate().hasErrors) {
        return current;
      }
      if (current === 3) {
        handleSubmit(form.values);
      }
      return current < 4 ? current + 1 : current;
    });

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <BookingFormProvider form={form}>
      <Container className="d-flex flex-column flex-wrap align-content-center pt-2">
        <Card>
          <Card.Body>
            <Stepper active={active}>
              <Stepper.Step label="Primer paso" description="Chofer">
                <StepChofer />
              </Stepper.Step>
              <Stepper.Step label="Segundo paso" description="Vehículo">
                <StepVehiculo />
              </Stepper.Step>
              <Stepper.Step label="Tercer paso" description="Producto">
                <StepProducto />
              </Stepper.Step>
              <Stepper.Step label="Último paso" description="Fecha">
                <StepFecha />
              </Stepper.Step>
              <Stepper.Completed>
                Listo! Valores seleccionados:
                <Code block mt="xl">
                  {JSON.stringify(form.values, null, 2)}
                </Code>
              </Stepper.Completed>
            </Stepper>
            <Group justify="flex-end" mt="md">
              {active !== 0 && active !== 4 && (
                <Button variant="default" onClick={prevStep}>
                  Atrás
                </Button>
              )}
              {active !== 4 && active !== 3 && <Button onClick={nextStep}>Siguiente</Button>}
              {active === 3 && <Button onClick={nextStep}>Agendar turno</Button>}
              {active === 4 && <Button onClick={() => setActive(0)}>Agendar otro turno</Button>}
            </Group>
          </Card.Body>
        </Card>
      </Container>
    </BookingFormProvider>
  );
};

export default BookingStepper;
