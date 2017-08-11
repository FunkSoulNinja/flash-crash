import React, { PureComponent } from 'react';
import { View, StyleSheet, FlatList, Animated } from 'react-native';
import { Icon, ButtonGroup } from 'react-native-elements';
import { connect } from 'react-redux';

import AnimatedInput from '../components/AnimatedInput';

import ListItem, { Separator } from '../components/ListItem';
import {
    addCardToList,
    removeCardFromList,
    updateSearchBar,
    updateFilter
} from '../actions';
import { cardsSelector, listCardFilterSelector } from '../selectors';

class RenderItem extends PureComponent {
    animate = new Animated.Value(1);
    componentWillUpdate(nextProps) {
        if (this.props.isInList || !nextProps.isInList) return;

        Animated.sequence([
            Animated.timing(this.animate, { toValue: 3, duration: 200 }),
            Animated.spring(this.animate, { toValue: 1, friction: 5 })
        ]).start();
    }
    onPress = () => {
        if (this.props.isInList) {
            this.props.removeCardFromList(
                this.props.listID,
                this.props.item.id
            );
            return;
        } else if (!this.props.isInList) {
            this.props.addCardToList(this.props.listID, this.props.item.id);
            return;
        }
    };
    render() {
        const animatedIconStyle = {
            transform: [{ scale: this.animate }]
        };

        return (
            <ListItem
                text={this.props.item.question}
                rightContent={
                    <Animated.View style={animatedIconStyle}>
                        <Icon
                            size={36}
                            name="done"
                            color={
                                this.props.isInList
                                    ? 'rgb(59, 161, 88)'
                                    : 'rgb(219, 219, 219)'
                            }
                            onPress={this.onPress}
                            underlayColor="transparent"
                        />
                    </Animated.View>
                }
            />
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const cards = cardsSelector(state);
    const list = state.lists[ownProps.navigation.state.params.id];
    return {
        cards,
        list,
        cardsToRender: listCardFilterSelector(state, ownProps, cards, list)
    };
};

@connect(mapStateToProps, {
    addCardToList,
    removeCardFromList,
    updateSearchBar,
    updateFilter
})
class AddCardScreen extends PureComponent {
    constructor(props) {
        super(props);

        this.state = { selectedIndex: 0 };
    }
    componentWillMount() {
        this.props.updateSearchBar('');
        this.props.updateFilter(0);
    }
    renderItem = ({ item }) => {
        const isInList = this.props.list.cards.includes(item.id);

        return (
            <RenderItem
                item={item}
                listID={this.props.list.id}
                isInList={isInList}
                addCardToList={this.props.addCardToList}
                removeCardFromList={this.props.removeCardFromList}
            />
        );
    };
    onFilterPress = selectedIndex => {
        this.setState({ selectedIndex }, () =>
            this.props.updateFilter(selectedIndex)
        );
    };
    onChangeText = input => this.props.updateSearchBar(input);
    render() {
        const buttons = ['Included', 'All', 'Excluded'];

        return (
            <View style={styles.container}>
                <AnimatedInput
                    icon={() => <Icon name="search" color="rgb(64, 64, 64)" />}
                    titleText="Search"
                    onChangeText={this.onChangeText}
                />
                <ButtonGroup
                    containerStyle={{
                        width: '95%',
                        backgroundColor: 'white',
                        borderRadius: 30
                    }}
                    selectedBackgroundColor="rgb(64, 64, 64)"
                    selectedTextStyle={{ color: 'white' }}
                    buttons={buttons}
                    onPress={this.onFilterPress}
                    selectedIndex={this.state.selectedIndex}
                />
                <FlatList
                    data={this.props.cardsToRender}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={Separator}
                    extraData={this.props.list.cards}
                    renderItem={this.renderItem}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-end'
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
        paddingHorizontal: 10,
        fontWeight: '100'
    }
});

export default AddCardScreen;
