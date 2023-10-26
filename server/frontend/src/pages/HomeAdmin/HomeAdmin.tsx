import { Card, Row } from 'react-bootstrap';
import ResourceCard from '../../components/ResourceCard';
import useSession from '../../hooks/useSession';
import { Skeleton, Text } from '@mantine/core';

const HomeAdmin = () => {
  const mockResources = [
    { icon: 'fa-solid fa-wheat-awn', initialQuantity: 70 },
    { icon: 'fa-solid fa-tree', initialQuantity: 20 },
    { icon: 'fa-solid fa-plant-wilt', initialQuantity: 40 },
  ];

  const { isLoading } = useSession();

  return (
    <>
      <Card className="d-flex w-100 justify-content-between my-3">
        <Card.Body>
          <Row className="justify-content-center px-3">
            {mockResources.map((r, index) => (
              <Skeleton visible={isLoading} className="w-auto py-1" key={index}>
                <ResourceCard {...r} />
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
                <ul>
                  <li>Noticia 1</li>
                  <li>Noticia 2</li>
                  <li>Noticia 3</li>
                </ul>
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
      </Skeleton>
    </>
  );
};

export default HomeAdmin;
