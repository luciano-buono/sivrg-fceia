import { useState } from 'react';
import { Stepper, Button, Group, Box, LoadingOverlay } from '@mantine/core';
import { Card, Container } from 'react-bootstrap';
import { notifications } from '@mantine/notifications';
import StepChofer from './StepChofer';
import StepVehiculo from './StepVehiculo';
import StepDetalles from './StepDetalles';
import { BookingFormProvider, useBookingForm } from '../../contexts/BookingFormContext';
import StepProducto from './StepProducto';
import useTurno from '../../hooks/useTurno';
import { Silo, TurnoData } from '../../types';
import StepCompleted from './StepCompleted';
import useChofer from '../../hooks/useChofer';
import useVehiculo from '../../hooks/useVehiculo';
import useProducto from '../../hooks/useProducto';
import useSessionEmpresa from '../../hooks/useSessionEmpresa';
import { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';

const BookingStepper = () => {
  const [active, setActive] = useState(0);
  const { empresa_id } = useSessionEmpresa();

  const querySilo = useQuery<Silo[]>({
    queryKey: ['silos'],
    queryFn: () => api.get(`/silos/`).then((res) => res.data),
  });

  const getCapacity = (producto_id: string) =>
    querySilo.data?.reduce(
      (acc, current) => ({
        ...acc,
        [current.producto_id]: current.capacidad - (current.utilizado + current.reservado),
      }),
      {} as { [key: string]: number },
    )[producto_id] || Infinity;

  const form = useBookingForm({
    initialValues: {
      chofer_id: '',
      empresa_id: empresa_id,
      producto_id: '',
      vehiculo_id: '',
      fecha: null,
      cantidad_estimada: '',
    },

    validate: (values) => {
      if (active === 0) {
        return {
          chofer_id: values.chofer_id === null ? 'Busque o cree un chofer' : null,
        };
      }
      if (active === 1) {
        return {
          vehiculo_id: values.vehiculo_id === null ? 'Busque o cree un vehículo' : null,
        };
      }
      if (active === 2) {
        return {
          producto_id: values.producto_id === null ? 'Busque o cree un producto' : null,
        };
      }
      if (active === 3) {
        return {
          turno_fecha: values.fecha === null ? 'Seleccione una fecha' : null,
          cantidad_estimada: ['', '0'].includes(values.cantidad_estimada)
            ? 'Ingrese una cantidad válida'
            : Number(values.cantidad_estimada) > getCapacity(values.producto_id)
            ? `Ingrese una cantidad estimada menor a ${getCapacity(values.producto_id)}kg.`
            : null,
        };
      }
      return {};
    },
  });

  const { createTurno, isMutatingTurno } = useTurno();
  const { isMutatingChofer } = useChofer();
  const { isMutatingVehiculo } = useVehiculo();
  const { isMutatingProducto } = useProducto();

  const handleSubmit = async (newTurnoData: TurnoData) => {
    try {
      const turno = await createTurno.mutateAsync({
        ...newTurnoData,
      });
      notifications.show({
        title: 'Turno agendado!',
        color: 'green',
        message: `Se ha agendado el turno para el ${turno.fecha}`,
      });
      form.reset();
      // @TODO: TRY BELOW, INVALIDATE SILOS QUERY TO UPDATE VALIDATOR
      querySilo.refetch();
    } catch (error) {
      if (error instanceof AxiosError) {
        notifications.show({
          title: 'Error al crear turno',
          color: 'red',
          message: `${error.response?.data.detail}`,
        });
      }
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

  return (
    <BookingFormProvider form={form}>
      <Container className="d-flex flex-column flex-wrap align-content-center pt-3">
        <Card className="col-xl-8">
          <Card.Body>
            <Box pos="relative">
              <Stepper active={active} color={active === 4 ? 'green' : 'blue'}>
                <Stepper.Step
                  icon={<i className="fa-solid fa-id-card"></i>}
                  description="Chofer"
                  label="Paso 1"
                  loading={isMutatingChofer}
                >
                  <StepChofer />
                </Stepper.Step>
                <Stepper.Step
                  icon={<i className="fa-solid fa-truck"></i>}
                  description="Vehículo"
                  label="Paso 2"
                  loading={isMutatingVehiculo}
                >
                  <StepVehiculo />
                </Stepper.Step>
                <Stepper.Step
                  icon={<i className="fa-solid fa-wheat-awn"></i>}
                  description="Producto"
                  label="Paso 3"
                  loading={isMutatingProducto}
                >
                  <StepProducto />
                </Stepper.Step>
                <Stepper.Step
                  icon={<i className="fa-solid fa-calendar-days"></i>}
                  description="Detalles"
                  label="Paso 4"
                >
                  <StepDetalles getCapacity={getCapacity} />
                </Stepper.Step>
                <Stepper.Completed>
                  <StepCompleted error={createTurno.isError}>
                    <LoadingOverlay
                      visible={isMutatingTurno}
                      zIndex={1000}
                      overlayProps={{ radius: 'sm', blur: 2 }}
                      loaderProps={{ color: 'blue', type: 'bars' }}
                    />
                  </StepCompleted>
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
