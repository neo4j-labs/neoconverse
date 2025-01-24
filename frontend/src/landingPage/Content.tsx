import { Typography } from '@neo4j-ndl/react';
import Templates from './categories/Templates';
import Component from './categories/Component';

export default function Content({ activeTab }: { activeTab: string }) {
  return (
    <div className='n-bg-palette-neutral-bg-default w-full p-0.75 gap-1'>
      <Typography variant='body-medium' className='flex p-5'>
        {activeTab === 'Template' ? <Templates /> : activeTab === 'Component' ? <Component /> : <></>}
      </Typography>
    </div>
  );
}
