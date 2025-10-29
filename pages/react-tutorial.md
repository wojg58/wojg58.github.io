---
title: "React 컴포넌트 기초 튜토리얼"
date: 2025-01-27
tags: ["React", "JavaScript", "Frontend", "Tutorial"]
category: "Frontend"
description: "React에서 컴포넌트를 만드는 기본적인 방법을 배워보세요."
---

# React 컴포넌트 기초 튜토리얼 🧩

React는 **컴포넌트 기반** 라이브러리로, UI를 작은 재사용 가능한 조각들로 나누어 개발할 수 있습니다. 이번 튜토리얼에서는 React 컴포넌트의 기본 개념과 실전 예제를 살펴보겠습니다.

## 📋 목차

1. [컴포넌트란 무엇인가?](#컴포넌트란-무엇인가)
2. [함수형 컴포넌트 vs 클래스 컴포넌트](#함수형-컴포넌트-vs-클래스-컴포넌트)
3. [Props와 State](#props와-state)
4. [실전 예제: Todo 리스트](#실전-예제-todo-리스트)
5. [컴포넌트 생명주기](#컴포넌트-생명주기)

## 🤔 컴포넌트란 무엇인가?

컴포넌트(Component)는 **독립적이고 재사용 가능한 UI 조각**입니다. 버튼, 입력창, 카드 등 모든 UI 요소를 컴포넌트로 만들 수 있습니다.

### 컴포넌트의 장점

- **재사용성**: 한 번 만든 컴포넌트를 여러 곳에서 사용
- **유지보수성**: 코드 변경이 용이
- **테스트 용이성**: 각 컴포넌트를 독립적으로 테스트 가능
- **가독성**: 코드 구조가 명확해짐

## ⚡ 함수형 컴포넌트 vs 클래스 컴포넌트

### 함수형 컴포넌트 (권장)

```jsx
function Welcome(props) {
  return <h1>안녕하세요, {props.name}!</h1>;
}

// 또는 화살표 함수로
const Welcome = (props) => {
  return <h1>안녕하세요, {props.name}!</h1>;
};
```

### 클래스 컴포넌트 (레거시)

```jsx
class Welcome extends React.Component {
  render() {
    return <h1>안녕하세요, {this.props.name}!</h1>;
  }
}
```

> **💡 팁**: React 16.8 이후 Hooks가 도입되면서 함수형 컴포넌트가 더 강력해졌습니다. 새로운 프로젝트에서는 함수형 컴포넌트를 사용하는 것을 권장합니다.

## 🔄 Props와 State

### Props (속성)

부모 컴포넌트로부터 전달받는 **읽기 전용** 데이터입니다.

```jsx
function UserCard({ name, age, job }) {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>나이: {age}세</p>
      <p>직업: {job}</p>
    </div>
  );
}

// 사용 예시
<UserCard name="김철수" age={25} job="개발자" />;
```

### State (상태)

컴포넌트 **내부에서 관리되는 데이터**로, 변경될 수 있습니다.

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>현재 카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
      <button onClick={() => setCount(count - 1)}>감소</button>
    </div>
  );
}
```

## 🛠️ 실전 예제: Todo 리스트

간단한 Todo 리스트 컴포넌트를 만들어보겠습니다.

```jsx
import { useState } from "react";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: inputValue,
          completed: false,
        },
      ]);
      setInputValue("");
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="todo-app">
      <h1>📝 Todo 리스트</h1>

      <div className="todo-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="할 일을 입력하세요..."
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
        />
        <button onClick={addTodo}>추가</button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>삭제</button>
          </li>
        ))}
      </ul>

      <p>
        총 {todos.length}개의 할 일 중 {todos.filter((t) => t.completed).length}
        개 완료
      </p>
    </div>
  );
}

export default TodoList;
```

## 🎨 CSS 스타일링

위 컴포넌트의 CSS 스타일:

```css
.todo-app {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.todo-input {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.todo-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #eee;
  margin-bottom: 5px;
  border-radius: 4px;
}

.todo-list li.completed span {
  text-decoration: line-through;
  color: #888;
}

.todo-list button {
  background: #ff4757;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}
```

## 🔄 컴포넌트 생명주기

### useEffect를 사용한 생명주기 관리

```jsx
import { useState, useEffect } from "react";

function DataFetcher({ url }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 컴포넌트가 마운트되거나 url이 변경될 때 실행
    fetchData();

    // 클린업 함수 (옵션)
    return () => {
      console.log("컴포넌트 언마운트 또는 url 변경");
    };
  }, [url]); // 의존성 배열

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (!data) return <div>데이터를 불러올 수 없습니다.</div>;

  return (
    <div>
      <h2>API 데이터</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

## 🚀 다음 단계

이제 기본적인 React 컴포넌트를 만들어보았습니다. 더 발전시키기 위해 다음 개념들을 공부해보세요:

1. **커스텀 Hooks**: 로직 재사용을 위한 커스텀 훅 만들기
2. **Context API**: 전역 상태 관리
3. **React Router**: 페이지 라우팅
4. **컴포넌트 최적화**: React.memo, useMemo, useCallback
5. **테스트**: Jest와 React Testing Library

## 📚 추천 자료

- [React 공식 문서](https://react.dev)
- [React Hooks 완벽 가이드](https://ko.reactjs.org/docs/hooks-intro.html)
- [React 컴포넌트 패턴](https://www.patterns.dev/posts/react-component-patterns)

---

React 컴포넌트를 만들면서 재미있으셨나요? 더 궁금한 점이 있으시면 댓글로 남겨주세요! 💬
