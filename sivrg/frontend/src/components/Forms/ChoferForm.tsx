import { Button, Loader, NumberInput, TextInput } from '@mantine/core';
import { Row } from 'react-bootstrap';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { ChoferData, ModelForm } from '../../types';
import { useForm } from '@mantine/form';
import useChoferes from '../../hooks/useChofer';
import { useBookingFormContext } from '../../contexts/BookingFormContext';
import { FC } from 'react';
import useSessionEmpresa from '../../hooks/useSessionEmpresa';
import { AxiosError } from 'axios';

const ChoferForm: FC<ModelForm> = ({ updateSearch, closeFn }) => {
  const bookingForm = useBookingFormContext();

  const { createChofer, isMutatingChofer } = useChoferes();
  const { empresa_id } = useSessionEmpresa();

  const form = useForm({
    initialValues: {
      firstname: '',
      lastname: '',
      documentNumber: '',
      birthdate: null,
      email: '',
    },
    validate: {
      firstname: (value) => (value !== '' ? null : 'Ingrese un nombre'),
      lastname: (value) => (value !== '' ? null : 'Ingrese un apellido'),
      documentNumber: (value) => (value !== '' ? null : 'Ingrese un documento'),
      birthdate: (value) => (value ? null : 'Ingrese una fecha'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Ingrese un email válido'),
    },
  });
  console.log(form);
  const handleCreateChofer = async (newChoferData: ChoferData) => {
    try {
      const chofer = await createChofer.mutateAsync(newChoferData);
      bookingForm.setFieldValue('id', chofer.id.toString());
      updateSearch(`${chofer.nombre} ${chofer.apellido}, ${chofer.dni.toString()}`);
      closeFn();
      notifications.show({
        title: 'Chofer creado!',
        color: 'green',
        message: `Se ha registrado a ${newChoferData.nombre} ${newChoferData.apellido} como chofer`,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        notifications.show({
          title: 'Error al crear chofer',
          color: 'red',
          message: `${error.response?.data.detail}`,
        });
      }
    }
  };

  return (
    <form
      onSubmit={form.onSubmit(() => {
        if (!isMutatingChofer) {
          handleCreateChofer({
            nombre: form.values.firstname,
            apellido: form.values.lastname,
            rfid_uid: 0,
            dni: parseInt(form.values.documentNumber),
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
          label="Nombre"
          placeholder="Nombre..."
          {...form.getInputProps('firstname')}
        />
        <TextInput
          className="col-md-4"
          withAsterisk
          label="Apellido"
          placeholder="Apellido..."
          {...form.getInputProps('lastname')}
        />
        <NumberInput
          className="col-md-4"
          allowNegative={false}
          allowDecimal={false}
          hideControls
          withAsterisk
          maxLength={8}
          label="DNI"
          placeholder="12345678..."
          {...form.getInputProps('documentNumber')}
        />
      </Row>
      <Row>
        <DateInput
          className="col-md-6"
          withAsterisk
          label="Fecha de nacimiento"
          placeholder="Seleccione una fecha"
          {...form.getInputProps('birthdate')}
        />
        <TextInput
          className="justify-content-center col-md-6"
          withAsterisk
          label="Email"
          placeholder="ejemplo@email.com"
          {...form.getInputProps('email')}
        />
      </Row>
      <Row className="d-flex justify-content-end pt-3 pe-3">
        <Button type="submit" className="w-auto">
          {isMutatingChofer ? <Loader type="dots" color="white" /> : 'Crear chofer'}
        </Button>
      </Row>
    </form>
  );
};

export default ChoferForm;
