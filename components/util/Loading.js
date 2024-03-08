import React from 'react';

import { Spinner } from 'react-bootstrap';

export default function Loading() {
  return (
    <div style={{ height: '75vh', width: '100wh' }} className="fullCenter">
      <Spinner
        style={{
          color: '#00BF67',
          width: '100px',
          height: '100px',
        }}
      />
    </div>
  );
}
