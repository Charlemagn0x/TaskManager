import { useState, useEffect } from 'react';

// Custom hook for using local storage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;
```
```typescript
import React from 'react';
import useLocalStorage from './useLocalStorage';

function App() {
  const [task, setTask] = useLocalStorage('task', '');

  return (
    <div>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <p>{`Task: ${task}`}</p>
    </div>
  )
}

export default App;
```
```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import { Fragment } from 'react'; // Ensure Fragment is imported
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Fragment>
    <App />
    </Fragment>
  </React.StrictMode>,
  document.getElementById('root')
);