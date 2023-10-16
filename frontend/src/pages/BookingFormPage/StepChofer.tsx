import { Button, CloseButton, Collapse, Select, Switch, TextInput, Tooltip } from '@mantine/core';
import { FC, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useQueries } from 'react-query';
import api from '../../api';
import { Chofer } from '../../types';
import { useBookingFormContext } from '../../contexts/BookingFormContext';
import ChoferForm from '../../components/Forms/ChoferForm';
import SearchInput from '../../components/Forms/Inputs/SearchInput';

const StepChofer: FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const closeForm = () => setShowForm(false);

  const updateSearch = (value: string) => {
    setSearchValue(value);
  };

  const form = useBookingFormContext();

  const [choferes] = useQueries([
    {
      queryKey: ['choferes'],
      queryFn: () => api.get<Chofer[]>('/choferes/').then((res) => res.data),
    },
  ]);

  const selectData = choferes.data?.map((chofer) => ({
    value: chofer.dni.toString(),
    label: `${chofer.nombre} ${chofer.apellido}, DNI: ${chofer.dni.toString()}`,
  }));

  return (
    <Card>
      <Card.Body>
        <SearchInput
          field={'chofer_id'}
          data={selectData}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          form={form}
          searchPlaceholder="Busque un chofer por nombre o dni..."
        />
        <div className="d-flex justify-content-center py-3 ">
          <Switch onChange={() => setShowForm((prev) => !prev)} checked={showForm} label="Nuevo chofer?" />
        </div>
        <Collapse in={showForm}>
          <ChoferForm updateSearch={updateSearch} closeFn={closeForm} />
        </Collapse>
      </Card.Body>
    </Card>
  );
};

export default StepChofer;
