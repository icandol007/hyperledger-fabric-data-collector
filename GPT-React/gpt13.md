14단계에서는 리액트 애플리케이션에서 **컨텍스트(Context)**를 활용하여 상태를 관리하고 공유하는 방법을 자세히 알아보겠습니다. 컨텍스트는 리액트에서 컴포넌트 간에 데이터를 전역적으로 관리하고 공유할 수 있도록 도와주는 기능입니다. 특히, 중첩된 컴포넌트 구조에서 데이터를 쉽게 전달할 수 있어, 전역 상태 관리에 유용합니다.

### 14단계: 리액트 컨텍스트(Context) 사용하기

#### 1. 컨텍스트(Context)란?

**컨텍스트(Context)**는 리액트에서 데이터를 전역적으로 관리하고, 컴포넌트 트리의 여러 단계에 걸쳐 데이터를 전달할 수 있도록 해주는 기능입니다. 컨텍스트를 사용하면 데이터를 일일이 부모에서 자식으로 `props`를 통해 전달할 필요 없이, 필요한 컴포넌트에서 쉽게 접근할 수 있습니다.

컨텍스트는 다음과 같은 경우에 유용합니다:

- **전역 상태 관리**: 로그인 상태, 사용자 정보, 테마 설정 등 애플리케이션 전반에 걸쳐 사용되는 데이터를 관리할 때 유용합니다.
- **컴포넌트 간 데이터 공유**: 깊이 중첩된 컴포넌트에서 공통 데이터를 사용할 때 `props`를 통해 데이터를 계속 전달하는 것을 피할 수 있습니다.

#### 2. 컨텍스트 기본 개념

리액트에서 컨텍스트는 다음과 같은 세 가지 주요 단계로 사용됩니다:

1. **컨텍스트 생성**: `React.createContext()`를 사용하여 컨텍스트 객체를 생성합니다.
2. **컨텍스트 제공(Provider)**: `Context.Provider` 컴포넌트를 사용하여 데이터를 하위 컴포넌트에 제공(전달)합니다.
3. **컨텍스트 소비(Consumer)**: `Context.Consumer` 컴포넌트나 `useContext` 훅을 사용하여 하위 컴포넌트에서 데이터를 소비(읽기)합니다.

#### 3. 컨텍스트 생성 및 사용

컨텍스트를 사용하려면 먼저 컨텍스트 객체를 생성하고, `Provider`를 통해 데이터를 제공하며, `Consumer`를 통해 데이터를 소비하는 구조를 설정해야 합니다.

##### 1) 컨텍스트 생성하기

컨텍스트는 `React.createContext()`를 사용하여 생성합니다. 컨텍스트 생성 시 기본 값을 설정할 수 있습니다.

```jsx
import React from 'react';

// 컨텍스트 생성
const ThemeContext = React.createContext('light');
```

위 예제에서는 `ThemeContext`라는 컨텍스트를 생성했으며, 기본 값으로 `'light'`를 설정했습니다.

##### 2) 컨텍스트 제공하기 (Provider)

컨텍스트를 제공하려면 `Context.Provider` 컴포넌트를 사용합니다. `Provider`는 컨텍스트의 값을 하위 컴포넌트에 제공하며, `value` 속성을 통해 제공할 값을 설정할 수 있습니다.

```jsx
import React from 'react';
import ThemeContext from './ThemeContext';

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

export default App;
```

위 예제에서 `App` 컴포넌트는 `ThemeContext.Provider`를 사용하여 `'dark'` 테마를 하위 컴포넌트에 제공하고 있습니다. 이제 `Toolbar`와 그 하위 컴포넌트들은 이 테마 값을 소비할 수 있습니다.

##### 3) 컨텍스트 소비하기 (Consumer)

컨텍스트를 소비하는 방법은 `Context.Consumer` 컴포넌트나 `useContext` 훅을 사용하는 것입니다. `Consumer` 컴포넌트는 함수로서 컨텍스트 값을 전달받아 사용할 수 있습니다.

