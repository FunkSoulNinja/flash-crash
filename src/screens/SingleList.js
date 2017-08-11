import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import getCardsForList from '../selectors/cardsForListSelector';
import { addCardToList } from '../actions';

const Separator = () => <View style={styles.separator} />;
//
//
//
// Unused Code
//
//
//
//
//
//
//

const mapStateToProps = (state, ownProps) => ({
    list: getCardsForList(state, ownProps)
});

@connect(mapStateToProps, { addCardToList })
class List extends Component {
    renderItem = ({ item }) => {
        return (
            <View style={styles.listItem}>
                <View style={styles.listItemLeftContent}>
                    <Text style={styles.listItemText}>
                        {item.question}
                    </Text>
                </View>
                <View style={styles.listItemRightContent} />
            </View>
        );
    };
    onFilterPress = selectedIndex => {
        this.setState({ selectedIndex });
    };
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    keyExtractor={item => item.id}
                    data={this.props.list.cards}
                    renderItem={this.renderItem}
                    ItemSeparatorComponent={Separator}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    headerLeft: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    headerRight: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    listItem: {
        backgroundColor: 'white',
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    listItemLeftContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    listItemRightContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    listItemText: {
        paddingVertical: 20,
        fontWeight: '100'
    },
    separator: {
        height: 1,
        width: '100%',
        marginLeft: 10,
        backgroundColor: '#CED0CE'
    }
});

export default List;
