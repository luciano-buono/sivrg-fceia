import { Collapse, Select, Switch, TextInput, Tooltip } from '@mantine/core';
import { FC, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useQueries } from 'react-query';
import api from '../../api';
import { Producto, Vehiculo } from '../../types';
import { useBookingFormContext } from '../../contexts/BookingFormContext';
import VehiculoForm from '../../components/Forms/VehiculoForm';
import SearchInput from '../../components/Forms/Inputs/SearchInput';
import ProductoForm from '../../components/Forms/ProductoForm';

const StepProducto: FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const closeForm = () => setShowForm(false);

  const updateSearch = (value: string) => {
    setSearchValue(value);
  };

  const form = useBookingFormContext();

  const [productos] = useQueries([
    {
      queryKey: ['productos'],
      queryFn: () => api.get<Producto[]>('/productos/').then((res) => res.data),
    },
  ]);

  const selectData = productos.data?.map((producto, index) => ({
    value: `${producto.producto_nombre} ${index}`, //TODO: REMOVER, BORRAR LABES REPETIDOS EN LA DB
    label: `${producto.producto_nombre}`,
  }));

  return (
    <Card>
      <Card.Body>
        <SearchInput
          field={'vehiculo_id'}
          data={selectData}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          form={form}
          searchPlaceholder="Busque un producto por nombre..."
        />
        <div className="d-flex justify-content-center py-3 ">
          <Switch onChange={() => setShowForm((prev) => !prev)} checked={showForm} label="Nuevo producto?" />
        </div>
        <Collapse in={showForm}>
          <ProductoForm updateSearch={updateSearch} closeFn={closeForm} />
        </Collapse>
      </Card.Body>
    </Card>
  );
};

export default StepProducto;
