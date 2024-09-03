5단계에서는 리액트의 **컴포넌트(Component)**에 대해 자세히 알아보겠습니다. 컴포넌트는 리액트의 핵심 요소로, UI를 구성하는 기본 단위입니다. 이 단계에서는 컴포넌트의 종류, 작성 방법, 컴포넌트 간의 데이터 전달 방법 등을 깊이 있게 다루겠습니다.

### 5단계: 리액트 컴포넌트 이해하기

#### 1. 컴포넌트란 무엇인가?

리액트에서 컴포넌트는 UI의 재사용 가능한 조각입니다. 각 컴포넌트는 독립적이며, 다른 컴포넌트와 결합하여 복잡한 사용자 인터페이스를 구성할 수 있습니다. 리액트 애플리케이션은 이러한 컴포넌트들로 이루어져 있으며, 각 컴포넌트는 고유의 역할을 가집니다.

- **컴포넌트의 역할**: 컴포넌트는 특정 UI를 렌더링하는 함수 혹은 클래스입니다. 컴포넌트는 입력을 받아(보통 `props`를 통해) 화면에 출력할 UI를 반환합니다.

#### 2. 함수형 컴포넌트와 클래스형 컴포넌트

리액트에서는 컴포넌트를 작성하는 방법이 두 가지 있습니다: **함수형 컴포넌트**와 **클래스형 컴포넌트**입니다. 최근에는 함수형 컴포넌트가 더 많이 사용되며, 리액트 훅(Hooks)과 함께 활용됩니다.

##### 1) 함수형 컴포넌트 (Functional Component)

함수형 컴포넌트는 단순한 자바스크립트 함수로, `props`라는 인자를 받아 JSX를 반환합니다. 함수형 컴포넌트는 구조가 간단하며, 리액트 훅을 통해 상태 관리와 생명주기 기능을 사용할 수 있습니다.

- **특징**:
  - 간결하고 이해하기 쉽습니다.
  - 상태를 가지지 않는 컴포넌트나 간단한 컴포넌트를 작성할 때 적합합니다.
  - 리액트 훅을 사용하면 상태와 생명주기 메서드도 사용할 수 있습니다.

- **예시**:
  ```jsx
  function Welcome(props) {
    return <h1>Hello, {props.name}!</h1>;
  }
  ```

  위의 `Welcome` 컴포넌트는 `props.name`을 받아 `Hello, {name}!`이라는 메시지를 반환하는 간단한 함수형 컴포넌트입니다.

##### 2) 클래스형 컴포넌트 (Class Component)

클래스형 컴포넌트는 ES6 클래스 문법을 사용하여 정의됩니다. 클래스형 컴포넌트는 상태(state)를 가질 수 있으며, 다양한 생명주기 메서드를 사용할 수 있습니다. 하지만 함수형 컴포넌트와 리액트 훅의 등장 이후, 클래스형 컴포넌트는 새로운 코드베이스에서 점차 덜 사용되고 있습니다.

- **특징**:
  - 상태와 생명주기 메서드를 사용할 수 있습니다.
  - 더 복잡한 로직을 포함할 수 있지만, 함수형 컴포넌트와 비교하여 코드가 복잡해질 수 있습니다.

- **예시**:
  ```jsx
  class Welcome extends React.Component {
    render() {
      return <h1>Hello, {this.props.name}!</h1>;
    }
  }
  ```

  위의 `Welcome` 클래스형 컴포넌트는 `props`를 받아 JSX를 반환하며, 클래스 문법을 사용하고 있습니다.

#### 3. Props (속성)와 State (상태)

리액트 컴포넌트는 두 가지 중요한 개념을 통해 데이터를 관리하고 전달합니다: **Props**와 **State**입니다.

##### 1) Props (속성)

`Props`는 부모 컴포넌트가 자식 컴포넌트에 데이터를 전달할 때 사용됩니다. `Props`는 읽기 전용(read-only)이며, 자식 컴포넌트는 이 값을 수정할 수 없습니다. `Props`를 통해 부모 컴포넌트는 자식 컴포넌트의 동작을 제어할 수 있습니다.

