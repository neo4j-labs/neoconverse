import { useState, CSSProperties } from 'react';
import { Typography, Box } from '@neo4j-ndl/react';
import { MovieInterface } from './Interfaces';

export default function Movie({ movie }: { movie: MovieInterface }) {
  const [isHovered, setIsHovered] = useState(false);

  const boxStyle: CSSProperties = {
    transition: 'all 0.3s ease',
    maxWidth: '350px',
    position: 'relative',
    transform: isHovered ? 'scale(1.2)' : 'scale(1)',
    zIndex: isHovered ? '10' : '1',
    boxShadow: isHovered ? '0px 0px 20px rgba(0,0,0,0.5)' : 'none',
  };
  const infoStyle: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    transform: isHovered ? 'translateY(0)' : 'translateY(70%)',
    display: isHovered ? 'inline-block' : 'none',
    transition: 'transform 1s ease',
    backgroundColor: 'rgb(var(--theme-palette-neutral-bg-stronger))',
    color: 'white',
    padding: '10px',
  };

  return (
    <Box
      htmlAttributes={{
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
      }}
      style={boxStyle}
    >
      <img src={movie.poster} alt={movie.title} className='w-full rounded-sm' />
      <div style={infoStyle}>
        <Typography className='md:flex hidden' variant='h6'>
          {movie.title}
        </Typography>
        <Typography
          className='md:flex hidden'
          variant='body-small'
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {movie.plot}
        </Typography>
      </div>
    </Box>
  );
}
