import { Collapse, Switch } from '@mantine/core';
import { FC, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useBookingFormContext } from '../../contexts/BookingFormContext';
import VehiculoForm from '../../components/Forms/VehiculoForm';
import SearchInput from '../../components/Forms/Inputs/SearchInput';
import useVehiculo from '../../hooks/useVehiculo';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { Vehiculo } from '../../types';

const StepVehiculo: FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const closeForm = () => setShowForm(false);

  const updateSearch = (value: string) => {
    setSearchValue(value);
  };

  const form = useBookingFormContext();

  const updateValue = (value: string) => {
    form.setFieldValue('vehiculo_id', value);
  };

  const queryVehiculo = useQuery<Vehiculo[]>({
    queryKey: ['vehiculos'],
    queryFn: () => api.get('/vehiculos/').then((res) => res.data),
  });
  const { data: vehiculos } = queryVehiculo;

  const selectData = vehiculos?.map((vehiculo) => ({
    value: vehiculo.vehiculo_id.toString(),
    label: `${vehiculo.patente},  ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.año}`,
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
          searchPlaceholder="Busque un vehículo por patente, modelo o marca..."
          searchLabel="Seleccione un vehículo"
          valueLabel="Vehículo"
        />
        <div className="d-flex justify-content-center py-3 ">
          <Switch onChange={() => setShowForm((prev) => !prev)} checked={showForm} label="Nuevo vehículo?" />
        </div>
        <Collapse in={showForm}>
          <VehiculoForm updateSearch={updateSearch} updateValue={updateValue} closeFn={closeForm} />
        </Collapse>
      </Card.Body>
    </Card>
  );
};

export default StepVehiculo;
