13단계에서는 **리덕스(Redux)**를 활용한 상태 관리(State Management)에 대해 자세히 알아보겠습니다. 리덕스는 리액트 애플리케이션의 상태를 보다 체계적으로 관리하고, 예측 가능한 방식으로 상태를 업데이트할 수 있도록 해주는 상태 관리 라이브러리입니다. 리덕스는 리액트와 함께 사용되지만, 리액트에 종속적이지 않으며, 다른 자바스크립트 라이브러리와도 함께 사용할 수 있습니다.

### 13단계: 리덕스를 사용한 상태 관리

#### 1. 리덕스란?

**리덕스(Redux)**는 애플리케이션의 상태를 전역적으로 관리하기 위한 라이브러리입니다. 리덕스의 주요 목표는 애플리케이션 상태의 일관성을 유지하고, 상태 업데이트 로직을 예측 가능하게 만드는 것입니다. 리덕스는 단일 상태 트리(Single State Tree)를 사용하며, 상태를 변경하는 유일한 방법은 액션(Action)을 디스패치(dispatch)하는 것입니다.

리덕스는 다음과 같은 세 가지 핵심 원칙을 따릅니다:

1. **단일 진실의 출처(Single Source of Truth)**: 애플리케이션 전체의 상태는 하나의 객체 트리 형태로 중앙 저장소(Store)에 저장됩니다.
2. **상태는 읽기 전용(Read-Only)**: 상태는 직접 수정할 수 없으며, 상태를 변경하려면 액션을 통해서만 가능합니다.
3. **순수 함수로만 상태를 변경(Pure Functions Only)**: 리듀서(Reducer)는 순수 함수여야 하며, 같은 입력에 대해 항상 같은 출력을 반환해야 합니다.

#### 2. 리덕스의 기본 개념

리덕스를 이해하기 위해서는 다음과 같은 핵심 개념들을 알아야 합니다:

- **스토어(Store)**: 애플리케이션의 상태를 저장하는 객체입니다. 스토어는 상태를 관리하고, 액션을 디스패치하며, 리듀서를 통해 상태를 업데이트합니다.
- **액션(Action)**: 상태를 변경하는 유일한 방법입니다. 액션은 `type` 필드와 선택적으로 추가 데이터를 포함하는 객체입니다.
- **리듀서(Reducer)**: 액션이 디스패치될 때 상태를 변경하는 순수 함수입니다. 현재 상태와 액션을 받아서 새로운 상태를 반환합니다.
- **디스패치(Dispatch)**: 액션을 스토어로 보내는 함수입니다. 디스패치된 액션은 리듀서에 의해 처리되어 상태가 변경됩니다.
- **구독(Subscription)**: 스토어의 상태가 변경될 때마다 특정 함수를 실행하도록 설정할 수 있습니다.

#### 3. 리덕스 설치 및 기본 설정

리덕스를 사용하기 위해서는 `redux` 패키지와 리액트와의 연결을 위해 `react-redux` 패키지를 설치해야 합니다.

```bash
npm install redux react-redux
```

##### 1) 스토어 생성하기

리덕스 스토어는 `createStore` 함수를 사용하여 생성할 수 있습니다. 스토어를 생성하기 위해서는 리듀서가 필요합니다.

```jsx
import { createStore } from 'redux';

// 초기 상태 정의
const initialState = {
  count: 0,
};

// 리듀서 정의
function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

// 스토어 생성
const store = createStore(counterReducer);
```

위 예제에서 `counterReducer`는 상태를 관리하는 리듀서이며, `createStore` 함수는 이 리듀서를 기반으로 스토어를 생성합니다.

##### 2) 리액트와 리덕스 연결하기

리액트 애플리케이션과 리덕스를 연결하기 위해서는 `Provider` 컴포넌트를 사용해야 합니다. `Provider`는 리액트 컴포넌트 트리 전체에서 리덕스 스토어에 접근할 수 있도록 해줍니다.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './store'; // 스토어를 외부 파일에서 가져옴

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

위 예제에서 `Provider` 컴포넌트는 `store`를 받아 리액트 컴포넌트 트리 전체에 전달합니다.

#### 4. 액션(Action)과 디스패치(Dispatch)

액션은 상태를 변경하기 위한 정보를 담고 있는 객체입니다. 액션 객체는 반드시 `type`이라는 속성을 가져야 하며, 상태 변경에 필요한 추가 데이터를 포함할 수 있습니다. 액션을 디스패치하면 리듀서가 호출되어 상태가 변경됩니다.

##### 1) 액션 생성하기

액션은 일반적으로 액션 생성자(Action Creator) 함수를 통해 생성됩니다.

