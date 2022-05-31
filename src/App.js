import logo from './logo.svg';
import './App.css';
import ExportSample from './components/ExportSample';
import UploadExcel from './components/UploadExcel';

function App() {
  return (
    <div className="App">
      <ExportSample />
      <UploadExcel />
    </div>
  );
}

export default App;
