import React, { useState } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import dateFnsFormat from 'date-fns/format';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import addDays from 'date-fns/addDays';
import isToday from 'date-fns/isToday';
import { parseISO } from 'date-fns';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

const DATE_FORMAT = 'dd/MM/yyyy';
function formatDate(date, format, locale) {
   return dateFnsFormat(date, format, { locale });
}
const AddTask = ({ onCancle, onAddTask }) => {
   const [task, setTask] = useState('');
   const [date, setDate] = useState(null);

   return (
      <div className="add-task-dialog">
         <input
            type="text"
            value={task}
            onChange={(event) => setTask(event.target.value)}
         />
         <div className="add-task-actions-container">
            <div className="btns-container">
               <button
                  disabled={!task}
                  className="add-btn"
                  onClick={() => {
                     onAddTask(task, date);
                     onCancle();
                     setTask('');
                  }}
               >
                  Add Task
               </button>
               <button
                  className="cancle-btn"
                  onClick={() => {
                     onCancle();
                     setTask('');
                  }}
               >
                  Cancle
               </button>
            </div>
            <div className="icon-container">
               <DayPickerInput
                  onDayChange={(day) => setDate(day)}
                  placeholder={`${dateFnsFormat(new Date(), DATE_FORMAT)}`}
                  formatDate={formatDate}
                  format={DATE_FORMAT}
                  dayPickerProps={{
                     modifiers: {
                        disabled: [{ before: new Date() }],
                     },
                  }}
               />
            </div>
         </div>
      </div>
   );
};

const TASKS_HEADER_MAPPING = {
   INBOX: 'Inbox',
   TODAY: 'Today',
   NEXT_7: 'Next 7 days',
};

const TaskItems = ({ selectedTab, tasks }) => {
   let tasksToRender = [...tasks];
   if (selectedTab === 'NEXT_7') {
      tasksToRender = tasksToRender.filter(
         ({ date }) =>
            isAfter(typeof date === 'string' ? parseISO(date) : date, new Date()) &&
            isBefore(
               typeof date === 'string' ? parseISO(date) : date,
               addDays(new Date(), 7)
            )
      );
   }

   if (selectedTab === 'TODAY') {
      tasksToRender = tasksToRender.filter(({ date }) =>
         isToday(typeof date === 'string' ? parseISO(date) : date)
      );
   }

   return (
      <div className="task-items-container">
         {tasksToRender.length ? (
            tasksToRender.map((task, index) => (
               <div className="task-item" key={index}>
                  <p>{task.text}</p>
                  <p>{dateFnsFormat(new Date(task.date), DATE_FORMAT)}</p>
               </div>
            ))
         ) : (
            <p>No Task</p>
         )}
      </div>
   );
};

const Tasks = ({ selectedTab }) => {
   const [showAddTask, setShowAddTask] = useState(false);
   const [tasks, setTasks] = useState([]);

   const addNewTask = (text, date) => {
      const newTaskItem = { text, date: date || new Date() };
      const newTasks = [...tasks, newTaskItem];
      setTasks((prevState) => newTasks);
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      NotificationManager.success('Task Added Successfully,', 'Added', 1000);
   };

   useState(() => {
      const savedTasks = JSON.parse(localStorage.getItem('tasks'));
      if (savedTasks) {
         setTasks(savedTasks);
      }
   }, []);

   return (
      <div className="tasks">
         <h1>{TASKS_HEADER_MAPPING[selectedTab]}</h1>
         {selectedTab === 'INBOX' && !showAddTask ? (
            <div
               className="add-task-btn"
               onClick={() => setShowAddTask((prevState) => !prevState)}
            >
               <span className="plus">+</span>
               <span className="add-task-text">Add Task</span>
            </div>
         ) : null}
         {showAddTask && (
            <AddTask onAddTask={addNewTask} onCancle={() => setShowAddTask(false)} />
         )}
         <TaskItems tasks={tasks} selectedTab={selectedTab} />
         <NotificationContainer />
      </div>
   );
};

export default Tasks;
