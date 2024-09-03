6단계에서는 리액트에서 중요한 두 가지 개념인 **Props**와 **State**에 대해 깊이 있게 살펴보겠습니다. 이 두 개념은 리액트 컴포넌트 간의 데이터 흐름과 컴포넌트 내부의 상태 관리를 담당하며, 리액트 애플리케이션의 동작을 이해하는 데 필수적입니다.

### 6단계: Props와 State

#### 1. Props (속성)

**Props**는 부모 컴포넌트가 자식 컴포넌트에 데이터를 전달할 때 사용하는 메커니즘입니다. Props는 읽기 전용이며, 자식 컴포넌트에서 수정할 수 없습니다. Props는 부모 컴포넌트가 자식 컴포넌트의 동작을 제어하거나 자식 컴포넌트에 필요한 데이터를 제공하는 역할을 합니다.

##### 1) Props의 기본 사용법

- **간단한 예시**: 부모 컴포넌트에서 자식 컴포넌트로 props를 전달하는 기본적인 방법을 알아보겠습니다.

  ```jsx
  function Welcome(props) {
    return <h1>Hello, {props.name}!</h1>;
  }

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

  위 예제에서 `Welcome` 컴포넌트는 `name`이라는 props를 받아 `Hello, {name}!`이라는 메시지를 표시합니다. 부모 컴포넌트인 `App` 컴포넌트는 `Welcome` 컴포넌트를 세 번 호출하면서 각각 다른 `name` 값을 전달합니다.

##### 2) Props의 특징

- **읽기 전용**: Props는 자식 컴포넌트 내에서 변경할 수 없습니다. 이를 통해 부모 컴포넌트가 자식 컴포넌트를 완전히 제어할 수 있습니다.
  
- **컴포넌트의 재사용성**: Props를 사용하면 하나의 컴포넌트를 다양한 데이터로 재사용할 수 있습니다. 예를 들어, `Welcome` 컴포넌트는 어떤 이름이든 받아서 동일한 구조로 메시지를 표시할 수 있습니다.

- **기본 값 설정**: 컴포넌트가 특정 props를 받지 못할 경우 기본 값을 설정할 수 있습니다. 이를 통해 컴포넌트가 항상 예상대로 동작하도록 보장할 수 있습니다.

  ```jsx
  function Welcome(props) {
    return <h1>Hello, {props.name}!</h1>;
  }

  Welcome.defaultProps = {
    name: 'Stranger'
  };
  ```

  이 예제에서는 `name` props가 전달되지 않으면, 기본 값으로 "Stranger"가 사용됩니다.

##### 3) Props 검증

리액트는 `PropTypes`를 사용하여 props의 타입을 검증할 수 있습니다. 이는 컴포넌트가 올바른 타입의 props를 받았는지 확인하는 데 도움이 됩니다.

```jsx
import PropTypes from 'prop-types';

function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

Welcome.propTypes = {
  name: PropTypes.string.isRequired,
};
```

위 예제에서 `Welcome` 컴포넌트는 `name` props가 반드시 문자열이어야 하며, 필수적으로 제공되어야 한다는 것을 명시하고 있습니다.

#### 2. State (상태)

**State**는 컴포넌트 내에서 관리되는 동적인 데이터입니다. State는 사용자의 입력이나 네트워크 응답과 같이 시간이 지남에 따라 변경될 수 있는 정보를 저장합니다. State가 변경되면 컴포넌트는 자동으로 다시 렌더링되어 UI가 업데이트됩니다.

##### 1) 클래스형 컴포넌트에서의 State 사용

클래스형 컴포넌트에서 State는 클래스의 `this.state` 객체로 관리됩니다. State를 변경할 때는 `setState` 메서드를 사용하여 상태를 갱신해야 합니다.

```jsx
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
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

이 예제에서 `Clock` 컴포넌트는 현재 시간을 `state`로 관리하며, `setState` 메서드를 통해 1초마다 시간을 갱신합니다. State가 변경될 때마다 `render` 메서드가 호출되어 UI가 업데이트됩니다.

##### 2) 함수형 컴포넌트에서의 State 사용 (useState 훅)

함수형 컴포넌트에서는 `useState` 훅을 사용하여 상태를 관리합니다. `useState`는 상태 변수와 해당 상태를 갱신하는 함수를 반환합니다.

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

위 예제에서 `Counter` 컴포넌트는 `count`라는 상태를 관리하며, 버튼을 클릭할 때마다 `setCount` 함수를 사용해 `count` 값을 증가시킵니다.

