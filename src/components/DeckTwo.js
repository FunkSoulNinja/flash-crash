import React, { Component } from 'react';
import {
    PanResponder,
    View,
    Dimensions,
    Animated,
    StyleSheet,
    UIManager,
    LayoutAnimation
} from 'react-native';
import { Text } from 'native-base';
import PropTypes from 'prop-types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD_X = 0.25 * SCREEN_WIDTH;
UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);

class DeckSwiper extends Component {
    constructor(props) {
        super(props);

        this.animatedOpacity = new Animated.Value(1);
        this.position = new Animated.ValueXY();

        this.state = {
            currentIndex: 0,
            cardWidth: 0,
            cardHeight: 0,
            overlayWidth: 0,
            overlayHeight: 0
        };

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: this.onPanResponderGrant,
            onPanResponderMove: this.onPanResponderMove,
            onPanResponderRelease: this.onPanResponderRelease
        });
    }
    componentWillUpdate() {
        LayoutAnimation.spring();
    }
    componentDidUpdate() {
        if (this.props.data[this.state.currentIndex])
            this.props.setCurrentCard(this.props.data[this.state.currentIndex].id);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState(state => ({ ...state, currentIndex: 0 }));
        }
    }
    onPanResponderGrant = () => {
        Animated.timing(this.animatedOpacity, {
            toValue: 0,
            duration: 250
        }).start();
    };
    onPanResponderMove = (event, { dx, dy }) => {
        this.position.setValue({ x: dx, y: dy });
    };
    onPanResponderRelease = (evt, { dx }) => {
        Animated.parallel([
            Animated.timing(this.animatedOpacity, {
                toValue: 1,
                duration: 250
            }),
            Animated.spring(this.position, {
                toValue: { x: 0, y: 0 },
                friction: 4
            })
        ]).start();

        if (dx < -SWIPE_THRESHOLD_X) this.forceSwipe('left');
        else if (dx > SWIPE_THRESHOLD_X) this.forceSwipe('right');
    };
    handleLayout = e => {
        if (this.state.cardWidth !== 0) return;
        const { width, height } = e.nativeEvent.layout;
        this.setState(state => ({ ...state, cardWidth: width, cardHeight: height }));
    };
    handleOverlayLayout = e => {
        if (this.state.overlayWidth !== 0) return;

        const { width, height } = e.nativeEvent.layout;
        this.setState(state => ({ ...state, overlayWidth: width, overlayHeight: height }));
    };
    renderOverlayText() {
        const { cardWidth, cardHeight } = this.state;

        const color = this.position.x.interpolate({
            inputRange: [-100, -30, 0, 30, 100],
            outputRange: [
                'rgba(183, 48, 55, 1)',
                'rgba(183, 48, 55, 0)',
                'rgba(255, 255, 255, 0)',
                'rgba(51, 152, 40, 0)',
                'rgba(51, 152, 40, 1)'
            ],
            extrapolate: 'clamp'
        });

        // const backgroundColor = this.position.x.interpolate({
        //     inputRange: [-100, -20, 0, 20, 100],
        //     outputRange: [
        //         'rgba(255, 255, 255, 1)',
        //         'rgba(255, 255, 255, 0)',
        //         'rgba(255, 255, 255, 0)',
        //         'rgba(255, 255, 255, 0)',
        //         'rgba(255, 255, 255, 1)'
        //     ],
        //     extrapolate: 'clamp'
        // });

        const wrongOpacity = this.position.x.interpolate({
            inputRange: [-100, -30, 0],
            outputRange: [1, 1, 0],
            extrapolate: 'clamp'
        });
        const correctOpacity = this.position.x.interpolate({
            inputRange: [0, 30, 100],
            outputRange: [0, 1, 1],
            extrapolate: 'clamp'
        });

        return (
            <Animated.View
                onLayout={this.handleOverlayLayout}
                style={[
                    styles.overlayContainer,
                    {
                        left: cardWidth / 2 - this.state.overlayWidth / 2,
                        top: cardHeight / 2 - this.state.overlayHeight / 2 - 150,
                        // borderColor: color,
                        backgroundColor: 'transparent'
                    }
                ]}
            >
                <Animated.Text
                    style={{
                        color,
                        backgroundColor: 'transparent',
                        fontSize: 32,
                        opacity: wrongOpacity,
                        position: 'absolute'
                    }}
                >
                    Wrong
                </Animated.Text>
                <Animated.Text
                    style={{
                        color,
                        backgroundColor: 'transparent',
                        fontSize: 32,
                        opacity: correctOpacity
                    }}
                >
                    Correct
                </Animated.Text>
            </Animated.View>
        );
    }
    getRotationStyle() {
        const position = this.position;
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 2, 0, SCREEN_WIDTH * 2],
            outputRange: ['-120deg', '0deg', '120deg']
        });
        return rotate;
    }
    getAnimationStyle(cardSide) {
        return {
            ...this.position.getLayout(),
            opacity: cardSide === 'front' ? this.animatedOpacity : 1,
            transform: [{ rotate: this.getRotationStyle() }]
        };
    }
    forceSwipe(direction) {
        const X_MOVE = SCREEN_WIDTH * 1.2;
        this.animatedOpacity.setValue(1);

        Animated.timing(this.position, {
            toValue: {
                y: 0,
                x: direction === 'left' ? -X_MOVE : X_MOVE
            },
            duration: 200
        }).start(this.onSwipeComplete);
    }
    onSwipeComplete = () => {
        this.position.setValue({ x: 0, y: 0 });

        if (this.state.currentIndex === this.props.data.length - 1) {
            return this.setState({ currentIndex: 0 });
        }
        this.setState({ currentIndex: this.state.currentIndex + 1 });
    };
    renderCards() {
        if (this.state.currentIndex >= this.props.data.length) {
            return this.props.renderEmpty();
        }

        return this.props.data
            .map((cardData, cardIndex) => {
                if (cardIndex < this.state.currentIndex) return <View key={cardData.id} />;
                const isCurrentCard = this.state.currentIndex === cardIndex;
                // Card has been swiped. No need to render

                if (isCurrentCard) {
                    return (
                        <View
                            {...this.panResponder.panHandlers}
                            key={cardData.id}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <Animated.View
                                onLayout={this.handleLayout}
                                style={[styles.cardStyle, this.getAnimationStyle('back')]}
                            >
                                {this.props.renderCardBack(cardData)}
                            </Animated.View>
                            {/* <Animated.View
                                style={[styles.cardStyle, this.getAnimationStyle('back')]}
                            >
                                {this.renderOverlayText()}
                            </Animated.View> */}
                            <Animated.View
                                style={[styles.cardStyle, this.getAnimationStyle('front')]}
                            >
                                {this.props.renderCardFront(cardData)}
                            </Animated.View>
                        </View>
                    );
                } else if (cardIndex > this.state.currentIndex + 3) {
                    return <View key={cardData.id} />;
                }
                const scaleStyle = {
                    transform: [{ scale: 1 - 0.04 * (cardIndex - this.state.currentIndex) }]
                };
                return (
                    <View
                        key={cardData.id}
                        style={{
                            top: 20 * (cardIndex - this.state.currentIndex)
                        }}
                    >
                        <Animated.View style={[styles.cardStyle, scaleStyle]}>
                            {this.props.renderCardBack(cardData)}
                        </Animated.View>
                        <Animated.View style={[styles.cardStyle, scaleStyle]}>
                            {this.props.renderCardFront(cardData)}
                        </Animated.View>
                    </View>
                );
            })
            .reverse();
    }
    render() {
        return <View style={styles.container}>{this.renderCards()}</View>;
    }
}

DeckSwiper.propTypes = {
    data: PropTypes.array.isRequired,
    renderEmpty: PropTypes.func,
    renderCardFront: PropTypes.func.isRequired,
    renderCardBack: PropTypes.func.isRequired
};

DeckSwiper.defaultProps = {
    renderEmpty: () => <Text>No More Cards</Text>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    },
    cardStyle: {
        position: 'absolute',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT
    },
    overlayContainer: {
        padding: 10,
        position: 'absolute',
        // borderWidth: 4,
        // borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default DeckSwiper;
