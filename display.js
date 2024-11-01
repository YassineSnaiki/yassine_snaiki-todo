const listElements = document.querySelectorAll('.list');
const btnAddTask = document.querySelector(".btn-addtask");
const modalElement = document.querySelector(".modal")
const draggables = document.querySelectorAll('.task');
const zones = document.querySelectorAll('.list-container');
const descriptionForm = document.querySelector('.description-form');

const tasksArrays = {  todo : [],doing : [],review : [],done : [] }
let currArray = tasksArrays.todo;
// blue #6A6DCD  purple #C340A1 red #D93535
taskColors = ['#D93535', '#C340A1','#6A6DCD' ];



document.addEventListener('click',hideModal)
document.addEventListener('click',e=>{
    hideDescription(e);
    showModal(e)
})
document.addEventListener('click',showModal)
modalElement.addEventListener('submit',createTask)


function hideModal(e){
    e.stopPropagation();
    if(!e.target.closest('.modal')){
       modalElement.classList.add('hidden');
       modalElement.classList.remove('flex');
    }
}
function hideDescription(e){
    if(!e.target.closest('.description-form')){
        descriptionForm.classList.add('hidden');
        descriptionForm.classList.remove('flex');
     }
}



function showModal(e){
    e.stopPropagation();   
    if(e.target.closest('.btn-addtask')) {
      const ArrayName = e.target.dataset.name;
      currArray = tasksArrays[ArrayName];        
      modalElement.firstElementChild.innerHTML = ArrayName.toUpperCase();
      modalElement.classList.remove('hidden');
      modalElement.classList.add('flex');
    }
}
function showDescriptionForm(e){
    e.stopPropagation();   
      descriptionForm.classList.remove('hidden');
      descriptionForm.classList.add('flex');
}

function createTask(e) {
        e.preventDefault();
        const task = {id:Date.now()+Math.trunc(Math.random()*100000),title:modalElement.querySelector(".title").value,deadline:new Date(modalElement.querySelector(".deadline").value),priority:modalElement.querySelector(".priority").value, description:"aaa"}
        if(task.title.length <3 || Date.now() > task.deadline || !isFinite(task.deadline.getTime())) {
            alert("enter correct data");
            return
        }   
        currArray.push(task);    
        modalElement.classList.add('hidden');
        modalElement.classList.remove('flex');
        displayTasks(tasksArrays,listElements);        
}




function displayTasks(tasksArrays,listElements){    
    listElements.forEach(list=>list.innerHTML="");   
    for(const [key,val] of Object.entries(tasksArrays)) {
        const list = [...listElements].find(list=>list.closest(`#${key}`));
        val.forEach(el => {           
           const li = createTaskElement(el);       
           list.append(li);
           li.addEventListener('dragstart',e=>{
            e.target.classList.add('is-dragged');
            e.target.style.opacity = '0';
           })
           li.addEventListener('dragend',e=>{
            e.target.classList.remove('is-dragged');
            e.target.style.opacity = '1';
        })      
        li.addEventListener('click', e=>{
            showDescriptionForm(e);
            console.log(el);          
            descriptionForm.querySelector("textarea").value = el.description;
            hideModal(e);
        })    
        });
    }

}



function createTaskElement(el) {
    li = document.createElement('li');
            li.setAttribute('class','transition-all task bg-[#D9D9D9] rounded overflow-hidden');
            li.setAttribute('draggable','true');
            li.dataset.id = el.id;
            li.innerHTML = `<span style="background-color: ${taskColors[el.priority]};" class="task-header flex justify-end h-3">
                                <span class=" flex gap-[2px] items-center px-1 cursor-pointer">
                                    <span class=" h-1 w-1 bg-[#D9D9D9] rounded-full"></span>
                                    <span class=" h-1 w-1 bg-[#D9D9D9] rounded-full"></span>
                                    <span class=" h-1 w-1 bg-[#D9D9D9] rounded-full"></span>                   
                                </span>
                            </span>
                            <p class="task-text py-2 px-4">${el.title}</p>`
    return li;
}



