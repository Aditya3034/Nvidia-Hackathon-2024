import React from 'react';

const CustomOptionsWidget = (props) => {
   
    const {actions, state} = props;
    const {customOptions } = state.currentQuestion;
    if (!state.showWidget) return null;

    
    // Check if question is defined and has customOptions
    const options = customOptions || [];

    const handleClick = (response) => {
        actions.handleUserResponse(response, props.state.checker, props.state.userData);
    };

    return (
        <div>
            {options.length > 0 && (
                options.map((option, index) => (
                    <button  className='start-btn  slow-btn'  key={index} onClick={() => handleClick(option)}>
                        {option}
                    </button>
                ))
            ) }
        </div>
    );
};

export default CustomOptionsWidget;
