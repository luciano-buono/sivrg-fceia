import { FC, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useBookingFormContext } from '../../contexts/BookingFormContext';
import SearchInput from '../../components/Forms/Inputs/SearchInput';
import useProducto from '../../hooks/useProducto';

const StepProducto: FC = () => {
  const [searchValue, setSearchValue] = useState('');

  const form = useBookingFormContext();

  const { queryProducto } = useProducto();
  const { data: productos } = queryProducto;

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
