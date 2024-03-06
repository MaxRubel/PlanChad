import React from 'react';
import { Button } from 'react-bootstrap';
import { signIn } from '../utils/auth';

function Signin() {
  return (
    <div
      style={{
        background: 'rgb(25,0,17)',
        // eslint-disable-next-line
        background: 'radial-gradient(circle, rgba(25,0,17,1) 0%, rgba(0,0,0,0.7693671218487395) 100%)',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '30px',
        width: '100wh',
        margin: '0 auto',
        color: 'white',
      }}
    >
      <h1
        className="gradient-text"
        style={{
          color: 'white', fontSize: '72px', fontWeight: '600', marginBottom: '5%', marginTop: '-15%',
        }}
      >PlanChad
      </h1>
      <h3 style={{
        fontFamily: 'helvetica', fontWeight: '600', marginBottom: '7%', color: 'lightgrey',
      }}
      >The Chad of Planning Apps™
      </h3>
      <Button
        type="button"
        style={{
          width: '40%',
          border: '1px solid lightgrey',
          backgroundColor: 'transparent',
          transition: 'all 1s ease',
          ':hover': {
            backgroundColor: '#1f2226',
          },
        }}
        className="clearButton"
        onClick={signIn}
      >
        Sign In
      </Button>

    </div>
  );
}

export default Signin;
