import { Skeleton, Text } from '@mantine/core';
import { Card } from 'react-bootstrap';
// import { useNavigate } from 'react-router';
import useSession from '../../hooks/useSession';
import EmpresaForm from '../../components/Forms/EmpresaForm';

const EmpresaPage = () => {
  // const navigate = useNavigate();
  const { isLoading } = useSession();

  return (
    <Card className="d-flex flex-wrap justify-content-center my-3">
      <Card.Body>
        <Text className="fs-2"> Cree su empresa </Text>
        <Skeleton visible={isLoading}>
          <Card className="d-flex flex-wrap justify-content-center mb-2">
            <Card.Body className="d-flex flex-wrap justify-content-center">
              <EmpresaForm />
            </Card.Body>
          </Card>
        </Skeleton>
      </Card.Body>
    </Card>
  );
};

export default EmpresaPage;
