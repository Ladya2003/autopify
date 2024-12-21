import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Car } from '../types/car';

const CarCard = ({ car }: { car: Car }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={
          car.images?.[0]?.startsWith('http')
            ? car.images[0]
            : `http://localhost:3000/assets/images/${car.images?.[0]
                ?.split('\\')
                .pop()}`
        }
        alt={`${car.brand} ${car.model}`}
      />
      <CardContent>
        <Typography variant="h6">
          {car.brand} {car.model}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Year: {car.year} | Mileage: {car.mileage} km
        </Typography>
        <Typography variant="body1" color="primary">
          ${car.price}
        </Typography>
        <Button onClick={() => navigate(`/view-car/${car._id}`)}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default CarCard;
