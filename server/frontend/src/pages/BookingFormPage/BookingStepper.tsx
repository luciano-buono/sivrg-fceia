import { useState } from 'react';
import { Stepper, Button, Group, Box, LoadingOverlay } from '@mantine/core';
import { Card, Container } from 'react-bootstrap';
import { useMutationState } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import StepChofer from './StepChofer';
import StepVehiculo from './StepVehiculo';
import StepDetalles from './StepDetalles';
import { BookingFormProvider, useBookingForm } from '../../contexts/BookingFormContext';
import StepProducto from './StepProducto';
import useMutateTurno from '../../hooks/useMutateTurno';
import { TurnoData } from '../../types';
import StepCompleted from './StepCompleted';

const BookingStepper = () => {
  const [active, setActive] = useState(0);

  const form = useBookingForm({
    initialValues: {
      chofer_id: '',
      empresa_id: 2,
      producto_id: '',
      vehiculo_id: '',
      turno_fecha: null,
      cantidad_estimada: '',
    },

    validate: (values) => {
      if (active === 0) {
        return {
          chofer_id: values.chofer_id === '' ? 'Busque o cree un chofer' : null,
        };
      }
      if (active === 1) {
        return {
          vehiculo_id: values.vehiculo_id === '' ? 'Busque o cree un vehículo' : null,
        };
      }
      if (active === 2) {
        return {
          producto_id: values.producto_id === '' ? 'Busque o cree un producto' : null,
        };
      }
      if (active === 3) {
        return {
          turno_fecha: values.turno_fecha === null ? 'Seleccione una fecha' : null,
          cantidad_estimada: ['', '0'].includes(values.cantidad_estimada) ? 'Ingrese una cantidad válida' : null,
        };
      }
      return {};
    },
  });

  const createTurnoMutation = useMutateTurno();
  const handleSubmit = async (newTurnoData: TurnoData) => {
    try {
      const turno = await createTurnoMutation.mutateAsync({
        ...newTurnoData,
      });
      notifications.show({
        title: 'Turno agendado!',
        color: 'green',
        message: `Se ha agendado el turno para el ${turno.turno_fecha}`,
      });
      form.reset();
    } catch (error: any) {
      notifications.show({
        title: 'Error al crear turno',
        color: 'red',
        message: `${error.response.data.detail}`,
      });
    }
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

  const isMutatingChofer = useMutationState({
    filters: { status: 'pending', mutationKey: ['chofer'] },
    select: (mutation) => mutation.state.variables,
  });
  const isMutatingVehiculo = useMutationState({
    filters: { status: 'pending', mutationKey: ['vehiculo'] },
    select: (mutation) => mutation.state.variables,
  });
  const isMutatingProducto = useMutationState({
    filters: { status: 'pending', mutationKey: ['producto'] },
    select: (mutation) => mutation.state.variables,
  });
  const isMutatingTurno = useMutationState({
    filters: { status: 'pending', mutationKey: ['turno'] },
    select: (mutation) => mutation.state.variables,
  });

  return (
    <BookingFormProvider form={form}>
      <Container className="d-flex flex-column flex-wrap align-content-center pt-3">
        <Card className="col-xl-8">
          <Card.Body>
            <Box pos="relative">
              <LoadingOverlay
                visible={isMutatingTurno.length > 0}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
                loaderProps={{ color: 'blue', type: 'bars' }}
              />
              <Stepper active={active} color={active === 4 ? 'green' : 'blue'}>
                <Stepper.Step
                  icon={<i className="fa-solid fa-id-card"></i>}
                  description="Chofer"
                  label="Paso 1"
                  loading={isMutatingChofer.length > 0}
                >
                  <StepChofer />
                </Stepper.Step>
                <Stepper.Step
                  icon={<i className="fa-solid fa-truck"></i>}
                  description="Vehículo"
                  label="Paso 2"
                  loading={isMutatingVehiculo.length > 0}
                >
                  <StepVehiculo />
                </Stepper.Step>
                <Stepper.Step
                  icon={<i className="fa-solid fa-wheat-awn"></i>}
                  description="Producto"
                  label="Paso 3"
                  loading={isMutatingProducto.length > 0}
                >
                  <StepProducto />
                </Stepper.Step>
                <Stepper.Step
                  icon={<i className="fa-solid fa-calendar-days"></i>}
                  description="Detalles"
                  label="Paso 4"
                >
                  <StepDetalles />
                </Stepper.Step>
                <Stepper.Completed>
                  <StepCompleted />
                </Stepper.Completed>
              </Stepper>
            </Box>
            <Group justify="flex-end" mt="md">
              {active !== 0 && active !== 4 && (
                <Button variant="default" onClick={prevStep}>
                  Atrás
                </Button>
              )}
              {active !== 4 && active !== 3 && <Button onClick={nextStep}>Siguiente</Button>}
              {active === 3 && <Button onClick={nextStep}>Agendar turno!</Button>}
              {active === 4 && <Button onClick={() => setActive(0)}>Agendar otro turno</Button>}
            </Group>
          </Card.Body>
        </Card>
      </Container>
    </BookingFormProvider>
  );
};

export default BookingStepper;
