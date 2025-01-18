import React, { useState } from 'react';
import { Field, Formik } from 'formik';
import Search from './Search';
import { useTranslation } from 'react-i18next';

interface FiltersProps<T> {
  data: T[];
  onFilterChange: (filteredData: T[]) => void;
  sortBy: keyof T & string; // Klucz, po którym można sortować
  filterByName: keyof T & string; // Klucz, po którym można wyszukiwać
}
const Filters = <T extends Record<string, any>>({
    data,
    onFilterChange,
    sortBy,
    filterByName,
  }: FiltersProps<T>) => {
    const [sortOrder, setSortOrder] = useState<string>('newest');
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [t] = useTranslation('global');
  
    const handleSortChange = (newSortOrder: string) => {
      setSortOrder(newSortOrder);
      applyFilters(data, newSortOrder, startDate, endDate, '');
    };
  
    const handleDateChange = (newStartDate: string | null, newEndDate: string | null) => {
      setStartDate(newStartDate);
      setEndDate(newEndDate);
      applyFilters(data, sortOrder, newStartDate, newEndDate, '');
    };
  
    const handleSearch = (query: string) => {
      applyFilters(data, sortOrder, startDate, endDate, query);
    };
  
    const applyFilters = (
      originalData: T[],
      sort: string,
      start: string | null,
      end: string | null,
      searchQuery: string
    ) => {
      let filteredData = [...originalData];
  
      // Sortowanie
      filteredData.sort((a, b) => {
        const dateA = new Date(a[sortBy]).getTime();
        const dateB = new Date(b[sortBy]).getTime();
        return sort === 'newest' ? dateB - dateA : dateA - dateB;
      });
  
      // Filtrowanie po datach
      if (start) {
        filteredData = filteredData.filter(item => new Date(item[sortBy]) >= new Date(start));
      }
      if (end) {
        filteredData = filteredData.filter(item => new Date(item[sortBy]) <= new Date(end));
      }
  
      // Wyszukiwanie (dla zagnieżdżonego pola)
      if (searchQuery.length >= 3) {
        filteredData = filteredData.filter(item =>
          item[filterByName]
            ?.toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      }
      
  
      onFilterChange(filteredData);
    };
  
    return (
      <div className="flex items-center gap-2">
        <select
          value={sortOrder}
          onChange={e => handleSortChange(e.target.value)}
          id="sortSelect"
          className="border-[1px] h-full pl-3 pr-8 py-1 text-black bg-white dark:text-grey-1 rounded-lg border-grey-2 dark:border-grey-4 focus:border-primary dark:focus:border-secondary hover:cursor-pointer dark:bg-black"
        >
          <option value="newest" id="newest">
            {t('general.newest')}
          </option>
          <option value="oldest" id="oldest">
            {t('general.oldest')}
          </option>
        </select>
        <Formik
          initialValues={{ startDate: '', endDate: '' }}
          onSubmit={() => {}}
        >
          {({ setFieldValue }) => (
            <div className="flex items-center gap-2">
              <Field
                name="startDate"
                type="date"
                id="startDateFilter"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value || null;
                  setFieldValue('startDate', value);
                  handleDateChange(value, endDate);
                }}
                className="border-[1px] px-3 py-1 h-full rounded-lg text-black dark:text-grey-1 border-grey-2 dark:border-grey-4 focus:border-primary dark:focus:border-secondary hover:cursor-pointer dark:bg-black"
              />
              <Field
                name="endDate"
                type="date"
                id="endDateFilter"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value || null;
                  setFieldValue('endDate', value);
                  handleDateChange(startDate, value);
                }}
                className="border-[1px] px-3 py-1 h-full rounded-lg text-black dark:text-grey-1 border-grey-2 dark:border-grey-4 focus:border-primary dark:focus:border-secondary hover:cursor-pointer dark:bg-black"
              />
            </div>
          )}
        </Formik>
        <Search filter={handleSearch} placeholder={t('profile.search')} />
      </div>
    );
  };
  
  export default Filters;
  


