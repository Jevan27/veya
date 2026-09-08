import { useContext } from 'react';
import { CardContext, CardContextValue } from '../context/CardContext';

export function useCard(): CardContextValue {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCard must be used within a CardProvider');
  }
  return context;
}
