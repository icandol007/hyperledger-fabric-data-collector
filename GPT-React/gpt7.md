8단계에서는 **조건부 렌더링(Conditional Rendering)**에 대해 자세히 알아보겠습니다. 조건부 렌더링은 특정 조건에 따라 리액트 컴포넌트의 출력 결과를 다르게 표현하는 기법입니다. 웹 애플리케이션에서는 사용자 상태(로그인 여부, 권한 등)에 따라 UI를 다르게 보여주거나, 데이터가 존재하는지 여부에 따라 컴포넌트를 표시할지 말지를 결정하는 등의 상황에서 조건부 렌더링이 자주 사용됩니다.

### 8단계: 조건부 렌더링

#### 1. 조건부 렌더링이란?

조건부 렌더링은 자바스크립트의 조건문을 사용해 특정 조건에 따라 리액트 컴포넌트의 일부를 렌더링할지 말지를 결정하는 방법입니다. 리액트에서는 조건부 렌더링을 통해 복잡한 UI를 간결하고 효율적으로 관리할 수 있습니다.

리액트에서 조건부 렌더링을 구현하는 방법에는 여러 가지가 있습니다. 가장 많이 사용되는 방법은 다음과 같습니다:

1. **if 문을 사용한 조건부 렌더링**
2. **삼항 연산자(ternary operator)를 사용한 조건부 렌더링**
3. **&& 연산자를 사용한 조건부 렌더링**
4. **switch 문을 사용한 조건부 렌더링**
5. **즉시 실행 함수 표현식(IIFE)을 사용한 조건부 렌더링**

#### 2. if 문을 사용한 조건부 렌더링

가장 기본적인 조건부 렌더링 방법은 자바스크립트의 `if` 문을 사용하는 것입니다. `if` 문을 사용하면 특정 조건이 참일 때만 특정 컴포넌트를 렌더링할 수 있습니다.

```jsx
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  } else {
    return <h1>Please sign up.</h1>;
  }
}
```

위 예제에서 `isLoggedIn`이 `true`일 경우 "Welcome back!" 메시지가, `false`일 경우 "Please sign up." 메시지가 렌더링됩니다.

**이 방법의 장점**:
- 가독성이 좋고, 명확한 조건을 처리할 때 적합합니다.

**이 방법의 단점**:
- 간단한 조건부 렌더링에는 적합하지만, 복잡한 조건부 로직을 처리할 때는 코드가 길어지고 복잡해질 수 있습니다.

#### 3. 삼항 연산자를 사용한 조건부 렌더링

삼항 연산자(ternary operator)를 사용하면 더 간결하게 조건부 렌더링을 구현할 수 있습니다. 삼항 연산자는 자바스크립트의 표현식으로, 조건이 참일 때와 거짓일 때 각각 다른 값을 반환합니다.

```jsx
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  return (
    <div>
      {isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please sign up.</h1>}
    </div>
  );
}
```

위 예제에서 `isLoggedIn`이 `true`일 경우 "Welcome back!" 메시지가, `false`일 경우 "Please sign up." 메시지가 삼항 연산자를 통해 렌더링됩니다.

**이 방법의 장점**:
- 코드가 간결하고, 간단한 조건부 렌더링에 매우 적합합니다.

**이 방법의 단점**:
- 조건이 복잡해지면 가독성이 떨어질 수 있습니다.

#### 4. && 연산자를 사용한 조건부 렌더링

&& 연산자는 조건이 참일 때만 특정 컴포넌트를 렌더링하는 데 사용됩니다. 자바스크립트의 논리 연산자인 &&는 왼쪽 조건이 `true`일 때만 오른쪽 표현식을 평가합니다.

```jsx
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>You have {unreadMessages.length} unread messages.</h2>
      }
    </div>
  );
}
```

위 예제에서 `unreadMessages.length > 0`이 참일 때만 "You have {unreadMessages.length} unread messages." 메시지가 렌더링됩니다.

**이 방법의 장점**:
- 특정 조건에서만 컴포넌트를 렌더링하는 경우에 매우 유용하며, 코드가 간결합니다.

**이 방법의 단점**:
- 조건이 거짓일 때 아무것도 렌더링하지 않는 경우에만 사용할 수 있습니다.

#### 5. switch 문을 사용한 조건부 렌더링

`swtich` 문은 여러 조건을 처리해야 할 때 유용합니다. 각 조건에 따라 다른 컴포넌트를 렌더링할 수 있습니다.

```jsx
function StatusMessage(props) {
  const status = props.status;

  switch (status) {
    case 'success':
      return <h1>Success!</h1>;
    case 'error':
      return <h1>Error occurred!</h1>;
    case 'loading':
      return <h1>Loading...</h1>;
    default:
      return null;
  }
}
```

위 예제에서 `status` 값에 따라 "Success!", "Error occurred!", "Loading..." 중 하나가 렌더링됩니다.

**이 방법의 장점**:
- 여러 가지 조건을 명확하게 처리할 수 있습니다.

**이 방법의 단점**:
- 간단한 조건부 렌더링에는 적합하지 않으며, 코드가 길어질 수 있습니다.

#### 6. 즉시 실행 함수 표현식(IIFE)을 사용한 조건부 렌더링

즉시 실행 함수 표현식(IIFE)은 복잡한 조건부 렌더링을 처리할 때 유용합니다. 이를 통해 리턴문 안에서 복잡한 논리를 처리할 수 있습니다.

