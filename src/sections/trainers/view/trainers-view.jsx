import React, { useState } from 'react';

import { Box, Card } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import TableNoData from 'src/sections/user/table-no-data';
import UserTableToolbar from 'src/sections/user/user-table-toolbar';
import { applyFilter, getComparator } from 'src/sections/user/utils';

import { useGetTrainersQuery } from 'src/store/reducers/trainers';

import TrainerCard from '../trainer-card';

const TrainersView = () => {
  const { data: trainers = [] } = useGetTrainersQuery();

  const [filterName, setFilterName] = useState('');

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: trainers,
    comparator: getComparator('first_name', 'desc'),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Card sx={{ pb: 3 }}>
      <UserTableToolbar filterName={filterName} onFilterName={handleFilterByName} />
      <Box px={3}>
        <Grid container spacing={3}>
          {dataFiltered.map((trainer) => (
            <TrainerCard key={trainer.id} trainer={trainer} />
          ))}
        </Grid>
        {notFound && (
          <Box display="flex" justifyContent="center" alignItems="center" py={3}>
            <TableNoData query={filterName} />
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default TrainersView;
