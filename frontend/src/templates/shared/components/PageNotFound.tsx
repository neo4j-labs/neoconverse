import { Button, Flex, Typography } from '@neo4j-ndl/react';
import { useNavigate } from 'react-router-dom';

import NotFoundImg from '../assets/NotFound.png';

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className='n-bg-palette-neutral-bg-default flex items-center justify-center min-h-screen p-12'>
      <img src={NotFoundImg} className='p-12' />
      <Flex gap='8'>
        <Typography variant='h1'>404 - Page Not Found</Typography>
        <Typography variant='body-medium'>
          <p>It looks like the page you are trying to access either does not exists or is currently unavailable</p>
          <p>Please try again later and if the problem persists contact us</p>
        </Typography>
        <Button onClick={() => navigate(-1)}>Go back</Button>
      </Flex>
    </div>
  );
}
