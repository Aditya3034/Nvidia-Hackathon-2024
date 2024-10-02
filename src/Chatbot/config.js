import { createChatBotMessage } from 'react-chatbot-kit';
import Avatar from './components/Avatar';
import StartBtn from './components/StartBtn';
import StartSlow from './components/StartSlow';
import data from './data';
import DipslayImage from './components/DipslayImage';
import BooleanOptions from './components/BooleanOptions';
import CustomOptionsWidget from './components/CustomOptionsWidget';

const config = {
    botName: "Chatbot",
    initialMessages: [createChatBotMessage(`Welcome to our Chatbot!`, {
        widget: "startBtn"
    })],
    customComponents: {
        botAvatar: (props) => <Avatar {...props} />,
    },
    state: {
        currentQuestionIndex: null, // Initialize to null or 0
        data,
        showWidget: true,
        userData: {
            name: "",
            age: 0,
            gender: "",
            todaysmood: "",
            stressOrAnxiety: "",
            sleepingWell: "",
            focusOnTasks: "",
            fulfilledLife: "",
            wishToChange: "",
            fulfilledLifeNow: "",
            standingToExpectations: "",
            relationsWithOthers: "",
        },
    },
    widgets: [
        {
            widgetName: "startBtn",
            widgetFunc: (props) => <StartBtn {...props} />,
        },
        {
            widgetName: "startSlow",
            widgetFunc: (props) => <StartSlow {...props} />,
        },
        {
            widgetName: "booleanOptions",
            widgetFunc: (props) => <BooleanOptions {...props} />, // Add the BooleanOptions widget
        },
        {
            widgetName: "customOptions",
            widgetFunc: (props) => <CustomOptionsWidget {...props} />,
        },
        {
            widgetName: "finalImage",
            widgetFunc: (props) => <DipslayImage {...props} />,
        },
    ]
};

export default config;
