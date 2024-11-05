import './App.css';
import Dropdown from "./components/Dropdown/Dropdown";

function App() {
  return (
    <div className="App">
      <Dropdown url='https://dummyjson.com/products' searchMode='external' />
      <Dropdown url='https://dummyjson.com/products' />
    </div>
  );
}

export default App;
