import React, { useRef, useState, useEffect } from 'react';
import cx from 'classnames';
import * as pdf from 'pdfjs-dist';
import { fabric } from 'fabric';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.js?url';
import camera from '../../assets/camera_2x.png';
import file from '../../assets/file_2x.png';
import image from '../../assets/image_2x.png';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

pdf.GlobalWorkerOptions.workerSrc = pdfWorker;

const File2Image = () => {
  const Base64Prefix = 'data:application/pdf;base64,';
  const add = document.querySelector('.add');

  function readBlob(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result));
      reader.addEventListener('error', reject);
      reader.readAsDataURL(blob);
    });

    async function printPDF(pdfData) {
      // 將檔案處理成 base64
      pdfData = await readBlob(pdfData);

      // 將 base64 中的前綴刪去，並進行解碼
      const data = atob(pdfData.substring(Base64Prefix.length));

      // 利用解碼的檔案，載入 PDF 檔及第一頁
      const pdfDoc = await pdfjsLib.getDocument({ data }).promise;
      const pdfPage = await pdfDoc.getPage(1);

      // 設定尺寸及產生 canvas
      const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      // 設定 PDF 所要顯示的寬高及渲染
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const renderContext = {
        canvasContext: context,
        viewport,
      };
      const renderTask = pdfPage.render(renderContext);

      // 回傳做好的 PDF canvas
      return renderTask.promise.then(() => canvas);
    }

    async function pdfToImage(pdfData) {
      // 設定 PDF 轉為圖片時的比例
      const scale = 1 / window.devicePixelRatio;

      // 回傳圖片
      return new fabric.Image(pdfData, {
        id: 'renderPDF',
        scaleX: scale,
        scaleY: scale,
      });
    }

    // 此處 canvas 套用 fabric.js
    const canvas = new fabric.Canvas('canvas');

    document.querySelector('input').addEventListener('change', async (e) => {
      canvas.requestRenderAll();
      const pdfData = await printPDF(e.target.files[0]);
      const pdfImage = await pdfToImage(pdfData);

      // 透過比例設定 canvas 尺寸
      canvas.setWidth(pdfImage.width / window.devicePixelRatio);
      canvas.setHeight(pdfImage.height / window.devicePixelRatio);

      // 將 PDF 畫面設定為背景
      canvas.setBackgroundImage(pdfImage, canvas.renderAll.bind(canvas));
    });
  }
  return (
    <>
      <div>
        <input type="file" accept="application/pdf" placeholder="選擇PDF檔案" />
      </div>
      <canvas id="canvas2" style={{ border: '1px solid #000' }}></canvas>
    </>
  );
};

