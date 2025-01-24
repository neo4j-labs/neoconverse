import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface FileContextType {
  file: File[] | [];
  setFile: Dispatch<SetStateAction<File[]>>;
}
const FileContext = createContext<FileContextType | undefined>(undefined);
interface FileContextProviderProps {
  children: ReactNode;
}
const FileContextProvider: React.FC<FileContextProviderProps> = ({ children }) => {
  const [file, setFile] = useState<File[] | []>([]);
  const value: FileContextType = {
    file,
    setFile,
  };
  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
};
const useFileContext = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFileContext must be used within a FileContextProvider');
  }
  return context;
};
export { FileContextProvider, useFileContext };
