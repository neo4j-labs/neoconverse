import React, { useState } from 'react';
import {
  DataGrid,
  Flex,
  IconButton,
  StatusIndicator,
  Tabs,
  TextInput,
  Tooltip,
  Typography,
  Widget,
} from '@neo4j-ndl/react';
import { MagnifyingGlassIconOutline, InformationCircleIconOutline } from '@neo4j-ndl/react/icons';
import { createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

import productsData from './assets/networkimpact.json';
import NoGraphImg from '../shared/assets/NoData.png';
import Header from '../shared/components/Header';

import './CyberSecurity.css';

type NetworkImpact = {
  Type: string;
  Name: string;
  Version: string;
  Status: string;
};

const columnHelper = createColumnHelper<NetworkImpact>();

const columns = [
  columnHelper.accessor('Type', {
    header: () => <b>Type</b>,
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('Name', {
    header: () => <b>Name</b>,
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('Version', {
    header: () => <b>Version</b>,
    cell: (info) => <i>{info.renderValue()}</i>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('Status', {
    header: () => <b>Status</b>,
    cell: (info) => (
      <>
        <StatusIndicator type={info.getValue() != 'Up' ? 'danger' : 'success'} className='mr-2' />
        {info.getValue().startsWith('CVE') ? (
          <div className='flex flex-column'>
            CVE Detected
            <Tooltip type='simple'>
              <Tooltip.Trigger>
                <InformationCircleIconOutline className='n-size-token-6 ml-2' />
              </Tooltip.Trigger>
              <Tooltip.Content>
                <Tooltip.Body>{info.renderValue()}</Tooltip.Body>
              </Tooltip.Content>
            </Tooltip>
          </div>
        ) : (
          <>{info.renderValue()}</>
        )}
      </>
    ),
    footer: (info) => info.column.id,
  }),
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchInitiated, setIsSearchInitiated] = useState(false);
  const network = productsData.ListItems;
  const defaultData: NetworkImpact[] = network as NetworkImpact[];
  const [data] = React.useState(() => [...defaultData]);

  const [activeTab, setActiveTab] = useState<number>(0);

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSearchInitiated(true);
  };

  const table = useReactTable({
    data,
    columns,
    enableSorting: true,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  const displayResult = () => {
    if (isSearchInitiated) {
      const searchResultElement = document.getElementById('search-result');
      if (searchResultElement) {
        searchResultElement.classList.add('search-result-visible');
      }
    }
  };

  return (
    <>
      <Header title='CyberSecurity' navItems={[]} useNeo4jConnect={false} userHeader={false} />
      <div className='landing-page n-bg-palette-neutral-bg-default'>
        <form className={`search-bar ${isSearchInitiated ? 'top' : 'center'}`} onSubmit={handleSearch}>
          <div
            onTransitionEnd={displayResult}
            className={`text-input-container ${isSearchInitiated ? 'search-initiated' : ''}`}
          >
            <TextInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              helpText='Search for server, IP, domain, etc.'
              isFluid={true}
              rightElement={
                <IconButton ariaLabel='Search Icon' isClean size='small' className='-mt-1'>
                  <MagnifyingGlassIconOutline className={isSearchInitiated ? 'n-w-4 n-h-4' : 'n-w-6 n-h-6'} />
                </IconButton>
              }
              htmlAttributes={{
                type: 'text',
                placeholder: 'Search...',
              }}
            />
          </div>
        </form>
        <Widget
          className='n-bg-palette-neutral-bg-weak min-h-[60%] min-w-[60%] flex flex-col search-result'
          header=''
          isElevated={true}
          htmlAttributes={{
            id: 'search-result',
          }}
        >
          <Flex flexDirection='column' justifyContent='space-between'>
            <div>
              <Tabs size='large' fill='underline' onChange={(e) => setActiveTab(e)} value={activeTab}>
                <Tabs.Tab tabId={0}>Table</Tabs.Tab>
                <Tabs.Tab tabId={1}>Graph</Tabs.Tab>
              </Tabs>
              <Flex className='p-6'>
                {activeTab === 0 ? (
                  <DataGrid<NetworkImpact>
                    isResizable={false}
                    tableInstance={table}
                    isKeyboardNavigable={false}
                    styling={{
                      hasZebraStriping: true,
                      borderStyle: 'none',
                      headerStyle: 'filled',
                    }}
                    components={{
                      Navigation: null,
                    }}
                  />
                ) : (
                  <Flex flexDirection='row'>
                    <img src={NoGraphImg} className='p-12' />
                    <Flex gap='8'>
                      <Typography variant='h1'>Graph Screen</Typography>
                      <div className='flex flex-col gap-3'>
                        <Typography variant='body-medium'>
                          This is where you would display a graph of the network/search result.
                        </Typography>
                        <Typography variant='body-medium'>
                          For now, we do not ship any visualization library to let you the freedom of using the one you
                          prefer. <br />
                          although, that might change in the futur...
                        </Typography>
                        <></>
                        <Typography variant='body-medium'>
                          If you want to use visualization libraries, here are few ones that you can use on top of Neo4j
                          (in no specific order):
                          <ul className='list-disc ml-8'>
                            <li>Neovis.js</li>
                            <li>D3.js</li>
                            <li>react-force-graph</li>
                            <li>Cytoscape.js</li>
                          </ul>
                        </Typography>
                      </div>
                    </Flex>
                  </Flex>
                )}
              </Flex>
            </div>
            <div className='text-center pb-2'>
              <>Results for "{searchQuery}"</>
            </div>
          </Flex>
        </Widget>
      </div>
    </>
  );
}
