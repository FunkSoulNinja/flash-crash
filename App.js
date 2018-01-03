import React, { Component } from 'react';
import { AsyncStorage, View, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';

import reducers from './src/reducers';
import App from './src/App';

const store = createStore(reducers, {}, autoRehydrate());
persistStore(store, {
    storage: AsyncStorage,
    whitelist: ['cards', 'lists', 'useAllSwitch', 'XRayDeck']
});
// .purge(['lists', 'cards'])

export default class Main extends Component {
    render() {
        return (
            <Provider store={store}>
                <View style={{ flex: 1 }}>
                    <StatusBar barStyle="light-content" />
                    <App />
                </View>
            </Provider>
        );
    }
}
