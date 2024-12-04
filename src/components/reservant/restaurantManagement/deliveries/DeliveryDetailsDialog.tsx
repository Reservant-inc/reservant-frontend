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
          <strong>{t('delivery.delivery-id')}:</strong> {deliveryDetails.deliveryId}
        </p>
        <p>
          <strong>{t('delivery.order-time')}:</strong> {deliveryDetails.orderTime}
        </p>
        <p>
          <strong>{t('delivery.delivered-time')}:</strong>{' '}
          {deliveryDetails.deliveredTime || t('delivery.not-delivered')}
        </p>
        <p>
          <strong>{t('delivery.canceled-time')}:</strong>{' '}
          {deliveryDetails.canceledTime || t('delivery.not-canceled')}
        </p>
        <p>
          <strong>{t('delivery.restaurant-id')}:</strong> {deliveryDetails.restaurantId}
        </p>
        <p>
          <strong>{t('delivery.user-id')}:</strong>{' '}
          {deliveryDetails.userId || t('delivery.not-available')}
        </p>
        <h3 className="text-md font-medium mt-4 mb-2">{t('delivery.ingredients')}</h3>
        <ul className="list-disc pl-6">
          {deliveryDetails.ingredients.map((ingredient: any, index: number) => (
            <li key={index} className="mb-2">
              <p>
                <strong>{t('delivery.store-name')}:</strong> {ingredient.storeName}
              </p>
              <p>
                <strong>{t('delivery.amount-ordered')}:</strong> {ingredient.amountOrdered}
              </p>
              <p>
                <strong>{t('delivery.amount-delivered')}:</strong>{' '}
                {ingredient.amountDelivered}
              </p>
              <p>
                <strong>{t('delivery.expiry-date')}:</strong> {ingredient.expiryDate}
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
