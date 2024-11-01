import PropTypes from 'prop-types';
import Cropper from 'react-easy-crop';
import React, { useState } from 'react';

import {
  Box,
  Radio,
  Button,
  Dialog,
  FormLabel,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from '@mui/material';

import { getCroppedImg } from './cropImage'; // Helper function for cropping

const AvatarCutterDialog = ({
  image,
  setImage,
  open,
  handleClose,
  shape = 'round',
  restrictPosition = true,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [aspect, setAspect] = useState(1); // Default aspect ratio 1:1

  const onCropComplete = (croppedArea, croppedAreaPixels2) => {
    setCroppedAreaPixels(croppedAreaPixels2);
  };

  const handleCrop = async () => {
    const croppedImg = await getCroppedImg(image, croppedAreaPixels);
    setImage(croppedImg); // Update parent with cropped image
    handleClose(); // Close the dialog after cropping
  };

  const handleAspectChange = (event) => {
    const { value } = event.target;
    setAspect(parseFloat(value));
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <div style={{ position: 'relative', height: 400, width: '100%' }}>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          cropShape={shape}
          showGrid
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          restrictPosition={restrictPosition}
          zoomWithScroll
        />
      </div>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
        {shape === 'rect' && (
          <FormControl component="fieldset">
            <FormLabel component="legend">Расположение</FormLabel>
            <RadioGroup
              row
              aria-label="aspect"
              name="aspect"
              value={aspect}
              onChange={handleAspectChange}
            >
              <FormControlLabel value={16 / 9} control={<Radio />} label="16:9" />
              <FormControlLabel value={4 / 3} control={<Radio />} label="4:3" />
              <FormControlLabel value={1} control={<Radio />} label="1:1" />
              <FormControlLabel value={3 / 4} control={<Radio />} label="3:4" />
            </RadioGroup>
          </FormControl>
        )}
        <Button variant="contained" onClick={handleCrop}>
          Обрезать
        </Button>
      </Box>
    </Dialog>
  );
};

AvatarCutterDialog.propTypes = {
  image: PropTypes.string,
  setImage: PropTypes.func,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  shape: PropTypes.string,
  restrictPosition: PropTypes.bool,
};

export default AvatarCutterDialog;
