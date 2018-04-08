import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
// import registerServiceWorker from './registerServiceWorker';
// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();

class TotalUndone extends React.Component {
    render(){
        return(
            <span> {this.props.undoneN} </span>
        );
    }
}
class TotalDone extends React.Component {
    render(){
        return(
            <span> {this.props.doneN} </span>            
        )
    }
}

class TitleNInpNAdd extends React.Component {
    constructor(props){
        super(props);
        this.titileInput = React.createRef();
    }
    render(){
        return(
            <div className = "header">
            <h1>TodoList</h1>
            <input className ="titleInput" ref = {this.titileInput} 
            rtype="text" id="myInp" placeholder="todo Title..." />
            <button className="addBtn" 
            onClick={() => {
                        const inputNode = this.titileInput.current;
                        this.props.addTodoTitle(inputNode.value);
                        inputNode.value = "";
                    }
                }>
            ADD</button>                    
            </div>
        );    
    }
}

class TitleNItems extends React.Component {
    constructor(props){
        super(props);
        this.itemInput = React.createRef();
    }

    render(){
        let genItems = this.props.items.map((element, itemIndex) => {
            return(
                <li key = {itemIndex} className = {element.doneOrN? "doneItem" : "undoneItem"}>
                    <span onClick = {() => {this.props.itemDoneToggle(itemIndex)}}>
                        {element.itemName} </span>
                    <button onClick = {() => this.props.deleteItem(itemIndex)}> x </button>
                </li>
            );
        });

        return (
            <li className = "titleList">
                <span>{this.props.titleName + "\t" }</span>
                <span className = "buttons">
                    <span className = "record">{this.props.undoneItemN} undone Items</span>
                    <input ref = {this.itemInput}/>
                    <button  
                    onClick = {() => {
                        let inputNode = this.itemInput.current;
                        this.props.rename(this.props.titleIndex, inputNode.value);
                        inputNode.value = "";
                    }}>Rename </button>
                    <button 
                    onClick = {() => {
                        let inputNode = this.itemInput.current;
                        this.props.additem(this.props.titleIndex, inputNode.value);
                        inputNode.value = "";
                    }}> + </button>
                    <button 
                    onClick = {() => {this.props.delTitle()}}> x </button>
                </span>
                <ul> {genItems} </ul>   
            </li>
        );

    }
} 

class TodoList extends React.Component {
    constructor(props){
        super(props);
        this.state = ({
            titles: [
                {titleName: "exercise", undoneItemN:2, items:[{itemName:"jump ropes", doneOrN:false}, {itemName:"run 10 miles", doneOrN:false}]},
                {titleName: "study", undoneItemN:2, items:[{itemName:"physics", doneOrN:false}, {itemName: "chemistry",doneOrN:false}]},
            ],
            totalUndoneN:4,
            totalDoneN:0,
        })
    }

    addTodoTitle(titleName){
        if(titleName === ""){
            alert("need input");
            return;
        }
        let titles = this.state.titles.slice();
        titles.push({
            titleName: titleName,
            undoneItemN:0,
            items:[]
        })
        
        this.setState({            
            titles: titles,
            totalUndoneN: this.state.totalUndoneN,
            totalDoneN: this.state.totalDoneN,
        })
    }

    rename(index, newName){
        if(newName === ""){
            alert("need input");
            return;
        }
        let titles = this.state.titles;
        titles[index].titleName = newName; 
        this.setState({
            titles: titles,
            totalUndoneN: this.state.totalUndoneN,
            totalDoneN: this.state.totalDoneN            
        })
    }

    additem(index, itemName){
        if(itemName === ""){
            alert("need input");
            return;
        }
        let titles = this.state.titles;
        titles[index].items.push({itemName: itemName, doneOrN:false});
        titles[index].undoneItemN += 1;
        this.setState({
            titles: titles,
            totalUndoneN: this.state.totalUndoneN + 1,
            totalDoneN: this.state.totalDoneN 
        })
    }
    
    itemDoneToggle(titleIndex, itemIndex){
        let titles = this.state.titles;
        (titles[titleIndex].items)[itemIndex].doneOrN = !(titles[titleIndex].items)[itemIndex].doneOrN
        const donePlus1 = (titles[titleIndex].items)[itemIndex].doneOrN;
        titles[titleIndex].undoneItemN = donePlus1? 
            titles[titleIndex].undoneItemN-1 : titles[titleIndex].undoneItemN+1 
        // alert(donePlus1);
        this.setState({
            titles: titles,
            totalUndoneN: donePlus1? this.state.totalUndoneN-1 : this.state.totalUndoneN+1,
            totalDoneN: donePlus1? this.state.totalDoneN+1 : this.state.totalDoneN-1
        })
    }

    deleteItem(titleIndex, itemIndex){
        let titles = this.state.titles;
        const delItemDoneOrN = (titles[titleIndex].items)[itemIndex].doneOrN;
        titles[titleIndex].undoneItemN = delItemDoneOrN ? 
            titles[titleIndex].undoneItemN : titles[titleIndex].undoneItemN-1;
        (titles[titleIndex].items).splice(itemIndex,1);
        
        this.setState({
            titles: titles,
            totalUndoneN: delItemDoneOrN? this.state.totalUndoneN : this.state.totalUndoneN-1,
            totalDoneN: delItemDoneOrN? this.state.totalDoneN-1 : this.state.totalDoneN
        })
    }

    delTitle(titleIndex){
        let titles = this.state.titles;
        const undoneNCount = titles[titleIndex].undoneItemN;        
        const doneNCount = titles[titleIndex].items.length - undoneNCount;
        titles.splice(titleIndex,1);
        this.setState({
            titles: titles,
            totalUndoneN: this.state.totalUndoneN - undoneNCount,
            totalDoneN: this.state.totalDoneN - doneNCount
        })
    }
    
    render(){
        const titles = this.state.titles;
        const genLists = titles.map((element,titleIndex) => {
            return <TitleNItems  titleIndex = {titleIndex} titleName = {element.titleName}
            key = {titleIndex}
            items = {this.state.titles[titleIndex].items}
            undoneItemN = {element.undoneItemN}
            rename = {(titleIndex, newName) => this.rename(titleIndex, newName)}
            additem = {(titleIndex, itemName) => this.additem(titleIndex, itemName)}
            delTitle = {() => this.delTitle(titleIndex)}
            itemDoneToggle = {(itemIndex) =>{ this.itemDoneToggle(titleIndex, itemIndex)} }
            deleteItem = {(itemIndex) => {this.deleteItem(titleIndex, itemIndex)}}
            />
        })
        let str = "display: -webkit-flex -webkit-align-items: center   display: flex align-items: center";
        return(
            <div id = "myTodoList">
                <TitleNInpNAdd addTodoTitle = {(titleName) => this.addTodoTitle(titleName)}/>
                <div className = "header" style = {{str}}>
                    <span> Undone Items: </span>
                    <TotalUndone undoneN = {this.state.totalUndoneN}/>
                    <span> Done Items: </span>
                    <TotalDone doneN = {this.state.totalDoneN}/>
                </div>
                <div>
                    <ul >{genLists}</ul>
                </div>
            </div>
        );
    }

}

ReactDOM.render(
    <TodoList />,
    document.getElementById('root')
);
