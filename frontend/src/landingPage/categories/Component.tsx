import { Typography } from '@neo4j-ndl/react';
import Card from '../components/Card';

// Dark mode featured images
import ChatbotImgDark from '../../assets/img/component/ChatbotImg-dark.png';
import ConnectionModalImgDark from '../../assets/img/component/ConnectionModalImg-dark.png';
import HeaderImgDark from '../../assets/img/component/HeaderImg-dark.png';
import CardImgDark from '../../assets/img/component/CardImg-dark.png';

// Light mode featured images
import ChatbotImgLight from '../../assets/img/component/ChatbotImg-light.png';
import ConnectionModalImgLight from '../../assets/img/component/ConnectionModalImg-light.png';
import HeaderImgLight from '../../assets/img/component/HeaderImg-light.png';
import CardImgLight from '../../assets/img/component/CardImg-light.png';

import { useContext } from 'react';
import { ThemeWrapperContext } from '../../context/ThemeWrapper';

export default function Component() {
  const { colorMode } = useContext(ThemeWrapperContext);

  const componentCards = [
    {
      title: 'Chatbot Widget',
      description:
        'An interactive chat widget component which you can use for your support, sales or any other chatbot needs. It is designed to be easily embeddable and customizable to fit your needs',
      image: colorMode === 'dark' ? ChatbotImgDark : ChatbotImgLight,
      sourceCode: `https://github.com/neo4j-labs/neo4j-needle-starterkit/blob/${
        import.meta.env.PACKAGE_VERSION
      }/src/templates/shared/components/Chatbot.tsx`,
      previewLink: '/chat-widget-preview',
    },
    {
      title: 'Connection Modal',
      description:
        'A responsive and user-friendly connection modal template, ideal for facilitating connection to your Neo4j databases in your applications.',
      image: colorMode === 'dark' ? ConnectionModalImgDark : ConnectionModalImgLight,
      sourceCode: `https://github.com/neo4j-labs/neo4j-needle-starterkit/blob/${
        import.meta.env.PACKAGE_VERSION
      }/src/templates/shared/components/ConnectionModal.tsx`,
      previewLink: '/connection-modal-preview',
    },
    {
      title: 'Header',
      description:
        'A modern and clean header component, perfect for any web application. It is designed to be easily embeddable and customizable to fit your needs.',
      image: colorMode === 'dark' ? HeaderImgDark : HeaderImgLight,
      sourceCode: `https://github.com/neo4j-labs/neo4j-needle-starterkit/blob/${
        import.meta.env.PACKAGE_VERSION
      }/src/templates/shared/components/Header.tsx`,
      previewLink: '/header-preview',
    },
    {
      title: 'Card',
      description:
        'A versatile card component that can be used to display information in a clean and organized way. It is designed to be easily customizable to fit your needs.',
      image: colorMode === 'dark' ? CardImgDark : CardImgLight,
      sourceCode: `https://github.com/neo4j-labs/neo4j-needle-starterkit/blob/${
        import.meta.env.PACKAGE_VERSION
      }/src/templates/shared/components/Card.tsx`,
      previewLink: '/cards-preview',
    },
  ];

  return (
    <div className='flex flex-col items-center'>
      <Typography variant='h2' className='flex p-5'>
        Components
      </Typography>
      <Typography variant='body-large' className='flex p-5'>
        Our components (patterns) are perfect for those seeking to integrate individual widgets or elements into their
        existing projects. These templates range from chatbot to a connections modal and many more coming on the way,
        offering a versatile selection of standalone components. Each component is built to be easily adaptable and
        embeddable, ensuring seamless integration with your larger project.
      </Typography>
      <div className='flex flex-wrap justify-center gap-x-14 gap-y-10 md:grid md:grid-cols-3 md:gap-x-14 md:gap-y-10'>
        {componentCards.map((card, index) => (
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
