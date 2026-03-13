import { useState, useCallback } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useToast }  from '@/context/ToastContext';
import { mockTransaction, calcFee } from '@/services/api';
import { genRef, todayStr, nowTime } from '@/utils/formatters';

export function useTransaction() {
  const { addTransaction, updateTransaction, addRecipient, balance, recipients } = useWallet();
  const toast = useToast();

  const [status,     setStatus]     = useState('idle'); // idle | processing | success | error
  const [lastTxRef,  setLastTxRef]  = useState('');
  const [error,      setError]      = useState('');

  const sendMoney = useCallback(async ({ recipient, amount, method = 'paystack', note, isNewRecipient }) => {
    if (!recipient)          { toast('⚠ Please select a recipient', 'error');    return false; }
    if (!amount || amount <= 0) { toast('⚠ Enter a valid amount', 'error');     return false; }

    const { fee, total } = calcFee(amount);
    if (total > balance)     { toast('⚠ Insufficient balance', 'error');         return false; }

    setStatus('processing');
    setError('');

    const ref = genRef();
    setLastTxRef(ref);

    // Build the transaction object
    const tx = {
      id:       ref,
      name:     recipient.name,
      bank:     recipient.bank,
      acct:     recipient.acct || '',
      initials: recipient.name.slice(0, 2).toUpperCase(),
      img:      '',
      type:     'debit',
      date:     todayStr(),
      time:     nowTime(),
      amount,
      fee,
      total,
      method,
      note:     note || '',
      cat:      'Transfer',
      // Add as PENDING immediately so balance is deducted and tx appears in history
      status:   'pending',
    };

    // 1. Add to history as pending (balance deducted immediately)
    addTransaction(tx);

    // 2. Save new recipient if applicable
    if (isNewRecipient) {
      addRecipient({ ...recipient, id: 'r_' + Date.now() });
    }

    // 3. Process through gateway
    try {
      await mockTransaction({ amount, recipient: recipient.name, method });

      // 4. On success: update status to completed
      updateTransaction({ id: ref, status: 'completed' });
      setStatus('success');
      toast('✓ Transfer successful — ' + ref, 'success');
      return true;
    } catch (err) {
      // 4. On failure: mark as failed (balance NOT refunded in real Paystack — handle server-side)
      updateTransaction({ id: ref, status: 'failed' });
      setStatus('error');
      setError(err.message || 'Transaction failed');
      toast('✗ ' + (err.message || 'Transaction failed'), 'error');
      return false;
    }
  }, [balance, addTransaction, updateTransaction, addRecipient, toast]);

  const reset = useCallback(() => {
    setStatus('idle');
    setError('');
    setLastTxRef('');
  }, []);

  return { status, lastTxRef, error, sendMoney, reset, isProcessing: status === 'processing' };
}
