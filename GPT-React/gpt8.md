9단계에서는 리액트에서 **리스트와 키(Lists and Keys)**를 사용하여 여러 개의 요소를 효율적으로 렌더링하는 방법을 깊이 있게 다루겠습니다. 리스트는 데이터를 화면에 나열하여 표시할 때 사용되며, 키는 리액트가 각 리스트 항목을 고유하게 식별하고 업데이트하는 데 중요한 역할을 합니다. 이 단계에서는 리스트와 키의 개념, 사용 방법, 그리고 성능 최적화 방법까지 자세히 설명하겠습니다.

### 9단계: 리스트와 키

#### 1. 리스트란 무엇인가?

리스트(List)는 여러 항목을 모아서 순서대로 표시하는 방법입니다. 예를 들어, 여러 개의 사용자 이름, 제품 목록, 메시지 목록 등을 화면에 나열할 때 리스트를 사용합니다. 리액트에서는 자바스크립트의 배열을 사용하여 리스트를 만들고, 배열의 각 요소를 반복하여 렌더링합니다.

```jsx
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);

return (
  <ul>{listItems}</ul>
);
```

위 예제에서는 `numbers` 배열의 각 요소를 `<li>` 태그로 변환한 다음, `<ul>` 요소 내에 렌더링하고 있습니다.

#### 2. 리스트와 `map()` 함수

리액트에서 리스트를 렌더링할 때는 자바스크립트의 `map()` 함수를 자주 사용합니다. `map()` 함수는 배열의 각 요소에 대해 콜백 함수를 실행하여 새로운 배열을 생성하며, 이 배열을 리액트 요소로 렌더링합니다.

