import { Button, Dialog, TextInput, Select, Banner, Dropzone } from '@neo4j-ndl/react';
import { useState } from 'react';
import { setDriver } from '../utils/Driver';

interface Message {
  type: 'success' | 'info' | 'warning' | 'danger' | 'neutral';
  content: string;
}

interface ConnectionModalProps {
  open: boolean;
  setOpenConnection: (arg: boolean) => void;
  setConnectionStatus: (status: boolean) => void;
  message?: Message;
}

export default function ConnectionModal({
  open,
  setOpenConnection,
  setConnectionStatus,
  message,
}: ConnectionModalProps) {
  const protocols = ['neo4j', 'neo4j+s', 'neo4j+ssc', 'bolt', 'bolt+s', 'bolt+ssc'];
  const [protocol, setProtocol] = useState<string>('neo4j+s');
  const [URI, setURI] = useState<string>('localhost');
  const [port, setPort] = useState<number>(7687);
  const [database, setDatabase] = useState<string>('neo4j');
  const [username, setUsername] = useState<string>('neo4j');
  const [password, setPassword] = useState<string>('password');
  const [connectionMessage, setMessage] = useState<Message | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const parseAndSetURI = (uri: string) => {
    const uriParts = uri.split('://');
    const uriHost = uriParts.pop() || URI;
    setURI(uriHost);
    const uriProtocol = uriParts.pop() || protocol;
    setProtocol(uriProtocol);
    const uriPort = Number(uriParts.pop()) || port;
    setPort(uriPort);
  };

  const handleHostPasteChange: React.ClipboardEventHandler<HTMLInputElement> = (event) => {
    event.clipboardData.items[0]?.getAsString((value) => {
      parseAndSetURI(value);
    });
  };

  const onDropHandler = async (files: Partial<globalThis.File>[]) => {
    setIsLoading(true);
    if (files.length) {
      const [file] = files;

      if (file.text) {
        const text = await file.text();
        const lines = text.split(/\r?\n/);
        const configObject = lines.reduce((acc: Record<string, string>, line: string) => {
          if (line.startsWith('#') || line.trim() === '') {
            return acc;
          }

          const [key, value] = line.split('=');
          if (['NEO4J_URI', 'NEO4J_USERNAME', 'NEO4J_PASSWORD', 'NEO4J_DATABASE'].includes(key)) {
            acc[key] = value;
          }
          return acc;
        }, {});
        parseAndSetURI(configObject.NEO4J_URI);
        setUsername(configObject.NEO4J_USERNAME);
        setPassword(configObject.NEO4J_PASSWORD);
        setDatabase(configObject.NEO4J_DATABASE);
      }
    }
    setIsLoading(false);
  };

  function submitConnection() {
    const connectionURI = `${protocol}://${URI}${URI.split(':')[1] ? '' : `:${port}`}`;
    setDriver(connectionURI, username, password).then((isSuccessful) => {
      setConnectionStatus(isSuccessful);
      isSuccessful
        ? setOpenConnection(false)
        : setMessage({
            type: 'danger',
            content: 'Connection failed, please check the developer console logs for more informations',
          });
    });
  }

  return (
    <>
      <Dialog
        size='small'
        isOpen={open}
        hasDisabledCloseButton
        htmlAttributes={{
          'aria-labelledby': 'form-dialog-title',
        }}
      >
        <Dialog.Header
          htmlAttributes={{
            id: 'form-dialog-title',
          }}
        >
          Connect to Neo4j
        </Dialog.Header>
        <Dialog.Content className='n-flex n-flex-col n-gap-token-4'>
          {message && (
            <Banner type={message.type} usage='inline'>
              {message.content}
            </Banner>
          )}
          {connectionMessage && (
            <Banner type={connectionMessage.type} usage='inline'>
              {connectionMessage.content}
            </Banner>
          )}
          <div className='n-flex max-h-24'>
            <Dropzone
              isTesting={false}
              customTitle={<>Drop your env file here</>}
              className='n-p-6 end-0 top-0 w-full h-full'
              acceptedFileExtensions={['.txt', '.env']}
              dropZoneOptions={{
                onDrop: (f: Partial<globalThis.File>[]) => {
                  onDropHandler(f);
                },
                maxSize: 500,
                onDropRejected: (e) => {
                  if (e.length) {
                    // eslint-disable-next-line no-console
                    console.log(`Failed To Upload, File is larger than 500 bytes`);
                  }
                },
              }}
            />
            {isLoading && <div>Loading...</div>}
          </div>
          <div className='n-flex n-flex-row n-flex-wrap'>
            <Select
              label='Protocol'
              type='select'
              size='medium'
              selectProps={{
                onChange: (newValue) => newValue && setProtocol(newValue.value),
                options: protocols.map((option) => ({ label: option, value: option })),
                value: { label: protocol, value: protocol },
              }}
              className='w-1/4 inline-block'
              isFluid
              htmlAttributes={{
                id: 'protocol',
              }}
            />
            <div className='ml-[5%] w-[70%] inline-block'>
              <TextInput
                value={URI}
                isDisabled={false}
                label='URI'
                isFluid
                onChange={(e) => setURI(e.target.value)}
                htmlAttributes={{
                  id: 'url',
                  placeholder: 'localhost',
                  autoFocus: true,
                  onPaste: handleHostPasteChange,
                }}
              />
            </div>
          </div>
          <TextInput
            value={database}
            isDisabled={false}
            label='Database (optional)'
            isFluid
            onChange={(e) => setDatabase(e.target.value)}
            className='w-full'
            htmlAttributes={{
              id: 'database',
              placeholder: 'neo4j',
            }}
          />
          <div className='n-flex n-flex-row n-flex-wrap mb-2'>
            <div className='w-[48.5%] mr-1.5 inline-block'>
              <TextInput
                value={username}
                isDisabled={false}
                label='Username'
                isFluid
                onChange={(e) => setUsername(e.target.value)}
                htmlAttributes={{
                  id: 'username',
                  placeholder: 'neo4j',
                }}
              />
            </div>
            <div className='w-[48.5%] ml-[1.5%] inline-block'>
              <TextInput
                value={password}
                isDisabled={false}
                label='Password'
                isFluid
                onChange={(e) => setPassword(e.target.value)}
                htmlAttributes={{
                  type: 'password',
                  id: 'password',
                  placeholder: 'password',
                }}
              />
            </div>
          </div>
          <Button onClick={() => submitConnection()}>Submit</Button>
        </Dialog.Content>
      </Dialog>
    </>
  );
}
