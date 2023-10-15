import { Collapse, Select, Switch, TextInput, Tooltip } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { FC, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useQueries } from 'react-query';
import api from '../../api';
import { Chofer } from '../../types';
import { useBookingFormContext } from '../../contexts/BookingFormContext';
import ChoferForm from './ChoferForm';

const StepChofer: FC = () => {
  const [showDriverForm, setShowDriverForm] = useState(false);

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
        <Row>
          <Col className="col-md-8 col-sm-12">
            <Select
              label="Busque un chófer"
              placeholder="Nombre o dni..."
              searchable
              limit={4}
              data={selectData}
              onChange={(value) => {
                form.setFieldValue('chofer', value);
              }}
            />
          </Col>
          <Col className="col-md-4 col-sm-12">
            <Tooltip label="Busca o crea un chófer" color="blue" position="bottom" withArrow>
              <TextInput
                readOnly
                required
                label="Chófer"
                {...form.getInputProps('chofer')}
                style={{ cursor: 'cursor' }}
              />
            </Tooltip>
          </Col>
        </Row>
        <div className="d-flex justify-content-center py-3 ">
          <Switch onChange={() => setShowDriverForm((prev) => !prev)} checked={showDriverForm} label="Nuevo chófer?" />
        </div>
        <Collapse in={showDriverForm}>
          <ChoferForm />
        </Collapse>
      </Card.Body>
    </Card>
  );
};

export default StepChofer;
