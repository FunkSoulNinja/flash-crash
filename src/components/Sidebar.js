import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Switch, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Badge } from 'react-native-elements';

import cardCountSelector from '../selectors/cardCountSelector';
import listCountSelector from '../selectors/cardListCountSelector';
import { toggleUseAllSwitch, setDeckType } from '../actions';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

class ListItem extends PureComponent {
    animate = new Animated.Value(0);
    animatePressIn = () => {
        Animated.spring(this.animate, {
            toValue: 1,
            duration: 250
        }).start();
    };
    animatePressOut = () => {
        Animated.spring(this.animate, {
            toValue: 0,
            duration: 250
        }).start();
    };
    render() {
        const { currentScreen } = this.props.nav;
        const colorInterpolate = this.animate.interpolate({
            inputRange: [0, 1],
            outputRange: [
                currentScreen === this.props.screenName ? 'rgba(0, 0, 0, .4)' : 'rgba(0, 0, 0, 0)',
                'rgba(255, 255, 255, 0.2)'
            ]
        });
        const animatedStyle = {
            backgroundColor: colorInterpolate
        };

        return (
            <AnimatedTouchable
                style={[styles.listItem, animatedStyle]}
                activeOpacity={1}
                onPressIn={this.animatePressIn}
                onPressOut={this.animatePressOut}
                onPress={() => this.props.nav.go(this.props.screenName)}
            >
                <Text style={styles.textStyle}>{this.props.text}</Text>
                {!!this.props.badge && (
                    <Badge value={this.props.badge} textStyle={{ color: 'gold' }} />
                )}
            </AnimatedTouchable>
        );
    }
}

const Sidebar = props => {
    return (
        <View style={styles.container}>
            <ListItem nav={props.nav} screenName="Home" text="Home" />
            <ListItem nav={props.nav} screenName="CreateCard" text="Create New Flashcard" />
            <ListItem badge={props.cardCount} nav={props.nav} screenName="Cards" text="Cards" />
            <ListItem badge={props.listCount} nav={props.nav} screenName="CardLists" text="Lists" />
            <ListItem nav={props.nav} screenName="StudyScreen" text="Study" />
            <View style={styles.separator} />
            <View style={styles.listItem}>
                <Text style={styles.textStyle}>Use All Cards</Text>
                <Switch
                    onTintColor="rgb(54, 122, 131)"
                    onValueChange={() => props.toggleUseAllSwitch(!props.useAllCards)}
                    value={props.useAllCards}
                />
            </View>
            {Platform.OS !== 'android' && (
                <View style={styles.listItem}>
                    <Text style={styles.textStyle}>
                        Deck Type: {props.XRayDeck ? 'X-Ray' : 'Flip'}
                    </Text>
                    <Switch
                        onTintColor="rgb(54, 122, 131)"
                        onValueChange={() => props.setDeckType(!props.XRayDeck)}
                        value={props.XRayDeck}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    listItem: {
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 10,
        height: 50,
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textStyle: {
        color: 'white',
        fontWeight: '200',
        fontSize: 20
    },
    separator: {
        height: 2,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, .4)'
    }
});

const mapStateToProps = state => {
    return {
        cardCount: cardCountSelector(state),
        listCount: listCountSelector(state),
        useAllCards: state.useAllSwitch,
        XRayDeck: state.XRayDeck
    };
};

export default connect(mapStateToProps, { toggleUseAllSwitch, setDeckType })(Sidebar);
