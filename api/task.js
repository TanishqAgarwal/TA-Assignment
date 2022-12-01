const express = require('express');
const router = express.Router();
const axios = require("axios");
const TaskModel = require('../models/Task');
const TaskListModel = require('../models/TaskList');
const moment = require('moment');
const ObjectId = require('mongoose').Types.ObjectId;
const getFormattedTasks  = require('../utils/getFormattedTasks');


router.post("/createtasklist", async(req, res) => {
    const {name, description, active} = req.body;

    if(!name || !description || active===undefined)
    {
        return res.status(400).send('Data sent incorrectly');
    }

    try{
        const newTaskList = await TaskListModel.create({name, description, active, tasks:[]});

        return res.status(201).send(newTaskList);

    } catch(err){
        console.log(err);
        return res.status(502).send("Server Error");
    }

})

router.post("/createtask", async(req, res) => {
    const {name, description, dueDate, period, periodType, taskListID} = req.body;

    if(!name || !description || !dueDate || !period || !periodType || !taskListID){
        return res.status(400).send('Data sent incorrectly');
    }

    if(!moment(dueDate, 'MM/DD/YYYY',true).isValid()){
        return res.status(400).send('Date format sent incorrectly');
    }

    if(!(periodType === "monthly" || periodType === "quarterly" || periodType === "yearly")){
        return res.status(400).send('PeriodType sent incorrectly');
    }

    if(!ObjectId(taskListID)){
        return res.status(400).send('taskListID sent incorrectly');
    }

    const dueDateObject = moment(dueDate, 'MM/DD/YYYY').toDate();
    const ISODate = dueDateObject.toISOString();


    try{

        const taskList = await TaskListModel.findById(taskListID);

        if(!taskList){
            return res.status(404).send('Task List Not found');
        }

        const newTask = await TaskModel.create({name, description, dueDate:ISODate, period, periodType,taskListID});
        taskList.tasks.push(newTask._id);
        await taskList.save();

        return res.status(201).send(newTask);

    } catch(err){
        console.log(err);
        return res.status(502).send("Server Error");
    }

})


router.get("/tasklist", async(req, res) => {
    const {searchText} = req.query;


    if(!searchText)
    {

        ///For pagination 
        
        const {tasksPerPage,pageNumber} = req.query;
         
        let tasks;
   
      try{
         
        if(tasksPerPage && pageNumber){
             tasks = await TaskModel.find({}).skip(tasksPerPage*(pageNumber-1)).limit(tasksPerPage).populate('taskListID');
             tasks = getFormattedTasks(tasks);
        }
        else{
            //return all tasks if not specified about pageNumber and tasksperPage

            tasks = await TaskModel.find({}).populate('taskListID');
            tasks = getFormattedTasks(tasks);
        }
        

        return res.status(201).send(tasks);

      }
      catch(err){
        console.log(err);
        return res.status(502).send("Server Error");
      }
    }
    else
    {
        try{

        const nameMatchingTask = await TaskModel.findOne({name : {$regex : searchText,$options:"$i"}}).populate('taskListID');
        const descriptionMatchingTask = await TaskModel.findOne({description : {$regex : searchText,$options:"$i"}}).populate('taskListID');
        let tasks =[];
        

        if(nameMatchingTask !== null){
            tasks.push(nameMatchingTask);
        }
        if(descriptionMatchingTask !== null){
            tasks.push(descriptionMatchingTask);
        }

        tasks = getFormattedTasks(tasks);
       return res.status(201).send(tasks);

        }
        catch(err){
            console.log(err);
            return res.status(502).send('Server Error');
        }
       

    }

})



module.exports = router;