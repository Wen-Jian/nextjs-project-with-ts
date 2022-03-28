import React, {
  FunctionComponent,
  useCallback,
  useRef,
  useState,
  useEffect,
} from 'react';
// import { Row, Rows } from '~/models/imageProcessor/imageProcessModel';
import style from '~/components/imageProcessor/imageProcessorStyle.module.scss';
import fetch from 'node-fetch';
import { CollapseButtons } from '../CollapseButtons/CollapseButtons';
import { useSelector } from 'react-redux';
import { StoreState } from '~/models/redux/storeModel';

const ImageProcessor: FunctionComponent = () => {
  const [isDrawingLine, setIsDrawingLine] = useState<boolean>(false);
  const [linePaths, setLinePaths] = useState<[] | number[][]>([]);
  const [imgData, setImgData] = useState<string>('');
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);
  const [imgHeight, setImgHeight] = useState<number>(0);

  const { lineWeight } = useSelector((st: StoreState) => st.imageProcessor);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const OriginImgMatRef = useRef<any>(null);
  const startPoint = useRef<[] | number[]>([]);
  const resutltImgMatRef = useRef<any>(null);
  // const [model, setModel] = useState<tf.LayersModel | null>(null);
  // var reader  = new FileReader();

  const handleUpload = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!!file) {
        // reader.readAsDataURL(file);
        const dataUrl = URL.createObjectURL(file);

        if (!!imgRef.current) {
          imgRef.current.addEventListener('load', function () {
            // @ts-ignore: Window & typeof globalThis
            let mat = cv.imread(imgRef.current);

            // @ts-ignore: Window & typeof globalThis
            // cv.imshow('canvasOutput', mat);

            const canvas = canvasRef.current;
            if (!!canvas && imgRef.current) {
              const ctx = canvas.getContext('2d');
              if (!!ctx) {
                canvas.width = imgRef.current.width;
                canvas.height = imgRef.current.height;
                // const img = imgRef.current;
                // const scale = Math.min(
                //   canvas.width / img.width,
                //   canvas.height / img.height
                // );
                // var x = canvas.width / 2 - (img.width / 2) * scale;
                // var y = canvas.height / 2 - (img.height / 2) * scale;
                ctx.drawImage(
                  imgRef.current,
                  0,
                  0,
                  canvas.width,
                  canvas.height
                );
                setImgHeight(canvas.getBoundingClientRect().height);
                let imgData = canvas.toDataURL('image/jpg');
                imgData = imgData.replace(/^data:image\/(png|jpg);base64,/, '');
                setImgData(imgData);
                setImgLoaded(true);
              }
              // let imgData = canvas.toDataURL('image/jpg');
              // imgData = imgData.replace(/^data:image\/(png|jpg);base64,/, '');
              // setImgData(imgData);
              // setImgLoaded(true);
            }
            // setImageMatrix(mat);
            OriginImgMatRef.current = mat;
            resutltImgMatRef.current = null;
          });
          imgRef.current.setAttribute('src', dataUrl);
        }
      }
    },
    [canvasRef.current]
  );
  // const padImage = (input: any) => {
  //   // @ts-ignore: Window & typeof globalThis
  //   let padded = new cv.Mat();
  //   // @ts-ignore: Window & typeof globalThis
  //   let s = new cv.Scalar(255, 255, 255, 255);
  //   const width = input.cols;
  //   const height = input.rows;
  //   // @ts-ignore: Window & typeof globalThis
  //   cv.copyMakeBorder(
  //     input,
  //     padded,
  //     0,
  //     32 - (height % 32),
  //     0,
  //     32 - (width % 32),
  //     // @ts-ignore: Window & typeof globalThis
  //     cv.BORDER_CONSTANT,
  //     s
  //   );
  //   return padded;
  // };

  const handleMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      if (imgLoaded) {
        setIsDrawingLine(true);
      }
    },
    [imgLoaded]
  );

  // const handleMouseUp = useCallback(
  //   async (e) => {
  //     setIsDrawingLine(false);
  //     startPoint.current = [];
  //     if (!!model) {
  //       const mat = padImage(resutltImgMatRef.current);
  //       const data = mat.data;
  //       const width = mat.cols;
  //       const height = mat.rows;
  //       const rows: Rows = [];
  //       for (let y = 0; y < height; y++) {
  //         // loop through each column
  //         let row: Row = [];
  //         for (var x = 0; x < width; x++) {
  //           var red = data[(width * y + x) * 4] / 255;
  //           var green = data[(width * y + x) * 4 + 1] / 255;
  //           var blue = data[(width * y + x) * 4 + 2] / 255;
  //           // var alpha = data[((width * y) + x) * 4 + 3];
  //           if (row.length === 0) {
  //             row = [[red, green, blue]];
  //           } else {
  //             row.push([red, green, blue]);
  //           }
  //         }
  //         rows.push(row);
  //       }
  //       if (!!canvasRef.current) {
  //         // const image = tf.browser.fromPixels(canvasRef.current);
  //         const image = tf.tensor([rows]);
  //         const result = model.predict([image]);
  //         await tf.browser.toPixels(
  //           tf.squeeze(result as tf.Tensor<tf.Rank>) as any,
  //           canvasRef.current
  //         );
  //       }
  //     }
  //   },
  //   [resutltImgMatRef.current]
  // );

  const handleMouseUp = useCallback(async () => {
    setIsDrawingLine(false);
    startPoint.current = [];
    const result = await fetch('http://localhost:5000/inpaint_image', {
      method: 'post',
      body: JSON.stringify({
        img_data: imgData,
        paths: JSON.stringify(linePaths),
        line_weight: lineWeight,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    const { status } = result;
    if (status === 200 && !!imgRef.current) {
      const { img_data } = await result.json();
      imgRef.current.setAttribute('src', `data:image/png;base64,${img_data}`);
    }
    setLinePaths([]);
  }, [imgData, linePaths]);

  const handleMouseMove = useCallback(
    (e) => {
      e.preventDefault();
      if (!!e.targetTouches && e.targetTouches.length > 1) {
        return;
      }
      if (isDrawingLine) {
        if (!!OriginImgMatRef.current) {
          const bounds = e.currentTarget.getBoundingClientRect();
          const clientX =
            ((e.clientX - bounds.left) / bounds.width) *
            OriginImgMatRef.current.cols;
          const clientY =
            ((e.clientY - bounds.top) / bounds.height) *
            OriginImgMatRef.current.rows;
          setLinePaths([...linePaths, [clientX, clientY]]);

          if (startPoint.current.length === 0) {
            startPoint.current = [clientX, clientY];
            return;
          }
          if (!resutltImgMatRef.current) {
            resutltImgMatRef.current = new cv.Mat();
            let temp = resutltImgMatRef.current;
            OriginImgMatRef.current.copyTo(temp);
          }
          // let temp = resutltImgMatRef.current;
          // let p1 = new cv.Point(startPoint.current[0], startPoint.current[1]);
          // let p2 = new cv.Point(clientX, clientY);
          if (!!canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (!!ctx) {
              ctx.beginPath();
              // ctx.moveTo(0, 0);
              ctx.moveTo(startPoint.current[0], startPoint.current[1]);
              ctx.lineTo(clientX, clientY);
              ctx.strokeStyle = '#ff0000';
              ctx.lineWidth = lineWeight;
              ctx.stroke();
            }
          }
          // cv.line(temp, p1, p2, [0, 0, 0, 255], 3);
          // cv.imshow('canvasOutput', temp);
          // resutltImgMatRef.current = temp;
          startPoint.current = [clientX, clientY];
        }
      }
    },
    [
      isDrawingLine,
      startPoint.current,
      OriginImgMatRef.current,
      canvasRef.current,
    ]
  );

  const handleTouchMove = useCallback(
    (e) => {
      console.log(e.touches[0].clientX);
      if (isDrawingLine) {
        if (!!OriginImgMatRef.current) {
          const bounds = e.currentTarget.getBoundingClientRect();
          const clientX =
            ((e.touches[0].clientX - bounds.left) / bounds.width) *
            OriginImgMatRef.current.cols;
          const clientY =
            ((e.touches[0].clientY - bounds.top) / bounds.height) *
            OriginImgMatRef.current.rows;
          setLinePaths([...linePaths, [clientX, clientY]]);

          if (startPoint.current.length === 0) {
            startPoint.current = [clientX, clientY];
            return;
          }
          if (!resutltImgMatRef.current) {
            resutltImgMatRef.current = new cv.Mat();
            let temp = resutltImgMatRef.current;
            OriginImgMatRef.current.copyTo(temp);
          }
          // let temp = resutltImgMatRef.current;
          // let p1 = new cv.Point(startPoint.current[0], startPoint.current[1]);
          // let p2 = new cv.Point(clientX, clientY);
          if (!!canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (!!ctx) {
              ctx.beginPath();
              // ctx.moveTo(0, 0);
              ctx.moveTo(startPoint.current[0], startPoint.current[1]);
              ctx.lineTo(clientX, clientY);
              ctx.strokeStyle = '#ff0000';
              ctx.lineWidth = lineWeight;
              ctx.stroke();
            }
          }
          // cv.line(temp, p1, p2, [0, 0, 0, 255], 3);
          // cv.imshow('canvasOutput', temp);
          // resutltImgMatRef.current = temp;
          startPoint.current = [clientX, clientY];
        }
      }
    },
    [
      isDrawingLine,
      startPoint.current,
      OriginImgMatRef.current,
      canvasRef.current,
    ]
  );

  // useEffect(() => {
  //   (async () => {
  //     const model = await tf.loadLayersModel(
  //       'http://localhost:8080/tf_models/p_conv/model.json'
  //     );
  //     setModel(model);
  //   })();
  // }, []);

  return (
    <div
      className={`flex-box just-content-center ${style['image-processor-wrapper']}`}
      style={{
        height: `max(100vh, ${imgHeight}px)`,
        touchAction: 'pinch-zoom',
      }}
    >
      <div className={`${style.paper}`}>
        <input
          type="file"
          onChange={handleUpload}
          className={style['image-uploader']}
          hidden={imgLoaded}
        />
        <br />
        <canvas
          ref={canvasRef}
          style={{ width: '80%' }}
          id="canvasOutput"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleMouseDown}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        />
        <CollapseButtons />
      </div>
      <img id="myImg" src="#" ref={imgRef} hidden={true} />
    </div>
  );
};

export default ImageProcessor;