//drag and drop/////////////////////////////////////////////////////////////

draggables.forEach(draggable=>{
    draggable.addEventListener('dragstart',e=>{
        e.target.classList.add('is-dragged');
        e.target.style.opacity = '0';
    })
    draggable.addEventListener('dragend',e=>{
        e.target.classList.remove('is-dragged');
        e.target.style.opacity = '1';
    })
    draggable.addEventListener('click', e=>{
        const taskObj = getTaskObject(draggable.dataset.id);
        showDescriptionForm(e);
    })
})




let currBottomElement = null;
zones.forEach(zone => {
    const originalColor = getComputedStyle(zone).getPropertyValue('backgroundColor');
    zone.addEventListener('dragover', e =>{
         e.preventDefault();
         const list = zone.querySelector('.list');
         currBottomElement = getBottom(list, e.clientY);
         if(currBottomElement)
         currBottomElement.classList.add('bottom-element');
         zone.style.backgroundColor = "#595959";       
        }); 
    zone.addEventListener('dragleave',e=>{
        e.preventDefault()
       zone.style.backgroundColor = originalColor;
        if(currBottomElement){
            currBottomElement.classList.remove('bottom-element');
            currBottomElement = null;    
        }
    })
    zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.style.backgroundColor = originalColor;
        const dragged = document.querySelector('.is-dragged');
        const list = zone.querySelector('.list');
        const taskId = +dragged.dataset.id;
        let taskObj;

        for (const arr of Object.values(tasksArrays)) {
            const taskIndex = arr.findIndex(el => el?.id === taskId);
            if (taskIndex !== -1) {
                taskObj = arr.splice(taskIndex, 1)[0];
                break;
            }
        }

        const listId = list.getAttribute('id');
        const destinationList = tasksArrays[listId];
        const bottomElement = getBottom(list, e.clientY);

        if (bottomElement) {
            const bottomIndex = destinationList.findIndex(el => el?.id === +bottomElement.getAttribute('id'));
            destinationList.splice(bottomIndex, 0, taskObj);
            list.insertBefore(dragged, bottomElement);
        } else {
            destinationList.push(taskObj);
            list.append(dragged);
        }
        document.querySelectorAll('.bottom-element').forEach(el => el.classList.remove('bottom-element'));
        currBottomElement = null;
    });
});


function getBottom(list,mouseY){
    let offset = Number.NEGATIVE_INFINITY;
    let bottom;
    const taskElements = list.querySelectorAll('.task:not(.is-dragged)');
    taskElements.forEach(task=>{
        const {top} = task.getBoundingClientRect();

        if(mouseY < top && (mouseY - top) > offset){
            offset = mouseY - top;
            bottom = task;
        }
    })
    return bottom;
}


//visual sort
zones.forEach(zone=>{
    const list = zone.querySelector('.list');
    const btnSortpr = zone.querySelector('.btn-sortpr');
    const btnSortdl = zone.querySelector('.btn-sortdl');
    btnSortpr.addEventListener('click',e=>{
        e.preventDefault();
        const newTasksArrays = {...tasksArrays};
        let wantedArray = newTasksArrays[list.getAttribute('id')];
        wantedArray.sort((a,b)=>a.priority-b.priority);
        displayTasks(newTasksArrays,listElements);
    })
    btnSortdl.addEventListener('click', e => {
        e.preventDefault();
        
        // Sort the target array by date in place
        let wantedArray = tasksArrays[list.getAttribute('id')];
        wantedArray.sort((a, b) => a.deadline - b.deadline);
        
        // Call displayTasks to reflect sorted changes
        displayTasks(tasksArrays, listElements);
    });
})


function getTaskObject(id) {
    for (const arr of Object.values(tasksArrays)) {
        let taskObj = null;
        taskObj = arr.find(el => el?.id === id);
        if (taskObj) {
            return taskObj
        }
    }
}


