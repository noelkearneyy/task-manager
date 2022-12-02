// ----------------------------------------------------------------------------------------------------------------------------------------
// IMPORTS
// ----------------------------------------------------------------------------------------------------------------------------------------
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect, useRef, useState } from 'react'
import Accordion from 'react-bootstrap/Accordion';
var _ = require('lodash');
import 'animate.css';
import { v4 as uuidv4 } from 'uuid';

// ----------------------------------------------------------------------------------------------------------------------------------------
// PARENT COMPONENT - Home
// ----------------------------------------------------------------------------------------------------------------------------------------
export default function Home()  {

// ----------------------------------------------------------------------------------------------------------------------------------------
// STATE
// ----------------------------------------------------------------------------------------------------------------------------------------
  // Task State - Object - Holds data on each submitted task
  const [tasks, setTasks] = useState({});

  // New Task State - Object - Holds data on a new task which is to be inputted to the Tasks Object. Used in relation to the input task field
  const [newTask, setNewTask] = useState({
    taskID: null,
    task: '',
    notes: {},
    time: null,
    complete: false,
  });

  // Error State - Boolean - When state is true, an error message will display in relation to the input task field
  const [error, setError] = useState(false);

// ----------------------------------------------------------------------------------------------------------------------------------------
// FUNCTIONS
// ----------------------------------------------------------------------------------------------------------------------------------------
  // handleInput - Function (event) - Updates the New Task State to the value inputted in the new task input field
  const handleInput = (event) => {
    // Value of new task input field
    let value = event.target.value;
    // Creates a Unique Universal Identifier 
    let UUID = uuidv4();

    // Updates New Task State with UUID and input field value
    setNewTask({
      taskID: UUID,
      task: value,
      notes: {},
      complete: false,
    })
  }

  // handleSubmit - Function (event) - Adds the New Task State Object to the Task State Object and resets the New Task Object
  const handleSubmit = (event) => {
    // Restricts submit button event submitting the form and refreshing the page
    event.preventDefault();

    // Validate input - if input is an empty string set Error State to true and set to false after 3 seconds
    if (newTask.task === '') {
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 3000)
    
    // If input is not an empty string, add the New Task State Object to the Tasks State Object 
    } else {
      setTasks({ ...tasks, [newTask.taskID]: newTask })

      // Reset the New Task State Object - deletes the value in the new task form input field
      setNewTask({
        taskID: null,
        task: '',
        notes: {},
        complete: false,
      })
    }
  }

  // displayTasks - Function - Iterate over Tasks State Object and display tasks in an Accordion (React-Bootstrap) format
  const displayTasks = () => {
    
    // If the length of keys in the Tasks State Object equals zero return 'NO TASKS'
    if (Object.keys(tasks).length == 0) {
      return (<p>NO TASKS</p>)
    
      // If the length of the keys in the Tasks State Object is not equal to zero map each key to display the tasks 
    } else {
      return (
        
        // Map the keys in the Tasks State Object in reverse order, this will display the tasks in descending order
        Object.keys(tasks).reverse().map((key) => {
          
          // If the value of the Complete Key is true return the Accordion Header classList with .taskHeaderCompleted - Add line through the Task 
          if (tasks[key].complete === true) {
            return (
              <Accordion.Item key={key} eventKey={key} className={styles.taskItem}>
                
                <Accordion.Header className={`${styles.taskHeader} ${styles.taskHeaderCompleted}`}>
                  {tasks[key].task}
                </Accordion.Header>
                
                <Accordion.Body className={styles.accordionBody}>
                  {/* Child Component Notes */}
                  <Notes keyID={key} tasks={tasks} setTasks={setTasks} />
                </Accordion.Body>
              
              </Accordion.Item>
            )

          // If the value of the Complete Key is false return the Accordion Header without line through Task
          } else if (tasks[key].complete === false) {
            return (
              <Accordion.Item key={key} eventKey={key} className={`${'animate__animated animate__fadeIn'} ${styles.taskItem}`}>
                <Accordion.Header className={styles.taskHeader}>
                  {tasks[key].task}
                </Accordion.Header>
                <Accordion.Body className={styles.accordionBody}>

                  <Notes keyID={key} tasks={tasks} setTasks={setTasks} />

                </Accordion.Body>
              </Accordion.Item>
            )
            // If anything else return an error message to the console
          } else {
            console.error('Error within Complete Key of Task State Object');
          }
        })
      )
    } 
  }

