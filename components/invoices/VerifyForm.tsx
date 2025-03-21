import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput, Modal, Image } from 'react-native';
import { font } from '../../constants/font';
import CustomButton from '../../modules/Button';
import { uiElements } from '../../constants/uiElements';
import React, { useCallback, useState } from 'react';
import DatePicker from 'react-native-date-picker';
import { useNavigation } from '@react-navigation/native';

/**
 * React Component handling display and editing of invoice form fields
 * @param route - invoice form as param
 * @returns 
 */
export default function VerifyForm({route}): React.JSX.Element  {
    const navigation = useNavigation();

    const [edit, setEdit] = useState(false);
    const [editIndex, setEditIndex] = useState(0);

    const { form } = route.params;

    const [statefulForm, setStatefulForm] = useState(form);

    /**
     * Mutate form field
     * @param i {number} - index of form field to be updated
     * @param value {string | object} - value to be updated
     */
    const updateField = (i: number, value: string | object) => {
        setStatefulForm(prevForm => {
            const updatedForm = [...prevForm];
            updatedForm[i] = { ...updatedForm[i], value };
            return updatedForm;
        });
    };

    /**
     * Navigate to next Screen
     */
    const confirm = () => {
        navigation.navigate('Confirm', {form: form})
    };

    /**
     * Navigate back
     */
    const back = () => {
        navigation.goBack();
    };

    /**
     * Eventhandler for formfield press
     * @param i index of field to be edited
     */
    const handleFieldPress = useCallback((i: number) => {
        setEditIndex(i);
        setEdit(!edit);
    }, []);

    /**
     * Function that renders form fields.
     * @returns JSX Element
     */
    const renderInputs = React.useMemo(() => {

        return statefulForm.map((f: object, i: number) => <View key={i}>

            <TouchableOpacity
                onPress={() => handleFieldPress(i)} 
                style={[styles.field, i === 0 ? uiElements.roundTop : i === form.length - 1 ? uiElements.roundBottom : {}]} >

                <View>
                    <Text style={font.label}>{f.display}</Text>

                    { f.type !== 'date' &&
                        <View style={styles.leftDetail}>
                            <Text style={font.text}>{f.value}</Text>
                            {f.currency && <Text> {f.currency}</Text>}
                        </View>
                    }

                    { f.type === 'date' && 
                        <Text style={font.text}>{new Date(f.value).toLocaleDateString()}</Text>
                    }
                </View>

                <Image style={styles.next} source={require('../../assets/icon_next.png')}/>


            </TouchableOpacity>

        </View>);
    }, [statefulForm]);


    return (
        <View style={styles.verifyForm}>
            <View>
                <Text style={font.title}>Invoice</Text>
                <Text style={font.subtitle}>Please verify the information</Text>


                <View >
                    {renderInputs}
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={edit && statefulForm[editIndex].type !== 'date'}
                >
                <TouchableOpacity 
                    style={styles.editModal} 
                    onPress={() => setEdit(!edit)}>
                    <View style={styles.popUp}>
                        <Text style={font.subtitle}>Edit {statefulForm[editIndex].display}</Text>
                        <TextInput style={uiElements.textInput}
                            placeholder={statefulForm[editIndex].display}
                            onChangeText={(value) => updateField(editIndex, value)}
                            selectTextOnFocus
                            selectionColor={uiElements.primaryColor} />
                        <CustomButton
                            text="Okay"
                            handler={() => setEdit(false)}
                            buttonStyle={[uiElements.isPrimary, {marginTop: 20}]}
                            textStyle={uiElements.isPrimary}/>
                    </View>
                </TouchableOpacity>
            </Modal>

            <DatePicker
                modal
                mode={'date'}
                open={edit && statefulForm[editIndex].type === 'date'}
                date={new Date()}
                minimumDate={new Date()}
                onConfirm={(date) => {
                    updateField(editIndex, date);
                    setEdit(false);
                }}
                onCancel={() => {
                    setEdit(false);
                }}/>

            <View>

                <View style={styles.navButtons}>

                    <CustomButton
                        text="Back"
                        handler={back}
                        buttonStyle={uiElements.isSecondary}
                        textStyle={font.textDark}/>
                    <CustomButton
                        text="Next"
                        handler={confirm}
                        buttonStyle={[uiElements.isPrimary, styles.confirmButton]}
                        textStyle={uiElements.isPrimary}/>

                </View>

            </View>
        </View>
    )
}

const dimension = Dimensions.get('window');

const styles = StyleSheet.create({
    verifyForm: {
        display: 'flex',
        height: dimension.height * .9,
        padding: 20,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    field: {
        backgroundColor: '#17171733',
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    editModal: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: dimension.height,
    },
    popUp: {
        margin: dimension.height * .3,
        // height: dimension.height,
        boxShadow: '2px -2px 100px grey',
        backgroundColor: 'white',
        width: dimension.width * .9,
        padding: 20,
        borderRadius: 20,
    },
    leftDetail: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    next: {
        height: 20,
        width: 20,
    },
    navButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    confirmButton: {
        width: dimension.width * .64
    }
});