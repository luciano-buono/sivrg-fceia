import React from 'react';
import { Card, Container, Row } from 'react-bootstrap';
import ResourceCard from '../../components/ResourceCard';
import useSession from '../../hooks/useSession';
import { Skeleton } from '@mantine/core';

const HomeAdmin = () => {
  const mockResources = [
    { icon: 'fa-solid fa-wheat-awn', initialQuantity: 70 },
    { icon: 'fa-solid fa-tree', initialQuantity: 20 },
    { icon: 'fa-solid fa-plant-wilt', initialQuantity: 40 },
  ];

  const { isLoading } = useSession();

  return (
    <Container className="d-flex flex-column justify-content-center align-content-center pt-2">
      <Card className="d-flex flex-wrap justify-content-center mb-2">
        <Card.Body>
          <Row className="justify-content-between px-3">
            {mockResources.map((r, index) => (
              <Skeleton visible={isLoading} className="w-auto">
                <ResourceCard key={index} {...r} />
              </Skeleton>
            ))}
          </Row>
        </Card.Body>
      </Card>
      <Skeleton visible={isLoading}>
        <Card>
          <Card.Body>
            <h1>Noticias</h1>
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
    </Container>
  );
};

export default HomeAdmin;
