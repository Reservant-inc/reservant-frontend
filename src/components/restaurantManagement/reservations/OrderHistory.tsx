import React, { useEffect, useState } from "react";
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
} from "@mui/icons-material";
import {
  MenuIteminOrderType,
  OrderType,
  UserType,
} from "../../../services/types";
import { fetchGET } from "../../../services/APIconn";
import { FetchError } from "../../../services/Errors";

interface OrderHistoryProps {
  orders: OrderType[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);

  const toggleDetails = () => {
    setOpen(!open);
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [rows, setRows] = useState<OrderType[]>([]);

  useEffect(() => {
    const populateRows = async () => {
      try {
        let tmp: OrderType[] = [];
        let indx = 0;
        for (const i in orders) {
          const response = await fetchGET(`/orders/${orders[i].orderId}`);
          console.log("response:");
          console.log(response);
          tmp.push({
            id: Number(indx++),
            orderId: response.orderId,
            visitId: response.visitId,
            cost: response.cost,
            status: response.status,
            items: response.items,
            employees: response.employees,
          });
        }
        setRows(tmp);
        console.log("rows:");
        console.log(rows);
      } catch (error) {
        if (error instanceof FetchError) {
          console.log(error.formatErrors());
        } else {
          console.log("Unexpected error");
        }
      }
    };
    populateRows();
  }, []);

  return (
    <div className="h-full w-full rounded-lg bg-white dark:bg-black">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Expand</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index: number) => (
              <>
                <TableRow key={index}>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      className="dark:text-grey-0"
                      onClick={() => {
                        toggleDetails();
                        console.log(row);
                      }}
                    >
                      {open ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>{row.orderId}</TableCell>
                  <TableCell>{row.cost}</TableCell>
                  <TableCell>{row.status}</TableCell>
                </TableRow>
                {open && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Box display="flex" className="gap-24">
                        <Box flex={1}>
                          <Typography variant="h6" gutterBottom component="div">
                            Employees Info
                          </Typography>
                          <Table size="small" aria-label="menu items">
                            <TableHead>
                              <TableRow>
                                <TableCell>First name</TableCell>
                                <TableCell>Last name</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {row.employees?.map(
                                (employees: UserType, index: number) => (
                                  <TableRow key={index}>
                                    <TableCell>{employees.firstName}</TableCell>
                                    <TableCell>{employees.lastName}</TableCell>
                                  </TableRow>
                                ),
                              )}
                            </TableBody>
                          </Table>
                        </Box>
                        <Box flex={1}>
                          <Typography variant="h6" gutterBottom component="div">
                            Order Info
                          </Typography>
                          <Table size="small" aria-label="menu items">
                            <TableHead>
                              <TableRow>
                                <TableCell>Amount</TableCell>
                                <TableCell>Cost</TableCell>
                                <TableCell>Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {row.items?.map(
                                (items: MenuIteminOrderType, index: number) => (
                                  <TableRow key={index}>
                                    <TableCell>{items.amount}</TableCell>
                                    <TableCell>{items.cost}</TableCell>
                                    <TableCell>{items.status}</TableCell>
                                  </TableRow>
                                ),
                              )}
                            </TableBody>
                          </Table>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          className="dark:text-grey-0"
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};

export default OrderHistory;
