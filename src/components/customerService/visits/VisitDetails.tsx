import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { fetchGET } from '../../../services/APIconn';
import DefaultImage from '../../../assets/images/user.jpg';

const VisitDetails: React.FC = () => {
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
        <p className="text-grey-5">No visit details available.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full gap-4 bg-grey-1 dark:bg-grey-5 dark:text-white">
      <div className="flex flex-col gap-4 h-full w-1/2">
        {/* Visit Details */}
        <div className="flex flex-col bg-white dark:bg-black rounded-lg p-4 shadow-md h-1/2">
          <h1 className="text-lg font-mont-bd">Visit Details</h1>
          <div className="flex flex-col gap-2 mt-4 px-4">
            <p>
              <span className="font-mont-bd">Date:</span>{' '}
              {new Date(visitDetails.date).toLocaleDateString()}
            </p>
            <p>
              <span className="font-mont-bd">Time:</span>{' '}
              {new Date(visitDetails.date).toLocaleTimeString()} -{' '}
              {new Date(visitDetails.endTime).toLocaleTimeString()}
            </p>
            <p>
              <span className="font-mont-bd">Guests:</span> {visitDetails.numberOfGuests}
            </p>
            <p>
              <span className="font-mont-bd">Takeaway:</span>{' '}
              {visitDetails.takeaway ? 'Yes' : 'No'}
            </p>
            <p>
              <span className="font-mont-bd">Table ID:</span> {visitDetails.tableId}
            </p>
          </div>
        </div>

        {/* Participants */}
<div className="flex flex-col bg-white rounded-lg p-4 shadow-md h-1/2 dark:bg-black " >
  <h1 className="text-lg font-mont-bd">Participants</h1>
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
              Go to profile
            </h1>
          </Link>
        </div>
      ))
    ) : (
      <p>No participants available.</p>
    )}
  </div>
</div>
      </div>

      <div className="flex flex-col bg-white dark:bg-black rounded-lg p-4 shadow-md h-full w-1/2">
        <h1 className="text-lg font-mont-bd">Orders</h1>
        <div className="flex flex-col gap-4 mt-4 px-4">
          {visitDetails.orders.length > 0 ? (
            visitDetails.orders.map((order: any) => (
              <div key={order.orderId} className="flex flex-col border-b pb-2">
                <p className="font-mont-bd">Order ID: {order.orderId}</p>
                <p>
                  <span className="font-mont-bd">Date:</span>{' '}
                  {new Date(order.date).toLocaleString()}
                </p>
                <p>
                  <span className="font-mont-bd">Note:</span>{' '}
                  {order.note || 'No notes'}
                </p>
                <p>
                  <span className="font-mont-bd">Cost:</span> {order.cost} USD
                </p>
                <p>
                  <span className="font-mont-bd">Status:</span> {order.status}
                </p>
                {order.assignedEmployee && (
                  <div className="flex items-center gap-2 mt-2">
                    <img
                      src={order.assignedEmployee.photo || DefaultImage}
                      alt={`${order.assignedEmployee.firstName} ${order.assignedEmployee.lastName}`}
                      className="w-8 h-8 rounded-full"
                    />
                    <p>
                      <span className="font-mont-bd">Employee:</span>{' '}
                      {order.assignedEmployee.firstName}{' '}
                      {order.assignedEmployee.lastName}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No orders available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitDetails;
