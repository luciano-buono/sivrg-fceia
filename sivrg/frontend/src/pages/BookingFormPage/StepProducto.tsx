import { FC, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useBookingFormContext } from '../../contexts/BookingFormContext';
import SearchInput from '../../components/Forms/Inputs/SearchInput';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { Producto } from '../../types';

const StepProducto: FC = () => {
  const [searchValue, setSearchValue] = useState('');

  const form = useBookingFormContext();

  const queryProducto = useQuery<Producto[]>({
    queryKey: ['productos'],
    queryFn: () => api.get('/productos/').then((res) => res.data),
  });
  const { data: productos } = queryProducto;

  const selectData = productos?.map((producto) => ({
    value: `${producto.id}`,
    label: `${producto.nombre}`,
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
          searchLabel="Seleccione un producto"
          valueLabel="Producto"
        />
      </Card.Body>
    </Card>
  );
};

export default StepProducto;
