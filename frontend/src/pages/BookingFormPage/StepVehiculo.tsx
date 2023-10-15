import { Input, NumberInput, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { FC } from 'react';
import { Card, Col, FormLabel, Row } from 'react-bootstrap';
import { useQueries } from 'react-query';
import api from '../../api';
import { Chofer } from '../../types';
import { useBookingFormContext } from '../../contexts/BookingFormContext';

const StepVehiculo: FC = () => {
  const [productos] = useQueries([
    {
      queryKey: ['productos'],
      queryFn: () => api.get<Chofer[]>('/productos/').then((res) => res.data),
    },
  ]);

  const form = useBookingFormContext();

  return (
    <Card className="mb-3">
      <Card.Body>
        <div>
          <FormLabel className="fw-bold py-1"> Datos de camión </FormLabel>
          <Row>
            <Col>
              <TextInput required label="Modelo de camión" {...form.getInputProps('truckType')} />
            </Col>
          </Row>
          <Row>
            <Col className="w-25">
              <TextInput required label="Patente" placeholder="" {...form.getInputProps('plate')} />
            </Col>
            <Col className="w-50">
              <NumberInput
                required
                label="Nro. de acoplados"
                placeholder=""
                {...form.getInputProps('trailersQuantity')}
              />
            </Col>
          </Row>
        </div>
        <div>
          <FormLabel className="fw-bold py-1"> Datos de producto </FormLabel>
          <Row>
            <Col>
              <Input.Wrapper label="Tipo de grano">
                <Input
                  component="select"
                  rightSection={<i className="fa-solid fa-angle-down" />}
                  {...form.getInputProps('grainType')}
                >
                  {productos.data?.map((product: any) => (
                    <option key={product.producto_nombre} value={product.producto_nombre}>
                      {product.producto_nombre}
                    </option>
                  ))}
                </Input>
              </Input.Wrapper>
            </Col>
            <Col>
              <NumberInput
                required
                label="Toneladas aprox."
                decimalScale={2}
                min={-1}
                step={0.05}
                {...form.getInputProps('totalWeight')}
              />
            </Col>
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StepVehiculo;
