import React, { Component } from 'react';
import { Animated, StyleSheet } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export default class SwipeRow extends Component {
    renderRightActions = (progress, dragX) => {
        const scale = dragX.interpolate({
            inputRange: [-80, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        });
        return (
            <RectButton style={styles.rightAction} onPress={() => this.props.onDelete(this.close)}>
                <AnimatedIcon
                    name="delete-forever"
                    size={30}
                    color="#fff"
                    style={[styles.actionIcon, { transform: [{ scale }] }]}
                />
            </RectButton>
        );
    };
    updateRef = ref => {
        this._swipeableRow = ref;
    };
    close = () => {
        this._swipeableRow.close();
    };
    render() {
        const { children } = this.props;
        return (
            <Swipeable
                enabled={this.props.enabled}
                ref={this.updateRef}
                friction={2}
                rightThreshold={60}
                renderRightActions={this.renderRightActions}
            >
                {children}
            </Swipeable>
        );
    }
}

const styles = StyleSheet.create({
    leftAction: {
        flex: 1,
        backgroundColor: '#388e3c',
        justifyContent: 'center'
    },
    actionIcon: {
        width: 30,
        marginHorizontal: 10
    },
    rightAction: {
        alignItems: 'flex-end',
        backgroundColor: '#dd2c00',
        flex: 1,
        justifyContent: 'center'
    }
});
