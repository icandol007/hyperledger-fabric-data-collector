3단계는 설치라서 스킵 ㅇㅇ

4단계에서는 리액트에서 사용하는 **JSX**에 대해 깊이 있게 알아보겠습니다. JSX는 리액트에서 UI를 정의하는 데 사용되는 독특한 문법으로, 자바스크립트와 HTML을 결합한 형태입니다. 이 단계에서는 JSX의 문법, 특징, 그리고 이를 사용하여 리액트 컴포넌트를 작성하는 방법에 대해 자세히 설명하겠습니다.

### 4단계: JSX 이해하기

#### 1. JSX란 무엇인가?

JSX는 JavaScript XML의 줄임말로, 리액트 컴포넌트에서 UI를 작성할 때 사용하는 문법입니다. JSX는 HTML과 매우 유사한 구문을 사용하지만, 순수한 HTML이 아니라 자바스크립트의 확장 문법입니다. JSX는 브라우저에서 실행되기 전에 Babel과 같은 트랜스파일러에 의해 일반 자바스크립트 코드로 변환됩니다.

- **HTML과의 차이점**: JSX는 HTML과 비슷해 보이지만, 몇 가지 중요한 차이점이 있습니다. 예를 들어, HTML에서는 `class` 속성을 사용하지만, JSX에서는 자바스크립트 예약어인 `class` 대신 `className`을 사용합니다.

#### 2. JSX의 문법

JSX 문법은 자바스크립트 코드 안에서 HTML 태그를 직접 사용할 수 있도록 해줍니다. 아래는 JSX의 기본적인 문법과 사용법입니다.

##### 1) JSX 요소

JSX에서는 HTML 요소를 직접 사용하여 DOM 요소를 생성할 수 있습니다.

```jsx
const element = <h1>Hello, world!</h1>;
```

위 코드는 `element`라는 변수를 선언하고, `<h1>` 태그로 "Hello, world!"라는 내용을 담은 요소를 생성합니다. 이 코드는 브라우저에서 실행되기 전에 다음과 같은 자바스크립트 코드로 변환됩니다:

```javascript
const element = React.createElement('h1', null, 'Hello, world!');
```

##### 2) 중괄호를 사용한 표현식

JSX에서는 중괄호 `{}`를 사용하여 자바스크립트 표현식을 삽입할 수 있습니다. 이를 통해 변수를 사용하거나, 함수의 결과를 직접 JSX 내에서 사용할 수 있습니다.

```jsx
const name = "John";
const element = <h1>Hello, {name}!</h1>;
```

위 코드는 `name` 변수의 값을 읽어와서 `<h1>` 태그 내에 삽입합니다. 출력 결과는 "Hello, John!"이 됩니다.

##### 3) 속성

JSX에서는 HTML 속성도 사용할 수 있습니다. 다만, 몇 가지 속성 이름은 자바스크립트의 예약어와 충돌을 피하기 위해 변경되어 사용됩니다.

- **class → className**: `class`는 자바스크립트의 예약어이기 때문에 JSX에서는 `className`을 사용합니다.
- **for → htmlFor**: `for` 속성도 마찬가지로 `htmlFor`로 사용됩니다.

예시:

```jsx
const element = <div className="container">Content goes here</div>;
```

##### 4) 닫힘 태그

JSX에서 태그는 항상 닫혀 있어야 합니다. HTML에서는 일부 태그가 닫힘 없이 사용될 수 있지만, JSX에서는 `<img />`, `<input />`처럼 스스로 닫는 태그도 명시적으로 닫아야 합니다.

예시:

```jsx
const element = <img src="image.png" alt="Example image" />;
```

#### 3. JSX의 조건부 렌더링

JSX에서 조건부 렌더링을 구현할 수 있습니다. 이는 특정 조건에 따라 다른 요소를 렌더링하도록 하는 것입니다.

##### 1) if 문

JSX에서 `if` 문을 사용해 조건부 렌더링을 할 수 있습니다.

```jsx
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  }
  return <h1>Please sign up.</h1>;
}
```

이 코드는 `isLoggedIn`이 `true`일 때 "Welcome back!" 메시지를, `false`일 때 "Please sign up." 메시지를 렌더링합니다.

##### 2) 삼항 연산자

더 간결하게 조건부 렌더링을 하고 싶다면 삼항 연산자를 사용할 수 있습니다.

```jsx
const isLoggedIn = true;
const element = isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please sign up.</h1>;
```

삼항 연산자는 조건이 `true`일 때와 `false`일 때 각각 다른 결과를 반환합니다.

##### 3) && 연산자

