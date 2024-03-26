import { Button, Loader, NumberInput, TextInput } from '@mantine/core';
import { Row } from 'react-bootstrap';
import { notifications } from '@mantine/notifications';
import { EmpresaData } from '../../types';
import { useForm } from '@mantine/form';
import { FC } from 'react';
import useEmpresa from '../../hooks/useEmpresa';
import useSession from '../../hooks/useSession';
import { AxiosError } from 'axios';

const EmpresaForm: FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
  const { createEmpresa, isMutatingEmpresa } = useEmpresa();
  const { user } = useSession();

  const form = useForm<EmpresaData>({
    initialValues: {
      nombre: '',
      RS: '',
      CUIT: undefined,
      direccion: 'Calle 123',
      localidad: 'Rosario',
      provincia: 'Santa Fe',
      pais: 'Argentina',
      telefono: '341872817',
      email: user?.email,
    },
    validate: {
      nombre: (value) => (value !== '' ? null : 'Ingrese un nombre'),
      RS: (value) => (value !== '' ? null : 'Ingrese un valor de RS'),
      CUIT: (value) => (value ? null : 'Ingrese un CUIT'),
      direccion: (value) => (value ? null : 'Ingrese una dirección'),
      localidad: (value) => (value ? null : 'Ingrese una localidad'),
      provincia: (value) => (value ? null : 'Ingrese una provincia'),
      pais: (value) => (value ? null : 'Ingrese un país'),
      telefono: (value) => (value !== '' ? null : 'Ingrese un teléfono'),
      email: (value) => (value !== '' ? null : 'Ingrese un email'),
    },
  });

  const handleCreateEmpresa = async (newEmpresaData: EmpresaData) => {
    try {
      await createEmpresa.mutateAsync(newEmpresaData);
      onSubmit();
      notifications.show({
        title: 'Empresa creada!',
        color: 'green',
        message: `Se ha registrado la empresa ${newEmpresaData.nombre}`,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        notifications.show({
          title: 'Error al crear empresa',
          color: 'red',
          message: `${error.response?.data?.detail ?? error.response?.statusText}`,
        });
      }
    }
  };

  return (
    <form
      onSubmit={form.onSubmit(() => {
        if (!isMutatingEmpresa) {
          handleCreateEmpresa({
            nombre: form.values.nombre,
            RS: form.values.RS,
            CUIT: form.values.CUIT,
            direccion: form.values.direccion,
            localidad: form.values.localidad,
            pais: form.values.pais,
            provincia: form.values.provincia,
            telefono: form.values.telefono,
            email: form.values.email,
          });
        }
      })}
    >
      <Row>
        <TextInput
          className="col-md-4"
          withAsterisk
          label="Nombre"
          placeholder="Nombre"
          {...form.getInputProps('nombre')}
        />
        <NumberInput
          hideControls
          className="col-md-4"
          withAsterisk
          label="CUIT"
          placeholder="CUIT"
          {...form.getInputProps('CUIT')}
        />
        <TextInput
          className="col-md-4"
          withAsterisk
          label="RS"
          placeholder="Ingrese el RS"
          {...form.getInputProps('RS')}
        />
      </Row>
      <Row>
        <TextInput
          className="col-md-4"
          withAsterisk
          label="Localidad"
          placeholder="Localidad"
          {...form.getInputProps('localidad')}
        />
        <TextInput
          className="col-md-4"
          withAsterisk
          label="País"
          placeholder="País"
          {...form.getInputProps('pais')}
        />
        <TextInput
          className="col-md-4"
          withAsterisk
          label="Provincia"
          placeholder="Provincia"
          {...form.getInputProps('provincia')}
        />
        <TextInput
          className="col-md-4"
          withAsterisk
          label="Dirección"
          placeholder="Dirección de su empresa"
          {...form.getInputProps('direccion')}
        />
        <TextInput
          className="col-md-4"
          withAsterisk
          label="Teléfono"
          placeholder="Teléfono"
          {...form.getInputProps('telefono')}
        />
        <TextInput
          className="col-md-4"
          readOnly
          withAsterisk
          disabled
          label="Email"
          placeholder="Email"
          {...form.getInputProps('email')}
        />
      </Row>
      <Row className="d-flex justify-content-end pt-3 pe-3">
        <Button type="submit" className="w-auto">
          {isMutatingEmpresa ? <Loader type="dots" color="white" /> : 'Crear empresa'}
        </Button>
      </Row>
    </form>
  );
};

export default EmpresaForm;
