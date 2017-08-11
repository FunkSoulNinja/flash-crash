import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export const Separator = () => <View style={styles.separator} />;

const ListItem = props =>
    <View style={styles.listItem}>
        <View style={styles.listItemLeftContent}>
            {props.leftContent}
            {!!props.text &&
                <Text style={styles.listItemText}>
                    {props.text}
                </Text>}
        </View>
        {props.mainContent}
        <View style={styles.listItemRightContent}>
            {props.rightContent}
        </View>
    </View>;

const styles = StyleSheet.create({
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
        paddingHorizontal: 10,
        fontWeight: '100',
        backgroundColor: 'transparent'
    },
    separator: {
        height: 1,
        width: '100%',
        marginLeft: 10,
        backgroundColor: '#CED0CE'
    }
});

export default ListItem;
