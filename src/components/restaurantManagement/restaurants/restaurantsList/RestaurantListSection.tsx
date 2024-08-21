import React, { useEffect, useState } from "react";
import { Box, Modal } from "@mui/material";
import RestaurantRegister from "../../../register/restaurantRegister/RestaurantRegister";
import AddIcon from "@mui/icons-material/Add";
import { GridToolbarContainer, GridRowModesModel, GridColDef, GridRowsProp, DataGrid, GridSlots } from "@mui/x-data-grid";
import { fetchGET } from "../../../../services/APIconn";
import { LocalType } from "../../../../services/enums";
import { RestaurantType } from "../../../../services/types";

interface RestaurantListSectionProps {
    handleChangeActiveRestaurant: (restaurantGroupId: number) => void
    setActiveSectionName: (sectionName: string) => void
}

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
  }

const RestaurantListSection: React.FC<RestaurantListSectionProps> = ({ handleChangeActiveRestaurant, setActiveSectionName }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [rows, setRows] = useState<GridRowsProp>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    useEffect(() => {
        const populateRows = async () => {
          try {

            const response = await fetchGET("/my-restaurant-groups");
            const tmp: RestaurantType[] = [];

            for (const group of response) {
            
            const response2 = await fetchGET(`/my-restaurant-groups/${group.restaurantGroupId}`);

                console.log(response2)

                for (const i in response2.restaurants) {
                    tmp.push({
                    id: Number(i),
                    groupName: group.name,
                    restaurantId: response2.restaurants[i].restaurantId,
                    name: response2.restaurants[i].name,
                    restaurantType: response2.restaurants[i].restaurantType as LocalType,
                    address: response2.restaurants[i].address,
                    city: response2.restaurants[i].city,
                    isVerified: response2.restaurants[i].isVerified
                    });
                }
            }

            console.log(tmp)
            setRows(tmp)
          } catch (error) {
            console.error("Error populating table", error);
          }
        };
        populateRows();
      }, []);
    
      const EditToolbar = (props: EditToolbarProps) => {
        return (
          <GridToolbarContainer>
            <div className="h-[3rem] w-full z-1 flex items-center">
                    <button
                        id="RestaurantListAddRestaurantButton"
                        onClick={() => setIsModalOpen(true)}
                        className="h-full rounded-lg text-primary justify-center items-center flex gap-2 hover:bg-grey-1 p-2"
                    >
                        <AddIcon />
                        <h1 className="text-lg font-mont-md">Add restaurant</h1>
                    </button>
                </div>
          </GridToolbarContainer>
        );
      };

      const columns: GridColDef[] = [
        { field: "restaurantId", headerName: "ID", width: 180, editable: false },
        {
          field: "name",
          headerName: "Name",
          type: "string",
          width: 180,
          align: "left",
          headerAlign: "left",
          editable: false,
        },
        {
          field: "restaurantType",
          headerName: "Local type",
          type: "string",
          width: 180,
          editable: false,
        },
        {
          field: "city",
          headerName: "City",
          type: "string",
          width: 180,
          editable: false,
        },
        {
          field: "isVerified",
          headerName: "Is verified?",
          type: "boolean",
          width: 180,
          align: "left",
          headerAlign: "left",
          editable: false,
        },
        {
          field: "groupName",
          headerName: "Group",
          width: 180,
          editable: false,
          type: "string",
        }
      ];

      const handleRowClick = (params: any) => {
        const rowData = params.row;
        console.log(rowData)
        setActiveSectionName(rowData.name)
        handleChangeActiveRestaurant(rowData.restaurantId) 
        };

    return(
        <div className="h-full w-full bg-white rounded-lg">
            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                disableRowSelectionOnClick
                onRowClick={handleRowClick}
                initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
                }}
                pageSizeOptions={[5, 10, 25]}
                slots={{
                toolbar: EditToolbar as GridSlots["toolbar"],
                }}
                slotProps={{
                toolbar: { setRows, setRowModesModel },
                }}
                className="border-0"
            />
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <Box>
                    <RestaurantRegister />
                </Box>
            </Modal>
        </div>
    )
}

export default RestaurantListSection