import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'
import Accordion from 'react-bootstrap/Accordion';
var Timer = require('timer-machine');

const TimePlayer = ({ tasks, setTasks, keyID }) => {
  const [initialStart, setInitialStart] = useState(true);
  const [start, setStart] = useState(false)
  const [pause, setPause] = useState(false);
  const [active, setActive] = useState(false);
  const [time, setTimer] = useState(0);
  const countRef = useRef(null);

  // START TIMER
  const handleStartTimer = () => {
    countRef.current = setInterval(()=>{
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

  return (
    <div>
    {/* {time} */}
    {formatTime()}

    {
      initialStart && 
      <svg id='play' xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" onClick={handleStartTimer} className="bi bi-play player-icon" viewBox="0 0 16 16">
      <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
    </svg>
    } 
    {
      start &&
      <svg id='play' xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" onClick={handleResumeTimer} className="bi bi-play player-icon" viewBox="0 0 16 16">
      <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
    </svg>
    }
      {
        pause &&
          <svg id='pause' xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" onClick={handlePauseTimer} viewBox="0 0 16 16">
            <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z" />
          </svg>
      }
    </div>
  );
}

const Notes = ({ keyID, tasks, setTasks }) => {
  const [newNote, setNewNote] = useState(['']);
  const [error, setError] = useState(false);

  const handleNoteInput = (event) => {
    let value = event.target.value;
    setNewNote([value])
  }

  const handleNoteSubmit = (event) => {
    event.preventDefault();
    if (newNote[0] === '') {
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 3000)
    } else {
      tasks[keyID].notes.push(newNote)
      setNewNote([''])
    }
  }

  return (
    <div>
      <div className={styles.notesHeader}>
        <h2>Notes:</h2>
        <TimePlayer tasks={tasks} setTasks={setTasks} keyID={keyID} />
      </div>
        <ul>
          {
            tasks[keyID].notes.map((i, index) => {
              return (<li key={index}>{i[0]}</li>)

            })
          }
        </ul>

      <form className={styles.notesForm} onSubmit={handleNoteSubmit}>
        <input className={styles.noteInput} type='text' name={keyID} value={newNote[0]} onChange={handleNoteInput} />
        <input className={`${styles.formBtn} ${styles.notesBtn}`} type='submit' value='ADD' />
      </form>
      {
        error ? <span className={styles.errorSpan}>Field cannot be left blank</span> : ''
      }
    </div>
  )
}

export default function Home() {

  const [tasks, setTasks] = useState({});

  const [newTask, setNewTask] = useState({
    taskID: null,
    task: '',
    notes: [],
  });

  const [error, setError] = useState(false);

  // ADD TASK
  const handleSubmit = (event) => {
    event.preventDefault();

    if (newTask.task === '') {
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 3000)
    } else {
      setTasks({ ...tasks, [newTask.taskID]: newTask })
      setNewTask({
        taskID: null,
        task: '',
        notes: [],
      })
    }
  }

  // HANDLE TASK INPUT
  const handleInput = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    let ID = Object.keys(tasks).length + 1;
    const taskTimer = new Timer();

    setNewTask({
      taskID: ID,
      task: value,
      notes: [],
    })
  }

  // DISPLAY TASKS FUNCTION
  const displayTasks = () => {
    if (Object.keys(tasks).length == 0) {
      return (<p>NO TASKS</p>)
    } else {
      return (
        Object.keys(tasks).map((key, index) => {
          return (
            <Accordion.Item key={index} eventKey={index} className={styles.taskItem}>
              <Accordion.Header className={styles.taskHeader}>
                {tasks[key].task}
              </Accordion.Header>
              <Accordion.Body>
                
                <Notes keyID={key} tasks={tasks} setTasks={setTasks} />

              </Accordion.Body>
            </Accordion.Item>
          )
        })
      )
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Task Manager</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

          <h1>TASK MANAGER</h1>
          
          <form onSubmit={handleSubmit} className={styles.taskForm}>
            <input className={styles.taskFormInput} name='newTask' type='text' onChange={handleInput} value={newTask.task} autoComplete='off' />
            <input className={styles.formBtn} type='submit' value='ADD TASK' />
          </form>
          
          {
            error ? <div><span className={styles.errorSpan}>Field cannot be left blank</span></div> : ''
          }
          
          <Accordion className={styles.tasksContainer}>

            {displayTasks()}

          </Accordion>

      </main>

    </div>
  )
}