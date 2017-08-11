import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Image, LayoutAnimation } from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import { ImagePicker } from 'expo';

import { updateCard } from '../actions/cardActions';

const greyColor = 'rgb(143, 143, 143)';
const imageButtonColor = 'rgb(55, 90, 119)';
const saveButtonColor = 'rgb(18, 183, 244)';

@connect(null, { updateCard })
class CardEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            image: this.props.cardProps.image,
            question: this.props.cardProps.question,
            answer: this.props.cardProps.answer,
            questionHeight: 0,
            answerHeight: 0
        };
    }
    setImage(image) {
        this.setState(() => {
            LayoutAnimation.spring();
            return { image };
        });
    }
    chooseImage = async () => {
        let image = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false
        });

        if (image.cancelled) return;
        this.setImage(image);
    };
    // takePhoto = async () => {
    // 	let image = await ImagePicker.launchCameraAsync({ allowsEditing: false })
    //
    // 	if(image.cancelled) return;
    // 	this.setImage(image)
    // }
    componentWillUpdate() {
        LayoutAnimation.spring();
    }
    onSavePress = () => {
        const { question, answer, image } = this.state;
        const { id } = this.props.cardProps;

        this.props.updateCard({ question, answer, image, id });
        this.props.collapse && this.props.collapse();
    };
    render() {
        const {
            question,
            answer,
            image,
            questionHeight,
            answerHeight
        } = this.state;

        return (
            <View style={styles.container}>
                {this.props.isListItem &&
                    <Button
                        borderRadius={30}
                        containerViewStyle={styles.button}
                        title="Cancel"
                        backgroundColor={greyColor}
                        onPress={this.props.collapse}
                    />}

                <FormLabel style={styles.label}>Question</FormLabel>
                <FormInput
                    multiline
                    onLayout={e =>
                        this.setState({ questionHeight: e.nativeEvent.layout })}
                    placeholder="Text for card front"
                    placeholderTextColor={greyColor}
                    style={[
                        styles.text,
                        { height: Math.max(35, questionHeight) }
                    ]}
                    maxLength={300}
                    value={question}
                    onContentSizeChange={e =>
                        this.setState({
                            questionHeight: e.nativeEvent.height
                        })}
                    onChangeText={question => this.setState({ question })}
                />
                <FormLabel style={styles.label}>Answer</FormLabel>
                <FormInput
                    multiline
                    onLayout={e =>
                        this.setState({ answerHeight: e.nativeEvent.layout })}
                    placeholder="Text for card back"
                    placeholderTextColor={greyColor}
                    style={[
                        styles.text,
                        { height: Math.max(35, answerHeight) }
                    ]}
                    maxLength={300}
                    value={answer}
                    onContentSizeChange={e =>
                        this.setState({
                            answerHeight: e.nativeEvent.height
                        })}
                    onChangeText={answer => this.setState({ answer })}
                />
                <FormLabel>Image</FormLabel>
                {image &&
                    <Image source={{ url: image.uri }} style={styles.image} />}
                {!image &&
                    <View style={styles.buttonGroup}>
                        <Button
                            borderRadius={30}
                            containerViewStyle={styles.imageButton}
                            backgroundColor={imageButtonColor}
                            title="Choose Image"
                            onPress={this.chooseImage}
                        />
                        {/* <Button borderRadius={30} containerViewStyle={styles.imageButton} backgroundColor={imageButtonColor} title="Take Photo" onPress={this.takePhoto} /> */}
                    </View>}
                {image &&
                    <Button
                        borderRadius={30}
                        containerStyle={styles.imageButton}
                        backgroundColor={greyColor}
                        title="Remove Image"
                        onPress={() => this.setImage(null)}
                    />}
                <View style={styles.buttonGroup}>
                    <Button
                        borderRadius={30}
                        containerViewStyle={styles.button}
                        style={styles.button}
                        title="Save"
                        backgroundColor={saveButtonColor}
                        onPress={this.onSavePress}
                    />
                    {!this.props.isListItem &&
                        <Button
                            borderRadius={30}
                            containerViewStyle={styles.button}
                            style={styles.button}
                            title="Cancel"
                            backgroundColor={greyColor}
                            onPress={this.props.onCancel}
                        />}
                </View>
            </View>
        );
    }
}

CardEditor.defaultProps = {
    cardProps: {
        question: '',
        answer: '',
        image: {}
    }
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingVertical: 20
    },
    text: {
        fontSize: 20
    },
    label: {
        marginVertical: 10
    },
    imageButton: {
        flex: 1,
        borderRadius: 30
    },
    button: {
        flex: 1,
        borderRadius: 30
    },
    buttonGroup: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10
    },
    image: {
        height: 300,
        width: 300,
        margin: 5,
        alignSelf: 'center'
    }
});

export default CardEditor;
