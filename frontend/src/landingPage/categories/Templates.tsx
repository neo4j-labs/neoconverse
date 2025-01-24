import { Typography } from '@neo4j-ndl/react';
import Card from '../components/Card';

// Dark mode featured images
import StarterKitImgDark from '../../assets/img/template/StarterKitImg-dark.png';
import EcommerceImgDark from '../../assets/img/template/EcommerceImg-dark.png';
import MovieImgDark from '../../assets/img/template/MovieImg-dark.png';
import CyberSecurityImgDark from '../../assets/img/template/CyberSecurityImg-dark.png';

// Light mode featured images
import StarterKitImgLight from '../../assets/img/template/StarterKitImg-light.png';
import EcommerceImgLight from '../../assets/img/template/EcommerceImg-light.png';
import MovieImgLight from '../../assets/img/template/MovieImg-light.png';
import CyberSecurityImgLight from '../../assets/img/template/CyberSecurityImg-light.png';

import { useContext } from 'react';
import { ThemeWrapperContext } from '../../context/ThemeWrapper';

export default function Templates() {
  const { colorMode } = useContext(ThemeWrapperContext);

  const templatesCards = [
    {
      title: 'Foundation Template',
      description:
        'The Foundation template, because we all starts somewhere, this was the first template we created, combining simple, modern and UX all together for a generic application design.',
      image: colorMode === 'dark' ? StarterKitImgDark : StarterKitImgLight,
      sourceCode: `https://github.com/neo4j-labs/neo4j-needle-starterkit/blob/${
        import.meta.env.PACKAGE_VERSION
      }/src/templates/foundation`,
      previewLink: '/foundation-preview',
    },
    {
      title: 'Cyber security',
      description:
        'Explore your network infrastructure and retrieve impact analysis in one click! This templates facilitate the visualization and analysis of complex infrastructures.',
      image: colorMode === 'dark' ? CyberSecurityImgDark : CyberSecurityImgLight,
      sourceCode: `https://github.com/neo4j-labs/neo4j-needle-starterkit/blob/${
        import.meta.env.PACKAGE_VERSION
      }/src/templates/cybersecurity`,
      previewLink: '/cybersecurity-preview',
    },
    {
      title: 'Movie Recommendation',
      description: 'Simple and modern movie recommendation template based on the famous Neo4j movie dataset.',
      image: colorMode === 'dark' ? MovieImgDark : MovieImgLight,
      sourceCode: `https://github.com/neo4j-labs/neo4j-needle-starterkit/blob/${
        import.meta.env.PACKAGE_VERSION
      }/src/templates/movie`,
      previewLink: '/movie-preview',
    },
    {
      title: 'Ecommerce',
      description:
        'E-commerce product page with a modern and clean design. Perfect for having one featured product followed by suggestions on recommended products and packages/frequently bought together.',
      image: colorMode === 'dark' ? EcommerceImgDark : EcommerceImgLight,
      sourceCode: `https://github.com/neo4j-labs/neo4j-needle-starterkit/blob/${
        import.meta.env.PACKAGE_VERSION
      }/src/templates/ecommerce`,
      previewLink: '/ecommerce-preview',
    },
  ];

  return (
    <div className='flex flex-col items-center'>
      <Typography variant='h2' className='flex p-5'>
        Templates
      </Typography>
      <Typography variant='body-large' className='flex p-5'>
        Dive into our collection of ready-to-use templates tailored for various use cases and industries. These
        templates are designed to serve a wide range of product purposes. Our templates provide a seamless blend of
        aesthetics and utility, ensuring your product not only meets its functional objectives but also delivers a
        memorable user experience.
      </Typography>
      <div className='flex flex-wrap justify-center gap-x-14 gap-y-10 md:grid md:grid-cols-3 md:gap-x-14 md:gap-y-10'>
        {templatesCards.map((card, index) => (
          <div key={index} className='w-full md:w-auto'>
            <Card
              title={card.title}
              description={card.description}
              image={card.image}
              sourceCode={card.sourceCode}
              previewLink={card.previewLink}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
