import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Button, Card, Dialog, Paragraph, Portal
} from 'react-native-paper';
import { StyleSheet } from 'react-native';

export const ModalButton = ({
  style, modalText, confirmAction, confirmText, icon, buttonText
}) => {
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  return (
    <>
      <Card
        style={{ ...styles.cardButton, ...style }}
        onPress={showDialog}
      >
        <Card.Content style={styles.cardContent}>
          <MaterialCommunityIcons
            name={icon}
            size={20}
          />
          <Paragraph>
            {buttonText}
          </Paragraph>
        </Card.Content>
      </Card>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Warning</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{modalText}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Abort</Button>
            <Button onPress={() => {
              confirmAction();
              hideDialog();
            }}
            >
              {confirmText}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  cardButton: {
    margin: 25,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
  },
  cardContent: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center'
  }
});

export default ModalButton;
