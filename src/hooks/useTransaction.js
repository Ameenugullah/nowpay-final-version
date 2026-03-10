import { useState, useCallback } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useToast } from '@/context/ToastContext';
import { mockTransaction, calcFee } from '@/services/api';
import { genRef, todayStr, nowTime } from '@/utils/formatters';

export function useTransaction() {
  const { addTransaction, addRecipient, balance, recipients } = useWallet();
  const toast = useToast();

  const [status, setStatus]     = useState('idle'); // idle | processing | success | error
  const [lastTxRef, setLastTxRef] = useState('');
  const [error, setError]       = useState('');

  const sendMoney = useCallback(async ({
    recipient,
    amount,      // in NGN
    method,
    note,
    isNewRecipient,
  }) => {
    if (!recipient)  { toast('⚠ Please select a recipient', 'error'); return false; }
    if (!amount || amount <= 0) { toast('⚠ Enter a valid amount', 'error'); return false; }
    if (amount > balance) { toast('⚠ Insufficient balance', 'error'); return false; }

    setStatus('processing');
    setError('');

    const ref = genRef();
    setLastTxRef(ref);

    try {
      // Use mock gateway for demo. Swap mockTransaction for paystackInitialize / flutterwaveTransfer
      // in production once you have real API keys set in .env
      await mockTransaction({ amount, recipient: recipient.name, method });

      // Save new recipient to wallet state
      if (isNewRecipient) {
        addRecipient({ ...recipient, id: 'r_' + Date.now() });
      }

      // Record the transaction
      const { fee, total } = calcFee(amount);
      addTransaction({
        id:       ref,
        name:     recipient.name,
        bank:     recipient.bank,
        initials: recipient.name.slice(0, 2).toUpperCase(),
        img:      recipient.img || '',
        type:     'debit',
        date:     todayStr(),
        time:     nowTime(),
        amount,
        fee,
        total,
        method,
        note:     note || '',
        status:   'completed',
        cat:      'Transfer',
      });

      setStatus('success');
      toast('✓ Transfer successful — ' + ref, 'success');
      return true;
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Transaction failed');
      toast('✗ ' + (err.message || 'Transaction failed'), 'error');
      return false;
    }
  }, [balance, addTransaction, addRecipient, toast]);

  const reset = useCallback(() => {
    setStatus('idle');
    setError('');
    setLastTxRef('');
  }, []);

  return { status, lastTxRef, error, sendMoney, reset, isProcessing: status === 'processing' };
}
