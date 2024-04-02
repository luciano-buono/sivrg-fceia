import { Collapse, Switch } from '@mantine/core';
import { FC, useState } from 'react';
import { Card, Container } from 'react-bootstrap';
import { useBookingFormContext } from '../../contexts/BookingFormContext';
import ChoferForm from '../../components/Forms/ChoferForm';
import SearchInput from '../../components/Forms/Inputs/SearchInput';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { Chofer } from '../../types';

const StepChofer: FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const closeForm = () => setShowForm(false);

  const updateSearch = (value: string) => {
    setSearchValue(value);
  };
  const form = useBookingFormContext();

  const updateValue = (value: string) => {
    form.setFieldValue('chofer_id', value);
  };

  const queryChofer = useQuery<Chofer[]>({
    queryKey: ['choferes'],
    queryFn: () => api.get('/choferes/').then((res) => res.data),
  });
  const { data: choferes } = queryChofer;

  const selectData = choferes?.map((chofer) => {
    console.log(chofer);
    return {
      value: chofer.id.toString(),
      label: `${chofer.nombre} ${chofer.apellido}, ${chofer.dni.toString()}`,
    };
  });

  return (
    <Container>
      <Card>
        <Card.Body>
          <SearchInput
            field={'chofer_id'}
            data={selectData}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            form={form}
            searchPlaceholder="Busque un chofer por nombre o dni..."
            searchLabel="Seleccione un chofer"
            valueLabel="Chofer"
          />
          <div className="d-flex justify-content-center py-3 ">
            <Switch onChange={() => setShowForm((prev) => !prev)} checked={showForm} label="Nuevo chofer?" />
          </div>
          <Collapse in={showForm}>
            <ChoferForm updateSearch={updateSearch} updateValue={updateValue} closeFn={closeForm} />
          </Collapse>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StepChofer;
