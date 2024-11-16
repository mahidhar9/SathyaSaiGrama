import { render, screen, userEvent } from '@testing-library/react-native';
import { Text as MockText}  from 'react-native';
import App from '../App';
import { openInbox } from "react-native-email-link";
import BaseRoute from '../navigation/stack-navigation/BaseRoute';
import NetInfo from '@react-native-community/netinfo';
import messaging from '@react-native-firebase/messaging';
import CodePush from 'react-native-code-push';
import { AuthProvider  } from '../src/auth/AuthProvider';
import ContextProvider from '../context/ContextProvider';
import {onAuthStateChanged } from "firebase/auth";

jest.mock('../navigation/stack-navigation/BaseRoute', () => {
  return jest.fn().mockImplementation ((props) => {
      return (<MockText>BaseRouteText</MockText>)
    })
   
  
})
jest.mock('@react-native-community/netinfo', () => {
  return ({addEventListener:jest.fn().mockImplementation ((callback) => {
    callback({isConnected: true});
    return (jest.fn())
  })
})
})


jest.mock('@react-native-firebase/messaging', () => {
  return jest.fn().mockImplementation ((props) => {
    return (<MockText>Messaging</MockText>)
  })
})

jest.mock('react-native-code-push', () => {
  return  jest.fn().mockImplementation ((MockApp) => {
    return MockApp
  })
})

jest.mock('react-native-email-link', () => {
  return   jest.fn().mockImplementation ((props) => {
      return (<MockText>Email Link</MockText>)
    })
})
test('form submits two answers', async () => {

  
    render(  <AuthProvider>
      <ContextProvider>
        <App />
      </ContextProvider>
      </AuthProvider>);
  
    const testDisplay = screen.getAllByText('BaseRouteText');
  
    expect(testDisplay).toBeDefined();
  });