```jsx
import React from 'react';
import ThemeContext from './ThemeContext';

function ThemedButton() {
  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <button style={{ backgroundColor: theme === 'dark' ? '#333' : '#FFF' }}>
          Theme: {theme}
        </button>
      )}
    </ThemeContext.Consumer>
  );
}

export default ThemedButton;
```

이 예제에서 `ThemedButton` 컴포넌트는 `ThemeContext.Consumer`를 사용하여 현재 테마를 받아, 버튼의 배경색을 설정합니다. 이 방식은 함수형 컴포넌트와 클래스형 컴포넌트 모두에서 사용할 수 있습니다.

##### 4) `useContext` 훅을 사용한 컨텍스트 소비

함수형 컴포넌트에서 컨텍스트를 소비할 때는 `useContext` 훅을 사용하는 것이 더 간단하고 직관적입니다.

```jsx
import React, { useContext } from 'react';
import ThemeContext from './ThemeContext';

function ThemedButton() {
  const theme = useContext(ThemeContext);

  return (
    <button style={{ backgroundColor: theme === 'dark' ? '#333' : '#FFF' }}>
      Theme: {theme}
    </button>
  );
}

export default ThemedButton;
```

이 예제에서 `useContext` 훅을 사용하여 현재 테마 값을 받아오고, 이를 기반으로 버튼의 스타일을 설정합니다.

#### 4. 여러 개의 컨텍스트 사용하기

리액트 애플리케이션에서는 종종 여러 개의 컨텍스트를 동시에 사용해야 할 때가 있습니다. 여러 컨텍스트를 사용하려면 각각의 `Provider`를 중첩하여 사용하고, `Consumer` 또는 `useContext`를 통해 값을 소비할 수 있습니다.

##### 1) 여러 개의 컨텍스트 생성 및 제공

```jsx
import React from 'react';

// 두 개의 컨텍스트 생성
const ThemeContext = React.createContext('light');
const UserContext = React.createContext({ name: 'Guest' });

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <UserContext.Provider value={{ name: 'John Doe' }}>
        <Layout />
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

function Layout() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

export default App;
```

이 예제에서 `App` 컴포넌트는 `ThemeContext`와 `UserContext` 두 개의 컨텍스트를 제공합니다. `Layout` 컴포넌트와 그 하위 컴포넌트들은 이 두 컨텍스트에 접근할 수 있습니다.

##### 2) 여러 컨텍스트 소비하기

여러 개의 컨텍스트를 동시에 소비하려면, `useContext` 훅을 각각 호출하거나, 중첩된 `Consumer`를 사용할 수 있습니다.

```jsx
import React, { useContext } from 'react';
import ThemeContext from './ThemeContext';
import UserContext from './UserContext';

function ThemedButton() {
  const theme = useContext(ThemeContext);
  const user = useContext(UserContext);

  return (
    <button style={{ backgroundColor: theme === 'dark' ? '#333' : '#FFF' }}>
      {user.name}'s Theme: {theme}
    </button>
  );
}

export default ThemedButton;
```

이 예제에서 `ThemedButton` 컴포넌트는 `ThemeContext`와 `UserContext`를 동시에 소비하여, 현재 테마와 사용자 이름을 기반으로 버튼을 렌더링합니다.

#### 5. 컨텍스트의 고급 사용법

컨텍스트는 기본적인 전역 상태 관리를 넘어 다양한 방식으로 활용될 수 있습니다. 여기서는 컨텍스트의 고급 사용법에 대해 알아보겠습니다.

##### 1) 컨텍스트 값 변경하기

`Provider`의 `value` 속성에 상태 값을 전달하면, 컴포넌트에서 이 값을 변경하여 동적으로 컨텍스트 값을 업데이트할 수 있습니다.

```jsx
import React, { useState } from 'react';
import ThemeContext from './ThemeContext';

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={theme}>
      <Toolbar />
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        Toggle Theme
      </button>
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

export default App;
```

이 예제에서 `App` 컴포넌트는 `theme` 상태를 관리하며, 버튼 클릭 시 테마를 토글합니다. `ThemedButton` 컴포넌트는 현재 테마에 따라 스타일이 변경됩니다.

