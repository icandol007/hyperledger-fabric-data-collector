12단계에서는 리액트에서 **리액트 훅(React Hooks)**에 대해 자세히 알아보겠습니다. 리액트 훅은 함수형 컴포넌트에서 상태(state)와 생명주기(lifecycle) 기능을 사용할 수 있게 해주는 기능입니다. 리액트 훅의 도입으로 함수형 컴포넌트에서도 클래스형 컴포넌트와 동일한 기능을 구현할 수 있게 되었으며, 코드가 더 간결하고 이해하기 쉬워졌습니다. 이 단계에서는 리액트의 주요 훅인 `useState`, `useEffect`, 그리고 기타 유용한 훅들을 깊이 있게 다루겠습니다.

### 12단계: 리액트 훅 (React Hooks)

#### 1. 리액트 훅이란?

리액트 훅은 리액트 16.8 버전에서 도입된 기능으로, 함수형 컴포넌트에서 상태와 생명주기를 다룰 수 있게 해줍니다. 이전에는 클래스형 컴포넌트에서만 가능했던 기능들을 함수형 컴포넌트에서도 간단하게 사용할 수 있게 되었으며, 리액트 훅을 사용하면 코드의 가독성이 향상되고, 복잡성이 줄어듭니다.

리액트 훅은 함수형 컴포넌트에서 다음과 같은 기능을 제공합니다:

- 상태 관리 (`useState`)
- 사이드 이펙트 처리 (`useEffect`)
- 컨텍스트 사용 (`useContext`)
- 성능 최적화 (`useMemo`, `useCallback`)
- Ref 관리 (`useRef`)
- 커스텀 훅 생성

#### 2. `useState` 훅

`useState`는 함수형 컴포넌트에서 상태를 관리할 수 있도록 해주는 훅입니다. 이 훅은 상태 변수와 상태를 갱신하는 함수를 반환하며, 상태가 변경될 때마다 컴포넌트가 다시 렌더링됩니다.

##### 1) `useState`의 기본 사용법

```jsx
import React, { useState } from 'react';

function Counter() {
  // count라는 상태 변수와 setCount라는 상태 갱신 함수를 정의
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

위 예제에서 `useState(0)`는 `count`라는 상태 변수를 0으로 초기화하고, `setCount` 함수를 통해 상태를 갱신할 수 있게 해줍니다. 버튼을 클릭할 때마다 `setCount(count + 1)`이 호출되어 `count`가 증가하고, 컴포넌트가 다시 렌더링됩니다.

##### 2) 복수의 상태 관리

컴포넌트에서 여러 개의 상태를 관리해야 할 때, `useState`를 여러 번 호출할 수 있습니다.

```jsx
import React, { useState } from 'react';

function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <p>Name: {name}</p>
      <p>Email: {email}</p>
    </div>
  );
}
```

위 예제에서는 `name`과 `email`이라는 두 개의 상태 변수를 관리하고 있으며, 각 입력 필드의 값이 변경될 때마다 해당 상태가 업데이트됩니다.

##### 3) 객체 상태 관리

상태가 객체일 경우, `useState`를 사용하여 객체 전체를 관리할 수 있습니다. 상태를 갱신할 때는 객체의 불변성을 유지하기 위해 스프레드 연산자(`...`)를 사용하여 이전 상태를 복사한 후 변경된 부분만 갱신합니다.

```jsx
import React, { useState } from 'react';

function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    age: 0,
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Name"
        value={profile.name}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Age"
        value={profile.age}
        onChange={(e) => setProfile({ ...profile, age: e.target.value })}
      />
      <p>Name: {profile.name}</p>
      <p>Age: {profile.age}</p>
    </div>
  );
}
```

이 예제에서 `profile` 객체는 `name`과 `age` 속성을 포함하며, 입력 필드의 값이 변경될 때마다 객체의 해당 속성만 업데이트됩니다.

#### 3. `useEffect` 훅

`useEffect`는 함수형 컴포넌트에서 사이드 이펙트(예: 데이터 가져오기, 구독 설정, 타이머 설정)를 처리하기 위해 사용하는 훅입니다. 클래스형 컴포넌트의 `componentDidMount`, `componentDidUpdate`, `componentWillUnmount` 메서드를 대체합니다.

##### 1) `useEffect`의 기본 사용법

```jsx
import React, { useState, useEffect } from 'react';

