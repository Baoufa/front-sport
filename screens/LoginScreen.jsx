import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Input } from '@rneui/themed';
import { Formik, ErrorMessage } from 'formik';
import { useLazyQuery } from '@apollo/client';
import { userQuery } from '../graphql/queries';
import useAuthContext from '../hooks/useAuthContext';
import * as Yup from 'yup';

import errorHandler from '../lib/errorHandler';

const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .required('No password provided.')
    .min(4, 'Password is too short - should be 4 chars minimum.')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
});

function LoginScreen({ navigation, route }) {
  const [signin, { data, loading, error }] = useLazyQuery(userQuery);
  const { email, loggedIn } = useAuthContext();

  const switchHandler = async email => {
    try {
      const emailValid = await SignupSchema.validateAt('email', { email });
      navigation.navigate('Register', { email: emailValid });
    } catch (error) {
      navigation.navigate('Register', { email: '' });
    }
  };

  const onSubmitHandler = async (values, setErrors) => {
    const userInput = {
      input: {
        email: values.email.toLowerCase().trim(),
        password: values.password.trim(),
      },
    };

    signin({ 
      variables: userInput, 
      onError: err => errorHandler(err, setErrors),
    });
  };

  useEffect(() => {
    if (data) {
      loggedIn(data.user);
    }
  }, [data, error]);

  return (
    <Formik
      initialValues={{ email: route.params?.email || '', password: '' }}
      validationSchema={SignupSchema}
      onSubmit={(values, props) => onSubmitHandler(values, props.setErrors)}
      validateOnBlur={true}
      validateOnChange={true}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        isValid = false,
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
              <Button
                onPress={handleSubmit}
                title='Se connecter'
                disabled={!isValid ? true : false}
              />
              <Button
                onPress={() => switchHandler(values.email)}
                title='Pas encore inscrit ?'
                type='solid'
              />
              <Button
                title='nav'
                onPress={() =>
                  navigation.navigate('Register', { email: values.email })
                }
              />
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

export default LoginScreen;
