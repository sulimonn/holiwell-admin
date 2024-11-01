/* eslint-disable no-shadow */
import React from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';

import { Box, Card, Stack, Typography, CardContent } from '@mui/material';

import Iconify from 'src/components/iconify';

const ReorderLessons = ({ initialLessons: lessons, setLessons }) => {
  if (!lessons?.length) return null;

  const onDragEnd = (result) => {
    // Check if the item was dropped outside the list
    if (!result.destination) return;

    const reorderedLessons = Array.from(
      lessons.map((lesson) => ({ ...lesson, prev_lesson_id: null, next_lesson_id: null }))
    );
    const [movedLesson] = reorderedLessons.splice(result.source.index, 1);
    reorderedLessons.splice(result.destination.index, 0, movedLesson);
    const updatedLessons = reorderedLessons.map((lesson, index) => ({
      ...lesson,
      prev_lesson_id: reorderedLessons[index - 1]?.id || null,
      next_lesson_id: reorderedLessons[index + 1]?.id || null,
    }));

    setLessons(updatedLessons);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lessons">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {lessons.map((lesson, index) => (
              <Draggable key={lesson.id} draggableId={lesson.id.toString()} index={index}>
                {(provided) => (
                  <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      margin: '10px 0',
                      padding: '0 !important',
                    }}
                    sx={{ cursor: 'grab', p: 0 }}
                  >
                    <CardContent sx={{ padding: '0 !important' }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box p={2}>
                          <Iconify icon="eva:menu-fill" sx={{ width: 24, height: 24 }} />
                        </Box>
                        <Stack
                          direction={{ xs: 'column', md: 'row' }}
                          spacing={2}
                          alignItems={{ xs: 'flex-start', md: 'center' }}
                          flex={1}
                        >
                          <Box sx={{ width: { xs: '100%', md: 100 }, height: 100 }}>
                            <img
                              src={lesson.path_to_cover}
                              alt={lesson.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </Box>
                          <Box sx={{ pt: { xs: 0, md: 2 }, pb: 2 }}>
                            <Typography variant="h6">{lesson.title}</Typography>
                            <Typography variant="body2">
                              {lesson.description.slice(0, 100)}
                            </Typography>
                          </Box>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

ReorderLessons.propTypes = {
  initialLessons: PropTypes.array,
  setLessons: PropTypes.func,
};

export default ReorderLessons;