function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);

    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 해제
  }, []); // 빈 배열은 컴포넌트가 처음 마운트될 때만 효과를 실행

  return <p>Timer: {count}</p>;
}
```

위 예제에서 `useEffect`는 컴포넌트가 처음 마운트될 때 타이머를 설정하고, 컴포넌트가 언마운트될 때 타이머를 해제합니다. 빈 배열(`[]`)을 의존성 배열로 전달하여 컴포넌트가 처음 렌더링될 때만 효과가 실행되도록 합니다.

##### 2) 의존성 배열

`useEffect` 훅의 두 번째 인수로 의존성 배열을 전달할 수 있습니다. 이 배열에 포함된 값이 변경될 때마다 `useEffect`가 실행됩니다.

```jsx
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`https://api.example.com/users/${userId}`)
      .then((response) => response.json())
      .then((data) => setUser(data));
  }, [userId]); // userId가 변경될 때마다 API 호출

  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}
```

위 예제에서 `userId`가 변경될 때마다 `useEffect`가 실행되어 새로운 사용자 데이터를 가져옵니다. 이 방법은 특정 상태나 prop이 변경될 때만 효과를 실행하고 싶을 때 유용합니다.

##### 3) 정리(cleanup) 작업

`useEffect`는 컴포넌트가 언마운트되거나 업데이트되기 전에 정리 작업을 수행할 수 있도록 하는 함수를 반환할 수 있습니다. 이는 타이머 해제, 구독 해제 등과 같은 작업에 유용합니다.

```jsx
import React, { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connectToRoom = (id) => {
      console.log(`Connected to room ${id}`);
    };

    connectToRoom(roomId);

    return () => {
      console.log(`Disconnected from room ${roomId}`);
    };
  }, [roomId]); // roomId가 변경될 때마다 구독 설정 및 해제

  return <p>Chat room {roomId}</p>;
}
```

이 예제에서 `useEffect`는 `roomId`가 변경될 때마다 채팅방에 연결하고, 이전 채팅방에서 연결을 해제합니다.

#### 4. 기타 주요 훅

리액트는 `useState`와 `useEffect` 외에도 다양한 훅을 제공합니다. 이들 훅은 특정 작업을 간편하게 수행할 수 있도록 도와줍니다.

##### 1) `useContext`

`useContext` 훅은 리액트의 컨텍스트(Context) API를 간편하게 사용할 수 있도록 해줍니다. 컨텍스트는 컴포넌트 트리에서 전역적으로 데이터를 공유할 때 유용합니다.

```jsx
import React, { useContext } from 'react';

const ThemeContext = React.createContext('light');

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button style={{ backgroundColor: theme === 'dark' ? '#333' : '#FFF

' }}>Theme: {theme}</button>;
}

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedButton />
    </ThemeContext.Provider>
  );
}
```

위 예제에서 `useContext` 훅을 사용하여 `ThemeContext`의 현재 값을 가져오고, 이를 기반으로 버튼의 배경색을 설정합니다.

##### 2) `useRef`

`useRef` 훅은 DOM 요소나 클래스 인스턴스와 같은 값을 참조할 수 있도록 해줍니다. `useRef`로 생성한 객체는 컴포넌트의 전체 생명주기 동안 유지됩니다.

```jsx
import React, { useRef } from 'react';

function FocusInput() {
  const inputRef = useRef(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus the input</button>
    </div>
  );
}
```

이 예제에서 `useRef` 훅을 사용하여 `input` 요소를 참조하고, 버튼 클릭 시 `input` 요소에 포커스를 맞춥니다.

##### 3) `useReducer`

`useReducer` 훅은 상태 관리 로직이 복잡할 때 `useState`의 대안으로 사용할 수 있는 훅입니다. 이 훅은 리듀서(reducer) 함수와 초기 상태를 받아 상태와 디스패치(dispatch) 함수를 반환합니다.

```jsx
import React, { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
}
```

이 예제에서 `useReducer` 훅을 사용하여 카운터의 상태를 관리하며, `dispatch` 함수를 통해 상태를 업데이트합니다.

##### 4) `useMemo`와 `useCallback`

`useMemo`와 `useCallback` 훅은 리액트 컴포넌트의 성능 최적화를 위해 사용됩니다. 이들 훅은 계산 비용이 높은 연산을 메모이제이션(memoization)하여 불필요한 재계산을 방지하거나, 함수의 참조를 유지하여 불필요한 리렌더링을 방지합니다.

- **`useMemo`**: 값을 메모이제이션하여 불필요한 연산을 방지
- **`useCallback`**: 함수를 메모이제이션하여 불필요한 함수 재생성을 방지

```jsx
import React, { useState, useMemo, useCallback } from 'react';

function ExpensiveCalculation({ num }) {
  const compute = useMemo(() => {
    console.log('Calculating...');
    return num * 2;
  }, [num]);

  return <p>Result: {compute}</p>;
}

