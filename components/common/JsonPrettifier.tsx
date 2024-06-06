import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const ReactJson = dynamic(() => import("react-json-view"), {ssr: false });

const JsonPrettifier = ({ jsonText }) => {
  const [jsonObject, setJsonObject] = useState(null);

  useEffect(() => {
    try {
    //   const parsedJson = JSON.parse(jsonText);
      setJsonObject(jsonText[0].schema);
    } catch (error) {
      setJsonObject(null);
    }
  }, [jsonText]);

  return (
    <div style={{ margin: '20px' }}>
      {jsonObject ? (
        <div style={{ marginTop: '20px' }}>
          <h3>Schema</h3>
          <ReactJson src={jsonObject} />
        </div>
      ) : (
        <div style={{ marginTop: '20px', color: 'red' }}>
          Invalid JSON format
        </div>
      )}
    </div>
  );
};

export default JsonPrettifier;
