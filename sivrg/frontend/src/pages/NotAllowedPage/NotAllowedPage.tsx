import { Card } from 'react-bootstrap';
import useSession from '../../hooks/useSession';

const NotAllowedPage = () => {
  const { user } = useSession();

  return (
    <Card className="m-3">
      <Card.Body>{user.roles ? `Acceso restringido para ${user.roles[0]}` : 'Acceso restringido'}</Card.Body>
    </Card>
  );
};

export default NotAllowedPage;
