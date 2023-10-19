import { Button, Loader, TextInput } from '@mantine/core';
import { Row } from 'react-bootstrap';
import { notifications } from '@mantine/notifications';
import { ModelForm, ProductoData } from '../../types';
import { useForm } from '@mantine/form';
import { useBookingFormContext } from '../../contexts/BookingFormContext';
import { FC } from 'react';
import useMutateProductos from '../../hooks/useMutateProducto';
import { useMutationState } from '@tanstack/react-query';

const ProductoForm: FC<ModelForm> = ({ updateSearch, closeFn }) => {
  const createProductoMutation = useMutateProductos();

  const bookingForm = useBookingFormContext();

  const form = useForm({
    initialValues: {
      producto_nombre: '',
    },
    validate: {
      producto_nombre: (value) => (value !== '' ? null : 'Ingrese el nombre del producto'),
    },
  });

  const handleCreateProducto = async (newProductoData: ProductoData) => {
    try {
      const producto = await createProductoMutation.mutateAsync(newProductoData);
      bookingForm.setFieldValue('producto_id', producto.producto_id.toString());
      updateSearch(`${producto.producto_nombre}`);
      // updateValue(producto.producto_id.toString());
      closeFn();
      notifications.show({
        title: 'Producto creado!',
        color: 'green',
        message: `Se ha creado el producto ${newProductoData.producto_nombre}`,
      });
    } catch (error: any) {
      notifications.show({
        title: 'Error al crear producto',
        color: 'red',
        message: `${error.response.data?.detail}`,
      });
    }
  };

  const isMutatingProducto = useMutationState({
    filters: { status: 'pending', mutationKey: ['producto'] },
    select: (mutation) => mutation.state.variables,
  });

  return (
    <form
      onSubmit={form.onSubmit(() => {
        if (!(isMutatingProducto.length > 0)) {
          handleCreateProducto({
            producto_nombre: form.values.producto_nombre,
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
          {...form.getInputProps('producto_nombre')}
        />
      </Row>
      <Row className="d-flex justify-content-end pt-3 pe-3">
        <Button type="submit" className="w-auto">
          {isMutatingProducto.length > 0 ? <Loader type="dots" color="white" /> : 'Crear producto'}
        </Button>
      </Row>
    </form>
  );
};

export default ProductoForm;