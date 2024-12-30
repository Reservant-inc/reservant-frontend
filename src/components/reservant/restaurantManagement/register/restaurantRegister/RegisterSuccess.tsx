import React from 'react';
import DoneIcon from '@mui/icons-material/Done';
import { useTranslation } from 'react-i18next'

interface RegisterSuccessrProps {
    onDialogClose: () => void;
    onRegisterSucces: () => void;
  }
  

const RegisterSuccess: React.FC<RegisterSuccessrProps> = ({onDialogClose, onRegisterSucces}) => {
  const [t] = useTranslation('global');

  const handleButton = () => {
    onDialogClose()
    onRegisterSucces()
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center font-mont-md p-4 ">
      <div className="w-full h-[80%] flex flex-col items-center justify-center">
        {/* Górna sekcja (Ikona) */}
        <div className="w-full flex items-center pt-10 pb-10 justify-center ">
          <DoneIcon className="text-primary text-8xl" />
        </div>

        {/* Dolna sekcja (Nagłówek i tekst) */}
        <div className="w-full flex flex-col items-center justify-center p-8">
          <h2 className="text-4xl mb-4">Registration complete</h2>
          <p className="text-lg text-black dark:text-grey-2 text-center">
            {t('restaurant-register.submitSuccessMessage')}
          </p> 
        </div>
        <div className='p-20'>
            <button
                onClick={() => handleButton()}
                className={`flex h-[60px] w-[120px]  cursor-pointer items-center justify-center rounded-lg shadow-md bg-primary text-white
                    }`}
            >
                OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccess;
