import React, { useEffect, useState } from 'react';
import { fetchGET, fetchPOST } from '../../../../services/APIconn';
import { useTranslation } from 'react-i18next';
import Dialog from '../../../reusableComponents/Dialog';
import { DeliveryActionDialogProps } from '../../../../services/types';

const DeliveryActionDialog: React.FC<DeliveryActionDialogProps> = ({
  open,
  onClose,
  deliveryId,
  action,
  onActionComplete,
}) => {
  const [deliveryDetails, setDeliveryDetails] = useState<any | null>(null);
  const [t] = useTranslation('global');

  useEffect(() => {
    if (open && deliveryId) {
      fetchDeliveryDetails();
    }
  }, [open, deliveryId]);

  const fetchDeliveryDetails = async () => {
    try {
      const data = await fetchGET(`/deliveries/${deliveryId}`);
      setDeliveryDetails(data);
    } catch (error) {
      console.error('Error fetching delivery details:', error);
    }
  };

  const handleAction = async () => {
    try {
      const endpoint =
        action === 'confirm'
          ? `/deliveries/${deliveryId}/confirm-delivered`
          : `/deliveries/${deliveryId}/mark-canceled`;

      await fetchPOST(endpoint);
      onActionComplete();
      onClose();
    } catch (error) {
      console.error(`Error during ${action} action:`, error);
    }
  };

  const formatDate = (date: string | null): string =>
    date
      ? new Date(date).toLocaleString('pl-PL', {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
      : t('delivery.not-available');

  if (!deliveryDetails) {
    return null;
  }

  const isConfirm = action === 'confirm';
  const title = isConfirm
    ? t('delivery.confirm-delivery')
    : t('delivery.cancel-delivery');
  const message = isConfirm
    ? t('delivery.confirm-delivery-message', { id: deliveryId })
    : t('delivery.cancel-delivery-message', { id: deliveryId });

  return (
    <Dialog open={open} onClose={onClose} title={`${title} ID: ${deliveryId}`}>
      <div className="p-4 text-black dark:text-white max-h-[45vh] min-w-[30vh] overflow-y-auto scroll">
        <p>{message}</p>
        <div className="mt-4">
          <h2 className="text-lg font-semibold">{t('delivery.delivery-details')}</h2>
          <p>
            <span className="font-mont-bd">{t('delivery.order-time')}:</span>{' '}
            {formatDate(deliveryDetails.orderTime)}
          </p>
          <ul className="mt-2">
            {deliveryDetails.ingredients.map((ingredient: any, index: number) => (
              <li key={index} className="py-2 px-4">
                <span className="font-mont-bd">{t('delivery.store-name')}:</span> {ingredient.storeName}
                <p>
                  <span className="font-mont-bd">{t('delivery.amount-ordered')}:</span>{' '}
                  {ingredient.amountOrdered}
                </p>
                <p>
                  <span className="font-mont-bd">{t('delivery.expiry-date')}:</span>{' '}
                  {formatDate(ingredient.expiryDate)}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="cursor-pointer flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
          >
            {t('delivery.return')}
          </button>
          <button
            onClick={handleAction}
            className={`cursor-pointer flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black`}
          >
            {isConfirm ? t('delivery.confirm') : t('delivery.cancel-delivery')}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default DeliveryActionDialog;
