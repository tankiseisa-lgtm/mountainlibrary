import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  const [currentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser')

    if (!savedUser) {
      return null
    }

    try {
      return JSON.parse(savedUser)
    } catch {
      localStorage.removeItem('currentUser')
      return null
    }
  })

  function logout() {
    localStorage.removeItem('currentUser')
    navigate('/')
  }

  if (!currentUser) {
    return null
  }

  return (
    <nav className="navbar">

      <div className="navbar-left">
        <h2>Mountain Library</h2>
      </div>

      <div className="navbar-links">

        {currentUser.role === 'librarian' && (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? 'active-nav-link' : ''
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/books"
              className={({ isActive }) =>
                isActive ? 'active-nav-link' : ''
              }
            >
              Books
            </NavLink>

            <NavLink
              to="/users"
              className={({ isActive }) =>
                isActive ? 'active-nav-link' : ''
              }
            >
              Members
            </NavLink>
          </>
        )}

        {currentUser.role === 'member' && (
          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              isActive ? 'active-nav-link' : ''
            }
          >
            My Activity
          </NavLink>
        )}

      </div>

      <div className="navbar-user">
        <span>{currentUser.name}</span>

        <button onClick={logout}>
          Logout
        </button>
      </div>

    </nav>
  )
}

export default Navbar