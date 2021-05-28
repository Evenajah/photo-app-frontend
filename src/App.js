import "./App.css";
import Header from "./components/core/Header";
import Photos from "./components/Photos";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="p-grid">
        <div className="p-col-10 p-offset-2">
          <Photos />
        </div>
      </div>
    </div>
  );
}

export default App;
