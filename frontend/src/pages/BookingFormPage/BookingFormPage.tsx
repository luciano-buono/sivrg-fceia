import { Input, NumberInput, TextInput } from '@mantine/core';
import { DateInput, DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';

const BookingFormPage = () => {
  const form = useForm({
    initialValues: {
      name: '',
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
    },
  });

  return (
    <Container className="d-flex flex-column flex-wrap align-content-center pt-2">
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Row className="d-flex jusitfy-content-center">
          <Col className="pe-4">
            <Row>
              <Card className="mb-3">
                <Card.Body>
                  <Row>
                    <TextInput
                      className="w-50"
                      required
                      withAsterisk
                      label="Nombres"
                      placeholder=""
                      {...form.getInputProps('name')}
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
                </Card.Body>
              </Card>
            </Row>
            <Row>
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
                      <Input.Wrapper withAsterisk label="Tipo de grano">
                        <Input
                          component="select"
                          rightSection={<i className="fa-solid fa-angle-down" />}
                          {...form.getInputProps('grainType')}
                        >
                          <option value="Trigo">Trigo</option>
                          <option value="Cebada">Cebada</option>
                        </Input>
                      </Input.Wrapper>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <TextInput
                        required
                        withAsterisk
                        label="Modelo de camión"
                        placeholder=""
                        {...form.getInputProps('truckType')}
                      />
                    </Col>
                    <Col>
                      <NumberInput
                        required
                        withAsterisk
                        label="Toneladas aprox."
                        precision={2}
                        min={-1}
                        step={0.05}
                        {...form.getInputProps('totalWeight')}
                      />
                    </Col>
                  </Row>
                  <Col className="w-50">
                    <NumberInput
                      required
                      withAsterisk
                      label="Cantidad de acoplados"
                      placeholder=""
                      {...form.getInputProps('trailersQuantity')}
                    />
                  </Col>
                </Card.Body>
              </Card>
            </Row>
          </Col>
          <Col>
            <Row className="h-100">
              <Card className="mb-3 w-auto">
                <Card.Body>
                  <div className="pt-3 mb-3 fw-bold"> Seleccione una fecha:</div>
                  <Card className="d-flex justify-content-center">
                    <Card.Body>
                      <DatePicker {...form.getInputProps('bookingDate')} />
                    </Card.Body>
                  </Card>
                  <div className="d-flex mt-4 w-auto justify-content-center">
                    <Button variant="primary" type="submit">
                      Pedir turno!
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Row>
          </Col>
        </Row>
      </form>
    </Container>
  );
};

export default BookingFormPage;
