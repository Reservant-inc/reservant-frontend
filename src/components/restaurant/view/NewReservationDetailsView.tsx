import React, { useState } from "react";
import { Box, Button, ButtonGroup, TextareaAutosize } from "@mui/material";

const GroupedButtons: React.FC = () => {
  const [counter, setCounter] = useState<number>(1);

  const handleIncrement = () => {
    setCounter(counter + 1);
  };

  const handleDecrement = () => {
    if (counter > 1) {
      setCounter(counter - 1);
    }
  };

  return (
    <ButtonGroup size="small" aria-label="small outlined button group">
      <Button onClick={handleIncrement}>+</Button>
      <Button disabled>{counter}</Button>
      <Button onClick={handleDecrement} disabled={counter === 1}>
        -
      </Button>
    </ButtonGroup>
  );
};

const NewReservationDetailsView: React.FC = () => {
  return (
    <Box className="flex flex-col items-center space-y-4">
      <p>Liczba miejsc:</p>
      <GroupedButtons />
      <TextareaAutosize
        minRows={4}
        placeholder="Opcjonalny komentarz do restauracji"
        style={{ width: 300, padding: 8 }}
      />
    </Box>
  );
};

export default NewReservationDetailsView;
