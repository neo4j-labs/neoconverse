import Header from '../templates/shared/components/Header';
import { useState } from 'react';
import Content from './Content';

export default function QuickStarter() {
  const [activeTab, setActiveTab] = useState<string>('Template');

  return (
    <div>
      <Header
        title={'StarterKit'}
        navItems={['Template', 'Component']}
        useNeo4jConnect={false}
        activeNavItem={activeTab}
        setActiveNavItem={setActiveTab}
        userHeader={false}
        documentation='https://neo4j.com/labs/neo4j-needle-starterkit/'
      />
      <div className='h-full min-h-screen w-full flex'>
        <Content activeTab={activeTab} />
      </div>
    </div>
  );
}
