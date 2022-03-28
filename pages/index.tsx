import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import ImageProcessor from '~/components/imageProcessor';

const Index: NextPage = () => {
  const [taps, setTaps] = useState<[] | Touch[]>([]);

  useEffect(() => {
    const body = document.getElementsByTagName('body')[0];
    body.addEventListener('touchmove', (e) => {
      e.preventDefault();
      console.log('touchmove', e.targetTouches[0].identifier);
      if (e.targetTouches.length === 2) {
        let diff = 0;
        let diff2 = 0;
        for (let index in e.targetTouches) {
          if (taps.length < 2) {
            setTaps([...taps, e.targetTouches[index]]);
          } else {
            const [p1, p2] = taps;
            if (p1.identifier === e.targetTouches[index].identifier) {
              diff = p1.clientX - e.targetTouches[index].clientX;
            }
            if (p2.identifier === e.targetTouches[index].identifier) {
              diff2 = p2.clientX - e.targetTouches[index].clientX;
            }
          }
        }
      }
    });
  });

  return (
    <>
      <ImageProcessor />
    </>
  );
};

export default Index;
