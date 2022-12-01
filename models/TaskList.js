const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskListSchema = new Schema(
    {
    
        name: {type:String, required:true},

        description: {type:String, required:true},

        active: {type:Boolean, required:true},

        tasks: [
            
            {type:Schema.Types.ObjectId, ref: "Task"},
            
        ]

    },
    { timestamps:true}
);

module.exports = mongoose.model("task-list",TaskListSchema);