- **Props 사용 방법**:
  ```jsx
  function Welcome(props) {
    return <h1>Hello, {props.name}!</h1>;
  }

  const element = <Welcome name="Sara" />;
  ```

  위 예시에서 `Welcome` 컴포넌트는 `name`이라는 `props`를 받아서 해당 값을 사용해 "Hello, {name}!" 메시지를 출력합니다. 부모 컴포넌트에서는 `name` 속성을 통해 자식 컴포넌트에 데이터를 전달합니다.

##### 2) State (상태)

`State`는 컴포넌트 내에서 관리되는 동적인 데이터입니다. `State`는 컴포넌트가 스스로 관리하는 데이터를 의미하며, 이 데이터는 사용자의 입력이나 네트워크 응답 등에 따라 변경될 수 있습니다. 상태가 변경되면 컴포넌트는 다시 렌더링되어 UI가 업데이트됩니다.

- **클래스형 컴포넌트에서의 State 사용**:
  ```jsx
  class Clock extends React.Component {
    constructor(props) {
      super(props);
      this.state = { date: new Date() };
    }

    render() {
      return (
        <div>
          <h1>Hello, world!</h1>
          <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
        </div>
      );
    }
  }
  ```

  이 예제에서 `Clock` 컴포넌트는 현재 시간을 `state`로 관리합니다. `this.state.date`가 갱신될 때마다 컴포넌트가 다시 렌더링되어 화면에 새로운 시간이 표시됩니다.

- **함수형 컴포넌트에서의 State 사용 (useState 훅)**:
  ```jsx
  import React, { useState } from 'react';

  function Counter() {
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

  함수형 컴포넌트에서는 `useState` 훅을 사용하여 상태를 관리합니다. `useState`는 현재 상태와 이 상태를 갱신하는 함수를 반환하며, 상태가 변경되면 컴포넌트가 다시 렌더링됩니다.

#### 4. 컴포넌트의 구조와 재사용성

컴포넌트는 독립적이고 재사용 가능한 구조를 가지고 있기 때문에, 다양한 상황에서 재사용할 수 있습니다. 이로 인해 코드의 중복이 줄어들고, 유지보수가 용이해집니다.

- **컴포넌트의 중첩**: 한 컴포넌트 내에서 다른 컴포넌트를 포함시킬 수 있습니다. 이렇게 하면 복잡한 UI를 보다 간결하고 이해하기 쉽게 구성할 수 있습니다.

  ```jsx
  function App() {
    return (
      <div>
        <Welcome name="Sara" />
        <Welcome name="Cahal" />
        <Welcome name="Edite" />
      </div>
    );
  }
  ```

  위의 예제에서 `App` 컴포넌트는 여러 개의 `Welcome` 컴포넌트를 포함하고 있으며, 각 `Welcome` 컴포넌트는 서로 다른 `name` 값을 받습니다.

- **컴포넌트의 재사용**: 컴포넌트를 여러 곳에서 재사용할 수 있습니다. 예를 들어, 동일한 `Button` 컴포넌트를 애플리케이션의 다양한 부분에서 사용할 수 있습니다.

  ```jsx
  function Button(props) {
    return <button>{props.label}</button>;
  }

  function App() {
    return (
      <div>
        <Button label="Save" />
        <Button label="Cancel" />
      </div>
    );
  }
  ```

  이 예제에서 `Button` 컴포넌트는 `label`이라는 `props`를 받아, 서로 다른 텍스트를 가진 버튼을 생성합니다.

#### 5. 컴포넌트의 라이프사이클

클래스형 컴포넌트는 컴포넌트의 생명주기(lifecycle) 동안 특정 시점에 실행되는 메서드를 정의할 수 있습니다. 이러한 메서드를 통해 컴포넌트가 생성, 업데이트, 제거될 때 특정 작업을 수행할 수 있습니다.

##### 1) 마운팅 (Mounting)

컴포넌트가 처음 DOM에 추가될 때 발생합니다. 이 과정에서 다음 메서드가 호출됩니다:

- `constructor()`: 컴포넌트가 생성될 때 호출되며, 초기 상태를 설정할 수 있습니다.
- `componentDidMount()`: 컴포넌트가 처음 렌더링된 후 호출됩니다. 이 메서드에서는 외부 데이터 가져오기, 타이머 설정 등의 작업을 수행할 수 있습니다.

##### 2) 업데이트 (Updating)

컴포넌트

의 `props`나 `state`가 변경될 때 발생합니다. 이 과정에서 다음 메서드가 호출될 수 있습니다:

- `componentDidUpdate(prevProps, prevState)`: 컴포넌트가 업데이트된 후 호출됩니다. 이 메서드에서는 업데이트된 `props`나 `state`를 기반으로 추가 작업을 수행할 수 있습니다.

##### 3) 언마운팅 (Unmounting)

컴포넌트가 DOM에서 제거될 때 발생합니다. 이 과정에서 다음 메서드가 호출됩니다:

- `componentWillUnmount()`: 컴포넌트가 DOM에서 제거되기 전에 호출됩니다. 이 메서드에서는 타이머 해제, 네트워크 요청 취소 등의 정리 작업을 수행할 수 있습니다.

##### 4) 함수형 컴포넌트에서의 생명주기 (useEffect 훅)

함수형 컴포넌트에서는 `useEffect` 훅을 사용하여 생명주기 메서드와 유사한 기능을 구현할 수 있습니다.

```jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 실행됨
    document.title = `You clicked ${count} times`;

    return () => {
      // 컴포넌트가 언마운트되거나 업데이트되기 전에 실행됨
    };
  }, [count]);  // count가 변경될 때마다 이 효과가 실행됨

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

