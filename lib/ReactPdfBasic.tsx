"use client";

import { saveAs } from 'file-saver';
import { useIntersectionObserver } from "@wojtekmaj/react-hooks";
import { BookImage, Download, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Document, Page, pdfjs, Thumbnail } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function ReactPdfBasic({ sourceUrl, filename }: { sourceUrl: string, filename: string }) {
  const [numPages, setNumPages] = useState<number>();
  const [scale, setScale] = useState<number>(1);
  const [visiblePages, setVisiblePages] = useState<Record<number, boolean>>({});
  const [rotation, setRotation] = useState<number>(0);
  const [isThumbnailShown, setTumbnailShown] = useState<boolean>(false);

  const arrPages = [...Array(numPages).keys()];

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const setPageVisibility = useCallback(
    (pageNumber: number, isIntersecting: boolean) => {
      setVisiblePages((prevVisiblePages) => ({
        ...prevVisiblePages,
        [pageNumber]: isIntersecting,
      }));
    }, []
  );

  const visibleArr = Object.entries(visiblePages).filter(([, value]) => value).map(([key]) => key);
  const currentPage = visibleArr.length > 0 ? +visibleArr[visibleArr.length - 1] : 1;

  return (
    <div className="flex-1 w-full h-full flex flex-col">
      {/* App Bar */}
      <div className="flex z-50 border-b shadow p-4">
        <div className="flex gap-2">
          <button className={`btn btn-circle ${isThumbnailShown ? "btn-info" : "btn-ghost"}`} onClick={() => setTumbnailShown(!isThumbnailShown)}>
            <BookImage />
          </button>
        </div>
        <div className="flex-1" />
        <div className="flex gap-2">
          {/* <button className="btn btn-circle btn-ghost"><ChevronUp /></button> */}
          {numPages ? <p><span className="font-semibold">{currentPage}</span> of {numPages}</p> : null}
          {/* <button className="btn btn-circle btn-ghost"><ChevronDown /></button> */}
          <div className="w-2" />
          <button className="btn btn-circle btn-ghost" onClick={() => setScale(scale - 0.1)}><ZoomOut /></button>
          <p>{Math.round(scale * 100)} %</p>
          <button className="btn btn-circle btn-ghost" onClick={() => setScale(scale + 0.1)}><ZoomIn /></button>
          <div className="w-2" />
          {/* <button className="btn btn-sm"><GalleryHorizontal /></button> */}
          <button className="btn btn-circle btn-ghost" onClick={() => setRotation(rotation == 0 ? 270 : rotation - 90)}><RotateCcw /></button>
        </div>
        <div className="flex-1" />
        <div className="flex gap-2">
          <button onClick={() => saveAs(sourceUrl, filename)} className="btn btn-circle btn-ghost"><Download /></button>
        </div>
      </div>

      {/* Main Content */}
      <Document file={sourceUrl} onLoadSuccess={onDocumentLoadSuccess} loading={<PdfLoading />} className="flex-1 overflow-y-auto">
        <div className="h-full flex bg-gray-200">
          {isThumbnailShown ? <div className="flex flex-col max-w-xs flex flex-col py-4 border-r overflow-y-scroll">
            {/* Thumbnails */}
            {arrPages.map((element: number) =>
              <div key={element} className="px-8 py-4">
                <div className="border p-0 m-0">
                  <Thumbnail pageNumber={element + 1} width={160} />
                </div>
                <p className="mt-2 text-center text-sm">{element + 1}</p>
              </div>
            )}
          </div> : null}
          <div className="flex-1 flex overflow-y-auto bg-base-300">
            <div className="flex-1" />
            <div className="py-4">
              {arrPages.map((element: number) =>
                <PageWithObserver
                  key={`page_${element + 1}`}
                  pageNumber={element + 1}
                  setPageVisibility={setPageVisibility}
                  scale={scale}
                  rotate={rotation}
                  className="flex flex-col justify-center items-center shadow-lg"
                />
              )}
            </div>
            <div className="flex-1" />
          </div>
        </div>
      </Document>
    </div>
  );
}

const observerConfig: IntersectionObserverInit = {
  threshold: 0.3,
};

interface PageWithObserverProps {
  pageNumber: number;
  setPageVisibility: (pageNumber: number, isVisible: boolean) => void;
  [key: string]: any; // Allow any other props to be passed
}

function PageWithObserver({
  pageNumber,
  setPageVisibility,
  ...otherProps
}: PageWithObserverProps) {
  const [page, setPage] = useState<HTMLCanvasElement | null>(null);

  const onIntersectionChange = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      setPageVisibility(pageNumber, entry.isIntersecting);
    },
    [pageNumber, setPageVisibility]
  );

  useIntersectionObserver(page, observerConfig, onIntersectionChange);

  return (
    <div className="py-4">
      <Page
        canvasRef={setPage}
        pageNumber={pageNumber}
        {...otherProps}
      // canvasBackground='rgb(255, 255, 255)'
      />
    </div>
  );
}

function PdfLoading() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-base-300">
      <span className="loading loading-spinner loading-lg"></span>
      <h1 className="pb-16">Please wait...</h1>
    </div>
  );
}
