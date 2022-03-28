import React, { useCallback, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import style from './collapseButtonsStyle.module.scss';
import Zoom from '@mui/material/Zoom';
import Fade from '@mui/material/Fade';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import { Paper } from '@mui/material';
import { Box } from '@mui/system';
import { useDispatch } from 'react-redux';
import { setLineWeight } from '~/redux/actions/imageProcessor';

export const CollapseButtons = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openLineWeightSetting, setOpenLineWeightSetting] =
    useState<boolean>(false);

  const dispatch = useDispatch();

  const toggleOpen = useCallback(() => {
    setOpen((pre) => !pre);
  }, []);

  const toggleLineWeightSetting = useCallback(() => {
    setOpenLineWeightSetting((pre) => !pre);
  }, []);

  const handleLineWeightChange = useCallback(
    (weight: number) => () => {
      dispatch(setLineWeight(weight));
      setOpenLineWeightSetting((pre) => !pre);
      setOpen((pre) => !pre);
    },
    []
  );

  return (
    <>
      <IconButton
        onClick={toggleOpen}
        className={`${style['icon-button']} ${style['more-button']}`}
      >
        <MoreHorizIcon fontSize="large" />
      </IconButton>
      <Zoom in={open} style={{ transitionDelay: open ? '100ms' : '0ms' }}>
        <Box
          className={`${style['line-weight-button-wrapper']} ${style['line-weight-button-wrapper_adjustment']}`}
        >
          <IconButton
            onClick={toggleLineWeightSetting}
            className={`${style['line-weight-control-button']} ${style['icon-button']}`}
          >
            <LineWeightIcon fontSize="large" />
          </IconButton>
        </Box>
      </Zoom>
      <Zoom
        in={openLineWeightSetting}
        style={{ transitionDelay: openLineWeightSetting ? '100ms' : '0ms' }}
      >
        <Box className={style['line-weight-button-wrapper']}>
          {[1, 2, 3].map((num) => {
            return (
              <IconButton
                className={`${style['icon-button']} ${style['line-weight-button']}`}
                key={num}
                onClick={handleLineWeightChange(num)}
              >
                {num}
              </IconButton>
            );
          })}
        </Box>
      </Zoom>
    </>
  );
};
