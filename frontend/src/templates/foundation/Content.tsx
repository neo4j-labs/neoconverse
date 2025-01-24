import { useEffect, useState } from 'react';
import { Button, Label, Typography } from '@neo4j-ndl/react';

import { setDriver, disconnect } from '../shared/utils/Driver';
import ConnectionModal from '../shared/components/ConnectionModal';

export default function Content() {
  const [init, setInit] = useState<boolean>(false);
  const [openConnection, setOpenConnection] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<boolean>(false);

  useEffect(() => {
    if (!init) {
      let session = localStorage.getItem('needleStarterKit-neo4j.connection');
      if (session) {
        let neo4jConnection = JSON.parse(session);
        setDriver(neo4jConnection.uri, neo4jConnection.user, neo4jConnection.password).then((isSuccessful: boolean) => {
          setConnectionStatus(isSuccessful);
        });
      }
      setInit(true);
    }
  });

  return (
    <div className='n-bg-palette-neutral-bg-default w-full p-0.75 flex flex-col items-center gap-1'>
      <ConnectionModal
        open={openConnection}
        setOpenConnection={setOpenConnection}
        setConnectionStatus={setConnectionStatus}
      />
      <div>Your content goes here.</div>
      <div>Happy coding!</div>

      <Typography variant='body-medium' className='flex p-5'>
        Neo4j connection Status:
        <Typography variant='body-medium' className='ml-2.5'>
          {!connectionStatus ? <Label color='danger'>Not connected</Label> : <Label color='success'>Connected</Label>}
        </Typography>
      </Typography>

      {!connectionStatus ? (
        <Button onClick={() => setOpenConnection(true)}>Connect to Neo4j</Button>
      ) : (
        <Button onClick={() => disconnect().then(() => setConnectionStatus(false))}>Disconnect</Button>
      )}
    </div>
  );
}
