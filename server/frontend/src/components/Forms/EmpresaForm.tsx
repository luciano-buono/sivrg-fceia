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
      empresa_nombre: '',
      empresa_RS: '',
      empresa_CUIT: undefined,
      empresa_direccion: 'Calle 123',
      empresa_localidad: 'Rosario',
      empresa_provincia: 'Santa Fe',
      empresa_pais: 'Argentina',
      empresa_telefono: '341872817',
      empresa_email: user?.email,
    },
    validate: {
      empresa_nombre: (value) => (value !== '' ? null : 'Ingrese un nombre'),
      empresa_RS: (value) => (value !== '' ? null : 'Ingrese un valor de RS'),
      empresa_CUIT: (value) => (value ? null : 'Ingrese un CUIT'),
      empresa_direccion: (value) => (value ? null : 'Ingrese una dirección'),
      empresa_localidad: (value) => (value ? null : 'Ingrese una localidad'),
      empresa_provincia: (value) => (value ? null : 'Ingrese una provincia'),
      empresa_pais: (value) => (value ? null : 'Ingrese un país'),
      empresa_telefono: (value) => (value !== '' ? null : 'Ingrese un teléfono'),
      empresa_email: (value) => (value !== '' ? null : 'Ingrese un email'),
    },
  });

  const handleCreateEmpresa = async (newEmpresaData: EmpresaData) => {
    try {
      await createEmpresa.mutateAsync(newEmpresaData);
      onSubmit();
      notifications.show({
        title: 'Empresa creada!',
        color: 'green',
        message: `Se ha registrado la empresa ${newEmpresaData.empresa_nombre}`,
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
            empresa_nombre: form.values.empresa_nombre,
            empresa_RS: form.values.empresa_RS,
            empresa_CUIT: form.values.empresa_CUIT,
            empresa_direccion: form.values.empresa_direccion,
            empresa_localidad: form.values.empresa_localidad,
            empresa_pais: form.values.empresa_pais,
            empresa_provincia: form.values.empresa_provincia,
            empresa_telefono: form.values.empresa_telefono,
            empresa_email: form.values.empresa_email,
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
          {...form.getInputProps('empresa_nombre')}
        />
        <NumberInput
          hideControls
          className="col-md-4"
          withAsterisk
          label="CUIT"
          placeholder="CUIT"
          {...form.getInputProps('empresa_CUIT')}
        />
        <TextInput
          className="col-md-4"
          withAsterisk
          label="RS"
          placeholder="Ingrese el RS"
          {...form.getInputProps('empresa_RS')}
        />
      </Row>
      <Row>
        <TextInput
          className="col-md-4"
          withAsterisk
          label="Localidad"
          placeholder="Localidad"
          {...form.getInputProps('empresa_localidad')}
        />
        <TextInput
          className="col-md-4"
          withAsterisk
          label="País"
          placeholder="País"
          {...form.getInputProps('empresa_pais')}
        />
        <TextInput
          className="col-md-4"
          withAsterisk
          label="Provincia"
          placeholder="Provincia"
          {...form.getInputProps('empresa_provincia')}
        />
        <TextInput
          className="col-md-4"
          withAsterisk
          label="Dirección"
          placeholder="Dirección de su empresa"
          {...form.getInputProps('empresa_direccion')}
        />
        <TextInput
          className="col-md-4"
          withAsterisk
          label="Teléfono"
          placeholder="Teléfono"
          {...form.getInputProps('empresa_telefono')}
        />
        <TextInput
          className="col-md-4"
          readOnly
          withAsterisk
          disabled
          label="Email"
          placeholder="Email"
          {...form.getInputProps('empresa_email')}
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
