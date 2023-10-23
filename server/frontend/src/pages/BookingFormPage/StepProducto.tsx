import { FC, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { Producto } from '../../types';
import { useBookingFormContext } from '../../contexts/BookingFormContext';
import SearchInput from '../../components/Forms/Inputs/SearchInput';

const StepProducto: FC = () => {
  const [searchValue, setSearchValue] = useState('');

  const form = useBookingFormContext();

  const { data: productos } = useQuery({
    queryKey: ['productos'],
    queryFn: () => api.get<Producto[]>('/productos/').then((res) => res.data),
  });

  const selectData = productos?.map((producto) => ({
    value: `${producto.producto_id}`,
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
          searchLabel="Seleccione un producto"
          valueLabel="Producto"
        />
      </Card.Body>
    </Card>
  );
};

export default StepProducto;
