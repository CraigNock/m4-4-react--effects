# 4.4.2 UseEffect hook

---

### Side effects

What happens when you want to do something _other_ than rendering to the screen?

---

- Updating the document title
- Fetching data from a network
- Doing something when the user scrolls

---

### Doing something on scroll

Here's how we do this in vanilla JS:

```js
window.addEventListener('scroll', () => {
  console.log('User scrolled!')
});
```

---

What about in React?

---

# 🙅‍♀️Not the answer:

```js
const App = () => {
  window.addEventListener('scroll', () => {
    console.log('scroll')
  })

  return <div style={{ height: '300vh' }}>
    <p>This is bad.</p>
    <p>
      Set some state in the event
      <br />
      listener to see why
    </p>
  </div>
}

render(<App />)

```

---

# The `useEffect` hook

---

```js
// `useEffect` takes a function.
// It calls this function AFTER the render
React.useEffect(() => {

})

//**note ONLY works with useState variables!**
```

---

It takes a "dependencies" array

```js
const [someState, setSomeState] == useState('');
const [someOtherState, setSomeOtherState] == useState('');


React.useEffect(() => {
    console.log('some state changed!')
}, [someState, someOtherState]); //if any of these are updated, function gets triggered
```

---

Neat example: logging

```js live=true
const Input = ({ val, onChange }) => {
  React.useEffect(() => {
    console.log(val)
  }, [val]);

  return <input
    value={val}
    onChange={(ev) =>
      onChange(ev.currentTarget.value)
    }
  />
}

const App = ({ title }) => {
  const [name, setName] = React.useState('');
  const [address, setAddress] = React.useState('');

  return (
    <>
      <Input val={name} onChange={setName} />
      <Input val={address} onChange={setAddress} />
    </>
  )
}

render(<App />)
```

---

## Fetching from a network

You _definitely_ don't want to do this in every render

---

```js
const App = () => {
  const [cart, setCart] = React.useState({});

  fetch('some-url')
    .then(data => {
      console.log('Got data:', data);
      setCart(data);
    })

  React.useEffect(() => {
      fetch('some-url')
        .then(data => {
          console.log('Got data:', data);
          setCart(data);
        });
    
      return JSON.stringify(cart, null, 2);
  }, [cart]);
  
  // ...
}

//////

const App = () => {
  const [cart, setCart] = React.useState({});

  //was redundant double fetching, keep updating constantly

  React.useEffect(() => {
      fetch('some-url')
        .then(data => {
          console.log('Got data:', data);
          setCart(data);
        });
    
      return JSON.stringify(cart, null, 2);
  }, []);//removing this dependancy value will cause it to initially render and fetch
  
  // ...blah other stuff
}
```

---

**Tip:** Use an empty dependency array to _only_ run the fetch on mount

---

# Exercises

Update the following snippets to make use of `useEffect`

---

```js
const App = () => {
  const [count, setCount] = React.useState(0);

  //was just "document.title = `You have clicked ${count} times`;"
  React.useEffect(()=> {
    document.title = `You have clicked ${count} times`;
  }, [count]);

  return (
    <button onClick={() => setCount(count + 1)}>
      Increment
    </button>
  );
}

//done
```

---

```js
const App = ({ color }) => {
  const [value, setValue] = React.useState(false);

  React.useEffect(()=>{
    window.localStorage.setItem('value', value);
  }, [value])
  React.useEffect(()=>{
    window.localStorage.setItem('color', color);
  }, [color])

  return (
    <div>
      Value: {value}
      <button onClick={() => setValue(!value)}>
        Toggle thing
      </button>
    </div>
  );
}
//done (we are assuming for exercise that color is a useState variable)
```

---

```js
const Modal = ({ handleClose }) => {
  React.useEffect(()=>{
    window.addEventListener('keydown', (ev) => {
      if (ev.code === 'Escape') {
        handleClose();
      }
    });
  }, []);
  // was just :
  // window.addEventListener('keydown', (ev) => {
  //     if (ev.code === 'Escape') {
  //       handleClose();
  //     }
  //   }); 
  return (
    <div>
      Modal stuff
    </div>
  );
}

// this makes it only trigger/addevent listener on mount, rather than add one every rerender...
```

---

# Unsubscribing

---

There's one other thing to know about `useEffect`: you can _clean stuff up_ when values change.

---

### The problem:

Let's say we have some routes:

```js
<Router>
  <Route path="/">
    <Home>
  </Route>
  <Route path="/about">
    <About />
  </Route>
</Router>
```

---

Our Home component has some sort of event listener.
It also has a link to the other route.

