import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Typography,
  Paper,
  TablePagination,
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CancelIcon,
} from "@mui/icons-material";

interface OrderHistoryProps {
  activeRestaurantId: number | null;
}

interface OrderRowProps {
  row: any;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

interface MenuItem {
  name: string;
  amount: number;
  price: number;
  status: string;
}

const OrderRow: React.FC<OrderRowProps> = ({
  row,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);

  const toggleDetails = () => {
    setOpen(!open);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={toggleDetails}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.orderId}</TableCell>
        <TableCell>{row.visitId}</TableCell>
        <TableCell>{row.cost}</TableCell>
        <TableCell>{row.status}</TableCell>
        <TableCell>{row.clientName}</TableCell>
        <TableCell>
          {isEditing ? (
            <>
              <IconButton onClick={onSave}>
                <SaveIcon />
              </IconButton>
              <IconButton onClick={onCancel}>
                <CancelIcon />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton onClick={onEdit}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={onDelete}>
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </TableCell>
      </TableRow>
      {open && (
        <>
          <TableRow>
            <TableCell colSpan={7}>
              <Box display="flex">
                <Box flex={1}>
                  <Typography variant="h6" gutterBottom component="div">
                    Client Info
                  </Typography>
                  <Typography>Client: {row.clientName}</Typography>
                  <Typography>Address: {row.address}</Typography>
                  <Typography>Note: {row.notes}</Typography>
                </Box>
                <Box flex={1}>
                  <Typography variant="h6" gutterBottom component="div">
                    Order Info
                  </Typography>
                  <Table size="small" aria-label="menu items">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name of Menu Item</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.menuItems.map(
                        (menuItem: MenuItem, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{menuItem.name}</TableCell>
                            <TableCell>{menuItem.amount}</TableCell>
                            <TableCell>{menuItem.price}</TableCell>
                            <TableCell>{menuItem.status}</TableCell>
                          </TableRow>
                        ),
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            </TableCell>
          </TableRow>
        </>
      )}
    </>
  );
};

const OrderHistory: React.FC<OrderHistoryProps> = ({ activeRestaurantId }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [rows, setRows] = useState([
    {
      id: 1,
      orderId: "ORD001",
      visitId: "2024-05-29",
      cost: 50.0,
      status: "Completed",
      clientName: "John Smith",
      clientId: "C001",
      address: "123 Main St",
      notes: "No allergies",
      menuItems: [
        { name: "Pizza", amount: 3, price: 30, status: "Completed" },
        { name: "Burger", amount: 2, price: 25, status: "In Progress" },
      ],
    },
    {
      id: 2,
      orderId: "ORD002",
      visitId: "2024-05-29",
      cost: 75.0,
      status: "Pending",
      clientName: "Emily Johnson",
      clientId: "C002",
      address: "456 Oak Ave",
      notes: "Extra ketchup",
      menuItems: [
        { name: "Pasta", amount: 1, price: 15, status: "Completed" },
        { name: "Salad", amount: 2, price: 10, status: "Pending" },
      ],
    },
    // Add more orders as needed
  ]);

  const [isEditing, setIsEditing] = useState<{ [key: number]: boolean }>({});

  const handleEditClick = (id: number) => () => {
    setIsEditing({ ...isEditing, [id]: true });
  };

  const handleSaveClick = (id: number) => () => {
    setIsEditing({ ...isEditing, [id]: false });
  };

  const handleDeleteClick = (id: number) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: number) => () => {
    setIsEditing({ ...isEditing, [id]: false });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Order ID</TableCell>
            <TableCell>Visit Date</TableCell>
            <TableCell>Total Cost</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Client Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <OrderRow
              key={row.id}
              row={row}
              isEditing={!!isEditing[row.id]}
              onEdit={handleEditClick(row.id)}
              onSave={handleSaveClick(row.id)}
              onCancel={handleCancelClick(row.id)}
              onDelete={handleDeleteClick(row.id)}
            />
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default OrderHistory;
