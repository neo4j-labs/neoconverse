import { useEffect, useState } from 'react';
import { Button, Flex, Typography } from '@neo4j-ndl/react';

import Header from '../shared/components/Header';
import { setDriver, runRecoQuery } from '../shared/utils/Driver';
import ConnectionModal from '../shared/components/ConnectionModal';

import Content from './Content';
import { MovieInterface } from './Interfaces';
import moviesData from './assets/movies.json';
import NoDataImg from '../shared/assets/NoData.png';

const mainMovieId = '79132';
const queryMainMovie = `MATCH (m:Movie {movieId: '${mainMovieId}'})-[:IN_GENRE]->(g:Genre) RETURN ID(m) as id, collect(g.name) as genres, m.year as year, m.imdbRating as imdbRating, m.languages as languages, m.title as title, m.plot as plot, m.poster as poster;`;
const queryOtherUsersAlsoWatched = `MATCH (m:Movie {movieId: '${mainMovieId}'})<-[:RATED]-(u:User)-[:RATED]->(rec:Movie)-[:IN_GENRE]->(g:Genre) WITH g, rec, COUNT(*) AS usersWhoAlsoWatched ORDER BY usersWhoAlsoWatched DESC LIMIT 25 RETURN ID(rec) as id, collect(g.name) as genres, rec.year as year, rec.imdbRating as imdbRating, rec.languages as languages, rec.title as title, rec.plot as plot, rec.poster as poster LIMIT 6;`;
const similarByGenre = `MATCH (m:Movie {movieId: '${mainMovieId}'})-[:IN_GENRE]->(g:Genre)<-[:IN_GENRE]-(rec:Movie) WITH rec, collect(g.name) AS genres, count(*) AS commonGenres RETURN ID(rec) as id, genres, rec.year as year, rec.imdbRating as imdbRating, rec.languages as languages, rec.title as title, rec.plot as plot, rec.poster as poster ORDER BY commonGenres DESC LIMIT 6;`;

export default function Home() {
  const [useReco, setUseReco] = useState(false);
  const [recoError, setRecoError] = useState(false);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);

  const [loading, setLoading] = useState({ main: true, similarGenre: true, otherUsers: true });

  const [mainMovie, setMainMovie] = useState<MovieInterface[]>([]);
  const [recoOtherUsers, setRecoOtherUsers] = useState<MovieInterface[]>([]);
  const [recoSimilarGenre, setRecoSimilarGenre] = useState<MovieInterface[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!useReco) {
        setRecoError(false);
        setLoading({ main: true, similarGenre: true, otherUsers: true });
        setMainMovie([moviesData.listMovies[0]]);
        setRecoSimilarGenre(moviesData.listMovies.slice(1, 7));
        setRecoOtherUsers(moviesData.listMovies.slice(7, 13));
        setLoading({ main: false, similarGenre: false, otherUsers: false });
      } else {
        setLoading({ main: true, similarGenre: true, otherUsers: true });
        const { uri, user, password } =
          JSON.parse(localStorage.getItem('needleStarterKit-neo4j.connection') ?? '') ?? {};
        setDriver(uri, user, password);
        await Promise.all([
          fetchMovies(queryMainMovie).then((movies) => setMainMovie(movies || [])),
          fetchMovies(similarByGenre).then((movies) => setRecoSimilarGenre(movies || [])),
          fetchMovies(queryOtherUsersAlsoWatched).then((movies) => setRecoOtherUsers(movies || [])),
        ]);
        setLoading({ main: false, similarGenre: false, otherUsers: false });
      }
    };

    fetchData();
  }, [useReco]);

  const fetchMovies = async (query: string) => {
    const result = await runRecoQuery(query);
    if (Array.isArray(result)) {
      if (result.length < 1) {
        setRecoError(true);
      } else {
        return result.map((movie) => ({
          id: movie.id,
          genres: movie.genres,
          year: movie.year,
          imdbRating: movie.imdbRating,
          languages: movie.languages,
          title: movie.title,
          plot: movie.plot,
          poster: movie.poster,
        }));
      }
    }
  };

  return (
    <div>
      <Header
        title='Movie'
        useNeo4jConnect={true}
        setConnectNeo4j={setUseReco}
        connectNeo4j={useReco}
        openConnectionModal={() => setIsConnectionModalOpen(true)}
        userHeader={false}
      />
      {recoError ? (
        <Flex
          className='n-bg-palette-neutral-bg-default flex justify-center items-center h-[calc(100vh-64px)]'
          flexDirection='row'
        >
          <img src={NoDataImg} className='p-12' />
          <Flex gap='8'>
            <Typography variant='h1'>Data error</Typography>
            <Typography variant='body-medium'>
              <p>An error occurred while fetching recommendations data.</p>
              <p>
                Please make sure you are connected to a Neo4j Database with the same data model as the{' '}
                <a href='https://github.com/neo4j-graph-examples/recommendations' target='_blank'>
                  <b>
                    <u>Recommendation demo available here</u>
                  </b>
                </a>
              </p>
              <p>
                Alternatively, you can also use the one from{' '}
                <a href='https://sandbox.neo4j.com' target='_blank'>
                  <b>
                    <u>Neo4j Sandbox</u>
                  </b>
                </a>
              </p>
            </Typography>
            <Button>Go back</Button>
          </Flex>
        </Flex>
      ) : (
        <Content
          loadingStates={{
            loadingMain: loading.main,
            loadingSimilarGenre: loading.similarGenre,
            loadingOtherUsers: loading.otherUsers,
          }}
          mainMovie={mainMovie}
          recoSimilarGenre={recoSimilarGenre}
          recoOtherUsers={recoOtherUsers}
        />
      )}
      <ConnectionModal
        open={isConnectionModalOpen}
        setOpenConnection={setIsConnectionModalOpen}
        setConnectionStatus={setUseReco}
        message={{
          type: 'warning',
          content:
            'Ensure you connect to a Neo4j database containing the Recommendation dataset ( using sandbox.neo4j.com for example )',
        }}
      />
      <div id='footer' className='n-bg-palette-neutral-bg-default h-[100px]' />
    </div>
  );
}