// ----------------------------------------------------------------------------------------------------------------------------------------
// RETURN - JSX
// ----------------------------------------------------------------------------------------------------------------------------------------
  return (
    <div className={styles.container}>
      {/* Head of page - Includes title (tab name), meta data, tab icon */}
      <Head>
        <title>Task Manager</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Main element containing components of the page */}
      <main className={styles.main}>

        <h1>TASK MANAGER</h1>

        {/* Add New Task form - excute handleSubmit function when submitted */}
        <form onSubmit={handleSubmit} className={styles.taskForm}>
          <input maxLength={40} className={styles.taskFormInput} name='newTask' type='text' onChange={handleInput} value={newTask.task} autoComplete='off' />
          <input className={styles.formBtn} type='submit' value='ADD TASK' />
        </form>

        {/* Ternary expression - If Error State true display an error message, if false, display null */}
        {
          error ? <div><span className={`${'animate__animated animate__shakeX'} ${styles.errorSpan}`}>Field cannot be left blank</span></div> : null
        }

        <Accordion className={styles.tasksContainer}>

          {/* Execute the displayTasks function to return the contents of the Task State Object. If the object key length is zero, a string (NO TASKS) will be returned */}
          {displayTasks()}

        </Accordion>

      </main>

    </div>
  )
}

// ----------------------------------------------------------------------------------------------------------------------------------------
// CHILD COMPONENT - Notes
// ----------------------------------------------------------------------------------------------------------------------------------------
// Notes component's props include;
// keyID - the key of the related task in the Task State Object
// tasks - the Tasks State Object
// setTasks - the Tasks State Object's setState function
const Notes = ({ keyID, tasks, setTasks }) => {
// ----------------------------------------------------------------------------------------------------------------------------------------
// STATE
// ----------------------------------------------------------------------------------------------------------------------------------------
  // New Note State - Object - Holds data on a new note which is to be added to the keyID of the Tasks Object. Used in relation to the input note field
  const [newNote, setNewNote] = useState({
    note: '',
    completed: false, 
  });
  
  // Error State - Boolean - When state is true, an error message will display in relation to the input note field
  const [error, setError] = useState(false);

  // Button State - Boolean - When state is false, the bin SVG will be displayed, when true, the close SVG will be displayed to hide the delete button and terminate the delete task process
  const [deleteBtn, setDeleteBtn] = useState(false);

// ----------------------------------------------------------------------------------------------------------------------------------------
// FUNCTIONS
// ----------------------------------------------------------------------------------------------------------------------------------------
  // handleNoteInput - Function (event) - 
  const handleNoteInput = (event) => {
    let value = event.target.value;
    setNewNote({
      note: value,
      completed: false,
    })
  }

  // handleNoteSubmit - Function (event) - 
  const handleNoteSubmit = (event) => {
    event.preventDefault();
    let UUID = uuidv4();
    if (newNote.note === '') {
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 3000)
    } else {
      setTasks({
        ...tasks,
        [keyID]: {
          ...tasks[keyID],
          notes: {
            ...tasks[keyID].notes,
            [UUID]: newNote,
          }
        }
      })
      setNewNote({
        note: '',
      })
    }
  }

  // handleCompleteTask - Function (event) - 
  const handleCompleteTask = (event) => {
    if (event.target.classList.contains(`${styles.completeBtnAcitoned}`)) {
      // CHANGE CIRCLE COLOR TO GREEN FOR COMPLETE
      event.target.classList.remove(`${styles.completeBtnAcitoned}`)

      // UPDATE TASKS STATE FOR COMPLETE TO FALSE
      setTasks({
        ...tasks,
        [keyID]: {
          ...tasks[keyID],
          complete: false,
        }
      })

    } else if (!event.target.classList.contains(`${styles.completeBtnAcitoned}`)) {
      // CHANGE CIRCLE COLOR TO WHITE FOR INCOMPLETE
      event.target.classList.add(`${styles.completeBtnAcitoned}`)

      // UPDATE TASKS STATE FOR COMPLETE TO TRUE
      setTasks({
        ...tasks,
        [keyID]: {
          ...tasks[keyID],
          complete: true,
          completed: true,
        }
      })
    }
  }

  // deleteTaskWarning - Function - 
  const deleteTaskWarning = () => {
    setDeleteBtn(!deleteBtn)
  }

  // handleDeleteTask - Function - 
  const handleDeleteTask = () => {
    setTasks(_.omit(tasks, keyID))
    setDeleteBtn(false)
  }

  // handleCompleteNote - Function (event) - 
  const handleCompleteNote = (event) => {
    let id = event.target.id;
    let completedNote = ('note-' + id)
    let note = document.getElementById(completedNote)
    let noteCompleteBtn = document.getElementById(id)

    if (noteCompleteBtn.classList.contains(`${styles.completeBtnAcitoned}`)) {
      
      setTasks({...tasks, 
        [keyID]: {
          ...tasks[keyID],
        notes: {
          ...tasks[keyID].notes,
          [id]: {
            ...tasks[keyID].notes[id],
            completed: false,
          }
        }}
        })
    } else if(!noteCompleteBtn.classList.contains(`${styles.completeBtnAcitoned}`)) {
      
      setTasks({...tasks, 
        [keyID]: {
          ...tasks[keyID],
        notes: {
          ...tasks[keyID].notes,
          [id]: {
            ...tasks[keyID].notes[id],
            completed: true,
          }
        }}
        })
    }
  }


  const binTaskSVG = (
    <svg onClick={deleteTaskWarning} xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className={`${'bi bi-trash'} ${styles.biIcon}`} viewBox="0 0 16 16">
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
      <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
    </svg>
  );

