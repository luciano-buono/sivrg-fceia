import { useState } from 'react';
import { Stepper, Button, Group, Code } from '@mantine/core';
import { Card, Container } from 'react-bootstrap';

import { notifications } from '@mantine/notifications';
import StepChofer from './StepChofer';
import StepVehiculo from './StepVehiculo';
import StepFecha from './StepFecha';
import { BookingFormProvider, useBookingForm } from '../../contexts/BookingFormContext';

const BookingStepper = () => {
  const [active, setActive] = useState(0);

  const form = useBookingForm({
    initialValues: {
      chofer: '',
      bookingDate: null,
      plate: '',
      truckType: '',
      trailersQuantity: 0,
      grainType: '',
      totalWeight: 0,
    },

    validate: (values) => {
      if (active === 0) {
        return {
          chofer: values.chofer === '' ? 'Busca o crea un chófer' : null,
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
      if (current === 2) {
        handleSubmit(form.values);
      }
      return current < 3 ? current + 1 : current;
    });

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <BookingFormProvider form={form}>
      <Container className="d-flex flex-column flex-wrap align-content-center pt-2">
        <Card>
          <Card.Body>
            <Stepper active={active}>
              <Stepper.Step label="Primer paso" description="Seleccione chófer">
                <StepChofer />
              </Stepper.Step>
              <Stepper.Step label="Segundo paso" description="Detalles del vehículo">
                <StepVehiculo />
              </Stepper.Step>
              <Stepper.Step label="Último paso" description="Seleccione fecha">
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
              {active !== 0 && active !== 3 && (
                <Button variant="default" onClick={prevStep}>
                  Atrás
                </Button>
              )}
              {active !== 3 && active !== 2 && <Button onClick={nextStep}>Siguiente</Button>}
              {active === 2 && <Button onClick={nextStep}>Agendar turno</Button>}
              {active === 3 && <Button onClick={() => setActive(0)}>Agendar otro turno</Button>}
            </Group>
          </Card.Body>
        </Card>
      </Container>
    </BookingFormProvider>
  );
};

export default BookingStepper;
