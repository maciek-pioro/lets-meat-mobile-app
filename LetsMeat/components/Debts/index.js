import React from 'react';
import {
  Button, Card
} from 'react-native-paper';
import { formatAmount } from '../../helpers/money';

export const DebtCard = ({ value }) => {
  if (!value) return null;
  return (
    <Card style={{
      marginHorizontal: 30,
      marginTop: -15,
      backgroundColor: 'rgba(255, 255, 255, 0.7)'
    }}
    >
      <Button>
        {value > 0 ? `Owes you ${formatAmount(Math.abs(value))}` : `You owe ${formatAmount(Math.abs(value))}`}
      </Button>
    </Card>
  );
};

export default DebtCard;
