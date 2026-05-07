import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'https://team-task-manager-production-e1e6.up.railway.app'

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [taskTitle, setTaskTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [selectedProj, setSelectedProj] = useState('')
  const [newProjName, setNewProjName] = useState('')
  const [activeSection, setActiveSection] = useState('board')

  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')
  const config = { headers: { Authorization: 'Bearer ' + token } }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line
  }, [])

  const loadData = async () => {
    const t = await axios.get(`${API}/api/tasks`, config)
    const p = await axios.get(`${API}/api/projects`, config)
    setTasks(t.data)
    setProjects(p.data)
  }

  const addTask = async () => {
    if (!taskTitle.trim()) return
    const res = await axios.post(`${API}/api/tasks`, {
      title: taskTitle, due: dueDate || null, proj_id: selectedProj || null
    }, config)
    setTasks(prev => [...prev, { id: res.data.id, title: taskTitle, status: 'todo', due: dueDate }])
    setTaskTitle('')
    setDueDate('')
  }

  const changeStatus = async (id, status) => {
    await axios.patch(`${API}/api/tasks/${id}/status`, { status }, config)
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
  }

  const addProject = async () => {
    if (!newProjName.trim()) return
    const res = await axios.post(`${API}/api/projects`, { title: newProjName }, config)
    setProjects(prev => [...prev, { id: res.data.id, title: newProjName }])
    setNewProjName('')
  }

  const deleteTask = async (id) => {
    await axios.delete(`${API}/api/tasks/${id}`, config)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const logout = () => { localStorage.clear(); navigate('/login') }

  const todoList = tasks.filter(t => t.status === 'todo')
  const inProgList = tasks.filter(t => t.status === 'in_progress')
  const doneList = tasks.filter(t => t.status === 'done')
  const today = new Date()
  const overdueList = tasks.filter(t => t.due && new Date(t.due) < today && t.status !== 'done')

  const columns = [
    { key: 'todo', label: 'To Do', color: '#6366f1', bg: '#1e1e2e', tasks: todoList, next: 'in_progress', nextLabel: 'Start' },
    { key: 'in_progress', label: 'In Progress', color: '#f59e0b', bg: '#1e1e1a', tasks: inProgList, next: 'done', nextLabel: 'Done' },
    { key: 'done', label: 'Done', color: '#10b981', bg: '#1a1e1e', tasks: doneList, next: null, nextLabel: null },
  ]

  return (
    <div style={s.shell}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sidebarLogo}>✦ TaskFlow</div>

        <div style={s.userBadge}>
          <div style={s.avatar}>{user.name?.[0]?.toUpperCase()}</div>
          <div>
            <div style={s.userName}>{user.name}</div>
            <div style={{ ...s.roleTag, ...(user.role === 'admin' ? s.roleAdmin : s.roleMember) }}>
              {user.role === 'admin' ? '⚡ Admin' : '👤 Member'}
            </div>
          </div>
        </div>

        <nav style={s.nav}>
          {[
            { key: 'board', icon: '▦', label: 'Board' },
            { key: 'projects', icon: '◈', label: 'Projects' },
          ].map(item => (
            <button key={item.key} onClick={() => setActiveSection(item.key)}
              style={{ ...s.navBtn, ...(activeSection === item.key ? s.navBtnActive : {}) }}>
              <span style={{ fontSize: '16px' }}>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        <button onClick={logout} style={s.logoutBtn}>↩ Logout</button>
      </aside>

      {/* Main */}
      <main style={s.main}>

        {/* Stats row */}
        <div style={s.statsRow}>
          {[
            { label: 'Total Tasks', value: tasks.length, color: '#6366f1' },
            { label: 'In Progress', value: inProgList.length, color: '#f59e0b' },
            { label: 'Completed', value: doneList.length, color: '#10b981' },
            { label: 'Overdue', value: overdueList.length, color: '#ef4444' },
          ].map(stat => (
            <div key={stat.label} style={s.statCard}>
              <div style={{ ...s.statNum, color: stat.color }}>{stat.value}</div>
              <div style={s.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {overdueList.length > 0 && (
          <div style={s.overdueBanner}>
            ⚠️ {overdueList.length} task{overdueList.length > 1 ? 's are' : ' is'} overdue
          </div>
        )}

        {/* Board section */}
        {activeSection === 'board' && (
          <>
            {/* Add task bar */}
            <div style={s.addBar}>
              <input style={s.addInput} placeholder="+ Add a task..."
                value={taskTitle} onChange={e => setTaskTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTask()} />
              <input type="date" value={dueDate}
                onChange={e => setDueDate(e.target.value)} style={s.dateInput} />
              <select value={selectedProj} onChange={e => setSelectedProj(e.target.value)} style={s.selectInput}>
                <option value="">No project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
              <button onClick={addTask} style={s.addBtn}>Add</button>
            </div>

            {/* Kanban columns */}
            <div style={s.board}>
              {columns.map(col => (
                <div key={col.key} style={{ ...s.column, background: col.bg }}>
                  <div style={s.colHeader}>
                    <span style={{ ...s.colDot, background: col.color }}></span>
                    <span style={s.colTitle}>{col.label}</span>
                    <span style={s.colCount}>{col.tasks.length}</span>
                  </div>

                  <div style={s.cardList}>
                    {col.tasks.length === 0 && (
                      <div style={s.emptyCol}>no tasks here</div>
                    )}
                    {col.tasks.map(t => (
                      <div key={t.id} style={{
                        ...s.taskCard,
                        borderLeft: `3px solid ${col.color}`,
                        opacity: col.key === 'done' ? 0.6 : 1
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ ...s.taskTitle, textDecoration: col.key === 'done' ? 'line-through' : 'none' }}>
                            {t.title}
                          </span>
                          {user.role === 'admin' && (
                            <button onClick={() => deleteTask(t.id)} style={s.deleteBtn}>✕</button>
                          )}
                        </div>
                        {t.due && (
                          <div style={{
                            ...s.dueTag,
                            color: new Date(t.due) < today && col.key !== 'done' ? '#ef4444' : '#6b6b8a'
                          }}>
                            📅 {t.due}
                          </div>
                        )}
                        {col.next && (
                          <button onClick={() => changeStatus(t.id, col.next)}
                            style={{ ...s.moveBtn, borderColor: col.color, color: col.color }}>
                            {col.nextLabel} →
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Projects section */}
        {activeSection === 'projects' && (
          <div>
            <h3 style={s.sectionTitle}>Projects</h3>

            {user.role === 'admin' && (
              <div style={s.addBar}>
                <input style={s.addInput} placeholder="New project name..."
                  value={newProjName} onChange={e => setNewProjName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addProject()} />
                <button onClick={addProject} style={s.addBtn}>Create</button>
              </div>
            )}

            <div style={s.projectGrid}>
              {projects.length === 0 && (
                <div style={s.emptyCol}>no projects yet</div>
              )}
              {projects.map(p => {
                const projTasks = tasks.filter(t => String(t.proj_id) === String(p.id))
                const doneTasks = projTasks.filter(t => t.status === 'done')
                const pct = projTasks.length > 0 ? Math.round((doneTasks.length / projTasks.length) * 100) : 0
                return (
                  <div key={p.id} style={s.projectCard}>
                    <div style={s.projectName}>◈ {p.title}</div>
                    <div style={s.projectMeta}>{projTasks.length} tasks · {doneTasks.length} done</div>
                    <div style={s.progressBar}>
                      <div style={{ ...s.progressFill, width: pct + '%' }}></div>
                    </div>
                    <div style={s.progressPct}>{pct}% complete</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

const s = {
  shell: { display: 'flex', minHeight: '100vh', background: '#0f0f13', fontFamily: "'Georgia', serif", color: '#f1f0ff' },
  sidebar: {
    width: '220px', minHeight: '100vh', background: '#13131c',
    borderRight: '1px solid #2a2a3a', padding: '28px 16px',
    display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0,
  },
  sidebarLogo: { color: '#a78bfa', fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.05em', marginBottom: '24px', paddingLeft: '8px' },
  userBadge: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 8px', background: '#1a1a24', borderRadius: '10px', marginBottom: '16px' },
  avatar: { width: '34px', height: '34px', borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', flexShrink: 0 },
  userName: { color: '#e0e0f0', fontSize: '13px', fontWeight: 'bold' },
  roleTag: { fontSize: '11px', padding: '2px 6px', borderRadius: '4px', marginTop: '3px', display: 'inline-block' },
  roleAdmin: { background: '#2d1f4e', color: '#a78bfa' },
  roleMember: { background: '#1a2a1a', color: '#4ade80' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  navBtn: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#6b6b8a', fontSize: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' },
  navBtnActive: { background: '#2d1f4e', color: '#a78bfa' },
  logoutBtn: { background: 'none', border: 'none', color: '#4a4a6a', fontSize: '13px', cursor: 'pointer', padding: '10px 12px', textAlign: 'left', marginTop: 'auto' },
  main: { flex: 1, padding: '32px', overflowY: 'auto' },
  statsRow: { display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' },
  statCard: { flex: 1, minWidth: '120px', background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: '12px', padding: '20px 24px' },
  statNum: { fontSize: '32px', fontWeight: 'bold', lineHeight: 1 },
  statLabel: { color: '#6b6b8a', fontSize: '12px', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  overdueBanner: { background: '#2d1a1a', border: '1px solid #5a2a2a', color: '#f87171', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' },
  addBar: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  addInput: { flex: 1, minWidth: '160px', background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: '8px', padding: '10px 14px', color: '#f1f0ff', fontSize: '14px', outline: 'none' },
  dateInput: { background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: '8px', padding: '10px 12px', color: '#9090b0', fontSize: '13px', outline: 'none' },
  selectInput: { background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: '8px', padding: '10px 12px', color: '#9090b0', fontSize: '13px', outline: 'none' },
  addBtn: { background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer' },
  board: { display: 'flex', gap: '16px', alignItems: 'flex-start' },
  column: { flex: 1, borderRadius: '12px', border: '1px solid #2a2a3a', padding: '16px', minWidth: '200px' },
  colHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' },
  colDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  colTitle: { color: '#c0c0d8', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.06em', flex: 1 },
  colCount: { background: '#2a2a3a', color: '#6b6b8a', fontSize: '11px', padding: '2px 7px', borderRadius: '10px' },
  cardList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  emptyCol: { color: '#3a3a5a', fontSize: '13px', textAlign: 'center', padding: '20px 0' },
  taskCard: { background: '#13131c', borderRadius: '8px', padding: '12px 14px', border: '1px solid #2a2a3a' },
  taskTitle: { color: '#e0e0f0', fontSize: '14px', lineHeight: 1.4 },
  deleteBtn: { background: 'none', border: 'none', color: '#3a3a5a', cursor: 'pointer', fontSize: '12px', padding: '0 0 0 8px', flexShrink: 0 },
  dueTag: { fontSize: '11px', marginTop: '6px' },
  moveBtn: { background: 'none', border: '1px solid', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer', marginTop: '10px', display: 'block' },
  sectionTitle: { color: '#c0c0d8', fontSize: '16px', fontWeight: 'normal', marginBottom: '20px', letterSpacing: '0.05em' },
  projectGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' },
  projectCard: { background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: '12px', padding: '20px' },
  projectName: { color: '#e0e0f0', fontSize: '15px', marginBottom: '6px' },
  projectMeta: { color: '#6b6b8a', fontSize: '12px', marginBottom: '14px' },
  progressBar: { height: '4px', background: '#2a2a3a', borderRadius: '2px', overflow: 'hidden', marginBottom: '6px' },
  progressFill: { height: '100%', background: '#7c3aed', borderRadius: '2px', transition: 'width 0.4s' },
  progressPct: { color: '#6b6b8a', fontSize: '11px' },
}

export default Dashboard