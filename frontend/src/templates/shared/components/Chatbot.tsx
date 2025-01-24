/* eslint-disable no-confusing-arrow */
import { useEffect, useRef, useState } from 'react';
import { Button, Widget, Typography, Avatar, TextInput, IconButton, useCopyToClipboard, Modal } from '@neo4j-ndl/react';

import ChatBotAvatar from '../assets/chatbot-ai.png';
import {
  ArrowPathIconOutline,
  ClipboardDocumentIconOutline,
  HandThumbDownIconOutline,
  InformationCircleIconOutline,
  SpeakerWaveIconOutline,
} from '@neo4j-ndl/react/icons';
import RetrievalInformation from './RetrievalInformation';

type ChatbotProps = {
  messages: {
    id: number;
    user: string;
    message: string;
    datetime: string;
    isTyping?: boolean;
    src?: Array<string>;
  }[];
};

type ChatbotResponse = {
  response: string;
  src: string[];
};

export default function Chatbot(props: ChatbotProps) {
  const { messages } = props;
  const [listMessages, setListMessages] = useState(messages);
  const [inputMessage, setInputMessage] = useState('');
  const [, copy] = useCopyToClipboard();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [sourcesModal, setSourcesModal] = useState<string[]>([]);
  const [modelModal, setModelModal] = useState<string>('');

  const handleCloseModal = () => setIsOpenModal(false);

  const formattedTextStyle = { color: 'rgb(var(--theme-palette-discovery-bg-strong))' };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const simulateTypingEffect = (responseText: ChatbotResponse, index = 0) => {
    const msg = responseText.response;
    if (index < msg.length) {
      const nextIndex = index + 1;
      const currentTypedText = msg.substring(0, nextIndex);

      if (index === 0) {
        const date = new Date();
        const datetime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        setListMessages((msgs) => [
          ...msgs,
          {
            id: Date.now(),
            user: 'chatbot',
            message: currentTypedText,
            datetime: datetime,
            isTyping: true,
            src: responseText.src,
          },
        ]);
      } else {
        setListMessages((msgs) => msgs.map((msg) => (msg.isTyping ? { ...msg, message: currentTypedText } : msg)));
      }

      setTimeout(() => simulateTypingEffect(responseText, nextIndex), 20);
    } else {
      setListMessages((msgs) => msgs.map((msg) => (msg.isTyping ? { ...msg, isTyping: false } : msg)));
    }
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!inputMessage.trim()) {
      return;
    }
    const date = new Date();
    const datetime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    const userMessage = { id: 999, user: 'user', message: inputMessage, datetime: datetime };
    setListMessages((listMessages) => [...listMessages, userMessage]);
    setInputMessage('');

    const chatbotReply = {
      response:
        'Hello, here is an example response with sources. To use the chatbot, plug this to your backend with a fetch containing an object response of type: {response: string, src: Array<string>}',
      src: ['1:1234-abcd-efgh-ijkl-5678:2', '3:8765-zyxw-vuts-rqpo-4321:4'],
    }; // Replace with getting a response from your chatbot through your APIs
    simulateTypingEffect(chatbotReply);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [listMessages]);

  return (
    <div className='n-bg-palette-neutral-bg-default flex flex-col justify-between min-h-screen max-h-full overflow-hidden'>
      <div className='flex overflow-y-auto pb-12 min-w-full'>
        <Widget className='n-bg-palette-neutral-bg-default w-full h-full' header='' isElevated={false}>
          <div className='flex flex-col gap-3 p-3'>
            {listMessages.map((chat) => (
              <div
                ref={messagesEndRef}
                key={chat.id}
                className={`flex gap-2.5 items-end ${chat.user === 'chatbot' ? 'flex-row' : 'flex-row-reverse'} `}
              >
                <div className='w-8 h-8 mr-4 ml-4'>
                  {chat.user === 'chatbot' ? (
                    <Avatar
                      className='-ml-4'
                      hasStatus
                      name='KM'
                      size='x-large'
                      source={ChatBotAvatar}
                      status='online'
                      type='image'
                      shape='square'
                    />
                  ) : (
                    <Avatar
                      className=''
                      hasStatus
                      name='KM'
                      size='x-large'
                      status='online'
                      type='image'
                      shape='square'
                    />
                  )}
                </div>
                <Widget
                  header=''
                  isElevated={true}
                  className={`p-4 self-start max-w-[55%] ${
                    chat.user === 'chatbot' ? 'n-bg-palette-neutral-bg-weak' : 'n-bg-palette-primary-bg-weak'
                  }`}
                >
                  <div>
                    {chat.message.split(/`(.+?)`/).map((part, index) =>
                      index % 2 === 1 ? (
                        <span key={index} style={formattedTextStyle}>
                          {part}
                        </span>
                      ) : (
                        part
                      )
                    )}
                  </div>
                  <div className='text-right align-bottom pt-3'>
                    <Typography variant='body-small'>{chat.datetime}</Typography>
                  </div>
                  <Typography variant='body-small' className='text-right'>
                    {chat.user === 'chatbot' ? (
                      <div className='flex gap-1'>
                        <>
                          <IconButton isClean ariaLabel='Search Icon'>
                            <SpeakerWaveIconOutline className='w-4 h-4 inline-block' />
                          </IconButton>
                          {chat.src ? (
                            <IconButton
                              isClean
                              ariaLabel='Search Icon'
                              onClick={() => {
                                setModelModal('OpenAI GPT 4o');
                                setSourcesModal(chat.src ?? []);
                                setTimeTaken(50);
                                setIsOpenModal(true);
                              }}
                            >
                              <InformationCircleIconOutline className='w-4 h-4 inline-block' />
                            </IconButton>
                          ) : (
                            <></>
                          )}
                          <IconButton isClean ariaLabel='Search Icon' onClick={() => copy(chat.message)}>
                            <ClipboardDocumentIconOutline className='w-4 h-4 inline-block' />
                          </IconButton>
                          <IconButton isClean ariaLabel='Search Icon'>
                            <ArrowPathIconOutline className='w-4 h-4 inline-block' />
                          </IconButton>
                          <IconButton isClean ariaLabel='Search Icon'>
                            <HandThumbDownIconOutline className='w-4 h-4 inline-block n-text-palette-danger-text' />
                          </IconButton>
                        </>
                      </div>
                    ) : (
                      <></>
                    )}
                  </Typography>
                </Widget>
              </div>
            ))}
          </div>
        </Widget>
      </div>
      <div className='n-bg-palette-neutral-bg-default flex gap-2.5 bottom-0 p-2.5 w-full'>
        <form onSubmit={handleSubmit} className='flex gap-2.5 w-full'>
          <TextInput
            className='n-bg-palette-neutral-bg-default flex-grow-7 w-full'
            value={inputMessage}
            isFluid
            onChange={handleInputChange}
            htmlAttributes={{
              type: 'text',
              'aria-label': 'Chatbot Input',
            }}
          />
          <Button type='submit'>Submit</Button>
        </form>
      </div>

      <Modal
        modalProps={{
          id: 'default-menu',
          className: 'n-p-token-4 n-bg-palette-neutral-bg-weak n-rounded-lg min-w-[60%]',
        }}
        onClose={handleCloseModal}
        isOpen={isOpenModal}
      >
        <RetrievalInformation sources={sourcesModal} model={modelModal} timeTaken={timeTaken} />
      </Modal>
    </div>
  );
}
