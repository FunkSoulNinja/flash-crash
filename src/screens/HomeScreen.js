import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Icon } from 'react-native-elements';

import { BACKGROUND_GREY, LIGHT_GREY, GREEN } from '../colors';

const MenuButton = props =>
    <TouchableOpacity onPress={props.onPress}>
        <Card containerStyle={styles.cardContainer}>
            <Text style={styles.buttonText}>
                {props.text}
            </Text>
            {!!props.icon && <Icon name={props.icon} size={36} color={GREEN} />}
        </Card>
    </TouchableOpacity>;

const HomeScreen = props => {
    return (
        <View style={styles.container}>
            <MenuButton
                text="Create Card"
                icon="note-add"
                onPress={() => props.nav.go('CreateCard')}
            />
            <MenuButton
                text="Manage Cards"
                icon="note"
                onPress={() => props.nav.go('Cards')}
            />
            <MenuButton
                text="Manage Lists"
                icon="view-list"
                onPress={() => props.nav.go('CardLists')}
            />
            <MenuButton
                text="Study"
                icon="school"
                onPress={() => props.nav.go('StudyScreen')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: BACKGROUND_GREY
    },
    cardContainer: {
        backgroundColor: LIGHT_GREY,
        borderRadius: 10,
        borderColor: 'rgb(96, 96, 96)',
        borderWidth: 2
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center'
    }
});

export default HomeScreen;
