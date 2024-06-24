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

  const updateValue = (newValue: T | ((currentValue: T) => T)) => {
    try {
      const valueToBeStored =
        newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToBeStored);
      window.localStorage.setItem(storageKey, JSON.stringify(valueToBeStored));
    } catch (error) {
      console.log('Saving to local storage failed:', error);
    }
  };

  return [value, updateValue] as const;
}

export default useLocalStorage;
```

```typescript
import React from 'react';
import useLocalStorage from './useLocalStorage';

function TaskApp() {
  const [taskText, setTaskText] = useLocalStorage('task', '');

  return (
    <div>
      <input
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
      />
      <p>{`Task: ${taskText}`}</p>
    </div>
  )
}

export default TaskApp;
```

```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import TaskApp from './TaskApp';

ReactDOM.render(
  <React.StrictMode>
    <React.Fragment>
      <TaskApp />
    </React.Fragment>
  </React.StrictMode>,
  document.getElementById('root')
);