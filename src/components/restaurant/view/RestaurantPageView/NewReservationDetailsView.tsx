import React, { useState } from "react";
import { Box, Button, ButtonGroup, TextField } from "@mui/material";
import { Input } from "@mui/base/Input";

const GroupedButtons: React.FC = React.memo(() => {
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
});

const NewReservationDetailsView: React.FC = React.memo(() => {
  return (
    <Box className="flex flex-col items-center space-y-4 p-4">
      <p>Liczba miejsc:</p>
      <GroupedButtons />

      <TextField
        multiline={true}
        placeholder="Opcjonalny komentarz do restauracji"
        rows={5}
        style={{ width: "100%", maxWidth: 600 }}
      />
    </Box>
  );
});

export default NewReservationDetailsView;
