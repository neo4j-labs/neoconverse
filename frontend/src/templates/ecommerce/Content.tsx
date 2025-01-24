import React from 'react';
import { Button, DataGrid, Typography, Widget, Tag } from '@neo4j-ndl/react';
import { PlusCircleIconOutline } from '@neo4j-ndl/react/icons';
import { createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

import productsData from './assets/products.json';
import productImg1 from './assets/product1.png';
import productImg2 from './assets/product2.png';
import productImg3 from './assets/product3.png';
import productImg4 from './assets/product4.png';
import productImg5 from './assets/product5.png';
import productImg6 from './assets/product6.png';

type Product = {
  CPU: number;
  Memory: string;
  Details: string;
};

const columnHelper = createColumnHelper<Product>();

const columns = [
  columnHelper.accessor('CPU', {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('Memory', {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('Details', {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
];

export default function Content() {
  const products = productsData.listProducts;
  const defaultData: Product[] = products[0].defaultData as Product[];
  const [data] = React.useState(() => [...defaultData]);

  const table = useReactTable({
    data,
    columns,
    enableSorting: true,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='w-full flex justify-center'>
      <div className='n-bg-palette-neutral-bg-default p-5 flex flex-col'>
        {/* Featured Product */}
        <Typography variant='h1'>{products[0].name}</Typography>
        <div className='flex flex-row items-start p-4 m-2'>
          <img src={productImg1} alt='Product 1' className='w-[40%] rounded-md' />
          <div className='px-5 flex flex-col'>
            <div className='flex flex-col gap-5'>
              <Typography variant='body-medium'>{products[0].desc1}</Typography>
              <Typography className='md:inline-block hidden' variant='body-medium'>
                {products[0].desc2}
              </Typography>
              <div className='n-w-full n-bg-light-neutral-text-weakest md:inline-block hidden'>
                <DataGrid
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
              </div>
              <div className='md:flex flex-row gap-2.5 hidden'>
                <Tag>DealOfTheWeek</Tag>
                <Tag>In Stock</Tag>
                <Tag>Next day delivery</Tag>
              </div>
            </div>
            <div className='p-2.5 flex flex-col gap-2.5'>
              <Typography variant='body-large'>Price: £{products[0].price}</Typography>
              <Button>Add to cart</Button>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div>
          <Typography variant='h2'>Similar products</Typography>
          <div className='flex flex-col md:flex-row gap-2.5 py-2.5'>
            {[productImg2, productImg3, productImg4].map((img, index) => (
              <Widget header={products[index + 1].name} isElevated={true} key={index} className='mx-auto max-w-[80%]'>
                <div className='flex flex-col gap-2.5 md:flex-row'>
                  <img src={img} alt={`Product ${index + 2}`} className='max-w-[40%] self-center' />
                  <div className='p-2.5 flex flex-col gap-2.5'>
                    <div>{products[index + 1].desc1}</div>
                    <Typography variant='body-large'>Price: £{products[index + 1].price}</Typography>
                    <Button>Add to cart</Button>
                  </div>
                </div>
              </Widget>
            ))}
          </div>
        </div>

        {/* Frequently Bought Together */}
        <div>
          <Typography variant='h2'>Frequently bought together</Typography>
          <div className='flex flex-col items-start md:flex-row gap-2.5 py-2.5'>
            {[productImg5, productImg6].map((img, index) => (
              <Widget className='md:max-w-[30%]' header='' isElevated={true} key={index}>
                <div className='flex flex-row gap-2.5 md:flex-row'>
                  <img src={productImg1} alt='Product 1' className='max-w-[40%]' />
                  <Typography variant='h6' className='self-center'>
                    <PlusCircleIconOutline className='n-w-6 n-h-6' />
                  </Typography>
                  <img src={img} alt={`Product ${index + 2}`} className='max-w-[40%]' />
                </div>
                <Typography variant='h4' style={{ textAlignLast: 'center' }}>
                  Package deal
                </Typography>
                <Typography variant='body-medium'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, quasi? Pariatur ipsam voluptatum,
                  quas labore amet dolor dolore, aspernatur tempora quasi ullam ad, autem distinctio doloribus! Iusto
                  rem iste accusamus.
                </Typography>
              </Widget>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
