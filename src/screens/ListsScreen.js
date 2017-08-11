import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Animated,
    Alert,
    TextInput
} from 'react-native';
import { Icon, Badge, ButtonGroup } from 'react-native-elements';
import { connect } from 'react-redux';

import { RED, GREEN } from '../colors';
import ListItem, { Separator } from '../components/ListItem';
import AnimatedInput from '../components/AnimatedInput';
import {
    createList,
    addCardToList,
    updateListName,
    toggleListActive,
    setFilter,
    deleteList
} from '../actions';
import listsSelector from '../selectors/listsSelector';

/*
TODO: per study session (hold in component State rather than redux),
reshow a card sooner if user has gotten it wrong
*/

class RenderItem extends Component {
    animate = new Animated.Value(1);
    shouldComponentUpdate(nextProps) {
        if (nextProps.item !== this.props.item) return true;
        if (nextProps.editMode !== this.props.editMode) return true;
        return false;
    }
    componentWillUpdate(nextProps) {
        if (this.props.item.active || !nextProps.item.active) return;

        Animated.sequence([
            Animated.timing(this.animate, { toValue: 3, duration: 200 }),
            Animated.spring(this.animate, { toValue: 1, friction: 5 })
        ]).start();
    }
    onCheckmarkPress = () => {
        this.props.toggleListActive(this.props.item.id);
    };
    onDelete = () => {
        Alert.alert('Do you want to delete this list?', '', [
            {
                text: 'Yes',
                onPress: () => {
                    this.props.delete();
                }
            },
            { text: 'No' }
        ]);
    };
    render() {
        const animatedIconStyle = {
            transform: [{ scale: this.animate }]
        };
        return (
            <ListItem
                leftContent={
                    <Animated.View style={animatedIconStyle}>
                        <Icon
                            size={36}
                            name={'done'}
                            color={
                                this.props.item.active
                                    ? GREEN
                                    : 'rgb(219, 219, 219)'
                            }
                            onPress={this.onCheckmarkPress}
                            underlayColor="transparent"
                        />
                    </Animated.View>
                }
                mainContent={
                    !this.props.editMode
                        ? <Text style={styles.listItemText}>
                              {this.props.item.name}
                          </Text>
                        : <TextInput
                              style={styles.listItemInput}
                              autoCorrect={false}
                              value={this.props.item.name}
                              onChangeText={text =>
                                  this.props.updateListName(
                                      this.props.item.id,
                                      text
                                  )}
                          />
                }
                rightContent={
                    <View style={styles.listItemRightContent}>
                        {!this.props.editMode &&
                            <Badge value={this.props.item.cards.length} />}
                        {!this.props.editMode
                            ? <Icon
                                  name="chevron-right"
                                  size={40}
                                  color="rgb(92, 92, 92)"
                                  onPress={() =>
                                      this.props.navigation.navigate('List', {
                                          id: this.props.item.id,
                                          name: this.props.item.name,
                                          addCardToList: this.props
                                              .addCardToList
                                      })}
                              />
                            : <Icon
                                  name="delete-forever"
                                  size={40}
                                  color={RED}
                                  onPress={this.onDelete}
                              />}
                    </View>
                }
            />
        );
    }
}

const mapStateToProps = state => {
    return {
        lists: listsSelector(state),
        filter: state.activeListFilter
    };
};

@connect(mapStateToProps, {
    createList,
    addCardToList,
    updateListName,
    toggleListActive,
    setFilter,
    deleteList
})
class CardListScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newListName: '',
            editMode: false
        };
    }
    onCreateList = () => {
        const name = this.state.newListName.trim();
        if (!name) return;
        this.props.createList(name);
        this.setState({ newListName: '' });
    };
    onFilterPress = selectedIndex => {
        let filter = 'all'; // Index of 0

        if (selectedIndex === 1) filter = 'active';
        else if (selectedIndex === 2) filter = 'inactive';
        this.props.setFilter(filter);
    };
    renderItem = ({ item }) => {
        return (
            <RenderItem
                item={item}
                navigation={this.props.navigation}
                toggleListActive={this.props.toggleListActive}
                delete={() => this.props.deleteList(item.id)}
                updateListName={this.props.updateListName}
                editMode={this.state.editMode}
            />
        );
    };
    render() {
        const buttons = ['All', 'Active', 'Inactive'];

        let selectedIndex = 0;
        if (this.props.filter === 'active') selectedIndex = 1;
        else if (this.props.filter === 'inactive') selectedIndex = 2;

        return (
            <View style={styles.container}>
                <AnimatedInput
                    onComplete={this.onCreateList}
                    placeholder="Name For List"
                    titleText="Create New"
                    finishButton="Create"
                    onChangeText={text => this.setState({ newListName: text })}
                    icon={() =>
                        <Icon
                            name="create-new-folder"
                            color="rgb(64, 64, 64)"
                        />}
                    right={
                        <Icon
                            name={!this.state.editMode ? 'mode-edit' : 'done'}
                            size={36}
                            containerStyle={styles.editButton}
                            color={
                                !this.state.editMode
                                    ? 'rgb(204, 200, 57)'
                                    : 'green'
                            }
                            underlayColor="transparent"
                            onPress={() =>
                                this.setState({
                                    editMode: !this.state.editMode
                                })}
                        />
                    }
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
                    selectedIndex={selectedIndex}
                />
                <FlatList
                    keyExtractor={item => item.id}
                    data={this.props.lists}
                    renderItem={this.renderItem}
                    ItemSeparatorComponent={Separator}
                    extraData={this.state.editMode}
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
    editButton: {
        position: 'absolute',
        paddingHorizontal: 10,
        zIndex: -1,
        right: 10
    },
    listItem: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    listItemInput: {
        flex: 3,
        fontSize: 16,
        height: 49,
        marginVertical: 4,
        fontWeight: '100',
        // paddingHorizontal: 10,
        backgroundColor: 'rgb(240, 240, 240)',
        color: 'black'
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
        flex: 3,
        paddingVertical: 20,
        paddingHorizontal: 10,
        fontWeight: '100',
        backgroundColor: 'transparent'
    }
});

export default CardListScreen;
