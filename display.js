const lists = document.querySelectorAll('.list');


const tasks = {  
    todo : [],
    doing : [],
    review : [],
    done : []
}

let currArray = tasks.todo;



const btnAddTask = document.querySelector(".btn-addtask");
const modal = document.querySelector(".modal")




document.addEventListener('click',hideModal)
document.addEventListener('click',showModal)
modal.addEventListener('submit',createTask)













function hideModal(e){
    e.stopPropagation();
    if(!e.target.closest('.modal')){
       modal.classList.add('hidden');
       modal.classList.remove('flex');
    }
}
function showModal(e){
    e.stopPropagation();
    
    if(e.target.closest('.btn-addtask')) {
      const ArrayName = e.target.dataset.name;
      currArray = tasks[ArrayName];        
      modal.firstElementChild.innerHTML = ArrayName.toUpperCase();
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
}
function createTask(e) {
        e.preventDefault();
        const task = {title:modal.querySelector(".title").value,deadline:modal.querySelector(".deadline").value,priority:modal.querySelector(".priority").value}
        console.log(task);
        
        if(task.title.length <3 || Date.now() > new Date(task.deadline)) {
            alert("enter correct data");
            return
        }
        currArray.push(task);
    
        
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        displayTasks(tasks,lists);
}
function displayTasks(tasks,lists){
    
    lists.forEach(list=>list.innerHTML="");
    
    for(const [key,val] of Object.entries(tasks)) {
        const list = [...lists].find(list=>list.closest(`#${key}`));
        val.forEach(el => {
           html = `
               <li class=" transition-all task bg-[#D9D9D9] rounded overflow-hidden" draggable="true">
                        
                            <span class="task-header flex justify-end bg-[#D93535] h-3">
                                <span class=" flex gap-[2px] items-center px-1 cursor-pointer">
                                    <span class=" h-1 w-1 bg-[#D9D9D9] rounded-full"></span>
                                    <span class=" h-1 w-1 bg-[#D9D9D9] rounded-full"></span>
                                    <span class=" h-1 w-1 bg-[#D9D9D9] rounded-full"></span>                   
                                </span>
                            </span>
                            <p class="task-text py-2 px-4">${el.title}</p>
                        
                    </li>
           ` 
           list.insertAdjacentHTML('afterbegin',html);
        });
    }

}
// displayTasks(tasks,lists)




// lists[0].insertAdjacentHTML("afterbegin",`<li class=" transition-all task bg-[#D9D9D9] rounded overflow-hidden" draggable="true">
                        
//                             <span class="task-header flex justify-end bg-[#D93535] h-3">
//                                 <span class=" flex gap-[2px] items-center px-1 cursor-pointer">
//                                     <span class=" h-1 w-1 bg-[#D9D9D9] rounded-full"></span>
//                                     <span class=" h-1 w-1 bg-[#D9D9D9] rounded-full"></span>
//                                     <span class=" h-1 w-1 bg-[#D9D9D9] rounded-full"></span>                   
//                                 </span>
//                             </span>
//                             <p class="task-text py-2 px-4">Lorem ipsum dolor</p>
                        
//                     </li>`)

//drag and drop/////////////////////////////////////////////////////////////
const draggables = document.querySelectorAll('.task');
const zones = document.querySelectorAll('.list-container');

draggables.forEach(draggable=>{
    draggable.addEventListener('dragstart',e=>{
        e.target.classList.add('is-dragged')
    })
    draggable.addEventListener('dragend',e=>{
        e.target.classList.remove('is-dragged')
    })
})
zones.forEach(zone=>{
    zone.addEventListener('dragover',(e)=>{
        e.preventDefault()
        const list = zone.querySelector('.list');
        const dragged = document.querySelector('.is-dragged');
        const bottom = getBottom(list,e.clientY);
        if(!bottom)
            list.append(dragged);
        else { 
            list.insertBefore(dragged,bottom);
        }
    })
})

function getBottom(list,mouseY){
    let offset = Number.NEGATIVE_INFINITY;
    let bottom;
    const tasks = list.querySelectorAll('.task:not(.is-dragged)');
    tasks.forEach(task=>{
        const {top} = task.getBoundingClientRect();
        console.log('----------------');
        console.log(task , mouseY < top);
        console.log('----------------');
        if(mouseY < top && (mouseY - top) > offset){
            offset = mouseY - top;
            bottom = task;
        }
    })
    return bottom;
}
//drag and drop/////////////////////////////////////////////////////////////