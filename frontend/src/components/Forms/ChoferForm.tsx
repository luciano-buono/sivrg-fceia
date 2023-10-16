import { Button, Loader, NumberInput, TextInput } from '@mantine/core';
import { Row } from 'react-bootstrap';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { ChoferData } from '../../types';
import { useForm } from '@mantine/form';
import useMutateChoferes from '../../hooks/useMutateChoferes';
import { useBookingFormContext } from '../../contexts/BookingFormContext';
import { FC } from 'react';

const ChoferForm: FC<{ updateSearch: (value: string) => void; closeFn: () => void }> = ({ updateSearch, closeFn }) => {
  const createChoferMutation = useMutateChoferes();

  const bookingForm = useBookingFormContext();

  const form = useForm({
    initialValues: {
      firstname: '',
      lastname: '',
      documentNumber: '',
      birthdate: null,
      email: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const handleCreateChofer = async (newChoferData: ChoferData) => {
    try {
      const chofer = await createChoferMutation.mutateAsync(newChoferData);
      bookingForm.setFieldValue('chofer_id', chofer.dni.toString());
      updateSearch(`${chofer.nombre} ${chofer.apellido}, DNI: ${chofer.dni.toString()}`);
      closeFn();
      notifications.show({
        title: 'Chofer creado!',
        color: 'green',
        message: `Se ha registrado a ${newChoferData.nombre} ${newChoferData.apellido} como chofer`,
      });
    } catch (error: any) {
      notifications.show({
        title: 'Error al crear chofer',
        color: 'red',
        message: `${error.response.data.detail}`,
      });
    }
  };

  return (
    <form
      onSubmit={form.onSubmit(() => {
        if (!createChoferMutation.isLoading) {
          handleCreateChofer({
            nombre: form.values.firstname,
            apellido: form.values.lastname,
            rfid_uid: 0,
            dni: parseInt(form.values.documentNumber),
            habilitado: true,
            empresa_id: 1,
          });
        }
      })}
    >
      <Row>
        <TextInput className="w-50" required label="Nombre" placeholder="" {...form.getInputProps('firstname')} />
        <TextInput className="w-50" required label="Apellido" placeholder="" {...form.getInputProps('lastname')} />
      </Row>
      <Row>
        <NumberInput className="w-50" required label="DNI" placeholder="" {...form.getInputProps('documentNumber')} />
        <DateInput className="w-50" required label="Fecha de nacimiento" {...form.getInputProps('birthdate')} />
      </Row>
      <TextInput
        className="w-50"
        required
        label="Email"
        placeholder="your@email.com"
        {...form.getInputProps('email')}
      />
      <Row className="d-flex justify-content-end pt-3 pe-3">
        <Button type="submit" className="w-auto">
          {createChoferMutation.isLoading ? <Loader type="dots" color="white" /> : 'Crear chofer'}
        </Button>
      </Row>
    </form>
  );
};

export default ChoferForm;