```jsx
// 액션 생성자 함수 정의
function increment() {
  return {
    type: 'INCREMENT',
  };
}

function decrement() {
  return {
    type: 'DECREMENT',
  };
}
```

액션 생성자는 특정 액션 객체를 반환하는 함수입니다.

##### 2) 디스패치하기

액션을 디스패치하여 상태를 변경할 수 있습니다. 리액트 컴포넌트에서 `useDispatch` 훅을 사용하여 디스패치 함수를 가져올 수 있습니다.

```jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { increment, decrement } from './actions'; // 액션 생성자 가져오기

function Counter() {
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
    </div>
  );
}

export default Counter;
```

이 예제에서 `useDispatch` 훅을 사용하여 `dispatch` 함수를 가져오고, 버튼 클릭 시 `increment`와 `decrement` 액션을 디스패치하여 상태를 변경합니다.

#### 5. 리듀서(Reducer)

리듀서는 현재 상태와 액션을 받아 새로운 상태를 반환하는 순수 함수입니다. 리듀서는 상태를 직접 수정하지 않고, 새로운 상태 객체를 반환해야 합니다.

##### 1) 리듀서 정의하기

리듀서는 상태 변경 로직을 캡슐화하여 특정 액션이 디스패치될 때 상태를 변경합니다.

```jsx
// 초기 상태 정의
const initialState = {
  count: 0,
};

// 리듀서 정의
function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}
```

이 예제에서 `counterReducer`는 `INCREMENT`와 `DECREMENT` 액션에 따라 상태를 업데이트합니다.

##### 2) 복수의 리듀서 결합하기

애플리케이션이 커지면 여러 개의 리듀서를 사용하여 상태를 관리하는 것이 좋습니다. `combineReducers` 함수를 사용하여 여러 리듀서를 하나로 결합할 수 있습니다.

```jsx
import { combineReducers } from 'redux';

// 각기 다른 상태를 관리하는 리듀서 정의
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function userReducer(state = { name: '' }, action) {
  switch (action.type) {
    case 'SET_NAME':
      return { name: action.payload };
    default:
      return state;
  }
}

// 리듀서 결합
const rootReducer = combineReducers({
  counter: counterReducer,
  user: userReducer,
});

export default rootReducer;
```

이 예제에서 `counterReducer`와 `userReducer`는 각각 `counter`와 `user` 상태를 관리하며, `combineReducers` 함수를 통해 결합되어 `rootReducer`로 사용됩니다.

#### 6. 리액트 컴포넌트와 스토어 연결하기

리액트 컴포넌트에서 리덕스 스토어의 상태를 읽고, 상태 변경에 반응하려면 `useSelector` 훅을 사용하여 스토어에 접근할 수 있습니다.

##### 1) 상태 읽기

`useSelector` 훅을 사용하여 리덕스 스토어의 특정 상태를 읽을 수 있습니다.

```jsx
import React from 'react';
import { useSelector } from 'react-redux';

function CounterDisplay() {
  const count = useSelector((state) => state.counter.count);

  return <p>Count: {count}</p>;
}

export default CounterDisplay;
``

`

이 예제에서 `useSelector` 훅을 사용하여 `counter` 상태의 `count` 값을 가져오고, 이를 컴포넌트에서 표시합니다.

##### 2) 상태 변경하기

앞서 설명한 `useDispatch` 훅을 사용하여 상태를 변경할 수 있습니다. 상태를 읽고 변경하는 기능을 하나의 컴포넌트에 결합할 수 있습니다.

```jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from './actions';

function Counter() {
  const count = useSelector((state) => state.counter.count);
  const dispatch = useDispatch();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
    </div>
  );
}

export default Counter;
```

이 예제에서 `Counter` 컴포넌트는 `count` 상태를 읽고, `+`와 `-` 버튼을 클릭할 때 상태를 변경합니다.

#### 7. 미들웨어(Middleware)와 비동기 작업

리덕스 미들웨어는 액션이 리듀서에 도달하기 전에 가로채서 처리할 수 있도록 해주는 함수입니다. 미들웨어는 로깅, 에러 보고, 비동기 작업 처리 등에 사용할 수 있습니다. 대표적인 리덕스 미들웨어로는 `redux-thunk`와 `redux-saga`가 있습니다.

##### 1) `redux-thunk` 설치 및 설정

`redux-thunk`는 비동기 액션을 처리하기 위해 널리 사용되는 미들웨어입니다. 이를 통해 액션 생성자가 액션 객체 대신 함수를 반환할 수 있게 됩니다.

```bash
npm install redux-thunk
```

스토어에 `redux-thunk` 미들웨어를 적용하려면 `applyMiddleware` 함수를 사용합니다.