##### 3) State의 특징

- **비동기적 업데이트**: `setState`는 비동기적으로 상태를 업데이트합니다. 이는 리액트가 여러 상태 업데이트를 최적화하여 성능을 향상시키기 위한 것입니다.
  
- **초기 상태**: 클래스형 컴포넌트에서는 `constructor`에서 초기 상태를 설정하고, 함수형 컴포넌트에서는 `useState`의 인자로 초기 상태를 설정합니다.

- **부분적 업데이트**: `setState`는 상태 객체 전체를 업데이트하는 것이 아니라, 특정 부분만 업데이트합니다. 이는 클래스형 컴포넌트에서 매우 유용합니다.

  ```jsx
  this.setState({ age: 30 });
  ```

  이 코드는 `age` 값만 업데이트하며, `state` 객체의 다른 속성들은 그대로 유지됩니다.

#### 3. Props와 State의 차이점

- **제어 권한**: Props는 부모 컴포넌트가 자식 컴포넌트를 제어하는 데 사용되며, 자식 컴포넌트는 Props를 읽기만 할 수 있습니다. 반면, State는 컴포넌트 내부에서 관리되며, 컴포넌트 자신이 State를 갱신할 수 있습니다.

- **데이터 흐름**: Props는 부모에서 자식으로 데이터를 전달하는 반면, State는 컴포넌트 자체에서 관리되는 데이터입니다.

- **재사용성**: Props는 컴포넌트 재사용성을 높이는 데 중요한 역할을 합니다. 컴포넌트는 다양한 props를 받아 다양한 상황에 맞게 동작할 수 있습니다. 반면, State는 컴포넌트 내부의 고유한 상태를 관리하며, 컴포넌트의 내부 로직을 결정합니다.

#### 4. Props와 State의 사용 사례

- **Props 사용 사례**:
  - 컴포넌트가 고정된 데이터를 표시할 때 (예: `Welcome` 컴포넌트에서 `name`을 표시)
  - 부모 컴포넌트가 자식 컴포넌트에 데이터를 전달할 때
  - 자식 컴포넌트의 동작을 부모 컴포넌트에서 제어할 때

- **State 사용 사례**:
  - 컴포넌트가 사용자 입력, 타이머, 네트워크 요청 등의 결과로 변하는 데이터를 관리할 때
  - 컴포넌트가 내부적으로 데이터를 저장하고 업데이트해야 할 때
  - 특정 컴포넌트의 상태가 그 컴포넌트 내에서만 유지되어야 할 때

#### 5. Props와 State를 함께 사용하기

Props와 State는 리액트 애플리케이션에서 함께 사용되어 복잡한 UI를 구성하는 데 중요한 역할을 합니다. 예를 들어, 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하고, 자식 컴포넌트가 특정 이벤트에 따라 상태를 갱신할 수 있습니다.

```jsx
function Parent() {
  const [value, setValue] = useState('');

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Child value={value} onValueChange={handleChange} />
      <p>Current value: {value}</p>
    </div>
  );
}

function Child(props) {
  return (
    <

input
      type="text"
      value={props.value}
      onChange={(e) => props.onValueChange(e.target.value)}
    />
  );
}
```

이 예제에서 `Parent` 컴포넌트는 `value`라는 상태를 관리하며, `Child` 컴포넌트는 `props`를 통해 `value`를 받고, 사용자가 입력한 값을 부모 컴포넌트로 전달합니다. 이처럼 Props와 State를 조합하여 컴포넌트 간의 데이터를 관리하고 UI를 갱신할 수 있습니다.

### 6단계 정리

리액트의 Props와 State는 컴포넌트 간의 데이터 흐름과 상태 관리를 이해하는 데 핵심적인 개념입니다. Props는 컴포넌트 간 데이터를 전달하고 제어하는 데 사용되며, State는 컴포넌트 내부의 동적인 데이터를 관리하는 데 사용됩니다. 이 두 가지 개념을 잘 이해하고 활용하면, 복잡한 리액트 애플리케이션에서도 효과적으로 데이터와 상태를 관리할 수 있습니다.

이제 Props와 State를 활용하여 다양한 컴포넌트를 만들어보고, 컴포넌트 간의 데이터 흐름과 상태 관리를 직접 체험해 보세요. 추가적인 질문이나 심화 학습이 필요하다면 언제든지 알려주세요!