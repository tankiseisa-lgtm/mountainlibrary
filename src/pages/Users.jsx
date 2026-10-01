import { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'

function Users() {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users')

    if (!savedUsers) {
      return []
    }

    try {
      return JSON.parse(savedUsers)
    } catch {
      localStorage.removeItem('users')
      return []
    }
  })

  const [name, setName] = useState('')
  const [membershipId, setMembershipId] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    localStorage.setItem(
      'users',
      JSON.stringify(users)
    )
  }, [users])

  function clearForm() {
    setName('')
    setMembershipId('')
    setEditingId(null)
  }

  function addOrUpdateUser(event) {
    event.preventDefault()

    if (!name || !membershipId) {
      alert('Please fill in all fields.')
      return
    }

    if (editingId !== null) {
      const updatedUsers = users.map((user) =>
        user.id === editingId
          ? {
              ...user,
              name,
              membershipId
            }
          : user
      )

      setUsers(updatedUsers)
      clearForm()
      return
    }

    const newUser = {
      id: Date.now(),
      name,
      membershipId
    }

    setUsers([...users, newUser])
    clearForm()
  }

  function editUser(user) {
    setName(user.name)
    setMembershipId(user.membershipId)
    setEditingId(user.id)
  }

  function deleteUser(id) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this member?'
    )

    if (confirmDelete) {
      setUsers(
        users.filter((user) => user.id !== id)
      )
    }
  }

  return (
    <div className="page">

      <Navbar />

      <main className="main-content">

        <h1>Members</h1>

        <h2>Member Management</h2>

        <div className="form-box">

          <form onSubmit={addOrUpdateUser}>

            <div className="form-group">
              <label>Member Name</label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter member name"
              />
            </div>

            <div className="form-group">
              <label>Membership ID</label>

              <input
                type="text"
                value={membershipId}
                onChange={(e) =>
                  setMembershipId(e.target.value)
                }
                placeholder="Example: M001"
              />
            </div>

            <button
              className="primary-button"
              type="submit"
            >
              {editingId !== null
                ? 'Update Member'
                : 'Add Member'}
            </button>

            {editingId !== null && (
              <button
                className="secondary-button"
                type="button"
                onClick={clearForm}
              >
                Cancel
              </button>
            )}

          </form>

        </div>

        <h2>Library Members</h2>

        {users.length === 0 ? (

          <p>
            No members have been added yet.
          </p>

        ) : (

          <div className="list-container">

            {users.map((user) => (

              <div
                className="list-item"
                key={user.id}
              >

                <h3>{user.name}</h3>

                <p>
                  Membership ID: {user.membershipId}
                </p>

                <button
                  className="primary-button"
                  onClick={() =>
                    editUser(user)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-button"
                  onClick={() =>
                    deleteUser(user.id)
                  }
                >
                  Delete
                </button>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  )
}

export default Users