import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import CardEditor from '../components/CardEditor';
import currentCardSelector from '../selectors/currentCardSelector';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const EditScreen = props => {
    return (
        <KeyboardAwareScrollView extraHeight={220}>
            <CardEditor
                cardProps={props.currentCard}
                onCancel={props.onCancel}
            />
        </KeyboardAwareScrollView>
    );
};

const mapStateToProps = state => {
    return { currentCard: currentCardSelector(state) };
};

export default connect(mapStateToProps)(EditScreen);
