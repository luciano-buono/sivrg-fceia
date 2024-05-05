import { Button, Loader, TextInput } from '@mantine/core';
import { Row } from 'react-bootstrap';
import { notifications } from '@mantine/notifications';
import { ModelForm, ProductoData } from '../../types';
import { useForm } from '@mantine/form';
import { useBookingFormContext } from '../../contexts/BookingFormContext';
import { FC } from 'react';
import useProducto from '../../hooks/useProducto';
import { AxiosError } from 'axios';

const ProductoForm: FC<ModelForm> = ({ updateSearch, closeFn }) => {
  const { createProducto, isMutatingProducto } = useProducto();

  const bookingForm = useBookingFormContext();

  const form = useForm({
    initialValues: {
      nombre: '',
    },
    validate: {
      nombre: (value) => (value !== '' ? null : 'Ingrese el nombre del producto'),
    },
  });

  const handleCreateProducto = async (newProductoData: ProductoData) => {
    try {
      const producto = await createProducto.mutateAsync(newProductoData);
      bookingForm.setFieldValue('producto_id', producto.id.toString());
      updateSearch(`${producto.nombre}`);
      closeFn();
      notifications.show({
        title: 'Producto creado!',
        color: 'green',
        message: `Se ha creado el producto ${newProductoData.nombre}`,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        notifications.show({
          title: 'Error al crear producto',
          color: 'red',
          message: `${error?.response?.data?.detail}`,
        });
      }
    }
  };

  return (
    <form
      onSubmit={form.onSubmit(() => {
        if (!isMutatingProducto) {
          handleCreateProducto({
            nombre: form.values.nombre,
          });
        }
      })}
    >
      <Row className="justify-content-center">
        <TextInput
          className="col-md-8"
          withAsterisk
          label="Nombre"
          placeholder="Nombre del producto"
          {...form.getInputProps('nombre')}
        />
      </Row>
      <Row className="d-flex justify-content-end pt-3 pe-3">
        <Button type="submit" className="w-auto">
          {isMutatingProducto ? <Loader type="dots" color="white" /> : 'Crear producto'}
        </Button>
      </Row>
    </form>
  );
};

export default ProductoForm;
