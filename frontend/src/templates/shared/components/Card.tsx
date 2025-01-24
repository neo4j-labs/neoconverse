import { Box, Typography } from '@neo4j-ndl/react';
import React, { ReactNode } from 'react';

interface CardProps {
  layout: 'vertical' | 'horizontal';
  imageSrc?: string;
  imageSize?: 'full' | 'small';
  iconSystem?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children: ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: ReactNode;
}

interface CardSubheaderProps {
  children: ReactNode;
}

interface CardContentProps {
  children: ReactNode;
}

const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Subheader: React.FC<CardSubheaderProps>;
  Content: React.FC<CardContentProps>;
} = ({ layout, imageSrc, imageSize = 'small', iconSystem, children, className }) => {
  return (
    <Box
      className={`n-bg-palette-neutral-bg-weak border rounded-3xl shadow-lg mx-auto ${
        layout === 'horizontal' ? 'flex' : 'block'
      } ${className}`}
      style={{ padding: 0 }}
    >
      <div
        className={`n-bg-palette-neutral-bg-weak border rounded-3xl shadow-lg mx-auto ${
          layout === 'horizontal' ? 'flex' : 'block'
        } ${className}`}
      >
        {imageSrc && (
          <div
            className={`relative overflow-hidden ${
              layout === 'horizontal'
                ? imageSize === 'full'
                  ? 'w-1/3'
                  : 'w-16 h-16 mr-4'
                : imageSize === 'full'
                ? 'w-full h-64'
                : 'w-16 h-16 mb-4'
            }`}
          >
            <img
              src={imageSrc}
              alt='Card Image'
              className={`${imageSize === 'full' ? 'object-cover w-full h-full' : 'object-cover w-16 h-16'} ${
                layout === 'horizontal' ? 'rounded-tl-3xl rounded-bl-3xl' : 'rounded-tl-3xl rounded-tr-3xl'
              }`}
            />
          </div>
        )}
        {iconSystem && <div className='p-4'>{React.createElement(iconSystem, { className: 'w-8 h-8' })}</div>}
        <div className={`p-4 ${layout === 'horizontal' ? 'flex flex-col justify-between w-2/3' : ''}`}>{children}</div>
      </div>
    </Box>
  );
};

const Header: React.FC<CardHeaderProps> = ({ children }) => (
  <Typography variant='h5' className='mb-2'>
    {children}
  </Typography>
);

const Subheader: React.FC<CardSubheaderProps> = ({ children }) => (
  <Typography variant='subheading-large' className='mb-2'>
    {children}
  </Typography>
);

const Content: React.FC<CardContentProps> = ({ children }) => (
  <Typography variant='body-small' className='flex flex-col gap-3'>
    {children}
  </Typography>
);

Card.Header = Header;
Card.Subheader = Subheader;
Card.Content = Content;

export default Card;
