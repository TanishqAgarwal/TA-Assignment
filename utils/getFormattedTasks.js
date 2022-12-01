const moment = require('moment');

const getFormattedTasks =(tasks) => {

    let formattedTasks = [];

    for(let task of tasks){
    
        const formattedDate = moment(task.dueDate).format("YYYY-MM-DD");
        const taskListName = task.taskListID.name;
        const {name,description,period,periodType} = task;

        const finalTask = {
           name, description, period, periodType, 
           dueDate: formattedDate,
           taskListName
        }
        formattedTasks.push(finalTask);
    }

    return formattedTasks;
}

module.exports = getFormattedTasks