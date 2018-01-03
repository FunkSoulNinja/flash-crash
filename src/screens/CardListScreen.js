import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ListView } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { KeyboardAwareListView } from 'react-native-keyboard-aware-scroll-view';
import Swipeout from 'react-native-swipeout';

import { createCard, updateCard, updateSearchBar, deleteCard, listCleanup } from '../actions';
import cardListSelector from '../selectors/cardsSelector';
import AnimatedInput from '../components/AnimatedInput';
import CardEditor from '../components/CardEditor';

class ListItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isExpanded: false,
            closeSwipeout: false
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.cardProps !== nextProps.cardProps) return true;
        else if (this.state !== nextState) return true;
        else return false;
    }
    onLongPress = () => {
        this.setState({ isExpanded: true });
    };
    renderCollapsed = () => {
        const { cardProps } = this.props;
        return (
            <View style={styles.listItemCollapsed}>
                <Text style={styles.listItemText}>{cardProps.question}</Text>
            </View>
        );
    };
    renderExpanded = () => {
        const { cardProps } = this.props;

        return (
            <CardEditor
                isListItem
                cardProps={cardProps}
                collapse={() => this.setState({ isExpanded: false })}
            />
        );
    };
    onDelete = () => {
        Alert.alert('Do you want to delete?', '', [
            {
                text: 'Yes',
                onPress: () => {
                    this.props.listCleanup(this.props.cardProps.id);
                    this.props.deleteCard(this.props.cardProps.id);
                }
            },
            {
                text: 'Cancel',
                onPress: () =>
                    this.setState(
                        state => ({ ...state, closeSwipeout: true }),
                        () => this.setState(state => ({ ...state, closeSwipeout: false }))
                    )
            }
        ]);
    };
    render() {
        const rightButtons = [
            {
                component: (
                    <TouchableOpacity onPress={this.onDelete} style={styles.deleteSwiper}>
                        <Icon color="white" name="delete" />
                    </TouchableOpacity>
                )
            }
        ];
        return (
            <Swipeout
                close={this.state.closeSwipeout}
                disabled={this.state.isExpanded}
                scroll={allow => this.props.allowScroll(allow)}
                right={rightButtons}
            >
                <TouchableOpacity
                    onLayout={this.onLayout}
                    activeOpacity={this.state.isExpanded ? 1 : 0.5}
                    delayLongPress={100}
                    onLongPress={!this.state.isExpanded ? this.onLongPress : null}
                    style={styles.listItem}
                >
                    {!this.state.isExpanded ? this.renderCollapsed() : this.renderExpanded()}
                </TouchableOpacity>
            </Swipeout>
        );
    }
}

const Separator = () => <View style={styles.separator} />;

const mapStateToProps = state => {
    return { cards: cardListSelector(state) };
};

@connect(mapStateToProps, {
    createCard,
    updateCard,
    deleteCard,
    updateSearchBar,
    listCleanup
})
export default class CardList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allowScroll: true
        };
    }
    createDataSource({ cards }) {
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.dataSource = ds.cloneWithRows(cards);
    }
    componentWillMount() {
        this.props.updateSearchBar('');
        this.createDataSource(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.createDataSource(nextProps);
    }
    renderListItem = item => {
        return (
            <ListItem
                key={item.id}
                deleteCard={this.props.deleteCard}
                listCleanup={this.props.listCleanup}
                allowScroll={allowScroll => this.setState({ allowScroll })}
                cardProps={item}
                updateCard={this.props.updateCard}
            />
        );
    };
    onChangeText = input => this.props.updateSearchBar(input);
    render() {
        return (
            <View style={{ flex: 1 }}>
                <AnimatedInput
                    left={
                        <Icon
                            size={36}
                            containerStyle={styles.createCardButton}
                            underlayColor="transparent"
                            name="add"
                            color="green"
                            onPress={() => this.props.nav.go('CreateCard')}
                        />
                    }
                    icon={() => <Icon name="search" color="rgb(64, 64, 64)" />}
                    titleText="Search"
                    onChangeText={this.onChangeText}
                />
                <KeyboardAwareListView
                    scrollEnabled={this.state.allowScroll}
                    extraHeight={220}
                    enableResetScrollToCoords={false}
                    dataSource={this.dataSource}
                    renderRow={this.renderListItem}
                    renderSeparator={Separator}
                    enableEmptySections
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 5,
        marginVertical: 5,
        backgroundColor: 'white'
    },
    infoButton: {
        position: 'absolute',
        paddingHorizontal: 10,
        zIndex: -1,
        right: 10
    },
    text: {
        fontSize: 30,
        backgroundColor: 'rgb(64, 99, 152)'
    },
    listItemCollapsed: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    listItemText: {
        fontWeight: '100',
        fontSize: 25,
        textAlign: 'center'
    },
    deleteSwiper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 25,
        backgroundColor: 'rgb(203, 48, 48)'
    },
    rightButtons: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
        // paddingRight: 16,
    },
    createCardButton: {
        position: 'absolute',
        paddingHorizontal: 10,
        zIndex: -1,
        left: 10
    },
    listItem: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: '#ffffff',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    listItemEditButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    actionIcon: {
        width: 30,
        marginHorizontal: 10
    },
    separator: {
        height: 1,
        width: '100%',
        marginLeft: 10,
        backgroundColor: '#CED0CE'
    }
});

// const babyblue = 'rgb(84, 165, 218)';
