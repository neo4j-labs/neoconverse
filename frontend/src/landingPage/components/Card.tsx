import { Button, Typography, Widget } from '@neo4j-ndl/react';
import { CodeBracketIconOutline, EyeIconOutline } from '@neo4j-ndl/react/icons';
import { Link } from 'react-router-dom';
import './Card.css';

export default function Card({
  title,
  description,
  image,
  sourceCode,
  previewLink,
}: {
  title: string;
  description: string;
  image: string;
  sourceCode: string;
  previewLink: string;
}) {
  return (
    <div className='min-h-full'>
      <Widget className='n-bg-palette-neutral-bg-weak min-h-full' header='' isElevated={true}>
        <div className='card flex flex-col h-full'>
          <div className='h-[200px] w-full overflow-hidden relative flex items-center justify-center'>
            <a className='image-link' href={previewLink} target='_blank'>
              <img
                className='image n-rounded-lg w-full max-h-full object-contain'
                src={image}
                alt='Image description'
              />
              <div className='overlay-text w-full max-h-full object-contain'>
                <EyeIconOutline className='n-size-token-7' />
                <Typography variant='body-medium'>View live preview</Typography>
              </div>
            </a>
          </div>

          <hr className='ml-[15%] w-[70%] mt-4 border border-gray-400' />
          <div className='card-content p-3 flex flex-col gap-3 flex-grow'>
            <Typography variant='h4'>{title}</Typography>
            <div className='min-h-[80px] max-h-[80px] overflow-hidden'>
              <Typography variant='body-medium'>{description}</Typography>
            </div>
          </div>
          <div className='Footer w-full flex content-center justify-center pb-4'>
            <Link to={sourceCode} target='_blank'>
              <Button>
                <CodeBracketIconOutline className='n-size-token-7' /> &emsp; Source code
              </Button>
            </Link>
          </div>
        </div>
      </Widget>
    </div>
  );
}
