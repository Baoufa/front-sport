import React from 'react';
import { useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { Input } from '@rneui/themed';

import { Formik, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';

import errorHandler from '../lib/errorHandler';

import { useMutation } from '@apollo/client';
import { createUser } from '../graphql/mutations';

const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .required('No password provided.')
    .min(4, 'Password is too short - should be 4 chars minimum.')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords must match'
  ),
});

function RegisterScreen({ navigation, route }) {
  const [signup, { data, loading, error }] = useMutation(createUser);
  const onSubmitHandler = (values, setErrors) => {
    const userInput = {
      input: {
        email: values.email.toLowerCase().trim(),
        password: values.password.trim(),
      },
    };
    signup({
      variables: userInput,
      onError: err => errorHandler(err, setErrors),
    });
  };

  const switchHandler = async email => {
    try {
      const emailValid = await SignupSchema.validateAt('email', { email });
      navigation.navigate('Login', { email: emailValid });
    } catch (error) {
      navigation.navigate('Login', { email: '' });
    }
  };

  useEffect(() => {
    if (data) {
      console.log('created');
      // navigation.navigate('Login', { user: data.createUser });
    }
  }, [data, error]);

  return (
    <Formik
      initialValues={{ email: route.params?.email || '', password: '' }}
      validationSchema={SignupSchema}
      onSubmit={(values, props) => onSubmitHandler(values, props.setErrors)}
      validateOnBlur={true}
      validateOnChange={true}
      validateOnMount={true}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldError,
        values,
        isValid,
      }) => (
        <View style={styles.container}>
          <View style={styles.formGroup}>
            <View style={styles.inputGroup}>
              <Input
                autoFocus
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                placeholder='Email'
                keyboardType='email-address'
                leftIcon={{ type: 'feather', name: 'user' }}
              />
              <ErrorMessage
                name='email'
                render={msg => <Text style={styles.error}>{msg}</Text>}
              />
            </View>

            <View style={styles.inputGroup}>
              <Input
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                placeholder='Password'
                secureTextEntry={true}
                leftIcon={{ type: 'feather', name: 'key' }}
              />
              <ErrorMessage
                name='password'
                render={msg => <Text style={styles.error}>{msg}</Text>}
              />
            </View>

            <View style={styles.inputGroup}>
              <Input
                onChangeText={handleChange('passwordConfirmation')}
                onBlur={handleBlur('passwordConfirmation')}
                value={values.passwordConfirmation}
                placeholder='Repeat password'
                secureTextEntry={true}
                leftIcon={{ type: 'feather', name: 'key' }}
              />
              <ErrorMessage
                name='passwordConfirmation'
                render={msg => <Text style={styles.error}>{msg}</Text>}
              />
            </View>

            <View style={styles.inputGroup}>
              {!loading && (
                <Button
                  onPress={handleSubmit}
                  title='Register'
                  disabled={!isValid || !values}
                />
              )}
              <Button
                onPress={() => switchHandler(values.email)}
                title='Déjà inscrit ?'
                type='solid'
              />

              {loading && <ActivityIndicator size='small' color='#0000ff' />}
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  formGroup: {
    borderRadius: 20,
    marginTop: 30,
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: '90%',
    backgroundColor: 'lightgray',
  },

  inputGroup: {
    marginVertical: 10,
  },

  error: {
    color: 'red',
    fontSize: 12,
  },
});

export default RegisterScreen;
