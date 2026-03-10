import { createContext, useContext, useReducer, useCallback } from 'react';
import { INITIAL_TRANSACTIONS, INITIAL_RECIPIENTS, INITIAL_BALANCE } from '@/utils/constants';

const WalletContext = createContext(null);

const initialState = {
  balance:      INITIAL_BALANCE,
  transactions: INITIAL_TRANSACTIONS,
  recipients:   INITIAL_RECIPIENTS,
};

function walletReducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION': {
      const tx = action.payload;
      const delta = tx.type === 'credit' ? tx.amount : -tx.amount;
      return {
        ...state,
        balance:      state.balance + delta,
        transactions: [tx, ...state.transactions],
      };
    }
    case 'ADD_RECIPIENT':
      return { ...state, recipients: [action.payload, ...state.recipients] };
    case 'UPDATE_RECIPIENT':
      return {
        ...state,
        recipients: state.recipients.map(r =>
          r.id === action.payload.id ? { ...r, ...action.payload } : r
        ),
      };
    default:
      return state;
  }
}

export function WalletProvider({ children }) {
  const [state, dispatch] = useReducer(walletReducer, initialState);

  const addTransaction = useCallback((tx) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: tx });
  }, []);

  const addRecipient = useCallback((r) => {
    dispatch({ type: 'ADD_RECIPIENT', payload: r });
  }, []);

  return (
    <WalletContext.Provider value={{ ...state, addTransaction, addRecipient }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used inside WalletProvider');
  return ctx;
};