// ----------------------------------------------------------------------------------------------------------------------------------------
// RETURN - JSX
// ----------------------------------------------------------------------------------------------------------------------------------------
  return (
    <div className={styles.taskAccordionContents}>
      <div id={'task-notes-' + keyID} className={styles.taskNotesContainer}>

        <div className={styles.notesHeader}>
          <h2 className={styles.notesTitle}>Notes:</h2>
          <div className={styles.taskBtnsContainer}>

            <TimePlayer tasks={tasks} setTasks={setTasks} keyID={keyID} />

            {
              deleteBtn ?
                <svg className={styles.closeBtn} onClick={deleteTaskWarning} xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                </svg>
                :
                binTaskSVG
            }

            <button className={styles.completeBtn} onClick={handleCompleteTask}></button>

          </div>
        </div>

        <ul className={`${styles.notesList}`}>
          {
            Object.keys(tasks[keyID].notes).reverse().map((key, index) => {
         
              if(tasks[keyID].notes[key].completed === true) {
                return (
                  <>
                    <div className={styles.notesContainer} key={key}>
                      <li id={'note-' + key} className={`${styles.note} ${styles.noteHeaderCompleted}`}>
                        {tasks[keyID].notes[key].note}
                      </li>
                      <div className={styles.noteBtnsContainer}>
                        <BinNoteSVG keyID={keyID} noteID={key} tasks={tasks} setTasks={setTasks} />
                        <button id={key} onClick={handleCompleteNote} className={`${styles.completeBtn} ${styles.noteCompleteBtn} ${styles.completeBtnAcitoned}`}></button>
                      </div>
                    </div>
                    <hr />
                  </>
                )
              } else {
                return (
                  <>
                    <div className={`${'animate__animated animate__fadeIn'} ${styles.notesContainer}` } key={key}>
                      <li id={'note-' + key} className={`${styles.note}`}>
                        {tasks[keyID].notes[key].note}
                      </li>
                      <div className={styles.noteBtnsContainer}>
                        <BinNoteSVG keyID={keyID} noteID={key} tasks={tasks} setTasks={setTasks} />
                        <button id={key} onClick={handleCompleteNote} className={`${styles.completeBtn} ${styles.noteCompleteBtn}`}></button>
                      </div>
                    </div>
                    <hr />
                  </>
                )
              }
            
            })
          }

        </ul>

        <form className={styles.notesForm} onSubmit={handleNoteSubmit}>
          <input autoComplete='off' className={styles.noteInput} type='text' name={keyID} value={newNote.note} onChange={handleNoteInput} />
          <input className={`${styles.formBtn} ${styles.notesBtn}`} type='submit' value='ADD' />
        </form>
        {
          error ? <span className={`${'animate__animated animate__shakeX'} ${styles.errorSpan} ${styles.notesError}`}>Field cannot be left blank</span> : null
        }
      </div>
      {deleteBtn && <button onClick={handleDeleteTask} className={`${'animate__animated animate__slideInRight'} ${styles.deleteTaskBtn}`}>DELETE</button>}

    </div>
  )
}

