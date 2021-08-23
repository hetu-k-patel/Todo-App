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
import { FaTrashAlt, FaCheck, FaPencilAlt } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import { DATE_FORMAT, TASKS_HEADER_MAPPING, STATUS } from '../constants/index';

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
            onKeyDown={(e) => {
               if (e.keyCode === 13) {
                  if (!task) return;
                  onAddTask(task, date);
                  onCancle();
                  setTask('');
               }
            }}
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

const ActionButton = ({ performAction, id, isCompleted }) => {
   if (isCompleted === 'COMPLETED') {
      return (
         <div className="action-buttons">
            <FaTrashAlt
               className="item"
               onClick={() => performAction(STATUS.DELETE, id)}
            />
         </div>
      );
   }

   return (
      <div className="action-buttons">
         <FaCheck className="item" onClick={() => performAction(STATUS.COMPLETED, id)} />
         <FaPencilAlt className="item" onClick={() => performAction(STATUS.EDIT, id)} />
         <FaTrashAlt className="item" onClick={() => performAction(STATUS.DELETE, id)} />
      </div>
   );
};

const TaskItems = ({ selectedTab, tasks, performAction }) => {
   let tasksToRender = [...tasks];
   if (selectedTab === 'NEXT_7') {
      tasksToRender = tasksToRender.filter(
         ({ date, status }) =>
            isAfter(typeof date === 'string' ? parseISO(date) : date, new Date()) &&
            isBefore(
               typeof date === 'string' ? parseISO(date) : date,
               addDays(new Date(), 7)
            ) &&
            status === STATUS.PENDING
      );
   } else if (selectedTab === 'TODAY') {
      tasksToRender = tasksToRender.filter(
         ({ date, status }) =>
            isToday(typeof date === 'string' ? parseISO(date) : date) &&
            status === STATUS.PENDING
      );
   } else if (selectedTab === STATUS.COMPLETED) {
      tasksToRender = tasksToRender.filter(({ status }) => status === STATUS.COMPLETED);
   } else {
      tasksToRender = tasksToRender.filter(({ status }) => status === STATUS.PENDING);
   }

   return (
      <div className="task-items-container">
         {tasksToRender.length ? (
            tasksToRender.map((task, index) => (
               <div className="task-item" key={index}>
                  <p>{task.text}</p>
                  <p className="task-date">
                     {dateFnsFormat(new Date(task.date), DATE_FORMAT)}
                  </p>
                  <ActionButton
                     performAction={performAction}
                     isCompleted={task.status}
                     id={task.id}
                  />
               </div>
            ))
         ) : (
            <p>No Task</p>
         )}
      </div>
   );
};

const updateLocalStorageItem = (tasks) => {
   localStorage.setItem('tasks', JSON.stringify(tasks));
};

const getLocalStorageItem = () => {
   return JSON.parse(localStorage.getItem('tasks'));
};

const Tasks = ({ selectedTab }) => {
   const [showAddTask, setShowAddTask] = useState(false);
   const [tasks, setTasks] = useState([]);

   const performAction = (status, id) => {
      switch (status) {
         case STATUS.COMPLETED:
            {
               const index = tasks.findIndex((task) => task.id === id);
               tasks[index].status = STATUS.COMPLETED;
               setTasks([...tasks]);
               updateLocalStorageItem(tasks);
            }
            break;

         case STATUS.DELETE:
            {
               const newItems = tasks.filter((task) => task.id !== id);
               setTasks(newItems);
               updateLocalStorageItem(newItems);
               NotificationManager.success('Task Deleted Successfully,', 'Success', 1000);
            }
            break;

         case STATUS.EDIT:
            {
               const index = tasks.findIndex((task) => task.id === id);
               const newText = prompt('Enter Task...');
               if (!newText) return;
               tasks[index].text = newText;
               setTasks([...tasks]);
               updateLocalStorageItem(tasks);
               NotificationManager.success('Task Updated Successfully,', 'Success', 1000);
            }
            break;

         default:
            return;
      }
   };

   const addNewTask = (text, date) => {
      const newTaskItem = {
         id: uuidv4(),
         text,
         date: date || new Date(),
         status: STATUS.PENDING,
      };
      const newTasks = [...tasks, newTaskItem];
      setTasks((prevState) => newTasks);
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      NotificationManager.success('Task Added Successfully,', 'Success', 1000);
   };

   useState(() => {
      const savedTasks = getLocalStorageItem();
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
         <TaskItems
            tasks={tasks}
            selectedTab={selectedTab}
            performAction={performAction}
         />
         <NotificationContainer />
      </div>
   );
};

export default Tasks;
