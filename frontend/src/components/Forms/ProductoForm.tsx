import { Button, Loader, NumberInput, TextInput } from '@mantine/core';
import { Row } from 'react-bootstrap';
import { notifications } from '@mantine/notifications';
import { Producto } from '../../types';
import { useForm } from '@mantine/form';
import { useBookingFormContext } from '../../contexts/BookingFormContext';
import { FC } from 'react';
import useMutateProductos from '../../hooks/useMutateProducto';

const ProductoForm: FC<{ updateSearch: (value: string) => void; closeFn: () => void }> = ({
  updateSearch,
  closeFn,
}) => {
  const createProductoMutation = useMutateProductos();

  const bookingForm = useBookingFormContext();

  const form = useForm({
    initialValues: {
      producto_nombre: '',
    },
  });

  const handleCreateProducto = async (newProductoData: Producto) => {
    try {
      const producto = await createProductoMutation.mutateAsync(newProductoData);
      bookingForm.setFieldValue('producto_id', producto.producto_nombre);
      updateSearch(`${producto.producto_nombre}`);
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

  return (
    <form
      onSubmit={form.onSubmit(() => {
        if (!createProductoMutation.isLoading) {
          handleCreateProducto({
            producto_nombre: form.values.producto_nombre,
          });
        }
      })}
    >
      <Row>
        <TextInput
          className="col-md-12"
          required
          label="Nombre"
          placeholder=""
          {...form.getInputProps('producto_nombre')}
        />
      </Row>
      <Row className="d-flex justify-content-end pt-3 pe-3">
        <Button type="submit" className="w-auto">
          {createProductoMutation.isLoading ? <Loader type="dots" color="white" /> : 'Crear producto'}
        </Button>
      </Row>
    </form>
  );
};

export default ProductoForm;
