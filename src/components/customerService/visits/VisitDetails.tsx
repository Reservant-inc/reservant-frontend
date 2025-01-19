import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { fetchGET, getImage } from '../../../services/APIconn';
import DefaultImage from '../../../assets/images/user.jpg';
import { useTranslation } from 'react-i18next';

const VisitDetails: React.FC = () => {
  const { t } = useTranslation('global');
  const { visitId } = useParams<{ visitId: string }>();
  const [visitDetails, setVisitDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVisitDetails = async () => {
      try {
        const response = await fetchGET(`/visits/${visitId}`);
        setVisitDetails(response);
      } catch (error) {
        console.error('Error fetching visit details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (visitId) {
      fetchVisitDetails();
    }
  }, [visitId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  }

  if (!visitDetails) {
    return (
      <div className="text-center">
        <p className="text-grey-5 dark:text-white">{t('customer-service.visit-details.no-visit-details')}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full gap-4 bg-grey-1 dark:bg-grey-5 p-4 dark:text-white">
      <div className="flex flex-col gap-4 h-full w-1/2">
        {/* Visit Details */}
        <div className="flex flex-col bg-white dark:bg-black rounded-lg p-4 shadow-md h-1/2">
          <h1 className="text-lg font-mont-bd">{t('customer-service.visit-details.visit-details')}</h1>
          <div className="flex flex-col gap-2 mt-4 px-4">
            <p>
              <span className="font-mont-bd">{t('customer-service.visit-details.date')}:</span>{' '}
              {new Date(visitDetails.date).toLocaleDateString()}
            </p>
            <p>
              <span className="font-mont-bd">{t('customer-service.visit-details.time')}:</span>{' '}
              {new Date(visitDetails.date).toLocaleTimeString()} -{' '}
              {new Date(visitDetails.endTime).toLocaleTimeString()}
            </p>
            <p>
              <span className="font-mont-bd">{t('customer-service.visit-details.guests')}:</span>{' '}
              {visitDetails.numberOfGuests}
            </p>
            <p>
              <span className="font-mont-bd">{t('customer-service.visit-details.takeaway')}:</span>{' '}
              {visitDetails.takeaway ? t('customer-service.visit-details.yes') : t('customer-service.visit-details.no')}
            </p>
            <p>
              <span className="font-mont-bd">{t('customer-service.visit-details.table-id')}:</span>{' '}
              {visitDetails.tableId}
            </p>
          </div>
        </div>

        {/* Participants */}
        <div className="flex flex-col bg-white dark:bg-black rounded-lg p-4 shadow-md h-1/2">
          <h1 className="text-lg font-mont-bd">{t('customer-service.visit-details.participants')}</h1>
          <div className="flex flex-col gap-4 mt-4 px-4">
            {visitDetails.participants.length > 0 ? (
              visitDetails.participants.map((participant: any) => (
                <div key={participant.userId} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={participant.photo || DefaultImage}
                      alt={`${participant.firstName} ${participant.lastName}`}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-mont-bd">
                        {participant.firstName} {participant.lastName}
                      </p>
                      <p className="text-sm text-grey-3">{participant.userId}</p>
                    </div>
                  </div>
                  <Link to={`/customer-service/users/${participant.userId}`}>
                    <h1 className="underline text-sm text-grey-4 dark:text-grey-2">
                      {t('customer-service.visit-details.go-to-profile')}
                    </h1>
                  </Link>
                </div>
              ))
            ) : (
              <p>{t('customer-service.visit-details.no-participants')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="flex flex-col bg-white dark:bg-black rounded-lg p-4 shadow-md h-full w-1/2">
        <h1 className="text-lg font-mont-bd">{t('customer-service.visit-details.orders')}</h1>
        <div className="flex flex-col gap-4 mt-4 px-4">
          {visitDetails.orders.length > 0 ? (
            visitDetails.orders.map((order: any) => (
              <div key={order.orderId} className="flex flex-col border-b pb-2">
                <p className="font-mont-bd">
                  {t('customer-service.visit-details.order-id')}: {order.orderId}
                </p>
                <p>
                  <span className="font-mont-bd">{t('customer-service.visit-details.date')}:</span>{' '}
                  {new Date(order.date).toLocaleString()}
                </p>
                <p>
                  <span className="font-mont-bd">{t('customer-service.visit-details.note')}:</span>{' '}
                  {order.note || t('customer-service.visit-details.no-notes')}
                </p>
                <p>
                  <span className="font-mont-bd">{t('customer-service.visit-details.cost')}:</span>{' '}
                  {order.cost} 
                </p>
                <p>
                  <span className="font-mont-bd">{t('customer-service.visit-details.status')}:</span>{' '}
                  {order.status}
                </p>
                {order.assignedEmployee && (
                  <div className="flex items-center gap-2 mt-2">
                    <img
                      src={getImage(order.assignedEmployee.photo, DefaultImage)}
                      alt={`${order.assignedEmployee.firstName} ${order.assignedEmployee.lastName}`}
                      className="w-8 h-8 rounded-full"
                    />
                    <p>
                      <span className="font-mont-bd">{t('customer-service.visit-details.employee')}:</span>{' '}
                      {order.assignedEmployee.firstName} {order.assignedEmployee.lastName}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>{t('customer-service.visit-details.no-orders')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitDetails;