또한, `&&` 논리 연산자를 사용해 조건이 참일 때만 특정 요소를 렌더링할 수 있습니다.

```jsx
const messages = [];
const element = (
  <div>
    {messages.length > 0 && <h2>You have {messages.length} unread messages.</h2>}
  </div>
);
```

`messages.length`가 0보다 크면 `<h2>` 요소가 렌더링되고, 그렇지 않으면 아무것도 렌더링되지 않습니다.

#### 4. JSX와 자바스크립트 표현식

JSX 내에서 자바스크립트의 다양한 표현식을 사용할 수 있습니다. 함수 호출, 수학 연산, 조건문 등을 모두 JSX 내에서 활용할 수 있습니다.

예시:

```jsx
const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};

function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);
```

이 예제에서는 `formatName` 함수가 `user` 객체를 받아서 풀 네임을 반환하고, 이 결과를 JSX 내에서 사용하고 있습니다.

#### 5. JSX의 배열과 반복문

JSX 내에서 배열을 사용하여 여러 요소를 렌더링할 수 있습니다. `map()` 함수는 배열의 각 요소에 대해 콜백 함수를 호출하여 JSX 요소를 생성하는 데 자주 사용됩니다.

예시:

```jsx
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>{number}</li>
);

const element = (
  <ul>
    {listItems}
  </ul>
);
```

이 예제에서는 `numbers` 배열의 각 요소를 `<li>` 요소로 변환한 후, `<ul>` 내에 배열을 삽입하여 리스트를 렌더링합니다.

#### 6. JSX의 스타일링

JSX에서 요소의 스타일을 지정할 때는 자바스크립트 객체를 사용해야 합니다. 스타일 속성 이름은 카멜 케이스(camelCase)로 작성해야 하며, 값은 문자열로 지정합니다.

예시:

```jsx
const divStyle = {
  color: 'blue',
  backgroundColor: 'lightgray',
  fontSize: '20px'
};

const element = <div style={divStyle}>Styled text</div>;
```

위의 예제에서는 `divStyle` 객체를 사용하여 `<div>` 요소의 스타일을 지정하고 있습니다.

#### 7. JSX의 기본 원칙

JSX를 사용할 때 몇 가지 기본 원칙을 기억해 두면 좋습니다.

- **자바스크립트와 호환성**: JSX는 자바스크립트의 표현식을 포함할 수 있습니다. 이를 통해 동적인 콘텐츠를 생성하거나, 조건에 따라 요소를 렌더링할 수 있습니다.
- **코드 가독성**: JSX는 HTML과 유사하기 때문에 코드가 더 직관적이며 가독성이 높습니다. 이를 통해 개발자들이 UI를 보다 쉽게 설계하고 이해할 수 있습니다.
- **보안**: JSX는 기본적으로 XSS(Cross-Site Scripting) 공격으로부터 안전합니다. JSX는 자바스크립트 표현식을 통해 삽입된 값들을 자동으로 이스케이프 처리하기 때문에, 악성 스크립트가 실행되지 않도록 보호합니다.

#### 8. JSX의 컴파일 과정

JSX는 자바스크립트의 문법이 아니기 때문에 브라우저에서 바로 실행할 수 없습니다. 이를 위해 JSX 코드를 트랜스파일러(예: Babel)를 사용해 순수 자바스크립트로 변환해야 합니다.

```jsx
const element = <h1>Hello, world!</h1>;
```

위 JSX 코드는 다음과 같은 자바스크립트 코드로 변환됩니다:

```javascript
const element = React.createElement(
  'h1',
  null,
  'Hello, world!'
);
```

이 과정에서 `React.createElement` 함수가 호출되어, 태그 이름, 속성, 자식 요소를 받아 리액트 요소를 생성합니다.

### 4단계 정리

이제 JSX에 대한 기본적인 이해를 마쳤습니다. JSX는 리액트에서 UI를 정의하는 데 필수적인 요소이며, HTML과 자바스크립트의 결합을 통해 보다 직관적이고 강력한 UI 설계를 가능하게 합니다. JSX의 기본

 문법과 활용 방법을 잘 익혀 두면 리액트 컴포넌트를 작성하고 관리하는 데 큰 도움이 될 것입니다.

다음 단계로 넘어가기 전에, JSX를 사용해 몇 가지 간단한 컴포넌트를 작성해 보세요. 이 과정을 통해 JSX와 리액트의 작동 방식을 직접 경험해 보는 것이 중요합니다. 궁금한 점이나 더 알고 싶은 부분이 있으면 언제든지 질문해 주세요!
