import { Button, Loader, NumberInput, TextInput } from '@mantine/core';
import { Row } from 'react-bootstrap';
import { notifications } from '@mantine/notifications';
import { Vehiculo } from '../../types';
import { useForm } from '@mantine/form';
import { useBookingFormContext } from '../../contexts/BookingFormContext';
import { FC } from 'react';
import useMutateVehiculos from '../../hooks/useMutateVehiculos';

const VehiculoForm: FC<{ updateSearch: (value: string) => void; closeFn: () => void }> = ({
  updateSearch,
  closeFn,
}) => {
  const createVehiculoMutation = useMutateVehiculos();

  const bookingForm = useBookingFormContext();

  const form = useForm({
    initialValues: {
      patente: '',
      seguro: '',
      modelo: '',
      año: 2020,
      marca: '',
    },
  });

  const handleCreateVehiculo = async (newVehiculoData: Vehiculo) => {
    try {
      const vehiculo = await createVehiculoMutation.mutateAsync(newVehiculoData);
      bookingForm.setFieldValue('vehiculo_id', vehiculo.patente);
      updateSearch(`Patente: ${vehiculo.patente},  ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.año}`);
      closeFn();
      notifications.show({
        title: 'Vehículo creado!',
        color: 'green',
        message: `Se ha registrado el vehículo ${newVehiculoData.patente}`,
      });
    } catch (error: any) {
      notifications.show({
        title: 'Error al crear vehículo',
        color: 'red',
        message: `${error.response.data?.detail ?? error.response.message}`,
      });
    }
  };

  return (
    <form
      onSubmit={form.onSubmit(() => {
        if (!createVehiculoMutation.isLoading) {
          handleCreateVehiculo({
            patente: form.values.patente,
            seguro: form.values.seguro,
            modelo: form.values.modelo,
            año: form.values.año,
            marca: form.values.marca,
            habilitado: true,
            empresa_id: 1,
          });
        }
      })}
    >
      <Row>
        <TextInput className="col-md-4" required label="Patente" placeholder="" {...form.getInputProps('patente')} />

        <TextInput
          className="col-md-8"
          required
          label="Número de Seguro"
          placeholder=""
          {...form.getInputProps('seguro')}
        />
      </Row>
      <Row>
        <TextInput className="col-md-4" required label="Marca" {...form.getInputProps('marca')} />
        <TextInput className="col-md-4" required label="Modelo" {...form.getInputProps('modelo')} />
        <NumberInput
          hideControls
          className="col-md-4"
          required
          label="Año"
          placeholder=""
          {...form.getInputProps('año')}
        />
      </Row>
      <Row className="d-flex justify-content-end pt-3 pe-3">
        <Button type="submit" className="w-auto">
          {createVehiculoMutation.isLoading ? <Loader type="dots" color="white" /> : 'Crear vehículo'}
        </Button>
      </Row>
    </form>
  );
};

export default VehiculoForm;
