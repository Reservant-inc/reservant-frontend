import React, { useEffect, useState } from 'react';
import Dialog from '../../../reusableComponents/Dialog';
import { Correction, IngredientHistoryDialogProps } from '../../../../services/types';
import { fetchGET } from '../../../../services/APIconn';
import { useTranslation } from 'react-i18next';

const IngredientHistoryDialog: React.FC<IngredientHistoryDialogProps> = ({
  open,
  onClose,
  ingredient,
}) => {
  const [history, setHistory] = useState<Correction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [t] = useTranslation('global');

  useEffect(() => {
    if (open && ingredient) {
      fetchHistory();
    }
  }, [open, ingredient]);

  const fetchHistory = async () => {
    if (!ingredient) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchGET(`/ingredients/${ingredient.ingredientId}/history`);
      setHistory(data.items || []);
    } catch (err) {
      console.error('Error fetching ingredient history:', err);
      setError('Failed to fetch history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!ingredient) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`${t('warehouse.ingredient-history')} ${ingredient.publicName}`}
    >
      <div
        className="p-4 text-black dark:text-white max-h-[65vh] min-w-[35vh] overflow-y-auto scroll"
      >
        <h1 className="text-lg font-semibold mb-4">{t('warehouse.ingredient-details')}</h1>
        <p>
          <strong>{t('warehouse.name')}:</strong> {ingredient.publicName}
        </p>
        <p>
          <strong>{t('warehouse.new-unit')}:</strong> {ingredient.unitOfMeasurement}
        </p>
        <p>
          <strong>{t('warehouse.new-minimal')}:</strong> {ingredient.minimalAmount}
        </p>
        <p>
          <strong>{t('warehouse.amount')}:</strong> {ingredient.amount}
        </p>

        <div className="mt-4">
          <h2 className="text-md font-semibold mb-2">{t('warehouse.history-details')}</h2>
          {loading ? (
            <p>{t('warehouse.loading-history')}</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : history.length === 0 ? (
            <p>{t('warehouse.no-history-message')}</p>
          ) : (
            <ul className="divide-y divide-white dark:divide-black">
              {history.map((correction) => {
                const isIncrease = correction.newAmount > correction.oldAmount;
                const amountChange = isIncrease
                  ? `${correction.newAmount - correction.oldAmount}`
                  : `-${correction.oldAmount - correction.newAmount}`;
                const amountClass = isIncrease ? 'text-green' : 'text-red';

                return (
                  <li
                    key={correction.correctionId}
                    className="py-3 bg-grey-1 dark:bg-grey-6 p-2"
                  >
                    <h3
                      className={`text-xl font-bold ${
                        correction.newAmount > correction.oldAmount ? 'text-green' : 'text-red'
                      }`}
                    >
                      {t('warehouse.change')}: {correction.newAmount > correction.oldAmount ? '+' : '-'}
                      {Math.abs(correction.newAmount - correction.oldAmount)}
                    </h3>

                    <p>
                      <strong>{t('warehouse.date')}:</strong>{' '}
                      {new Date(correction.correctionDate).toLocaleString()}
                    </p>
                    <p>
                      <strong>{t('warehouse.id')}:</strong> {correction.correctionId}
                    </p>
                    <p>
                      <strong>{t('warehouse.old-amount')}:</strong> {correction.oldAmount}
                    </p>
                    <p>
                      <strong>{t('warehouse.new-amount1')}:</strong> {correction.newAmount}
                    </p>
                    <p>
                      <strong>{t('warehouse.comment')}:</strong> {correction.comment}
                    </p>
                    <p>
                      <strong>{t('warehouse.user')}:</strong> {correction.user.firstName}{' '}
                      {correction.user.lastName} ({correction.user.userId})
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
          >
            {t('warehouse.return')}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default IngredientHistoryDialog;
