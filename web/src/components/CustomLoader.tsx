import React from 'react';
import Loader from 'react-loader-spinner';

const CustomLoader = (): JSX.Element => {
  return (
    <div
      className="page"
      style={{justifyContent: 'center', alignItems: 'center'}}
    >
      <Loader type="TailSpin" color="#c1558b" height={100} width={100} />
    </div>
  );
};

export default CustomLoader;
