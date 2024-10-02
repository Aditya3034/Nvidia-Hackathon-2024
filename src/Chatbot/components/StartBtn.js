import React from 'react';

const StartBtn = (props) => {
  const startInteraction = () => {
    props.actions.askNextQuestion(0, props.state.userData);
  };

  return (
    <div>
      <button className='start-btn' onClick={startInteraction}>Start Autism Prediction</button>
    </div>
  );
};

export default StartBtn;
