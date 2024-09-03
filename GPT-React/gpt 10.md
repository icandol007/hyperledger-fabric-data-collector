11단계에서는 리액트에서 **라우팅(Routing)**을 관리하는 방법을 자세히 알아보겠습니다. 리액트는 SPA(Single Page Application) 프레임워크로, 페이지 간의 이동을 전통적인 멀티 페이지 애플리케이션처럼 처리하지 않습니다. 대신, URL 변경에 따라 동적으로 다른 컴포넌트를 로드하여 페이지 전환처럼 보이게 합니다. 이 단계에서는 `React Router` 라이브러리를 사용하여 라우팅을 구현하고, 이를 통해 SPA에서 다양한 "페이지"를 구현하는 방법을 깊이 있게 설명하겠습니다.

### 11단계: 리액트 라우터 (React Router)

#### 1. 리액트 라우터란?

**리액트 라우터(React Router)**는 리액트 애플리케이션에서 클라이언트 측 라우팅을 관리하기 위한 라이브러리입니다. 이 라이브러리는 사용자가 특정 URL로 이동할 때 해당 URL에 맞는 컴포넌트를 렌더링합니다. 리액트 라우터를 사용하면, SPA에서도 멀티 페이지 애플리케이션처럼 자연스러운 페이지 전환을 구현할 수 있습니다.

#### 2. 리액트 라우터 설치

리액트 라우터를 사용하기 위해서는 `react-router-dom` 패키지를 설치해야 합니다.

```bash
npm install react-router-dom
```

이 명령어는 리액트 라우터를 설치하여 프로젝트에서 사용할 수 있게 해줍니다.

#### 3. 리액트 라우터의 기본 개념

리액트 라우터에서 중요한 세 가지 컴포넌트는 `BrowserRouter`, `Route`, `Link`입니다. 이 컴포넌트들은 각각 애플리케이션의 라우팅을 관리하고, 특정 URL에 따라 컴포넌트를 렌더링하며, 사용자가 다른 경로로 이동할 수 있도록 링크를 제공합니다.

##### 1) `BrowserRouter`

`BrowserRouter`는 리액트 라우터의 기본 컴포넌트로, 애플리케이션의 루트 컴포넌트를 감싸서 라우팅 기능을 활성화합니다. 이 컴포넌트는 HTML5의 히스토리 API를 사용하여 브라우저에서 URL을 관리합니다.

```jsx
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      {/* 라우팅 관련 컴포넌트 */}
    </BrowserRouter>
  );
}

export default App;
```

##### 2) `Route`

`Route` 컴포넌트는 특정 경로와 해당 경로에 맞는 컴포넌트를 매핑합니다. 사용자가 지정된 경로로 이동하면 해당 경로에 맞는 컴포넌트가 렌더링됩니다.

```jsx
import { BrowserRouter, Route } from 'react-router-dom';

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Home} />
      <Route path="/about" component={About} />
    </BrowserRouter>
  );
}

export default App;
```

위 예제에서 `/` 경로는 `Home` 컴포넌트를 렌더링하고, `/about` 경로는 `About` 컴포넌트를 렌더링합니다. `exact` 속성은 경로가 정확히 일치할 때만 컴포넌트를 렌더링하도록 합니다.

##### 3) `Link`

`Link` 컴포넌트는 HTML의 `<a>` 태그와 유사하게 작동하며, 다른 경로로 이동할 수 있는 링크를 제공합니다. 하지만 `<a>` 태그와 달리 페이지를 새로고침하지 않고, 히스토리를 관리하여 SPA 내에서 부드러운 전환을 가능하게 합니다.

```jsx
import { BrowserRouter, Route, Link } from 'react-router-dom';

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </nav>
      <Route path="/" exact component={Home} />
      <Route path="/about" component={About} />
    </BrowserRouter>
  );
}

export default App;
```

위 예제에서는 `Link` 컴포넌트를 사용하여 네비게이션 메뉴를 생성합니다. 사용자가 링크를 클릭하면 해당 경로로 이동하고, 연결된 컴포넌트가 렌더링됩니다.

