import React from 'react';
import Loader from 'react-loader-spinner';

const CustomLoader = (): JSX.Element => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1010,
        width: '100vw',
        height: '100vh',
      }}
    >
      <Loader type="TailSpin" color="#c1558b" height={100} width={100} />
    </div>
  );
};

export default CustomLoader;
