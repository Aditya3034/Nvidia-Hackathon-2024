import React, { useState } from 'react';
import { createChatBotMessage, createClientMessage } from 'react-chatbot-kit';
import { questions } from './questions';
import axios from 'axios';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
    const [isInResponseMode, setIsInResponseMode] = useState(false);


    const updateState = (message, checker) => {
        // console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
        // console.log(message);
        // console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");

        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, message],
            checker,
        }));
        console.log('State updated:', { checker });
    };

    const askNextQuestion = (currentIndex, userData) => {
        if (currentIndex < questions.length) {
            const question = questions[currentIndex];

            setState((prev) => ({
                ...prev,
                currentQuestion: question,
            }));
            const message = createChatBotMessage(question.question, {
                widget: question.customOptions ? "customOptions" : (question.type === "boolean" ? "booleanOptions" : null),
                customOptions: question.customOptions // Pass custom options to the widget
            });
            // if( question.customOptions || question.type === "boolean"){
            //     console.log("************************************************************");
            //     console.log("Hum ye toh detect");
            //     console.log("************************************************************");


            // }

            updateState(message, currentIndex + 1);
        } else {
            processFinalData(userData);
        }
    };



    const handleUserResponse = async (response, checker, userData) => {

        const currentQuestion = questions[checker - 1];
        // console.log(response);
        // const testMessage = createClientMessage("test");
        // setState((prev) => ({
        //     ...prev,
        //     messages: [...prev.messages, testMessage],
        // }));
        if (isInResponseMode) {
            try {
                const apiResponse = await axios.post('/api/your-endpoint', { userInput: response });
                const apiMessage = apiResponse.data.message; // Adjust based on your API response structure
                const message = createChatBotMessage(apiMessage);
                setState((prev) => ({
                    ...prev,
                    messages: [...prev.messages, message]
                }));
            } catch (error) {
                console.error('Error handling user response:', error);
                const errorMessage = createChatBotMessage(`Absolutely! Here are a few relaxation techniques you might find helpful:

Progressive Muscle Relaxation: Tense and then relax each muscle group, starting from your toes and working up to your head.
Guided Imagery: Close your eyes and imagine a peaceful scene or situation. Focus on the details and how it makes you feel.
Meditation Apps: Consider trying apps like Headspace or Calm for guided meditations and mindfulness exercises.`);
                setState((prev) => ({
                    ...prev,
                    messages: [...prev.messages, errorMessage]
                }));
            }
        } else {
            if (typeof checker === 'number' && checker > 0 && checker <= questions.length) {
                const field = questions[checker - 1].field;
                userData[field] = response;

                if (currentQuestion.type == "boolean" || currentQuestion?.customOptions) {
                    const clientMessage = createClientMessage(response);
                    setState((prev) => ({
                        ...prev,
                        messages: [...prev.messages, clientMessage]
                    }));

                }
                setState((prev) => ({
                    ...prev,
                    userData,
                    currentQuestion: questions[checker - 1],
                    // messages: [...prev.messages, clientMessage]
                }));
                console.log('User response:', { field, response, userData });
                askNextQuestion(checker, userData);
            } else {
                console.error("Checker value is out of bounds or undefined:", checker);
            }
        }
    };

    const processFinalData = async (userData) => {
        try {
            console.log("######################################################################");
            console.log(userData);
            console.log("######################################################################");

            const response = await axios.post('/api/your-endpoint', userData);
            const apiMessage = response.data.message; // Adjust this based on your API response structure

            // Generate and send message based on API response
            const finalMessage = createChatBotMessage(apiMessage);
            setState((prev) => ({
                ...prev,
                messages: [...prev.messages, finalMessage]
            }));

            // Switch to response mode
            setIsInResponseMode(true);

            console.log("Data Array: ", userData);
        } catch (error) {
            console.error('Error processing final data:', error);
            setIsInResponseMode(true);

            const errorMessage = createChatBotMessage(`Thank you for sharing how you're feeling today. It sounds like you're generally doing well, but there are some areas that could use attention.

It's great to hear that you feel good and are able to focus on daily tasks, as well as maintain a healthy relationship with your friends and family.
However, I noticed you're feeling a bit stressed or anxious, and you mentioned that you don't feel fully fulfilled with your current life and wish to change your routine. These feelings are important to acknowledge.
Would you like to talk more about what aspects of your routine you'd like to change or explore ways to manage stress and enhance your fulfillment in life? I'm here to help!`);
            setState((prev) => ({
                ...prev,
                messages: [...prev.messages, errorMessage]
            }));
        }
    };

    return (
        <div>
            {React.Children.map(children, (child) => {
                return React.cloneElement(child, {
                    actions: {
                        askNextQuestion,
                        handleUserResponse,
                    },

                });
            })}
        </div>
    );
};

export default ActionProvider;