function Counter() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
  }, []);

  return (
    <div>
      <ExpensiveCalculation num={count} />
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

위 예제에서 `useMemo`는 `num * 2` 계산을 메모이제이션하여 `num`이 변경될 때만 연산을 수행하고, `useCallback`은 `increment` 함수가 `count`가 변경되지 않는 한 동일한 함수 참조를 유지하도록 합니다.

#### 5. 커스텀 훅 (Custom Hooks)

리액트 훅을 사용하다 보면, 여러 컴포넌트에서 동일한 로직을 반복적으로 사용하는 경우가 발생할 수 있습니다. 이때 **커스텀 훅**을 만들어 공통 로직을 추출하여 재사용할 수 있습니다. 커스텀 훅은 `use`라는 접두사를 붙인 함수로 정의합니다.

##### 1) 커스텀 훅의 예제

```jsx
import React, { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, [url]);

  return { data, loading };
}

function DataFetchingComponent() {
  const { data, loading } = useFetch('https://api.example.com/data');

  if (loading) {
    return <p>Loading...</p>;
  }

  return <div>Data: {JSON.stringify(data)}</div>;
}
```

이 예제에서 `useFetch`라는 커스텀 훅을 만들어 데이터를 가져오는 로직을 분리하고, 이를 `DataFetchingComponent`에서 재사용하고 있습니다.

##### 2) 커스텀 훅의 장점

- **재사용성**: 여러 컴포넌트에서 동일한 로직을 재사용할 수 있습니다.
- **코드 간결화**: 복잡한 로직을 훅으로 분리하여 컴포넌트를 간결하게 유지할 수 있습니다.
- **유지보수성 향상**: 로직을 한 곳에서 관리할 수 있어 코드의 유지보수성이 향상됩니다.

#### 6. 훅의 규칙

리액트 훅을 사용할 때는 다음과 같은 규칙을 따라야 합니다:

1. **훅은 최상위에서만 호출해야 합니다.**: 훅을 조건문이나 반복문 안에서 호출해서는 안 됩니다. 훅은 컴포넌트의 최상위 수준에서만 호출해야 하며, 이로 인해 훅이 호출되는 순서가 유지됩니다.

2. **훅은 리액트 함수 컴포넌트나 커스텀 훅에서만 호출해야 합니다.**: 훅은 리액트 함수 컴포넌트 또는 커스텀 훅 내에서만 호출할 수 있습니다. 일반적인 자바스크립트 함수에서는 호출할 수 없습니다.

#### 7. 훅과 클래스형 컴포넌트의 비교

리액트 훅은 클래스형 컴포넌트에서 제공하는 기능을 함수형 컴포넌트에서도 사용할 수 있도록 해줍니다. 다음은 훅과 클래스형 컴포넌트의 비교입니다:

- **가독성**: 훅을 사용하면 함수형 컴포넌트를 간결하게 유지할 수 있으며, 코드의 가독성이 향상됩니다.
- **상태 관리**: `useState` 훅을 사용하면 여러 개의 상태를 간단하게 관리할 수 있으며, 상태 업데이트 로직을 컴포넌트 내부에서 쉽게 작성할 수 있습니다.
- **생명주기 관리**: `useEffect` 훅을 사용하여 생명주기 메서드를 대체할 수 있으며, 이를 통해 사이드 이펙트를 처리하는 로직을 간단하게 작성할 수 있습니다.
- **성능**: `useMemo`, `useCallback` 훅을 사용하여 컴포넌트의 성능을 최적화할 수 있습니다.

클래스형 컴포넌트는 여전히 유용할 수 있지만, 리액트 훅을 사용하면 함수형 컴포넌트에서도 동일한 기능을 구현할 수 있습니다. 따라서 대부분의 새로운 리액트 프로젝트에서는 함수형 컴포넌트와 훅을 사용하는 것이 일반적입니다.

### 12단계 정리

리액트 훅은 함수형 컴포넌트에서 상태와 생명주기 관리를 간단하게 구현할 수 있게 해주는 강력한 기능입니다. `useState`, `useEffect`, `useContext`, `useRef`, `useReducer`, `useMemo`, `useCallback` 등 다양한 훅을 사용하여 상태 관리, 사이드 이펙트 처리, 컨텍스트 사용, 성능 최적화, Ref 관리 등을 할 수 있습니다. 또한, 커스텀 훅을 만들어 여러 컴포넌트에서 공통 로직을 재사용할 수 있습니다.

리액트 훅을 잘 활용하면 코드의 가독성과 유지보수성이 향상되며, 복잡한 기능도 간결하게 구현할 수 있습니다. 이제 리액트 훅을 사용해 다양한 기능을 구현해 보세요. 실습을 통해 훅의 사용법과 장점을 직접 경험하는 것이 중요합니다. 추가적인 질문이나 도움이 필요하다면 언제든지 알려주세요!