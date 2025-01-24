import { MoonIconOutline, SunIconOutline, QuestionMarkCircleIconOutline } from '@neo4j-ndl/react/icons';
import { Typography, IconButton, Tabs, Switch, Logo } from '@neo4j-ndl/react';
import React, { useState, useCallback } from 'react';
import { ThemeWrapperContext } from '../../../context/ThemeWrapper';
import User from './User';

export default function Header({
  title,
  navItems = [],
  activeNavItem = navItems[0],
  setActiveNavItem = () => {},
  useNeo4jConnect = false,
  connectNeo4j = false,
  setConnectNeo4j = () => {},
  openConnectionModal = () => {},
  userHeader = true,
  documentation = '',
}: {
  title: string;
  navItems?: string[];
  activeNavItem?: string;
  setActiveNavItem?: (activeNavItem: string) => void;
  useNeo4jConnect?: boolean;
  connectNeo4j?: boolean;
  setConnectNeo4j?: (connectNeo4j: boolean) => void;
  openConnectionModal?: () => void;
  userHeader?: boolean;
  documentation?: string;
}) {
  const themeUtils = React.useContext(ThemeWrapperContext);
  const [themeMode, setThemeMode] = useState<string>(themeUtils.colorMode);

  const toggleColorMode = () => {
    setThemeMode((prevThemeMode) => {
      return prevThemeMode === 'light' ? 'dark' : 'light';
    });
    themeUtils.toggleColorMode();
  };

  const handleURLClick = useCallback((url: string) => {
    window.open(url, '_blank');
  }, []);

  return (
    <div className='n-bg-palette-neutral-bg-weak p-1 border-b-2 border-[rgb(var(--theme-palette-neutral-border-weak))] h-16'>
      <nav
        className='flex items-center justify-between'
        role='navigation'
        data-testid='navigation'
        id='navigation'
        aria-label='main navigation'
      >
        <section className='flex md:flex-row flex-col items-center w-1/6 shrink-0 grow-0'>
          <div className='md:inline-block'>
            <Logo className='h-6 min-h-6 min-w-12 md:h-8 md:min-h-12 md:min-w-24 md:mr-2' type='full' />
          </div>
          <div className='flex justify-center md:ml-0 pl-0'>
            <Typography className='md:inline-block hidden' variant='h6'>
              {title}
            </Typography>
            <Typography className='md:hidden inline-block' variant='subheading-small'>
              {title}
            </Typography>
          </div>
        </section>

        <section className='flex w-1/3 shrink-0 grow-0 justify-center items-center mb-[-24px]'>
          <Tabs size='large' fill='underline' onChange={(e) => setActiveNavItem(e)} value={activeNavItem}>
            {navItems.map((item) => (
              <Tabs.Tab tabId={item} key={item}>
                {item}
              </Tabs.Tab>
            ))}
          </Tabs>
        </section>
        <section className='flex items-center justify-end w-1/6 grow-0'>
          <div>
            <div className='flex grow-0 gap-x-1 w-max items-center pr-3'>
              {useNeo4jConnect ? (
                <Switch
                  isChecked={connectNeo4j}
                  onChange={(e) => {
                    if (e.target.checked) {
                      openConnectionModal();
                    } else {
                      setConnectNeo4j(false);
                    }
                  }}
                  isDisabled={false}
                  isFluid={true}
                  label={`Connect${connectNeo4j ? 'ed' : ''} to Neo4j`}
                  hasLabelBefore={true}
                />
              ) : null}
              <IconButton ariaLabel='Toggle Dark mode' isClean size='large' onClick={toggleColorMode}>
                {themeMode === 'dark' ? (
                  <span role='img' aria-label='sun'>
                    <SunIconOutline />
                  </span>
                ) : (
                  <span role='img' aria-label='moon'>
                    <MoonIconOutline />
                  </span>
                )}
              </IconButton>
              <IconButton
                onClick={() => handleURLClick(documentation)}
                className='hidden md:inline-flex'
                ariaLabel='Help'
                isClean
                size='large'
              >
                <QuestionMarkCircleIconOutline />
              </IconButton>

              {userHeader ? (
                <div className='hidden md:inline-block'>
                  <User />
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </nav>
    </div>
  );
}
