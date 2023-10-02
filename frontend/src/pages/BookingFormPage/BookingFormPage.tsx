import React from 'react';
import { Button, Input, NumberInput, Select, Skeleton, Switch, TextInput } from '@mantine/core';
import { DateInput, DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { Card, Col, Collapse, Container, Row } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { Product } from '../../types';
import useSession from '../../hooks/useSession';

const BookingFormPage = () => {
  const form = useForm({
    initialValues: {
      firstname: '',
      lastname: '',
      documentNumber: '',
      birthdate: null,
      email: '',
      bookingDate: null,
      plate: '',
      truckType: '',
      trailersQuantity: 0,
      grainType: '',
      totalWeight: 0,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      bookingDate: (value) => (value !== null ? null : 'Please select a date'),
    },
  });

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [showDriverForm, setShowDriverForm] = useState(false);

  const { isLoading } = useSession();

  const { data } = useQuery('granos', async () => fetch('http://192.168.2.150:5001/productos/').then((r) => r.json()));

  const excludedDates = [today, tomorrow];

  return (
    <Container className="d-flex flex-column flex-wrap align-content-center pt-2">
      <form
        onSubmit={form.onSubmit((values) => {
          console.log(values);
          notifications.show({
            title: 'Turno agendado!',
            color: 'green',
            message: 'Se ha agengado su turno con éxito',
          });
        })}
      >
        <Row className="d-flex jusitfy-content-center">
          <Col className="pe-3">
            <Skeleton visible={isLoading}>
              <Row>
                <Card className="mb-3">
                  <Card.Body>
                    <Select
                      disabled={showDriverForm}
                      label="Seleccione chofer"
                      placeholder="Busque chofer por nombre"
                      data={['Juan', 'Julian', 'Raul', 'Mariano']}
                      searchable
                    />
                    <div className="d-flex justify-content-center py-3 ">
                      <Switch
                        onChange={() => setShowDriverForm((prev) => !prev)}
                        checked={showDriverForm}
                        label="Nuevo chofer?"
                      />
                    </div>
                    <Collapse in={showDriverForm}>
                      <div>
                        <Row>
                          <TextInput
                            className="w-50"
                            required
                            withAsterisk
                            label="Nombre"
                            placeholder=""
                            {...form.getInputProps('firstname')}
                          />
                          <TextInput
                            className="w-50"
                            required
                            withAsterisk
                            label="Apellido"
                            placeholder=""
                            {...form.getInputProps('lastname')}
                          />
                        </Row>
                        <Row>
                          <NumberInput
                            className="w-50"
                            required
                            withAsterisk
                            label="DNI"
                            placeholder=""
                            {...form.getInputProps('documentNumber')}
                          />
                          <DateInput
                            className="w-50"
                            required
                            withAsterisk
                            label="Fecha de nacimiento"
                            {...form.getInputProps('birthdate')}
                          />
                        </Row>
                        <TextInput
                          required
                          withAsterisk
                          label="Email"
                          placeholder="your@email.com"
                          {...form.getInputProps('email')}
                        />
                      </div>
                    </Collapse>
                  </Card.Body>
                </Card>
              </Row>
            </Skeleton>
            <Skeleton visible={isLoading} mt={4}>
              <Row style={{ height: 'auto' }}>
                <Card className="mb-3">
                  <Card.Body>
                    <Row>
                      <Col className="w-25">
                        <TextInput
                          required
                          withAsterisk
                          label="Patente"
                          placeholder=""
                          {...form.getInputProps('plate')}
                        />
                      </Col>
                      <Col className="w-50">
                        <NumberInput
                          required
                          withAsterisk
                          label="Número de acoplados"
                          placeholder=""
                          {...form.getInputProps('trailersQuantity')}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Input.Wrapper withAsterisk label="Tipo de grano">
                          <Input
                            component="select"
                            rightSection={<i className="fa-solid fa-angle-down" />}
                            {...form.getInputProps('grainType')}
                          >
                            {data?.map((product: Product) => (
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
                          withAsterisk
                          label="Toneladas aprox."
                          decimalScale={2}
                          min={-1}
                          step={0.05}
                          {...form.getInputProps('totalWeight')}
                        />
                      </Col>
                    </Row>
                    <Col>
                      <TextInput
                        required
                        withAsterisk
                        label="Modelo de camión"
                        placeholder=""
                        {...form.getInputProps('truckType')}
                      />
                    </Col>
                  </Card.Body>
                </Card>
              </Row>
            </Skeleton>
          </Col>
          <Col>
            <Row className="w-auto">
              <Skeleton visible={isLoading}>
                <Card className="h-100">
                  <Card.Body>
                    <div className="pt-2 pb-2 fw-bold"> Seleccione una fecha:</div>
                    <Card className="d-flex justify-content-center">
                      <Card.Body>
                        <DatePicker
                          allowDeselect
                          excludeDate={(date) =>
                            excludedDates.some(
                              (excludedDate) => excludedDate.toLocaleDateString() === date.toLocaleDateString(),
                            )
                          }
                          getDayProps={(date) => {
                            if (
                              excludedDates.some(
                                (excludedDate) => excludedDate.toLocaleDateString() === date.toLocaleDateString(),
                              )
                            ) {
                              return {
                                style: () => ({
                                  backgroundColor: 'red',
                                  color: 'white',
                                  pointerEvents: 'none',
                                }),
                              };
                            }

                            return {};
                          }}
                          {...form.getInputProps('bookingDate')}
                        />
                      </Card.Body>
                    </Card>
                    <div className="d-flex mt-4 w-auto justify-content-center flex-column">
                      <span className="pb-2 w-auto d-flex justify-content-center text-danger  ">
                        {form.errors.bookingDate}
                      </span>
                      <Button type="submit">Pedir turno!</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Skeleton>
            </Row>
          </Col>
        </Row>
      </form>
    </Container>
  );
};

export default BookingFormPage;
