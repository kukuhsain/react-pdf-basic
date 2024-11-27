import ReactPdfBasic from "./ReactPdfBasic"

function App() {
  return (
    <div>
      <div className="px-4 pt-8 flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-semibold">React PDF Basic</h1>
        <h2 className="text-lg">A simple open-source React component to view PDF file easily</h2>
        <p>npm install react-pdf-basic</p>
      </div>
      <div className="py-16">
        <div className="max-w-7xl mx-auto border h-lvh">
          <ReactPdfBasic sourceUrl="https://pdfslick.dev/pdfs/p4450.pdf" filename="download.pdf" />
        </div>
      </div>
    </div>
  )
}

export default App
