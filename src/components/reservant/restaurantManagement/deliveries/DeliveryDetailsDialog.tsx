import React, { useEffect, useState } from 'react';
import { fetchGET } from '../../../../services/APIconn';
import { useTranslation } from 'react-i18next';
import Dialog from '../../../reusableComponents/Dialog';
import { DeliveryDetailsDialogProps } from '../../../../services/types';

const DeliveryDetailsDialog: React.FC<DeliveryDetailsDialogProps> = ({
  open,
  onClose,
  deliveryId,
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

  const formatDate = (date: string | null): string =>
    date
      ? new Date(date).toLocaleDateString('pl-PL', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
      : t('delivery.not-available');

  if (!deliveryDetails) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`${t('delivery.delivery-details')} ID: ${deliveryId}`}
    >
      <div className="p-4 text-black dark:text-white max-h-[65vh] min-w-[20vh] overflow-y-auto scroll">
        <h2 className="text-lg font-semibold mb-4">{t('delivery.delivery-details')}</h2>
        <p>
          <span className="font-mont-bd">{t('delivery.delivery-id')}:</span> {deliveryDetails.deliveryId}
        </p>
        <p>
          <span className="font-mont-bd">{t('delivery.order-time')}:</span> {formatDate(deliveryDetails.orderTime)}
        </p>
        <p>
          <span className="font-mont-bd">{t('delivery.delivered-time')}:</span>{' '}
          {formatDate(deliveryDetails.deliveredTime) || t('delivery.not-delivered')}
        </p>
        <p>
          <span className="font-mont-bd">{t('delivery.canceled-time')}:</span>{' '}
          {formatDate(deliveryDetails.canceledTime) || t('delivery.not-canceled')}
        </p>
        <p>
          <span className="font-mont-bd">{t('delivery.restaurant-id')}:</span> {deliveryDetails.restaurantId}
        </p>
        <h3 className="text-md font-medium mt-4 mb-2">{t('delivery.ingredients')}</h3>
        <ul className="list-disc pl-6">
          {deliveryDetails.ingredients.map((ingredient: any, index: number) => (
            <li key={index} className="mb-2">
              <p>
                <span className="font-mont-bd">{t('delivery.store-name')}:</span> {ingredient.storeName}
              </p>
              <p>
                <span className="font-mont-bd">{t('delivery.amount-ordered')}:</span> {ingredient.amountOrdered}
              </p>
              <p>
                <span className="font-mont-bd">{t('delivery.amount-delivered')}:</span>{' '}
                {ingredient.amountDelivered}
              </p>
              <p>
                <span className="font-mont-bd">{t('delivery.expiry-date')}:</span> {formatDate(ingredient.expiryDate)}
              </p>
            </li>
          ))}
        </ul>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="cursor-pointer flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
          >
            {t('delivery.return')}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default DeliveryDetailsDialog;
