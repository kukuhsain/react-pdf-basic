import ReactPdfBasic from "./ReactPdfBasic"

function App() {
  return (
    <>
      <div>
        <h1 className="text-xl font-semibold">Hello, World!</h1>
        <ReactPdfBasic sourceUrl="https://pdfslick.dev/pdfs/p4450.pdf" filename="download.pdf" />
      </div>
    </>
  )
}

export default App
