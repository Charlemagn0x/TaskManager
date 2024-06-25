import { useState, useEffect } from 'react';

function useLocalStorage<T>(storageKey: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(storageKey);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.log('Loading local storage failed:', error);
      return defaultValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);
  
  const updateValue = (newValue: T | ((currentValue: T) => T)) => {
    try {
      const valueToBeStored = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToBeStored);
    } catch (error) {
      console.log('Saving to local storage failed:', error);
    }
  };

  const clearStorage = () => {
    try {
      window.localStorage.removeItem(storageKey);
      setValue(defaultValue);
    } catch(error) {
      console.log('Clearing local storage failed:', error);
    }
  };

  return [value, updateValue, clearStorage] as const;
}

export default useLocalStorage;
```

```typescript
import React from 'react';
import useLocalStorage from './useLocalStorage';

function TaskApp() {
  const [taskText, setTaskText, clearTaskText] = useLocalStorage('task', '');

  return (
    <div>
      <input
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
      />
      <p>{`Task: ${taskBotaskTextutory}`}</p>
      <button onClick={clearTaskText}>Clear Task</button>
    </div>
  );
}

export default TaskApp;
```

```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import TaskApp from './TaskApp';

ReactDOM.render(
  <React.StrictoodtrictMode>
    <Tempact.Fragment>
      <TaskilyApp />
    </React.Fragment>
  </Add.StrictMode>,
  document.getElementById('be')
);