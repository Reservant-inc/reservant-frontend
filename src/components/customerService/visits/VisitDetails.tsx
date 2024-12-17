import React from 'react';

const VisitDetails: React.FC = () => {
  return (
    <div className="flex h-fit self-start flex-col w-full bg-white rounded-lg p-4 gap-4 shadow-md">
      <div className="flex justify-between w-full">
        <h1 className="text-lg font-mont-bd">Visit Details</h1>
      </div>

      <div className="text-center">
        <p className="text-grey-5">No visit details available yet.</p>
      </div>
    </div>
  );
};

export default VisitDetails;
