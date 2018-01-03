import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    PanResponder,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import { connect } from 'react-redux';
// import { Icon } from 'react-native-elements';
import { Icon } from 'native-base';
import _ from 'lodash';

import EditScreen from '../screens/EditScreen';
import currentCardSelector from '../selectors/currentCardSelector';

//TODO: add second drag button thing at bottom right to reveal a secondary drawer siderbar!

const SIDEBAR_WIDTH = 250;
const MOVE_DISTANCE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 0.3;

const friction = 5;
const tension = 10;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

//TODO: add thin panresponder strip to left side of screen;
const mapStateToProps = state => ({
    currentCardID: state.currentCardID,
    currentCard: currentCardSelector(state)
});

@connect(mapStateToProps)
class SideDrawerBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false
        };

        this.drawerPosition = new Animated.Value(0);
        this.drawerOffset = 0;
        this.drawerPosition.addListener(({ value }) => {
            let newValue = 0;
            if (value <= SIDEBAR_WIDTH && value >= 0) newValue = value;
            else if (value >= SIDEBAR_WIDTH) newValue = SIDEBAR_WIDTH;
            else if (value <= 0) newValue = 0;

            this.drawerOffset = newValue;
        });
        this.isOpen = false;

        this.headerPanResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                Keyboard.dismiss();
                this.drawerPosition.setOffset(this.drawerOffset);
                this.drawerPosition.setValue(0);
            },
            onPanResponderMove: Animated.event([null, { dx: this.drawerPosition }]),
            onPanResponderRelease: (e, { dx, vx }) => {
                this.finishMovingDrawer(dx, vx);
            }
        });

        this.mainViewPanResponder = PanResponder.create({
            onStartShouldSetPanResponder: this.canSwipeMainView,
            onStartShouldSetResponderCapture: () => this.isOpen,
            onMoveShouldSetResponderCapture: () => this.isOpen,
            // onMoveShouldSetPanResponder: this.canSwipeMainView,
            onPanResponderGrant: () => {
                this.drawerPosition.setOffset(this.drawerOffset);
                this.drawerPosition.setValue(0);
            },
            onPanResponderMove: (evt, { dx, vx, vy }) => {
                if (Math.abs(vx) > Math.abs(vy) * 3) this.drawerPosition.setValue(dx);
            },
            onPanResponderRelease: (e, { dx, vx }) => {
                this.finishMovingDrawer(dx, vx);
            }
        });
    }
    canSwipeMainView = evt => {
        if (this.isOpen || evt.nativeEvent.pageX < 30) return true;
        else return false;
    };
    componentWillUpdate() {
        this.state.modalOpen = false;

        if (this.drawerOffset > 200) {
            // Animated.timing(this.drawerPosition, {
            // 	toValue: -SIDEBAR_WIDTH,
            // 	duration: 700
            // }).start()
            this.isOpen = false;
            Animated.sequence([
                Animated.delay(50),
                Animated.timing(this.drawerPosition, {
                    toValue: -SIDEBAR_WIDTH,
                    duration: 500
                })
            ]).start();
        }
    }

    menuButtonPress = () => {
        if (this.isOpen) {
            Animated.timing(this.drawerPosition, {
                toValue: -SIDEBAR_WIDTH,
                duration: 500
            }).start();
            this.isOpen = false;
        } else {
            Animated.timing(this.drawerPosition, {
                toValue: SIDEBAR_WIDTH,
                duration: 500
            }).start();
            this.isOpen = true;
        }
    };
    finishMovingDrawer(dx, vx) {
        // finishes animating open or close drawer animation after the user releases touch

        if (this.isOpen) {
            if (dx < -MOVE_DISTANCE_THRESHOLD || vx < -VELOCITY_THRESHOLD) {
                // console.log('isOpen and is closing');
                this.isOpen = false;
                Animated.spring(this.drawerPosition, {
                    toValue: -SIDEBAR_WIDTH,
                    friction,
                    tension
                }).start();
            } else {
                // console.log('isOpen and is reverting');
                this.isOpen = true;
                Animated.timing(this.drawerPosition, {
                    toValue: SIDEBAR_WIDTH,
                    duration: 300
                }).start();
            }
        } else if (!this.isOpen) {
            if (dx > MOVE_DISTANCE_THRESHOLD || vx > VELOCITY_THRESHOLD) {
                // console.log('!isOpen and is opening');
                this.isOpen = true;

                Animated.spring(this.drawerPosition, {
                    toValue: SIDEBAR_WIDTH,
                    friction,
                    tension
                }).start();
            } else {
                // console.log('!isOpen and is reverting');
                this.isOpen = false;
                Animated.timing(this.drawerPosition, {
                    toValue: -SIDEBAR_WIDTH,
                    duration: 300
                }).start();
            }
        }
    }
    renderHeader() {
        const rotate = this.drawerPosition.interpolate({
            inputRange: [0, SIDEBAR_WIDTH],
            outputRange: ['0deg', '180deg'],
            extrapolate: 'clamp'
        });
        const arrowIconOpacity = this.drawerPosition.interpolate({
            inputRange: [0, 25],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        });
        const menuIconOpacity = this.drawerPosition.interpolate({
            inputRange: [0, 25],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        });

        return (
            <View style={styles.header} {...this.headerPanResponder.panHandlers}>
                <AnimatedTouchable style={styles.headerLeft} onPress={this.menuButtonPress}>
                    <Animated.View
                        style={[
                            styles.headerButton,
                            {
                                opacity: menuIconOpacity,
                                transform: [{ rotate }]
                            }
                        ]}
                    >
                        <Icon name="menu" size={30} style={styles.icon} />
                    </Animated.View>
                    <Animated.View
                        style={[
                            styles.headerButton,
                            {
                                opacity: arrowIconOpacity,
                                transform: [{ rotate }]
                            }
                        ]}
                    >
                        <Icon name="arrow-forward" size={30} style={styles.icon} />
                    </Animated.View>
                </AnimatedTouchable>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerText}>{this.props.nav.headerTitle}</Text>
                </View>
                <View style={styles.headerRight}>
                    {this.props.nav.currentScreen !== 'StudyScreen' ? (
                        <TouchableOpacity onPress={() => this.props.nav.go('StudyScreen')}>
                            <Text style={styles.headerText}>Study</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={() =>
                                this.setState({
                                    modalOpen: !this.state.modalOpen
                                })
                            }
                        >
                            <Text style={styles.headerText}>
                                {!this.state.modalOpen ? 'Edit Card' : 'Cancel'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    }
    renderSidebar() {
        const { sidebar: Sidebar } = this.props;
        return (
            <View style={styles.sidebar}>
                <View style={styles.sidebarHeader}>
                    <Text style={styles.sidebarHeaderText}>Flash Crash</Text>
                </View>
                <Sidebar nav={this.props.nav} />
            </View>
        );
    }
    render() {
        const drawerX = this.drawerPosition.interpolate({
            inputRange: [0, SIDEBAR_WIDTH],
            outputRange: [0, SIDEBAR_WIDTH],
            extrapolate: 'clamp'
        });
        return (
            <View style={styles.container}>
                {this.renderSidebar()}
                <Animated.View style={[styles.main, { left: drawerX }]}>
                    {this.renderHeader()}
                    <View style={styles.mainView} {...this.mainViewPanResponder.panHandlers}>
                        {this.props.children}
                        {this.state.modalOpen && (
                            <View style={styles.modal}>
                                <EditScreen
                                    cardProps={this.props.currentCard}
                                    onCancel={() => this.setState({ modalOpen: false })}
                                />
                            </View>
                        )}
                    </View>
                </Animated.View>
            </View>
        );
    }
}
/////////////////////////////////
// Higher Order Component Creator
/////////////////////////////////

export default config => {
    class ConfiguredSideDrawer extends Component {
        screens = null;
        CurrentScreen = null;
        state = { CurrentScreen: null };
        sidebar = config.sidebar;

        componentWillMount() {
            this.screens = {};
            _.map(config.screens, (val, keyName) => {
                this.screens[keyName] = val;
                this.screens[keyName].name = keyName;
                if (!val.headerTitle) this.screens[keyName].headerTitle = keyName;
                if (val.defaultScreen) this.setState({ CurrentScreen: this.screens[keyName] });
            });
        }

        changeScreen = screenName => {
            if (!this.screens[screenName]) {
                return console.warn(`${screenName} is not registered screen`);
            }
            if (this.state.CurrentScreen !== this.screens[screenName]) {
                this.setState({ CurrentScreen: this.screens[screenName] });
            }
        };
        getScreens = () => {
            return Object.keys(this.screens);
        };
        render() {
            const { CurrentScreen } = this.state;
            const nav = {
                go: this.changeScreen,
                getScreens: this.getScreens,
                headerTitle: CurrentScreen.headerTitle,
                currentScreen: CurrentScreen.name
            };

            return (
                <SideDrawerBase {...this.props} sidebar={this.sidebar} nav={nav}>
                    <CurrentScreen.screen {...this.props} nav={nav} />
                </SideDrawerBase>
            );
        }
    }

    return ConfiguredSideDrawer;
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    modal: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        zIndex: 10
    },
    main: {
        flex: 1,
        backgroundColor: 'rgb(221, 221, 221)',
        shadowColor: '#000',
        shadowOffset: { width: -20 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 1
    },
    mainView: {
        flex: 1
    },
    header: {
        backgroundColor: 'rgb(64, 64, 64)',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 10,
        paddingHorizontal: 10,
        height: 65,
        width: '100%'
    },
    headerLeft: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '100%',
        width: '100%'
    },
    headerCenter: {
        flexDirection: 'row',
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerRight: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    headerText: {
        fontSize: 20,
        color: 'rgb(233, 233, 233)'
    },
    icon: {
        padding: 5,
        color: 'white'
    },
    headerButton: {
        position: 'absolute'
    },
    sidebarHeader: {
        flexDirection: 'row',
        backgroundColor: 'rgb(75, 75, 75)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingHorizontal: 10,
        height: 65
    },
    sidebarHeaderText: {
        fontSize: 20,
        color: 'rgb(133, 131, 131)'
    },
    sidebar: {
        position: 'absolute',
        backgroundColor: 'rgb(65, 66, 74)',
        flex: 1,
        height: '100%',
        width: SIDEBAR_WIDTH,
        zIndex: -1
    }
});