##### 2) 컨텍스트를 사용한 성능 최적화

컨텍스트를 사용할 때는 성능 최적화를 염두에 두어야 합니다. `Provider`의 `value`가 변경될 때마다 해당 컨텍스트를 소비하는 모든 컴포넌트가 다시 렌더링되기 때문입니다.

이를 최적화하려면 `useMemo` 훅을 사용하여 `value` 객체가 불필요하게 다시 생성되지 않도록 할 수 있습니다.

```jsx
import React, { useState, useMemo } from 'react';
import ThemeContext from './ThemeContext';

function App() {
  const [theme, set

Theme] = useState('light');

  // useMemo를 사용하여 value 객체가 불필요하게 다시 생성되지 않도록 최적화
  const value = useMemo(() => ({ theme, toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark') }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

export default App;
```

이 예제에서 `useMemo`를 사용하여 `value` 객체가 `theme`이 변경될 때만 새로 생성되도록 최적화했습니다.

##### 3) 커스텀 컨텍스트 훅

컨텍스트를 보다 간편하게 사용하기 위해 커스텀 훅을 만들어 사용할 수 있습니다. 이렇게 하면 컨텍스트 사용 로직을 재사용할 수 있고, 코드가 더 간결해집니다.

```jsx
import React, { useContext, useState } from 'react';
import ThemeContext from './ThemeContext';

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

function ThemedButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button style={{ backgroundColor: theme === 'dark' ? '#333' : '#FFF' }} onClick={toggleTheme}>
      Theme: {theme}
    </button>
  );
}

function App() {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

export default App;
```

이 예제에서 `useTheme`이라는 커스텀 훅을 만들어 `ThemeContext`를 보다 간편하게 사용할 수 있도록 했습니다. 이 훅은 컨텍스트 값을 쉽게 접근할 수 있게 해주며, `ThemeContext.Provider` 내부에서만 사용할 수 있도록 제한합니다.

#### 6. 컨텍스트와 상태 관리 라이브러리 비교

리액트의 컨텍스트는 전역 상태 관리에 매우 유용하지만, 복잡한 상태 관리에서는 리덕스(Redux)와 같은 상태 관리 라이브러리를 사용할 때 더 나은 선택이 될 수 있습니다.

- **컨텍스트**:
  - 간단한 전역 상태 관리에 적합합니다.
  - 비교적 사용이 간편하며, 리액트의 내장 기능입니다.
  - 상태의 불변성 관리가 어렵고, 상태 변경 로직이 복잡해질 수 있습니다.
  - 성능 최적화가 필요한 경우 사용 시 주의가 필요합니다.

- **리덕스**:
  - 복잡한 애플리케이션의 상태 관리에 적합합니다.
  - 상태 변경 로직이 명확하고, 상태의 불변성을 보장합니다.
  - 미들웨어를 통해 비동기 작업과 같은 복잡한 로직을 처리할 수 있습니다.
  - 설정이 복잡할 수 있으며, 초기 학습 곡선이 있을 수 있습니다.

### 14단계 정리

리액트 컨텍스트는 컴포넌트 간에 데이터를 전역적으로 관리하고 공유하는 데 매우 유용한 도구입니다. 컨텍스트를 사용하면 깊이 중첩된 컴포넌트 구조에서도 간편하게 데이터를 전달하고 소비할 수 있습니다. 컨텍스트의 기본 개념과 사용법을 이해하고, 여러 컨텍스트를 사용하는 방법, 성능 최적화, 커스텀 훅 등을 통해 컨텍스트를 효과적으로 사용할 수 있습니다.

리액트 컨텍스트는 간단한 상태 관리에는 훌륭하지만, 복잡한 애플리케이션에서는 리덕스와 같은 전역 상태 관리 라이브러리와 함께 사용하는 것이 좋습니다. 컨텍스트를 활용해 다양한 전역 상태를 관리해보고, 실습을 통해 경험을 쌓아보세요. 추가적인 질문이나 도움이 필요하다면 언제든지 알려주세요!