```jsx
function ComplexComponent(props) {
  return (
    <div>
      {
        (() => {
          if (props.isLoggedIn) {
            return <h1>Welcome back!</h1>;
          } else if (props.hasAccount) {
            return <h1>Please log in.</h1>;
          } else {
            return <h1>Please sign up.</h1>;
          }
        })()
      }
    </div>
  );
}
```

위 예제에서 IIFE를 사용하여 복잡한 조건부 로직을 리턴문 안에서 처리하고 있습니다.

**이 방법의 장점**:
- 복잡한 조건부 로직을 명확하게 처리할 수 있습니다.

**이 방법의 단점**:
- 코드가 복잡해질 수 있으며, IIFE 사용에 익숙하지 않은 개발자에게는 가독성이 떨어질 수 있습니다.

#### 7. 조건부 렌더링의 복잡성 관리

조건부 렌더링이 복잡해지면 코드를 잘 구조화하는 것이 중요합니다. 다음은 조건부 렌더링의 복잡성을 관리하기 위한 몇 가지 방법입니다:

##### 1) 컴포넌트 분리

복잡한 조건부 렌더링을 단일 컴포넌트에 모두 포함시키면 가독성이 떨어질 수 있습니다. 이 경우, 조건별로 작은 컴포넌트로 분리하는 것이 좋습니다.

```jsx
function WelcomeMessage(props) {
  if (props.isLoggedIn) {
    return <h1>Welcome back!</h1>;
  } else if (props.hasAccount) {
    return <h1>Please log in.</h1>;
  } else {
    return <h1>Please sign up.</h1>;
  }
}

function ComplexComponent(props) {
  return (
    <div>
      <WelcomeMessage
        isLoggedIn={props.isLoggedIn}
        hasAccount={props.hasAccount}
      />
    </div>
  );
}
```

이 예제에서는 `WelcomeMessage` 컴포넌트를 별도로 분리하여 조건부 로직을 처리하고 있습니다.

##### 2) Helper 함수 사용

복잡한 조건을 처리해야 할 때는 헬퍼 함수를 사용하여 조건부 렌더링 로직을 컴포넌트 코드에서 분리할 수 있습니다.

```jsx
function getWelcomeMessage(isLoggedIn, hasAccount) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  } else if (hasAccount) {
    return <h1>Please log in.</h1>;
  } else {
    return <h1>Please sign up.</h1>;
  }
}

function ComplexComponent(props) {
  return (
    <div>
      {getWelcomeMessage(props.isLoggedIn, props.hasAccount)}
    </div>
  );
}
```

이 예제에서는 조건부 로직을 `getWelcomeMessage` 헬퍼 함수로 분리하여, 컴포넌트 코드가 간결해졌습니다.

##### 3) Null 반환

조건에 따라 아무것도 렌더링하지 않아야 할 경우, `null`을 반환하여 컴포넌트가 렌더링되지 않도록 할 수 있습니다.

```jsx


function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="warning">
      Warning!
    </div>
  );
}
```

이 예제에서 `props.warn`이 `false`일 경우, `WarningBanner` 컴포넌트는 아무것도 렌더링하지 않고 `null`을 반환합니다.

#### 8. 조건부 렌더링과 리액트의 성능

조건부 렌더링을 효율적으로 구현하면 리액트 애플리케이션의 성능을 최적화하는 데 도움이 됩니다. 리액트는 변경 사항이 발생할 때마다 컴포넌트를 다시 렌더링합니다. 불필요한 컴포넌트가 렌더링되지 않도록 조건부 렌더링을 통해 제어할 수 있습니다.

- **불필요한 렌더링 방지**: 특정 조건이 충족될 때만 컴포넌트를 렌더링함으로써, 불필요한 렌더링을 방지할 수 있습니다. 이는 특히 많은 양의 데이터를 처리하거나 복잡한 UI를 렌더링할 때 성능에 큰 영향을 미칩니다.
  
- **React.memo**: 리액트의 `React.memo`를 사용하여 props가 변경되지 않은 경우 컴포넌트가 다시 렌더링되지 않도록 할 수 있습니다. 이는 조건부 렌더링과 결합하여 성능 최적화에 유용합니다.

```jsx
const MyComponent = React.memo(function(props) {
  return <div>{props.message}</div>;
});
```

이 예제에서 `MyComponent`는 `props.message`가 변경되지 않으면 다시 렌더링되지 않습니다.

### 8단계 정리

조건부 렌더링은 리액트에서 UI를 동적으로 제어하는 핵심 기법입니다. 다양한 방법으로 조건부 렌더링을 구현할 수 있으며, 각 방법은 상황에 따라 적절히 사용될 수 있습니다. 조건부 렌더링을 적절히 활용하면, 복잡한 UI를 보다 명확하고 효율적으로 관리할 수 있으며, 애플리케이션의 성능을 최적화할 수도 있습니다.

이제 조건부 렌더링을 실제로 구현해보면서, 다양한 시나리오에 맞게 UI를 동적으로 제어하는 연습을 해보세요. 실습을 통해 조건부 렌더링의 다양한 기법과 그 효과를 경험하는 것이 중요합니다. 추가적인 질문이나 도움이 필요하다면 언제든지 알려주세요!