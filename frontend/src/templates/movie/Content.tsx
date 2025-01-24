import { Button, Typography, Tag, LoadingSpinner } from '@neo4j-ndl/react';
import { ChevronLeftIconOutline, ChevronRightIconOutline } from '@neo4j-ndl/react/icons';

import { MovieInterface } from './Interfaces';
import Movie from './Movie';

export default function Content({
  loadingStates,
  mainMovie,
  recoSimilarGenre,
  recoOtherUsers,
}: {
  loadingStates: { loadingMain: boolean; loadingSimilarGenre: boolean; loadingOtherUsers: boolean };
  mainMovie: MovieInterface[];
  recoSimilarGenre: MovieInterface[];
  recoOtherUsers: MovieInterface[];
}) {
  return (
    <div className='w-full flex justify-center'>
      <div className='n-bg-palette-neutral-bg-default p-5 flex flex-col'>
        {/* Featured Movie */}
        {loadingStates.loadingMain ? (
          <div className='w-screen h-[33vh] flex justify-center'>
            <LoadingSpinner size='large' />
          </div>
        ) : (
          <div className='flex flex-row items-start p-4 m-2 max-h-[40%]'>
            <img src={mainMovie[0].poster} alt='Product 1' className='w-[20%] h-full rounded-md' />
            <div className='px-5 flex flex-col items-center gap-5 w-[80%]'>
              <Typography variant='h1'>{mainMovie[0].title}</Typography>
              <div className='flex flex-col gap-5'>
                <Typography variant='body-medium'>{mainMovie[0].plot}</Typography>
              </div>
              <div className='flex flex-row gap-5'>
                {mainMovie[0].languages.map((lang: string, index: number) => (
                  <Tag className='p-[5px] px-[10px]' key={index}>
                    {lang}
                  </Tag>
                ))}
              </div>
              <div className='md:flex hidden gap-5'>
                {mainMovie[0].genres.map((genre: string, index: number) => (
                  <Tag className='p-[5px] px-[10px]' key={index}>
                    {genre}
                  </Tag>
                ))}
              </div>
              <div className='md:flex hidden gap-5'>
                <Typography variant='body-medium'>Year: {mainMovie[0].year.toString()}</Typography>
                <Typography variant='body-medium'>IMDB Rating: {mainMovie[0].imdbRating}</Typography>
              </div>
              <div className='flex flex-col gap-2.5 md:flex-row'>
                <div className='p-2.5 flex flex-row gap-2.5'>
                  <Button>Play</Button>
                  <Button>More Info</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Similar Genre */}
        {loadingStates.loadingSimilarGenre ? (
          <div className='w-screen h-[33vh] flex justify-center'>
            <LoadingSpinner size='large' />
          </div>
        ) : (
          <div className='flex flex-col items-start gap-[10px]'>
            <Typography variant='h2'>Similar genre</Typography>
            <div className='flex items-center gap-[10px] p-[10px]'>
              <ChevronLeftIconOutline className='n-size-token-9 self-center' />
              <div className='flex gap-[20px]'>
                {recoSimilarGenre.map((movie, index) => (
                  <Movie key={index} movie={movie} />
                ))}
              </div>
              <ChevronRightIconOutline className='n-size-token-9 self-center' />
            </div>
          </div>
        )}

        {/* User who watched this, also watched this */}
        {loadingStates.loadingOtherUsers ? (
          <div className='w-screen h-[33vh] flex justify-center'>
            <LoadingSpinner size='large' />
          </div>
        ) : (
          <div className='flex flex-col items-start gap-[10px]'>
            <Typography variant='h2'>Users who watched {mainMovie[0]?.title} also watched this</Typography>
            <div className='flex items-center gap-[10px] p-[10px]'>
              <ChevronLeftIconOutline className='n-size-token-9 self-center' />
              <div className='flex gap-[20px]'>
                {recoOtherUsers.map((movie, index) => (
                  <Movie key={index} movie={movie} />
                ))}
              </div>
              <ChevronRightIconOutline className='n-size-token-9 self-center' />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
