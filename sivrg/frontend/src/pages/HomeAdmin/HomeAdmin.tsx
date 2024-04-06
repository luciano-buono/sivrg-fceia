import { Card, Row } from 'react-bootstrap';
import ResourceCard from '../../components/ResourceCard';
import useSession from '../../hooks/useSession';
import { Skeleton, Text } from '@mantine/core';
import { useNewsContext } from '../../contexts/NewsContext';
import { useQuery } from '@tanstack/react-query';
import { Silo } from '../../types';
import api from '../../api';

const HomeAdmin = () => {

  const queryTurno = useQuery<Silo[]>({
    queryKey: ['silos'],
    queryFn: () =>
      api.get('/silos/').then((res) => res.data),
  });
  const { data: silos } = queryTurno;


  const { isLoading } = useSession();
  const state = useNewsContext();
  return (
    <>
      <Card className="d-flex w-100 justify-content-between my-3">
        <Card.Body>
          <Row className="justify-content-center px-3">
            {silos?.map((silo, index) => (
              <Skeleton visible={isLoading} className="w-auto py-1" key={index}>
                <ResourceCard silo={silo} />
              </Skeleton>
            ))}
          </Row>
        </Card.Body>
      </Card>
      <Skeleton visible={isLoading}>
        <Card>
          <Card.Body>
            <Text className="fs-2">Noticias</Text>
            <Card>
              <Card.Body>
                <ul>{state?.news.map((n: string, index: number) => <li key={index + n}>{n}</li>)}</ul>
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
      </Skeleton>
    </>
  );
};

export default HomeAdmin;
