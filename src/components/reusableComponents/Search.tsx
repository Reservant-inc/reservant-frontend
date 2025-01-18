import { Close } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import React, { useRef, useState } from 'react';

interface SearchProps {
  filter: (query: string) => void;
  placeholder: string;
}

const Search: React.FC<SearchProps> = ({ filter, placeholder }) => {
  const [query, setQuery] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);


    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      filter(value);
    }, 10);
  };

  const handleInputFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearchClear = () => {
    setQuery('');
    filter('');
  };

  return (
    <div className="relative flex w-full items-center">
      <input
        type="text"
        ref={inputRef}
        placeholder={placeholder}
        value={query}
        id="searchBarIn"
        className="w-full border-[1px] border-grey-2 dark:border-grey-4 rounded-full px-3 focus:border-primary dark:focus:border-secondary placeholder:text-grey-4 dark:placeholder:text-grey-2 text-black dark:text-grey-1"
        onChange={handleSearchChange}
      />
      {query ? (
        <span
          className="absolute right-2 h-6 w-6 text-grey-4 dark:text-grey-2 hover:cursor-pointer"
          onClick={handleSearchClear}
          id="searchBarCloseIco"
        >
          <Close />
        </span>
      ) : (
        <span
          className="absolute right-2 h-6 w-6 text-grey-4 dark:text-grey-2 hover:cursor-pointer"
          onClick={handleInputFocus}
          id="searchBarIco"
        >
          <SearchIcon />
        </span>
      )}
    </div>
  );
};

export default Search;