const EmptyFile = ({ onUploadFile }) => {
  return (
    <>
      <div className="step1-main-wrapper__content">
        <h4 className="text-center text-gray-dark">上傳簽署檔案</h4>
        <div className="mt-3 flex h-[559px] w-full flex-col gap-5">
          <div className="flex h-1/3 items-center justify-center rounded-[10px] border-2 border-dashed border-blue-dark bg-white">
            <div className="flex flex-col items-center justify-center gap-4">
              <img src={camera} alt="camera icon on screen" className="h-10" />
              <button
                type="button"
                className="btn-black flex w-[136px] items-center justify-center"
              >
                開啟相機
              </button>
            </div>
          </div>
          <div className="flex h-1/3 items-center justify-center rounded-[10px] border-2 border-dashed border-blue-dark bg-white">
            <div className="flex flex-col items-center justify-center gap-4">
              <img src={image} alt="image on screen" className="h-10" />
              <label className="btn-black flex w-[136px] items-center justify-center">
                <input type="file" className="hidden" />
                <span>選擇照片</span>
              </label>
            </div>
          </div>
          <div className="flex h-1/3 items-center justify-center rounded-[10px] border-2 border-dashed border-blue-dark bg-white">
            <div className="flex flex-col items-center justify-center gap-4">
              <img src={file} alt="file icon on screen" className="h-10" />

              <label className="btn-black flex w-[136px] items-center justify-center">
                <input
                  onChange={onUploadFile}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                />
                <span>選擇檔案</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Step1 = ({ isUpload, setIsUpload, focus }) => {
  if (focus !== '1') return;
  const canvasRef = useRef(null);
  const minusRef = useRef(null);
  const plusRef = useRef(null);

  const [pdfPage, setPdfPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [fileName, setFileName] = useState('上傳簽署檔案名稱.pdf');

  let thePdf = null;
  const onUploadFile = (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    thePdf = file;
    onRenderPdf();
  };

  const onRenderPdf = () => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(thePdf);
    fileReader.addEventListener('load', () => {
      // 獲取readAsArrayBuffer產生的結果，並用來渲染PDF
      const typedarray = new Uint8Array(fileReader.result);
      // handlePdf(typedarray);
      pdf.getDocument(typedarray).promise.then(async (pdfDocument) => {
        // 總頁數
        setPdfPage(pdfDocument.numPages);

        thePdf = pdfDocument;
        const viewer = canvasRef.current;

        for (let page = 1; page <= thePdf.numPages; page++) {
          const canvas = document.createElement('canvas');
          canvas.className = 'pdf-page-canvas';
          viewer.appendChild(canvas);
          handlePages(page, canvas, scale);
        }
      });
    });
    setIsUpload(true);
  };

  const handlePages = (pageNumber, canvas, scale) => {
    thePdf.getPage(pageNumber).then((page) => {
      const viewport = page.getViewport({ scale: scale });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const result = page.render({
        canvasContext: canvas.getContext('2d'),
        viewport: viewport,
      });
      // return result;
      return result.promise.then(() => canvas);
    });
  };

  // 此處 canvas 套用 fabric.js
  const canvas2 = new fabric.Canvas('canvas');

  const toImage = async () => {
    const pdfData = await printPDF(e.target.files[0]);
    const pdfImage = await pdfToImage(pdfData);
  };

  const deleteFile = () => {
    const viewer = document.getElementById('pdf-viewer');
    while (viewer.firstChild) {
      viewer.removeChild(viewer.lastChild);
    }
    setIsUpload(false);
  };

  //TODO:用CSS做掉放大縮小
  // 預設大小為1
  // 每個step為25%
  // 1 = 100, 1.25 = 125%
  // 0.75 = 75%, 0.5 = 50%
  const updateScale = (e) => {
    const canvas = document.querySelector('canvas');
    let target = e.target.getAttribute('data-name');
    let cs = canvas.className;
    // scale = 1
    let min = 0.25;
    let max = 1.5;
    let step = 0.25;

    if (target === 'minus') {
      if (scale < min) return;
      setScale(scale - step);

      if (scale === 1.5) {
        canvasRef.current.className = ' scale-125';
        return;
      } else if (scale === 1.25) {
        canvasRef.current.className = ' scale-100';
        return;
      } else if (scale === 1) {
        canvasRef.current.className = ' scale-75';
        return;
      } else if (scale === 0.75) {
        canvasRef.current.className = ' scale-50';
        return;
      }
    } else if (target === 'plus') {
      setScale(scale + step);
      if (scale === 1.25) {
        canvasRef.current.className = ' scale-150';
        return;
      } else if (scale === 1) {
        canvasRef.current.className = ' scale-125';
        return;
      } else if (scale === 0.75) {
        canvasRef.current.className = ' scale-100';
        return;
      } else if (scale === 0.5) {
        canvasRef.current.className = ' scale-75';
        return;
      } else if (scale === 0.25) {
        canvasRef.current.className = ' scale-50';
        return;
      }
    }
  };

  return (
    <>
      <File2Image />
      <main className={cx('step1-main-wrapper', { hidden: focus === '2' })}>
        {!isUpload && <EmptyFile onUploadFile={onUploadFile} />}

        <div className={cx({ hidden: !isUpload })}>
          <div className="step1-main-wrapper__content">
            <div className="relative mb-2.5 ">
              <p className="rounded-lg border py-2.5 px-3">{fileName}</p>
              <button
                onClick={deleteFile}
                type="button"
                className="absolute -right-0.5 top-0 translate-y-[-1px] rounded-lg bg-red py-3 px-4 text-white ring-blue-dark hover:bg-red-dark active:ring-2 disabled:bg-gray"
              >
                刪除檔案
              </button>
            </div>

            <div className="relative h-[538px] rounded-[10px] border bg-[#E7E9EA] p-2.5">
              <span className="absolute right-2.5 z-50 rounded-md bg-black py-1.5 px-3 font-medium text-white">
                共{pdfPage}頁
              </span>

              <div className="pdf-wrapper">
                <div
                  className="pdf-viewer"
                  id="pdf-viewer"
                  ref={canvasRef}
                ></div>
              </div>

              <div className="absolute bottom-2.5 right-2.5 flex gap-1">
                <button className="icon-btn">
                  <MinusIcon
                    onClick={updateScale}
                    data-name="minus"
                    ref={minusRef}
                    className={cx('h-6 w-6 text-white', {
                      disabled: scale === 0.25,
                    })}
                  />
                </button>
                <button className="icon-btn">
                  <PlusIcon
                    onClick={updateScale}
                    ref={plusRef}
                    data-name="plus"
                    className={cx('h-6 w-6 text-white', {
                      disabled: scale === 1.5,
                    })}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Step1;