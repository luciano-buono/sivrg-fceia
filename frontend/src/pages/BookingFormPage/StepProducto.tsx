import { Collapse, Switch } from '@mantine/core';
import { FC, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { Producto } from '../../types';
import { useBookingFormContext } from '../../contexts/BookingFormContext';
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

  const { data: productos } = useQuery({
    queryKey: ['productos'],
    queryFn: () => api.get<Producto[]>('/productos/').then((res) => res.data),
  });

  const selectData = productos?.map((producto, index) => ({
    value: `${producto.producto_nombre} ${index}`, //TODO: REMOVER, BORRAR LABES REPETIDOS EN LA DB
    label: `${producto.producto_nombre}`,
  }));

  return (
    <Card>
      <Card.Body>
        <SearchInput
          field={'producto_id'}
          data={selectData}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          form={form}
          searchPlaceholder="Busque un producto por nombre..."
          valuePlaceholder="Sin selección"
          searchLabel="Seleccione un producto"
          valueLabel="Producto"
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
