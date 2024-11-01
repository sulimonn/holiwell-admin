import React from 'react';
import { useParams } from 'react-router-dom';

import { useGetTrainerQuery } from 'src/store/reducers/trainers';
// eslint-disable-next-line perfectionist/sort-imports
import { AddTrainerView } from '../add-trainer-view';

const TrainerView = () => {
  const { id } = useParams();
  const { data = {}, isSuccess, isFetching } = useGetTrainerQuery(id);

  if (!isSuccess) {
    return null;
  }

  return <AddTrainerView trainer={data} isFetching={isFetching} />;
};

export default TrainerView;