```jsx
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

위 예제에서 `NumberList` 컴포넌트는 `props.numbers` 배열을 받아, 각 요소를 `<li>`로 변환하여 `<ul>`에 렌더링합니다.

#### 3. 키(Key)란 무엇인가?

**키(Key)**는 리액트에서 각 리스트 항목을 고유하게 식별하기 위한 특별한 문자열입니다. 키는 리액트가 리스트를 효율적으로 업데이트하는 데 중요한 역할을 합니다. 리스트 항목에 키를 지정하지 않으면, 리액트는 모든 리스트 항목을 새로 렌더링하게 되어 성능이 저하될 수 있습니다.

##### 1) 키의 역할

키는 리액트가 각 항목을 구별할 수 있도록 돕습니다. 예를 들어, 리스트가 변경되거나 항목이 추가, 삭제되었을 때 리액트는 키를 사용하여 변경된 항목만을 효율적으로 업데이트할 수 있습니다. 키가 없다면 리액트는 리스트를 순차적으로 비교해야 하므로 성능이 떨어질 수 있습니다.

```jsx
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```

이 예제에서 각 `<li>` 태그는 `number` 값을 문자열로 변환한 값을 키로 사용하고 있습니다.

##### 2) 키의 선택 기준

- **고유성**: 키는 리스트 내에서 고유해야 합니다. 같은 리스트에서 동일한 키를 사용하면 안 됩니다.
- **항목의 고유 ID 사용**: 데이터베이스나 API로부터 받은 항목에 고유한 ID가 있다면, 이 ID를 키로 사용하는 것이 가장 좋습니다.
- **인덱스 사용**: 항목에 고유한 ID가 없을 경우, 배열의 인덱스를 키로 사용할 수 있습니다. 그러나 이 방법은 항목이 자주 변경되거나 재정렬될 경우에는 권장되지 않습니다.

```jsx
const todoItems = todos.map((todo, index) =>
  <li key={index}>
    {todo.text}
  </li>
);
```

인덱스를 키로 사용하는 것은 리스트가 변하지 않을 때는 괜찮지만, 항목이 추가되거나 삭제되는 리스트에서는 불안정할 수 있습니다.

##### 3) 고유하지 않은 키의 문제점

고유하지 않은 키를 사용하면 리액트가 항목을 제대로 구분하지 못하게 됩니다. 이로 인해 예기치 않은 버그가 발생할 수 있습니다. 예를 들어, 리스트에서 항목을 삭제하거나 추가할 때, 리액트는 잘못된 항목을 업데이트하거나 상태가 예상치 못하게 동기화되지 않을 수 있습니다.

#### 4. 리스트 항목 컴포넌트 분리하기

리스트 항목이 복잡해지면, 각 항목을 별도의 컴포넌트로 분리하는 것이 좋습니다. 이렇게 하면 코드의 가독성과 유지보수성이 향상됩니다.

```jsx
function ListItem(props) {
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <ListItem key={number.toString()} value={number} />
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

이 예제에서는 `ListItem` 컴포넌트가 리스트의 각 항목을 렌더링하며, `NumberList` 컴포넌트는 `ListItem` 컴포넌트를 통해 리스트 전체를 렌더링합니다. 이렇게 하면 각 리스트 항목의 코드를 별도의 컴포넌트로 관리할 수 있습니다.

#### 5. 다중 컴포넌트에서 키 사용하기

리액트는 동일한 리스트 내의 키만 구별합니다. 그러나 리스트가 여러 개의 컴포넌트로 나뉘어 있을 경우, 각각의 컴포넌트 내에서 키가 고유해야 합니다. 그렇지 않으면 리액트는 키 충돌로 인해 예기치 않은 동작을 할 수 있습니다.

```jsx
function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map((post) =>
        <li key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
  const content = props.posts.map((post) =>
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}

const posts = [
  {id: 1, title: 'Hello World', content: 'Welcome to learning React!'},
  {id: 2, title: 'Installation', content: 'You can install React from npm.'}
];

ReactDOM.render(
  <Blog posts={posts} />,
  document.getElementById('root')
);
```

위 예제에서 `Blog` 컴포넌트는 `sidebar`와 `content` 두 가지 부분으로 나뉘어 있으며, 각 부분에서 동일한 `post.id` 키를 사용하고 있습니다. 이 경우, 각각의 리스트에서 키가 고유하기 때문에 문제가 발생하지 않습니다.

#### 6. 리스트와 키의 성능 최적화

리스트와 키는 리액트의 성능에 중요한 영향을 미칩니다. 키를 적절히 사용하여 리액트가 항목을 효율적으로 업데이트할 수 있도록 도와주는 것이 중요합니다. 다음은 성능 최적화를 위한 몇 가지 팁입니다:

##### 1) 고유한 키 사용

항상 리스트 항목에 고유한 키를 사용하세요. 데이터베이스의 고유 ID나 항목 자체의 고유한 속성을 키로 사용하는 것이 좋습니다.

##### 2) 불필요한 재렌더링 방지

키가 잘못 지정되면 리액트는 불필요하게 모든 리스트 항목을 다시 렌더링할 수 있습니다. 이를 방지하기 위해, 고유한 키를 사용하고, 리스트의 구조가 크게 변경되지 않도록 설계하는 것이 중요합니다.

##### 3) `React.memo`와 키

리액트에서 `React.memo`를 사용하면 함수형 컴포넌트의 불필요한 재렌더링을 방지할 수 있습니다. 이를 키와 함께 사용하면 리스트의 성능을 더욱 최적화할 수 있습니다.

```jsx
const ListItem = React.memo(function ListItem({ value }) {
  return <li>{value}</li>;
});
```

이 예제에서 `ListItem` 컴포넌트는 `value`가 변경되지 않으면 재렌더링되지 않습니다.

#### 7. 복잡한 리스트 렌더링

리스트가 복잡하거나 중첩된 데이터를 포함할 때는 여러 레벨의 리스트를 렌더링할 수 있습니다. 이를 위해 재귀적으로 컴포넌트를 호출하거나

, 중첩된 리스트를 반복해서 렌더링할 수 있습니다.

```jsx
function NestedList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.name}
          {item.children && <NestedList items={item.children} />}
        </li>
      ))}
    </ul>
  );
}

const data = [
  {
    id: 1,
    name: 'Item 1',
    children: [
      {
        id: 2,
        name: 'Item 1.1',
        children: [
          { id: 3, name: 'Item 1.1.1' },
          { id: 4, name: 'Item 1.1.2' },
        ],
      },
    ],
  },
];

ReactDOM.render(<NestedList items={data} />, document.getElementById('root'));
```

이 예제에서는 `NestedList` 컴포넌트가 재귀적으로 호출되어 중첩된 리스트를 렌더링합니다. 각 항목에 고유한 키를 사용하여 리액트가 효율적으로 리스트를 업데이트할 수 있도록 돕습니다.

### 9단계 정리

리스트와 키는 리액트 애플리케이션에서 다수의 요소를 효율적으로 관리하고 렌더링하는 데 중요한 역할을 합니다. 리스트는 배열 데이터를 반복하여 렌더링할 때 사용되며, 키는 리액트가 각 리스트 항목을 고유하게 식별하고 최적화된 방식으로 업데이트할 수 있도록 돕습니다. 고유한 키를 사용하는 것이 중요하며, 이를 통해 성능을 최적화하고 불필요한 재렌더링을 방지할 수 있습니다.

이제 리스트와 키를 사용하여 다양한 데이터를 렌더링하는 실습을 해보세요. 복잡한 리스트와 중첩된 데이터 구조를 다루는 방법을 익히고, 성능 최적화 기법을 직접 경험해보는 것이 좋습니다. 추가적인 질문이나 도움이 필요하다면 언제든지 알려주세요!