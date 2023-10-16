import { Collapse, Switch } from '@mantine/core';
import { FC, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useQueries } from 'react-query';
import api from '../../api';
import { Vehiculo } from '../../types';
import { useBookingFormContext } from '../../contexts/BookingFormContext';
import VehiculoForm from '../../components/Forms/VehiculoForm';
import SearchInput from '../../components/Forms/Inputs/SearchInput';

const StepVehiculo: FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const closeForm = () => setShowForm(false);

  const updateSearch = (value: string) => {
    setSearchValue(value);
  };

  const form = useBookingFormContext();

  const [vehiculos] = useQueries([
    {
      queryKey: ['vehiculos'],
      queryFn: () => api.get<Vehiculo[]>('/vehiculos/').then((res) => res.data),
    },
  ]);

  const selectData = vehiculos.data?.map((vehiculo) => ({
    value: vehiculo.patente,
    label: `Patente: ${vehiculo.patente},  ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.año}`,
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
        />
        <div className="d-flex justify-content-center py-3 ">
          <Switch onChange={() => setShowForm((prev) => !prev)} checked={showForm} label="Nuevo vehículo?" />
        </div>
        <Collapse in={showForm}>
          <VehiculoForm updateSearch={updateSearch} closeFn={closeForm} />
        </Collapse>
      </Card.Body>
    </Card>
  );
};

export default StepVehiculo;