#### 4. 중첩된 라우트(Nested Routes)

리액트 라우터에서는 중첩된 라우트를 사용할 수 있습니다. 중첩된 라우트는 하나의 경로 안에 여러 개의 서브 경로를 포함할 수 있습니다.

```jsx
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <nav>
        <ul>
          <li><Link to="/dashboard/profile">Profile</Link></li>
          <li><Link to="/dashboard/settings">Settings</Link></li>
        </ul>
      </nav>

      <Switch>
        <Route path="/dashboard/profile" component={Profile} />
        <Route path="/dashboard/settings" component={Settings} />
      </Switch>
    </div>
  );
}

function Profile() {
  return <h3>Profile</h3>;
}

function Settings() {
  return <h3>Settings</h3>;
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
        </ul>
      </nav>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
```

위 예제에서 `Dashboard` 컴포넌트는 `/dashboard` 경로에 매핑되며, `/dashboard/profile` 및 `/dashboard/settings` 경로에 각각 `Profile` 및 `Settings` 컴포넌트가 렌더링됩니다. `Switch` 컴포넌트는 여러 경로 중 첫 번째로 일치하는 경로만 렌더링하도록 합니다.

#### 5. 동적 라우트 매칭(Dynamic Route Matching)

리액트 라우터는 경로의 일부를 동적으로 지정할 수 있습니다. 이는 URL의 특정 부분이 변수로 처리될 때 유용합니다.

```jsx
import { BrowserRouter, Route, Link } from 'react-router-dom';

function User({ match }) {
  return <h3>User ID: {match.params.id}</h3>;
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li><Link to="/user/1">User 1</Link></li>
          <li><Link to="/user/2">User 2</Link></li>
        </ul>
      </nav>
      <Route path="/user/:id" component={User} />
    </BrowserRouter>
  );
}

export default App;
```

위 예제에서 `/user/:id` 경로는 동적 라우트 매칭을 사용합니다. `:id` 부분은 URL의 변수로 처리되며, `User` 컴포넌트는 `match.params.id`를 통해 이 값을 접근할 수 있습니다.

#### 6. 리다이렉트(Redirect)와 프로그램적 네비게이션

사용자가 특정 조건을 만족하지 않을 때, 다른 경로로 리다이렉트할 수 있습니다. 리다이렉트를 구현하기 위해 `Redirect` 컴포넌트를 사용하거나, `history` 객체를 사용하여 프로그램적으로 네비게이션할 수 있습니다.

##### 1) `Redirect` 컴포넌트 사용

```jsx
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

function Login() {
  const isLoggedIn = false; // 예시로서 로그인이 안 된 상태로 가정
  if (!isLoggedIn) {
    return <Redirect to="/" />;
  }
  return <h2>Login</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <Route path="/login" component={Login} />
      <Route path="/" exact component={Home} />
    </BrowserRouter>
  );
}

export default App;
```

이 예제에서 `isLoggedIn`이 `false`일 경우, `/login` 경로로 접근하려 하면 자동으로 `/` 경로로 리다이렉트됩니다.

##### 2) 프로그램적 네비게이션

`useHistory` 훅을 사용하면 자바스크립트 코드 내에서 프로그래밍 방식으로 경로를 변경할 수 있습니다.

```jsx
import { BrowserRouter, Route, useHistory } from 'react-router-dom';

function Home() {
  let history = useHistory();

  function handleClick() {
    history.push('/dashboard

');
  }

  return (
    <div>
      <h2>Home</h2>
      <button onClick={handleClick}>Go to Dashboard</button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Home} />
      <Route path="/dashboard" component={Dashboard} />
    </BrowserRouter>
  );
}

export default App;
```

위 예제에서 `useHistory` 훅을 사용하여 `handleClick` 함수가 호출될 때 프로그램적으로 `/dashboard` 경로로 이동합니다.

#### 7. 라우트 보호(Protected Routes)

