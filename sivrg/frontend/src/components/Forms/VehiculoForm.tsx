import { Button, Loader, NumberInput, TextInput } from '@mantine/core';
import { Row } from 'react-bootstrap';
import { notifications } from '@mantine/notifications';
import { ModelForm, VehiculoData } from '../../types';
import { useForm } from '@mantine/form';
import { useBookingFormContext } from '../../contexts/BookingFormContext';
import { FC } from 'react';
import useVehiculo from '../../hooks/useVehiculo';
import useSessionEmpresa from '../../hooks/useSessionEmpresa';
import { AxiosError } from 'axios';

const VehiculoForm: FC<ModelForm> = ({ updateSearch, closeFn }) => {
  const bookingForm = useBookingFormContext();

  const { createVehiculo, isMutatingVehiculo } = useVehiculo();
  const { empresa_id } = useSessionEmpresa();

  const form = useForm({
    initialValues: {
      patente: '',
      seguro: '',
      modelo: '',
      año: undefined,
      marca: '',
    },
    validate: {
      patente: (value) => (value !== '' ? null : 'Ingrese una patente'),
      seguro: (value) => (value !== '' ? null : 'Ingrese un número de seguro'),
      modelo: (value) => (value !== '' ? null : 'Ingrese un modelo'),
      año: (value) => (value ? null : 'Ingrese un año'),
      marca: (value) => (value !== '' ? null : 'Ingrese una marca'),
    },
  });

  const handleCreateVehiculo = async (newVehiculoData: VehiculoData) => {
    try {
      const vehiculo = await createVehiculo.mutateAsync(newVehiculoData);
      bookingForm.setFieldValue('vehiculo_id', vehiculo.id.toString());
      updateSearch(`${vehiculo.patente},  ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.año}`);
      closeFn();
      notifications.show({
        title: 'Vehículo creado!',
        color: 'green',
        message: `Se ha registrado el vehículo ${newVehiculoData.patente}`,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        notifications.show({
          title: 'Error al crear vehículo',
          color: 'red',
          message: `${error.response?.data?.detail ?? error.response?.statusText}`,
        });
      }
    }
  };

  return (
    <form
      onSubmit={form.onSubmit(() => {
        if (!isMutatingVehiculo) {
          handleCreateVehiculo({
            patente: form.values.patente,
            seguro: form.values.seguro,
            modelo: form.values.modelo,
            año: form.values.año,
            marca: form.values.marca,
            habilitado: true,
            empresa_id: empresa_id,
          });
        }
      })}
    >
      <Row>
        <TextInput
          className="col-md-4"
          withAsterisk
          label="Patente"
          placeholder="ABC123"
          {...form.getInputProps('patente')}
        />
        <TextInput
          className="col-md-8"
          withAsterisk
          label="Número de Seguro"
          placeholder="Ingrese el número de su seguro"
          {...form.getInputProps('seguro')}
        />
      </Row>
      <Row>
        <TextInput
          className="col-md-4"
          withAsterisk
          label="Marca"
          placeholder="Marca de su vehículo"
          {...form.getInputProps('marca')}
        />
        <TextInput
          className="col-md-4"
          withAsterisk
          label="Modelo"
          placeholder="Modelo de su vehículo"
          {...form.getInputProps('modelo')}
        />
        <NumberInput
          hideControls
          className="col-md-4"
          withAsterisk
          maxLength={4}
          max={2023}
          label="Año"
          placeholder="Año de su vehículo"
          {...form.getInputProps('año')}
        />
      </Row>
      <Row className="d-flex justify-content-end pt-3 pe-3">
        <Button type="submit" className="w-auto">
          {isMutatingVehiculo ? <Loader type="dots" color="white" /> : 'Crear vehículo'}
        </Button>
      </Row>
    </form>
  );
};

export default VehiculoForm;
