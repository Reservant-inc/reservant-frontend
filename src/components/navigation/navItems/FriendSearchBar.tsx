import React, { useState } from "react";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
  Avatar,
  ListItemAvatar,
} from "@mui/material";

interface FriendSearchBarProps {
  // moze potem jakies propry sie pojawia, na teraz wstawiam zeby dzialalo
}

const FriendSearchBar: React.FC<FriendSearchBarProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const mockUsers = [
    { id: 1, name: "Leanne Graham" },
    { id: 2, name: "Ervin Howell" },
    { id: 3, name: "Clementine Bauch" },
    { id: 4, name: "Patricia Lebsack" },
    { id: 5, name: "Chelsey Dietrich" },
    { id: 6, name: "Mrs. Dennis Schulist" },
    { id: 7, name: "Kurtis Weissnat" },
    { id: 8, name: "Nicholas Runolfsdottir V" },
    { id: 9, name: "Glenna Reichert" },
    { id: 10, name: "Clementina DuBuque" },
    { id: 11, name: "Leanne Graham1" },
    { id: 12, name: "Leanne Graham2" },
    { id: 13, name: "Leanne Graham3" },
    { id: 14, name: "Leanne Graham4" },
    { id: 15, name: "Leanne Graham5" },
    { id: 16, name: "Leanne Graham6" },
    { id: 17, name: "Leanne Graham7" },
  ];

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.length >= 3) {
      const results = mockFetchUsers(value);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const mockFetchUsers = (query: string) => {
    return mockUsers
      .filter((user) => user.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  };

  return (
    <div className="relative">
      <TextField
        label="Szukaj znajomych"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={handleSearch}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 100)}
        className="w-60"
      />
      {isFocused && searchTerm.length >= 3 && (
        <Paper className="absolute left-0 z-10 mt-1 w-full">
          <List>
            {searchResults.length > 0 ? (
              searchResults.map((user) => (
                <ListItem key={user.id} button>
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText primary={user.name} />
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#a94c79", color: "#fefefe" }}
                  >
                    Zaproś
                  </Button>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="Brak pasujących użytkowników" />
              </ListItem>
            )}
            {searchResults.length > 0 && (
              <ListItem button>
                <Button
                  variant="text"
                  color="primary"
                  fullWidth
                  style={{ color: "#a94c79" }}
                >
                  Wyświetl wszystkich
                </Button>
              </ListItem>
            )}
          </List>
        </Paper>
      )}
    </div>
  );
};

export default FriendSearchBar;
