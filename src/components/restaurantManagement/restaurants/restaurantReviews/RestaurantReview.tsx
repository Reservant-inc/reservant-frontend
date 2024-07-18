import React, { useState } from "react";
import { Avatar, Rating, Button, Modal, Box } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Textarea } from "@mui/joy";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  color: "#fefefe",
  bgcolor: "#111",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
};

interface RestaurantReviewProps {
  createdAt: string;
  stars: number;
  contents: string;
}

const RestaurantReview: React.FC<RestaurantReviewProps> = ({
  stars,
  createdAt,
  contents,
}) => {
  const [areDetailsOpen, setAreDetailsOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setAreDetailsOpen(true);
  };

  const handleClose = () => {
    setAreDetailsOpen(false);
  };

  const reducedDescription =
    contents.length > 100 ? contents.substring(0, 100) + "..." : contents;

  return (
    <div className="flex h-[10rem] flex-col justify-between gap-2 rounded-lg border-grey-0 p-1 dark:bg-grey-3">
      <div className="flex items-center items-center justify-between space-x-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-8 w-8">A</Avatar>
          <p>{new Date(createdAt).toLocaleDateString()}</p>
        </div>
        <Rating
          name="read-only"
          value={stars}
          readOnly
          emptyIcon={
            <StarBorderIcon
              fontSize="inherit"
              className="text-grey-2 dark:text-grey-1"
            />
          }
        />
      </div>
      <div className="flex flex-col items-start">
        {reducedDescription.replace(/\s/g, "").length > 0 ? (
          <p>{reducedDescription}</p>
        ) : (
          <p className="italic">No description.</p>
        )}
        <div className="flex justify-end">
          <Modal
            open={areDetailsOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className="flex items-center justify-start space-x-4">
                <Avatar>A</Avatar>
                <div>
                  <div>{new Date(createdAt).toLocaleDateString()}</div>
                  <Rating
                    name="read-only"
                    value={stars}
                    readOnly
                    emptyIcon={
                      <StarBorderIcon
                        fontSize="inherit"
                        className="text-grey-2 dark:text-grey-1"
                      />
                    }
                  />
                </div>
              </div>
              <div className="mt-3 break-words">
                {contents.replace(/\s/g, "").length > 0 ? (
                  <p>{contents}</p>
                ) : (
                  <p className="italic">No description.</p>
                )}
              </div>
              <div className="mt-3 flex items-center p-3">
                <Textarea
                  sx={{
                    bgcolor: "#333333",
                    color: "#fefefe",
                    borderColor: "#333333",
                    m: 2,
                    width: 500,
                  }}
                  aria-label="minimum height"
                  minRows={3}
                  placeholder="Comment..."
                />
                <Button
                  variant="contained"
                  sx={{ bgcolor: "#64c3a6" }}
                  id="RestaurantReviewAddButton"
                >
                  Add
                </Button>
              </div>
            </Box>
          </Modal>
        </div>
      </div>
      <div className="flex w-full justify-end">
        <Button
          id="RestaurantReviewMoreButton"
          onClick={handleOpen}
          className="rounded-lg text-primary"
        >
          Respond
        </Button>
      </div>
      <div className="h-[2px] w-full bg-grey-1" />
    </div>
  );
};

export default RestaurantReview;
