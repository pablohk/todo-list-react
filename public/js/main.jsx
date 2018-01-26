//
//
// class ToDo extends React.Component {
//   constructor(props){
//     super(props);
//     this.state={
//       arr:[],
//       click:0
//     };
//     this.handleClick=this.handleClick.bind(this);
//   }
//
//   componentDidMount(){
//     this.setState(()=>{return this.state.arr.push("STATE");});
//   }
//
//   // componentWillUnmount(){}
//   handleClick(e) {
//     e.preventDefault();
//     this.setState((prevState)=>({
//       click:prevState.click+1}
//     ));
//   }
//
//   render(){
//     console.log(this.state.click);
//     return(
//       <div>
//         <button onClick={this.handleClick}>
//           Click me
//         </button>
//         <h1>HOLA</h1>
//         <p>state: {this.state.arr[0]}</p>
//         <p>props: {this.props.name}, {this.props.surname}</p>
//         <p>clicks: {this.state.click}</p>
//       </div>
//     );
//   }
// }
//
// function App(){
//   return (
//    <div>
//      <h1> To-Do List with React</h1>
//      <ToDo name="Pablo" surname="jjj"/>
//    </div>
//   );
// }
//
// ReactDOM.render(<App />, document.getElementById('root'));
console.clear();

const Title = ({todoCount}) => {
  return (
    <header>
      <h1>To-Do React</h1>
      <p className="top-right">Items:({todoCount})</p>
    </header>
  );
};

const TodoForm = ({addTodo}) => {
  // Input Tracker
  let input;
  // Return JSX
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      addTodo(input.value);
      input.value = '';
    }}>
      <input className="form-control col-md-12" placeholder="Put your to do pending" ref={node => {
        input = node;
      }} />
      <br />
    </form>
  );
};

const Todo = ({todo, remove}) => {
  // Each Todo
  return (
    <div className="list-group-item">
      <button  className="btn btn-danger"
        onClick={(e) => {
          remove(todo.id);}}>Delete</button>
      <p>{todo.id}: {todo.text}</p>
    </div>);
};

const TodoList = ({todos, remove}) => {
  // Map through the todos
  const todoNode = todos.map((todo) => {
    return (<Todo todo={todo} key={todo.id} remove={remove}/>);
  });
  return (<div className="list-group">{todoNode}</div>);
};

// Contaner Component
// Todo Id
window.id = 0;
class TodoApp extends React.Component{
  constructor(props){
    // Pass props to parent class
    super(props);
    // Set initial state
    this.state = {
      data: []
    };
    this.apiUrl = 'http://5a6b0a4f8bdfbe0012adc187.mockapi.io/api/todos';
  }
  // Lifecycle method
  componentDidMount(){
    // Make HTTP reques with Axios
    axios.get(this.apiUrl)
      .then((res) => {
        // Set state with result
        this.setState({data:res.data});
      });
  }
  // Add todo handler
  addTodo(val){
    // Assemble data
    const todo = {text: val};
    // Update data
    axios.post(this.apiUrl, todo)
       .then((res) => {
         this.state.data.push(res.data);
         this.setState({data: this.state.data});
       });
  }
  // Handle remove
  handleRemove(id){
    // Filter all todos except the one to be removed
    const remainder = this.state.data.filter((todo) => {
      if(todo.id !== id) return todo;
    });
    // Update state with filter
    axios.delete(this.apiUrl+'/'+id)
      .then((res) => {
        this.setState({data: remainder});
      });
  }

  render(){
    // Render JSX
    return (
      <div>
        <Title todoCount={this.state.data.length}/>
        <TodoForm addTodo={this.addTodo.bind(this)}/>
        <TodoList
          todos={this.state.data}
          remove={this.handleRemove.bind(this)}
        />
      </div>
    );
  }
}
ReactDOM.render(<TodoApp />, document.getElementById('root'));