애플리케이션에서 특정 경로에 접근할 수 있는 사용자를 제한하려면, 라우트를 보호하는 방법이 필요합니다. 라우트 보호는 주로 사용자의 인증 상태를 기반으로 특정 경로에 접근할 수 있는지 여부를 결정하는 방식으로 구현됩니다.

```jsx
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

function ProtectedRoute({ component: Component, ...rest }) {
  const isAuthenticated = false; // 예시로서 인증되지 않은 상태로 가정
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="/" exact component={Home} />
    </BrowserRouter>
  );
}

export default App;
```

이 예제에서 `ProtectedRoute` 컴포넌트는 사용자가 인증되지 않은 상태에서 `/dashboard` 경로에 접근하려 하면, `/login` 경로로 리다이렉트합니다.

#### 8. 라우터의 전환 애니메이션

리액트 라우터에서는 페이지 전환 시 애니메이션을 적용하여 사용자 경험을 향상시킬 수 있습니다. 이를 위해 `react-transition-group`과 같은 라이브러리를 사용하여 페이지 전환 애니메이션을 쉽게 구현할 수 있습니다.

```bash
npm install react-transition-group
```

```jsx
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css'; // CSS 파일에서 애니메이션 정의

function App() {
  return (
    <BrowserRouter>
      <Route
        render={({ location }) => (
          <TransitionGroup>
            <CSSTransition
              key={location.key}
              timeout={300}
              classNames="fade"
            >
              <Switch location={location}>
                <Route path="/" exact component={Home} />
                <Route path="/about" component={About} />
                <Route path="/dashboard" component={Dashboard} />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        )}
      />
    </BrowserRouter>
  );
}

export default App;
```

위 예제에서 `TransitionGroup`과 `CSSTransition`을 사용하여 라우트 전환 시 `fade` 애니메이션이 적용됩니다. `App.css` 파일에서 `fade` 클래스에 대한 애니메이션을 정의할 수 있습니다.

```css
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  opacity: 1;
  transition: opacity 300ms;
}
.fade-exit {
  opacity: 1;
}
.fade-exit-active {
  opacity: 0;
  transition: opacity 300ms;
}
```

#### 9. 라우트 매칭 순서와 `Switch` 컴포넌트

라우트 매칭 시, 여러 경로가 동일한 패턴과 일치할 수 있습니다. `Switch` 컴포넌트는 첫 번째로 일치하는 경로만 렌더링되도록 하여 이러한 상황을 관리합니다.

```jsx
import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />
        <Route path="/:id" component={DynamicPage} />
        <Route path="*" component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
```

위 예제에서 `Switch` 컴포넌트는 경로가 `/about`일 때 `About` 컴포넌트를 렌더링하고, `/1`, `/2` 등의 동적 경로일 때 `DynamicPage` 컴포넌트를 렌더링합니다. 경로가 어떤 것도 일치하지 않으면 `NotFound` 컴포넌트를 렌더링합니다.

### 11단계 정리

리액트 라우터를 사용하면 리액트 애플리케이션에서 클라이언트 측 라우팅을 간편하게 구현할 수 있습니다. `BrowserRouter`, `Route`, `Link`와 같은 기본 컴포넌트를 이해하고, 중첩된 라우트, 동적 라우트 매칭, 리다이렉트, 프로그램적 네비게이션, 그리고 라우트 보호 등을 활용하면 보다 복잡한 SPA를 구축할 수 있습니다. 또한, 애니메이션을 사용하여 페이지 전환을 부드럽게 하고, `Switch` 컴포넌트를 통해 라우트 매칭 순서를 관리할 수 있습니다.

이제 리액트 라우터를 사용해 다양한 페이지 전환과 네비게이션을 구현해 보세요. 실습을 통해 라우팅에 대한 이해를 높이고, 복잡한 라우팅 구조를 설계하는 경험을 쌓는 것이 중요합니다. 추가적인 질문이나 도움이 필요하다면 언제든지 알려주세요!