위 예제에서 `useEffect` 훅은 컴포넌트가 렌더링될 때마다 실행되며, `count` 값이 변경될 때마다 다시 실행됩니다. 이 훅은 클래스형 컴포넌트에서의 `componentDidMount`, `componentDidUpdate`, `componentWillUnmount` 메서드를 모두 대체할 수 있습니다.

#### 6. 컴포넌트 간의 데이터 전달

리액트 컴포넌트 간에는 데이터를 `props`를 통해 전달할 수 있습니다. 부모 컴포넌트가 자식 컴포넌트에 데이터를 전달하며, 자식 컴포넌트는 전달받은 `props`를 사용해 UI를 구성합니다. 그러나 반대로, 자식에서 부모로 데이터를 전달할 때는 콜백 함수를 사용하는 패턴이 일반적입니다.

- **부모에서 자식으로 데이터 전달**:
  ```jsx
  function Parent() {
    const [message, setMessage] = useState("Hello from Parent");

    return (
      <div>
        <Child message={message} />
      </div>
    );
  }

  function Child(props) {
    return <p>{props.message}</p>;
  }
  ```

- **자식에서 부모로 데이터 전달**:
  ```jsx
  function Parent() {
    const [message, setMessage] = useState("");

    const handleMessageChange = (newMessage) => {
      setMessage(newMessage);
    };

    return (
      <div>
        <Child onMessageChange={handleMessageChange} />
        <p>{message}</p>
      </div>
    );
  }

  function Child(props) {
    const handleChange = (e) => {
      props.onMessageChange(e.target.value);
    };

    return <input type="text" onChange={handleChange} />;
  }
  ```

위 예제에서 `Child` 컴포넌트는 `onMessageChange`라는 콜백 함수를 통해 부모 컴포넌트로 데이터를 전달합니다.

### 5단계 정리

리액트의 컴포넌트 개념은 UI를 작은 조각으로 나누어 관리하고 재사용성을 높이는 데 매우 중요한 역할을 합니다. 함수형 컴포넌트와 클래스형 컴포넌트의 차이점, `props`와 `state`의 역할, 그리고 컴포넌트의 생명주기와 데이터 전달 방법을 이해하는 것이 리액트 개발의 기초를 다지는 데 필수적입니다.

이제 다양한 컴포넌트를 직접 작성해보고, 컴포넌트 간의 데이터를 주고받는 실습을 통해 이 개념들을 익혀 보세요. 이 과정에서 궁금한 점이나 추가로 알고 싶은 부분이 있다면 언제든지 질문해 주세요!