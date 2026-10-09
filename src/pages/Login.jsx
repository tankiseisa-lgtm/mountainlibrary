import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [name, setName] = useState('')
  const [membershipId, setMembershipId] =
    useState('')

  const navigate = useNavigate()

  function handleLogin(event) {
    event.preventDefault()

    if (!name || !membershipId) {
      alert(
        'Please enter your name and membership ID.'
      )
      return
    }

    if (
      name.toLowerCase() === 'seisa' &&
      membershipId
        .toUpperCase()
        .startsWith('L')
    ) {
      const librarian = {
        name: 'Seisa',
        membershipId,
        role: 'librarian'
      }

      localStorage.setItem(
        'currentUser',
        JSON.stringify(librarian)
      )

      navigate('/dashboard')
      return
    }

    const users =
      JSON.parse(
        localStorage.getItem('users')
      ) || []

    const member = users.find(
      (user) =>
        user.name.toLowerCase() ===
          name.toLowerCase() &&
        user.membershipId.toUpperCase() ===
          membershipId.toUpperCase()
    )

    if (member) {
      const currentUser = {
        name: member.name,
        membershipId: member.membershipId,
        role: 'member'
      }

      localStorage.setItem(
        'currentUser',
        JSON.stringify(currentUser)
      )

      navigate('/transactions')
      return
    }

    alert(
      'Invalid name or membership ID.'
    )
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Mountain Library</h1>

        <p>
          Community Library Management System
        </p>

        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>Membership ID</label>

            <input
              type="text"
              value={membershipId}
              onChange={(e) =>
                setMembershipId(
                  e.target.value
                )
              }
              placeholder="Example: M001"
            />
          </div>

          <button
            className="primary-button"
            type="submit"
          >
            Login
          </button>

          <div className="demo-login">
            <strong>Demo Login</strong>
            <p>Name: Seisa</p>
            <p>Membership ID: L001</p>
          </div>

          <p className="register-message">
            New to the system? Approach our
            friendly librarian to register you.
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
