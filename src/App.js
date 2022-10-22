import * as React from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Interval from './components/intervalTutorial/Interval';

// simple variable
// const title = 'React1'; // <h1>{title}</h1>

// object variable
/*const welcome = { // <h1>{welcome.greeting} {welcome.title}</h1>
  greeting: 'Hey',
  title: 'React',
};*/

// method
/*function getTitle(title) { // <h1>Hello {getTitle('React')}</h1> 
  return title;
}*/

/* // list
const list = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
]; */

/* function List() {
  return list.map(function (item) { // or return list.map(item => {
    return (
      <div key={item.objectID}>
        <span>
          <a href={item.url}>{item.title}</a>
        </span>
        <span>{item.author}</span>
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
      </div>
    );
  });
} */

const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const getAsyncStories = () =>
  new Promise(resolve =>
    setTimeout(
      () => resolve({ data: { stories: initialStories } }),
      2000
    )
  );
  

// custom hook
const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState (
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => { // called any time [value or key change]
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STORIES':
      return action.payload;
    case 'REMOVE_STORY':
      return state.filter(
        story => action.payload.objectID !== story.objectID
      );
    default:
      throw new Error();
  }
};


const App = () => {

  // call custom hook
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

  // inital stories states
  const [stories, dispachStories] = React.useReducer(
    storiesReducer,
    []
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  /*
  const [searchTerm, setSearchTerm] = React.useState(localStorage.getItem('search') || 'React'); // first term is the current state, second term updates the state

  // called any time searchTerm is updated, the first param is a function where the effect occurs
  React.useEffect(() => { // this is done to ensure we always saving the value typed
    localStorage.setItem('search', searchTerm);
  }, [searchTerm]);
  */

  // load data for stories
  React.useEffect(() => {
    setIsLoading(true);

    getAsyncStories()
    .then(result => {
      dispachStories({
        type: 'SET_STORIES',
        payload: result.data.stories,
      });
      setIsLoading(false);
    }).catch(() => setIsError(true));
  }, []);

  const handleRemoveStory = item => {
    dispachStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  const handleSearch = event => {
    setSearchTerm(event.target.value);
    localStorage.setItem('search', event.target.value);
  };

  const searchedStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Router>
      <Routes>
        <Route path='/interval' element={<Interval/>}/>
      </Routes>
    </Router>
    // <div>
    //   <h1>Mpr-App</h1>

    //   <InputWithLabel id='search' value={searchTerm} isFocused onInputChange={handleSearch}><strong>Search: </strong></InputWithLabel>
    //   <hr />

    //   {isError && <p>Something went wrong ...</p>}

    //   {isLoading ? (<p>Loading...</p>) : (<List list={searchedStories} onRemoveItem={handleRemoveStory} />)}
    // </div>
  );
};

const InputWithLabel = ({ id, value, type = 'text', onInputChange, isFocused, children }) => {
  // const {search, onSearch} = props; // deconstruction of props object
  // <> JSX fragment, used in place of an html wrapper to avoid rendering un-needed html
  const inputRef = React.useRef(); // A

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      // D
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      {/* B */}
      <input ref={inputRef} id={id} type={type} value={value} onChange={onInputChange} />

      <p>
          Searching for <strong>{value}</strong>
        </p>
    </>
  );
};

const List = ({list, onRemoveItem}) =>
  list.map(item => <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem}/>);

const Item = ({ item, onRemoveItem }) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <span>
      <button type="button" onClick={() => onRemoveItem(item)}>Dismiss</button>
    </span>
  </li>
);



/*// using props deconstruction, js spred operator (...), and js rest operator which just extracts the remaining content from object 
const List = ({ list }) =>
  list.map(({objectID, ...item}) => <Item key={objectID} {...item}/>); // ... js spread operator

const Item = ({title, url, author, num_comments, points }) => (
  <li>
    <span>
      <a href={url}>{title}</a>
    </span>
    <span>{author}</span>
    <span>{num_comments}</span>
    <span>{points}</span>
  </li>
); */

export default App;
