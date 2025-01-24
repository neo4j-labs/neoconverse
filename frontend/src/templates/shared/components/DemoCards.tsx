import Card from './Card';
import testImg from '../assets/cardImg.png';
import { Button, Typography } from '@neo4j-ndl/react';
import { AcademicCapIconOutline, RocketLaunchIconOutline } from '@neo4j-ndl/react/icons';

export default function DemoCards() {
  return (
    <div className='min-h-screen max-h-full p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 n-bg-palette-neutral-bg-default'>
      <Card layout='vertical' imageSrc={testImg} imageSize='full' className='h-auto w-96'>
        <Card.Header>Header text</Card.Header>
        <Card.Subheader>Subtitle or description</Card.Subheader>
        <Card.Content>
          <p>Some description about relatively important things but not too long since this is a card component.</p>
          <ul className='list-disc list-inside'>
            <li>1 Key information</li>
            <li>12.59 Key information</li>
            <li>3 Key information</li>
          </ul>
          <div className='flex flex-row min-w-full justify-between'>
            <Button size='small' color='danger' className='w-2/5 mx-2.5'>
              <Typography variant='body-small'>Cancel</Typography>
            </Button>
            <Button size='small' color='primary' className='w-2/5 mx-2.5'>
              <Typography variant='body-small'>Sign</Typography>
            </Button>
          </div>
        </Card.Content>
      </Card>

      <Card layout='vertical' imageSrc={testImg} imageSize='full' className='h-auto w-96'>
        <Card.Content>
          <p>Some description about relatively important things but not too long since this is a card component.</p>
          <ul className='list-disc list-inside'>
            <li>18 Key information</li>
            <li>12.59 Key information</li>
            <li>5 Key information</li>
          </ul>
        </Card.Content>
      </Card>

      <Card layout='vertical' className='h-auto w-96' iconSystem={RocketLaunchIconOutline}>
        <Card.Header>Header text</Card.Header>
        <Card.Content>
          <p>Some description about relatively important things but not too long since this is a card component.</p>
          <ul className='list-disc list-inside'>
            <li>18 Key information</li>
            <li>12.59 Key information</li>
            <li>5 Key information</li>
          </ul>
        </Card.Content>
      </Card>

      <Card layout='horizontal' imageSrc={testImg} imageSize='full' className='h-72'>
        <Card.Header>Header text</Card.Header>
        <Card.Subheader>Subtitle or description</Card.Subheader>
        <Card.Content>
          <p>Some description about relatively important things but not too long since this is a card component.</p>
          <ul className='list-disc list-inside'>
            <li>18 Key information</li>
            <li>12.59 Key information</li>
            <li>5 Key information</li>
          </ul>
          <div className='flex flex-row min-w-full justify-between'>
            <Button size='small' color='danger' className='w-2/5 mx-2.5'>
              <Typography variant='body-small'>Cancel</Typography>
            </Button>
            <Button size='small' color='primary' className='w-2/5 mx-2.5'>
              <Typography variant='body-small'>Sign</Typography>
            </Button>
          </div>
        </Card.Content>
      </Card>

      <Card layout='horizontal' imageSrc={testImg} imageSize='full' className='h-44'>
        <Card.Content>
          <p>Some description about relatively important things but not too long since this is a card component.</p>
          <ul className='list-disc list-inside'>
            <li>1 Key information</li>
            <li>12.59 Key information</li>
            <li>3 Key information</li>
          </ul>
        </Card.Content>
      </Card>

      <Card layout='horizontal' iconSystem={AcademicCapIconOutline}>
        <Card.Header>Header text</Card.Header>
        <Card.Content>
          <p>Some description about relatively important things but not too long since this is a card component.</p>
          <ul className='list-disc list-inside'>
            <li>18 Key information</li>
            <li>12.59 Key information</li>
            <li>5 Key information</li>
          </ul>
        </Card.Content>
      </Card>
    </div>
  );
}
