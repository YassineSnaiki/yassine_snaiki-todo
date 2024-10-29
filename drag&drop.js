const draggables = document.querySelectorAll('.task');
const zones = document.querySelectorAll('.list');



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
        const dragged = document.querySelector('.is-dragged');

        const bottom = getBottom(zone,e.clientY);
        if(!bottom)
        zone.appendChild(dragged);
        else { 
            zone.insertBefore(dragged,bottom);
        }
    })
})

function getBottom(zone,mouseY){
    let offset = Number.NEGATIVE_INFINITY;
    let bottom;
    const tasks = zone.querySelectorAll('.task:not(.is-dragged)');
    tasks.forEach(task=>{
        const {top} = task.getBoundingClientRect();
        if(mouseY < top && (mouseY - top) > offset){
            offset = mouseY - top;
            bottom = task;
        }
    })
    return bottom;
}