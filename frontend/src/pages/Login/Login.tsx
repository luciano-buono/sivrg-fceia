import { Box, Group, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Button, Card, Container, Row } from 'react-bootstrap';

const Login = () => {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  return (
    <Container className="d-flex flex-wrap flex-column justify-content-center align-content-center pt-2">
      <Card className="d-flex justify-content-center h-100 w-100">
        <Card.Body>
          <h1> Iniciar sesión </h1>
          <Row className="d-flex justify-content-center">
            <Card style={{ height: '300px', width: '300px' }}>
              <Card.Body>
                <Box maw={300} mx="auto">
                  <form onSubmit={form.onSubmit((values) => console.log(values))}>
                    <TextInput label="Email" placeholder="your@email.com" {...form.getInputProps('email')} />
                    <PasswordInput label="Contraseña" placeholder="contraseña" {...form.getInputProps('password')} />
                    <Group position="right" mt="md">
                      <Button type="submit">Iniciar Sesión</Button>
                    </Group>
                  </form>
                </Box>
              </Card.Body>
            </Card>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