```jsx
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
```

##### 2) 비동기 액션 생성자

`redux-thunk`를 사용하면 액션 생성자에서 비동기 작업을 수행할 수 있습니다. 예를 들어, API 요청을 수행하는 비동기 액션 생성자를 작성할 수 있습니다.

```jsx
import axios from 'axios';

export function fetchUser(userId) {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_USER_REQUEST' });

    try {
      const response = await axios.get(`/api/users/${userId}`);
      dispatch({ type: 'FETCH_USER_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_USER_FAILURE', error });
    }
  };
}
```

이 예제에서 `fetchUser` 액션 생성자는 비동기 API 호출을 수행하고, 요청이 시작되었을 때, 성공했을 때, 실패했을 때 각각 다른 액션을 디스패치합니다.

#### 8. 리덕스 개발자 도구

리덕스는 강력한 개발자 도구를 제공합니다. `redux-devtools-extension`을 사용하면 브라우저에서 리덕스 스토어의 상태를 쉽게 모니터링하고 디버깅할 수 있습니다.

##### 1) 설치 및 설정

`redux-devtools-extension`을 설치하고, 스토어 생성 시 설정을 추가합니다.

```bash
npm install redux-devtools-extension
```

```jsx
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';

const store = createStore(rootReducer, composeWithDevTools());

export default store;
```

이제 브라우저에서 리덕스 개발자 도구를 사용하여 상태를 모니터링하고, 액션이 디스패치될 때마다 상태가 어떻게 변경되는지 추적할 수 있습니다.

#### 9. 리덕스의 장점과 단점

리덕스는 리액트 애플리케이션에서 상태를 예측 가능하고 일관성 있게 관리할 수 있는 강력한 도구입니다. 하지만 리덕스를 도입할 때는 그 장점과 단점을 고려해야 합니다.

##### 장점

- **상태 관리의 일관성**: 리덕스는 상태 관리 로직을 중앙 집중화하여 애플리케이션의 상태가 예측 가능하게 합니다.
- **디버깅 용이성**: 액션 로그, 상태 스냅샷 등을 통해 상태 변경을 추적하고 디버깅할 수 있습니다.
- **확장성**: 리덕스는 대규모 애플리케이션에서도 상태를 체계적으로 관리할 수 있게 해줍니다.

##### 단점

- **보일러플레이트 코드**: 리덕스는 초기 설정과 상태 관리 코드가 다소 복잡할 수 있습니다.
- **학습 곡선**: 리덕스의 개념을 처음 배우는 개발자에게는 익숙해지기까지 시간이 걸릴 수 있습니다.
- **불필요한 복잡성**: 작은 애플리케이션에서는 리덕스가 오히려 불필요한 복잡성을 초래할 수 있습니다.

#### 10. 리덕스의 대안

리덕스는 매우 강력하지만, 모든 프로젝트에 적합한 것은 아닙니다. 리덕스의 대안으로는 `Context API`, `MobX`, `Recoil`, `zustand` 등이 있습니다. 이들 대안은 리덕스보다 간단하거나, 다른 방식으로 상태 관리를 제공합니다.

- **Context API**: 리액트 내장 기능으로, 작은 규모의 상태 공유에는 적합하지만, 대규모 상태 관리에는 한계가 있을 수 있습니다.
- **MobX**: 상태 변경을 반응형으로 처리하며, 리덕스보다 사용이 간단할 수 있습니다.
- **Recoil**: 리액트 팀에서 개발한 상태 관리 라이브러리로, 리덕스보다 자연스러운 리액트 사용 경험을 제공합니다.
- **zustand**: 간단하고 경량의 상태 관리 라이브러리로, 복잡성을 줄인 상태 관리에 적합합니다.

### 13단계 정리

리덕스는 리액트 애플리케이션에서 상태를 중앙에서 관리하고, 예측 가능하게 유지하는 데 매우 유용한 도구입니다. 리덕스의 핵심 개념인 스토어, 액션, 리듀서, 디스패치를 이해하고, 이를 통해 상태를 체계적으로 관리할 수 있습니다. 또한, 미들웨어를 사용하여 비동기 작업을 처리하고, 리덕스 개발자 도구를 통해 상태를 모니터링하며, 다양한 상태 관리 패턴을 익힐 수 있습니다.

리덕스를 사용해 복잡한 애플리케이션에서 상태를 관리해 보세요. 리덕스의 장점과 단점을 이해하고, 프로젝트의 요구사항에 맞게 적절한 상태 관리 도구를 선택하는 것이 중요합니다. 추가적인 질문이나 도움이 필요하다면 언제든지 알려주세요!