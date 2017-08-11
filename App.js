import Expo from 'expo';
import React, { Component } from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';

import reducers from './src/reducers';
// import { Button } from 'react-native-elements';
import App from './src/App';



//TODO: Add deck with renderCardFront and renderCardBack methods to parent componentWillMount
//TODO: Make list component that enables creating new cards and lists
//TODO: enable redux persist

const store = createStore(reducers, {}, autoRehydrate());
persistStore(store, {
	storage: AsyncStorage,
	whitelist: ['cards', 'lists', 'useAllSwitch']
})
// .purge(['lists', 'cards'])

export default class Main extends Component {
	render() {
		return (
			<Provider store={store}>
				<App />
			</Provider>
		);
	}
}
