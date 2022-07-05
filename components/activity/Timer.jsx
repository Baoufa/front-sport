import { Text, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';

const Timer = ({ remainingTime, isTimerStarted }) => {
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    if (!isTimerStarted) {
      setFormattedTime(`${remainingTime / 100} min`);
    }

    if (isTimerStarted) {
      let minutes =
        Math.floor(remainingTime / 60) <= 0
          ? '00'
          : Math.floor(remainingTime / 60)
              .toString()
              .padStart(2, '0');
      let seconds =
        Math.floor(remainingTime % 60) <= 0
          ? '00'
          : Math.floor(remainingTime % 60)
              .toString()
              .padStart(2, '0');
      setFormattedTime(`${minutes} : ${seconds}`);
    }
  }, [remainingTime, isTimerStarted]);

  return (
    <Text
      style={[
        styles.timer,
        remainingTime > 300 ? styles.timerNormal : '',
        remainingTime <= 300 ? styles.timerWarning : '',
        remainingTime <= 60 ? styles.timerDanger : '',
      ]}
    >
      {formattedTime}
    </Text>
  );
};

const styles = StyleSheet.create({
  timer: {
 
    backgroundColor: 'green',
    color: 'white',
    textAlign: 'center',

    fontSize: 40,
    padding: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    overflow: 'hidden',
    //marginBottom: 50,
  },

  timerNormal: {
    backgroundColor: '#10b981',
  },

  timerDanger: {
    backgroundColor: '#ef4444',
  },

  timerWarning: {
    backgroundColor: '#f97316',
  },
});

export default Timer;
