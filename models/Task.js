const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema(
    {
    
        name: {type:String, required:true},
        
        description: {type:String, required:true},

        dueDate: {type:Date, required:true},

        period: {type:String, required:true},
        
        periodType: {type:String, required:true},

        taskListID: {type:Schema.Types.ObjectId, ref: "TaskList"},
    },
    { timestamps:true}
);

module.exports = mongoose.model("task",TaskSchema);