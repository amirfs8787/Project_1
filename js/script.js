var taskArray = []; //The array where the tasks will be
var myForm = document.getElementById('taskForm');
var divContainingNotes = document.getElementById('noteArea');
var allSpans = document.getElementsByTagName('span');
var finalPreviousTasks = getLocalStorage();

/*
This function checks if there have already been tasks submitted, in order to display them when refreshing or reopening the browser.
*/
if(finalPreviousTasks != null){
    taskArray = finalPreviousTasks;
    addAllDivs();
}

//This function sets the task Array in the local storage.
function setLocalStorage(){
    var taskArrayString = JSON.stringify(taskArray);
    window.localStorage.setItem('previousTasks',taskArrayString);
}

//This function gets the task Array from the local storage.
function getLocalStorage(){
    var prevTasksExist = window.localStorage.getItem('previousTasks');
    var displayPrevTasks = JSON.parse(prevTasksExist);
    return displayPrevTasks;
}

myForm.addEventListener('submit', taskArrayAndShowNotes);

//This function validates the date format, and then creates a new task by using two of the functions below.
function taskArrayAndShowNotes(e){
    
    e.preventDefault();
    
    var taskNote = document.getElementById('firstFormPart');
    var taskDate = document.getElementById('secondFormPart');
    var reg = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    var dateOk = reg.test(taskDate.value);
    var dateMessage = document.getElementById('wrongDate');

    if(dateOk){
            dateMessage.style.visibility = 'hidden';
            createtaskArray();
            showDivs(taskArray.length-1);
            taskNote.value = '';
            taskDate.value = '';
    }
    else{
        dateMessage.style.visibility = 'visible';
    }
}

//This function uses a function to get a task the user entered, which is an object, and adds it to the task array.
function createtaskArray(){
    
    var getTask = turnFormInfoIntoObject();
    taskArray.push(getTask);
    setLocalStorage();
}


//This function gets the value the user typed in the form input.
function getValueFromId(x){
    
    var textValue = document.getElementById(x).value;
    return textValue;
}

//This function uses the function above to get all the values entered, and creates an object from them.
function turnFormInfoIntoObject(){
    
    var textAreaInfo = getValueFromId('firstFormPart');
    var dateInfo = getValueFromId('secondFormPart');
    var taskObject = {};
    taskObject['Note'] = textAreaInfo;
    taskObject['Date'] = dateInfo;
    
    return taskObject;
}

/*
This function takes the values from the object, and creates new elements in the DOM in order to display the task on the screen.  It also adds a span element to each task div, which will serve as our element to delete a task should the user choose to do so.
*/
function showDivs(x){
    
    var newNote = document.createElement('div');
    newNote.id = x;

    var task = document.createElement('p');
    task.innerHTML = taskArray[x].Note;
    task.className = 'p1';
    newNote.appendChild(task);

    var date = document.createElement('p');
    date.innerHTML = taskArray[x].Date;
    date.className = 'p2';
    newNote.appendChild(date);

    var closeIt = document.createElement('span');
    closeIt.className = "glyphicon glyphicon-remove";
    newNote.appendChild(closeIt);
    newNote.className = 'note col-lg-2 col-md-2 col-sm-3 col-xs-4';
    
    divContainingNotes.appendChild(newNote);
    
    for(var i = 0; i<allSpans.length; i++){
        allSpans[i].addEventListener('click',removeTask);
    }   
}

//This function uses the function above to create all the tasks which are saved in the local storage.
function addAllDivs(){
    
    divContainingNotes.innerHTML = '';
    var newNote = document.createElement('div');
    newNote.className = 'note col-lg-2 col-md-2 col-sm-3 col-xs-4';
    newNote.id = 'noteTest';
    for(var i = 0; i<taskArray.length; i++){
    showDivs(i);
    }
}

//This function checks which span of which task was clicked, and subsequently removes that object from the task array, and removes the object's corresponding div from the DOM.
function removeTask(event){
    
    var deleteTask = window.confirm('Are you sure you want to delete this task?');
    
    if(deleteTask){
        var clickedSpan = event.target;
        var getDiv = clickedSpan.parentNode;
        getDiv.className = 'removedDiv note col-lg-2 col-md-2 col-sm-3 col-xs-4';
        var idOfDiv = getDiv.id;
        taskArray.splice(idOfDiv, 1);
        
        //It was necessary to add the setTimeout method in order to allow time for the user to see the "fade out" effect.  In addition, the helping function was added since the function "newBoard" requires an argument, and a function with an argument obviously has parantheses, which causes it to be called immediately, despite it being in the setTimeout method.
        setTimeout(function() {

        newBoard(getDiv);

        }, 2100);
        
    }
        
    setLocalStorage();
}

//This function removes the task div from the DOM.
function newBoard(task){
    
    divContainingNotes.removeChild(task);
    addIdToDivs();
}

//This function sets new IDs to each task div, in order to identify which task needs to be deleted.
function addIdToDivs(){
    
    var allTasks = document.getElementsByClassName('note');
    for (var i = 0; i<taskArray.length; i++){
        allTasks[i].id = i;
    }
}