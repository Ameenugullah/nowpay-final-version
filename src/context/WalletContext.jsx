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
      // For debits: deduct total (amount + fee). For credits: add amount.
      const delta = tx.type === 'credit' ? tx.amount : -(tx.total || tx.amount);
      return {
        ...state,
        balance:      state.balance + delta,
        transactions: [tx, ...state.transactions],
      };
    }

    // Update an existing transaction (e.g. pending → completed / failed)
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };

    case 'ADD_RECIPIENT':
      return { ...state, recipients: [action.payload, ...state.recipients] };

    default:
      return state;
  }
}

export function WalletProvider({ children }) {
  const [state, dispatch] = useReducer(walletReducer, initialState);

  const addTransaction    = useCallback((tx) => dispatch({ type: 'ADD_TRANSACTION',    payload: tx }), []);
  const updateTransaction = useCallback((tx) => dispatch({ type: 'UPDATE_TRANSACTION', payload: tx }), []);
  const addRecipient      = useCallback((r)  => dispatch({ type: 'ADD_RECIPIENT',      payload: r  }), []);

  return (
    <WalletContext.Provider value={{ ...state, addTransaction, updateTransaction, addRecipient }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used inside WalletProvider');
  return ctx;
};
