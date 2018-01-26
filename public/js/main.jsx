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
    return (<Todo todo={todo} key={todo.createdAt} remove={remove}/>);
  });
  return (<div className="list-group">{todoNode}</div>);
};

const RemovedList= (props)=>{
  return (
    <div>
      <ul className="list-group">
        <p>Deleted itmes</p>
        {props.remov.map((elem)=><li className="list-group-item" key={elem.createdAt}>
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