```js
const Home = () => {
  React.useEffect(() => {
    window.addEventListener('scroll', func());
  }, []);

  return (
    <div>
      <Link to="/about">
        About
      </Link>
    </div>
  );
}
```

---

We click the "About" link.

The scroll handler _doesn't go away_ just because we changed components.

`<Home>` is no longer rendered, but its scroll-handler lives on.

---

# Unsubscribing

```js
const Home = () => {
  React.useEffect(() => {
    window.addEventListener('scroll', aFunc());

    return () => {
      window.removeEventListener('scroll', aFunc());
    }
  }, []);
}
```

---

Unsubscribes are processed **right before** the next update, and **right before** removal.

---

import updateASrc from './assets/update-A.svg';

<img src={updateASrc} style={{ width: '100%' }} />

---

import updateBSrc from './assets/update-B.svg';

<img src={updateBSrc} style={{ width: '100%' }} />

---

import updateCSrc from './assets/update-C.svg';

<img src={updateCSrc} style={{ width: '100%' }} />

---

import updateDSrc from './assets/update-D.svg';

<img src={updateDSrc} style={{ width: '100%' }} />

---

# Exercises

Make sure to do the appropriate cleanup work

---

```js
// seTimeout is similar to setInterval...
const App = () => {
  React.useEffect(() => {
    const timeo = window.setTimeout(() => {
      console.log('1 second after update!')
    }, 10000);
    return () => {clearTimeout(timeo)};
  }, [])

  return null;
}
```

---

```js
const App = () => {
  const keyHandle = (ev) => {
    console.log('You pressed: ' + ev.code);
  };

  React.useEffect(() => {
    window.addEventListener('keydown', keyHandle);
    return ()=>{
      window.removeEventListener('keydown', keyHandle);
    }
  }, []);

  return null;
}
```

---

# Custom hooks

React hooks are powerful because we can _compose them_.

---

A custom hook is a **function** that starts with **use**.

Examples:

- _useApiEndpoint_
- _useTextToSpeech_
- _useScrollPosition_
- _useCounter_

React tooling actually **does** care that the name starts with `use`.

---

Custom hooks use **one or more** official React hooks.

They're a great way to **reuse logic**.

---

### Example

Tracking mouse position

<div class="row">
<div class="col">

```js
const App = ({ path }) => {
  const [mousePosition, setMousePosition] = React.useState({
    x: null,
    y: null
  });

  React.useEffect(() => {
    const handleMousemove = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    window.addEventListener('mousemove', handleMousemove);

    return () => {
      window.removeEventListener('mousemove', handleMousemove)
    }
  }, []);

  return (
    <div>
      The mouse is at {mousePosition.x}, {mousePosition.y}.
    </div>
  )
}
```
</div>
<div class='col'>

```js
// refactoring time...
//make your own hook! (remember must start with 'use')
//custom hooks(makes allowed to use/contain react hooks), also must contain at least one hook
const useMousePos = () => {
  const [mousePosition, setMousePosition] = React.useState({
    x: null,
    y: null
  });

  React.useEffect(() => {
    const handleMousemove = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    window.addEventListener('mousemove', handleMousemove);

    return () => {
      window.removeEventListener('mousemove', handleMousemove)
    }
  }, []);

  return mousePosition;
}

const App = ({ path }) => {
  const mousePosition = useMousePos();
  return (
    <div>
      The mouse is at {mousePosition.x}, {mousePosition.y}.
    </div>
  )
}

```
</div>
</div>

---

# Exercises

Extract a custom hook

---

```js
const App = ({ path }) => {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch(path)
      .then(res => res.json())
      .then(json => {
        setData(json);
      })
  }, [path])

  return (
    <span>
      Data: {JSON.stringify(data)}
    </span>
  );
}

/////

const useDataHook = (path) => {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch(path)
      .then(res => res.json())
      .then(newData => {
        setData(newData);
      })
  }, [path])

  return data; //useEffect is async by nature, thus useData is too?
  //regardless it's gonna wait for the useEffect to finish before returning the data
}

const App = ({ path }) => {
  let gotData = useDataHook(path);
  return (
    <span>
      Data: {JSON.stringify(gotData)}
    </span>
  );
}
```

---

```js live=true
const Time = ({ throttleDuration }) => {
  const [time, setTime] = React.useState(
    new Date()
  );

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTime(new Date());
    }, throttleDuration);

    return () => {
      window.clearInterval(intervalId);
    }
  }, [throttleDuration])

  return (
    <span>
      It is currently<br />{time.toTimeString()}
    </span>
  );
}

render(<Time throttleDuration={1000} />)
```

---

[Next lecture: Refs](../lecture-3-refs)