// ----------------------------------------------------------------------------------------------------------------------------------------
// CHILD COMPONENT - BinNoteSVG
// ----------------------------------------------------------------------------------------------------------------------------------------
// BinNoteSVG component's props include;
// keyID - the key of the related task in the Task State Object
// noteID - 
// tasks - the Tasks State Object
// setTasks - the Tasks State Object's setState function
const BinNoteSVG = ({ keyID, noteID, tasks, setTasks }) => {

// ----------------------------------------------------------------------------------------------------------------------------------------
// FUNCTIONS
// ----------------------------------------------------------------------------------------------------------------------------------------
  const deleteNote = () => {
    let currentNotes = tasks[keyID].notes;
    let updatedNotes = _.omit(currentNotes, noteID)

    setTasks({
      ...tasks,
      [keyID]: {
        ...tasks[keyID],
        notes: updatedNotes,
      }
    })
  }

  return (
    <svg onClick={deleteNote} xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className={`${'bi bi-trash'} ${styles.biIcon} ${styles.binNoteIcon}`} viewBox="0 0 16 16">
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
      <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
    </svg>
  )
}

// ----------------------------------------------------------------------------------------------------------------------------------------
// CHILD COMPONENT - TimePlayer
// ----------------------------------------------------------------------------------------------------------------------------------------
const TimePlayer = ({ tasks, keyID }) => {
  const [initialStart, setInitialStart] = useState(true);
  const [start, setStart] = useState(false)
  const [pause, setPause] = useState(false);
  const [time, setTimer] = useState(0);

  const countRef = useRef(null);

  // START TIMER
  const handleStartTimer = () => {
    countRef.current = setInterval(() => {
      setTimer((time) => time + 1)
    }, 1000)
    setInitialStart(false);
    setPause(true);
  }

  // PAUSE TIMER
  const handlePauseTimer = (event) => {
    setPause(!pause)
    setStart(!start)

    clearInterval(countRef.current)
  }

  // RESUME TIMER
  const handleResumeTimer = (event) => {
    setPause(!pause)
    setStart(!start)

    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1)
    }, 1000)
  }

  const formatTime = () => {
    const getSeconds = `0${(time % 60)}`.slice(-2)
    const minutes = `${Math.floor(time / 60)}`
    const getMinutes = `0${minutes % 60}`.slice(-2)
    const getHours = `0${Math.floor(time / 3600)}`.slice(-2)

    return `${getHours} : ${getMinutes} : ${getSeconds}`
  }

  useEffect(() => {
    if (tasks[keyID].complete === true) {
      setInitialStart(false)
      setStart(false)
      setPause(false)

      clearInterval(countRef.current)
    } else if (tasks[keyID].complete === false && tasks[keyID].completed === true) {
      setPause(true)
      countRef.current = setInterval(() => {
        setTimer((timer) => timer + 1)
      }, 1000)
    }
  }, [tasks[keyID].complete])

  return (
    <div className={styles.timerContainer}>

      <div id={`${'timer' + keyID}`} className={styles.time}>
        {formatTime()}
      </div>

      {
        initialStart &&
        <svg id='play' xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" onClick={handleStartTimer} className={`${'bi bi-play player-icon'} ${styles.biIcon}`} viewBox="0 0 16 16">
          <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
        </svg>
      }
      {
        start &&
        <svg id='play' xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" onClick={handleResumeTimer} className={`${'bi bi-play player-icon'} ${styles.biIcon}`} viewBox="0 0 16 16">
          <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
        </svg>
      }
      {
        pause &&
        <svg id='pause' xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" onClick={handlePauseTimer} className={`${styles.biIcon}`} viewBox="0 0 16 16">
          <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z" />
        </svg>
      }
    </div>
  );
}

