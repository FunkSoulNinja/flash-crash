import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import SideDrawer from './components/SideDrawer';
import Sidebar from './components/Sidebar';
import CardListScreen from './screens/CardListScreen';
import HomeScreen from './screens/HomeScreen';
import CreateCardScreen from './screens/CreateCardScreen';
import StudyScreen from './screens/StudyScreen';
import ListsScreen from './screens/ListsScreen';
import AddCardScreen from './screens/AddCardsToListScreen';

const routeConfig = {
    Home: {
        screen: ListsScreen,
        navigationOptions: { header: null }
    },
    List: {
        screen: AddCardScreen,
        navigationOptions: ({ navigation: { state: { params } } }) => ({
            title: params.name
        })
    }
};

const navConfig = {
    // global navigation config
    initialRouteName: 'Home',
    cardStyle: {
        elevation: 0,
        shadowOpacity: 0
    },
    navigationOptions: {
        headerTintColor: 'white',
        headerStyle: {
            paddingTop: 0,
            height: 57,
            justifyContent: 'center',
            backgroundColor: 'rgb(64, 64, 64)'
        }
    }
};

const CardListNavigator = StackNavigator(routeConfig, navConfig);

const DrawerNavigator = SideDrawer({
    screens: {
        Home: {
            defaultScreen: true,
            screen: HomeScreen
        },
        CreateCard: {
            screen: CreateCardScreen,
            headerTitle: 'Create new card'
        },
        Cards: {
            screen: CardListScreen
        },
        StudyScreen: {
            screen: StudyScreen,
            headerTitle: 'Study'
        },
        CardLists: {
            screen: () => <CardListNavigator onNavigationStateChange={null} />,
            headerTitle: 'Lists'
        }
    },
    sidebar: Sidebar
});

const App = () => <DrawerNavigator />;

export default App;
