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
  let input;
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
  return (
    <div className="list-group-item">
      <button  className="btn btn-danger"
        onClick={(e) => {
          remove(todo.id);}}>Delete</button>
      <p>Task {todo.id}: {todo.text}</p>
    </div>);
};

const TodoList = ({todos, remove}) => {
  const todoNode = todos.map((todo) => {
    return (<Todo todo={todo} key={todo.id} remove={remove}/>);
  });
  return (<div className="list-group">{todoNode}</div>);
};

const RemovedList= (props)=>{
  return (
    <div>
      <ul className="list-group">
        <p>Deleted itmes</p>
        {props.remov.map((elem)=><li className="list-group-item" key={elem.id}>
          task {elem.id}: {elem.text}</li>)}
      </ul>
    </div>);
};

window.id = 0;
class TodoApp extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      data: []
    };
    this.removed=[];
    this.apiUrl = 'https://5a6b0a4f8bdfbe0012adc187.mockapi.io/api/todos';
  }

  componentDidMount(){
    axios.get(this.apiUrl)
      .then((res) => {
        this.setState({data:res.data});
      });
  }

  addTodo(val){
    const todo = {text: val};
    axios.post(this.apiUrl, todo)
       .then((res) => {
         this.state.data.push(res.data);
         this.setState({data: this.state.data});
       });
  }

  handleRemove(id){
    // Filter all todos except the one to be removed
    const remainder = this.state.data.filter((todo) => {
      if(todo.id===id) this.removed.push(todo);
      if(todo.id !== id) return todo;
    });
    // console.log(this.removed);
    axios.delete(this.apiUrl+'/'+id)
      .then((res) => {
        this.setState({data: remainder});
      });
  }

  render(){
    return (
      <div>
        <Title todoCount={this.state.data.length}/>
        <TodoForm addTodo={this.addTodo.bind(this)}/>
        <TodoList
          todos={this.state.data}
          remove={this.handleRemove.bind(this)}
        />
        <RemovedList remov={this.removed} />
      </div>
    );
  }
}
ReactDOM.render(<TodoApp />, document.getElementById('root'));
