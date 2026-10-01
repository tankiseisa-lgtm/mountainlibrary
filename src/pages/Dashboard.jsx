import { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'

function Dashboard() {
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem('books')

    if (!savedBooks) {
      return []
    }

    try {
      return JSON.parse(savedBooks)
    } catch {
      localStorage.removeItem('books')
      return []
    }
  })

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

  const [transactions, setTransactions] = useState(() => {
    const savedTransactions =
      localStorage.getItem('transactions')

    if (!savedTransactions) {
      return []
    }

    try {
      return JSON.parse(savedTransactions)
    } catch {
      localStorage.removeItem('transactions')
      return []
    }
  })

  useEffect(() => {
    function loadData() {
      const savedBooks =
        localStorage.getItem('books')

      const savedUsers =
        localStorage.getItem('users')

      const savedTransactions =
        localStorage.getItem('transactions')

      try {
        setBooks(
          savedBooks
            ? JSON.parse(savedBooks)
            : []
        )

        setUsers(
          savedUsers
            ? JSON.parse(savedUsers)
            : []
        )

        setTransactions(
          savedTransactions
            ? JSON.parse(savedTransactions)
            : []
        )
      } catch {
        console.log('Could not load library data.')
      }
    }

    loadData()
  }, [])

  const totalBooks = books.reduce(
    (total, book) =>
      total +
      (book.initialQuantity || book.quantity),
    0
  )

  const availableBooks = books.reduce(
    (total, book) =>
      total + book.quantity,
    0
  )

  const borrowedBooks = transactions.reduce(
    (total, transaction) =>
      transaction.status === 'Borrowed'
        ? total + transaction.quantity
        : total,
    0
  )

  const lowStock = books.filter(
    (book) => book.quantity <= 2
  ).length

  const totalMembers = users.length

  const totalLibrarians = 1

  return (
    <div className="page">

      <Navbar />

      <main className="main-content">

        <h1>Dashboard</h1>

        <h2>
          Welcome to Mountain Library
        </h2>

        <div className="dashboard-cards">

          <div className="card">
            <h3>Total Books</h3>
            <p>{totalBooks}</p>
          </div>

          <div className="card">
            <h3>Available Books</h3>
            <p>{availableBooks}</p>
          </div>

          <div className="card">
            <h3>Books Borrowed</h3>
            <p>{borrowedBooks}</p>
          </div>

          <div className="card">
            <h3>Low Stock</h3>
            <p>{lowStock}</p>
          </div>

          <div className="card">
            <h3>Members</h3>
            <p>{totalMembers}</p>
          </div>

          <div className="card">
            <h3>Librarians</h3>
            <p>{totalLibrarians}</p>
          </div>

        </div>

        <h2 className="dashboard-section-title">
          Member Activity
        </h2>

        {transactions.length === 0 ? (

          <div className="list-item">
            <p>
              No member activity yet.
            </p>
          </div>

        ) : (

          <div className="list-container">

            {[...transactions]
              .reverse()
              .map((transaction) => (

                <div
                  className="transaction-item"
                  key={transaction.id}
                >

                  <h3>
                    {transaction.bookTitle}
                  </h3>

                  <p>
                    Member:{' '}
                    {transaction.userName}
                  </p>

                  <p>
                    Membership ID:{' '}
                    {transaction.membershipId}
                  </p>

                  <p>
                    Quantity:{' '}
                    {transaction.quantity}
                  </p>

                  <p>
                    Borrowed:{' '}
                    {transaction.date}
                  </p>

                  <p>
                    Status:{' '}
                    {transaction.status}
                  </p>

                  {transaction.returnDate && (
                    <p>
                      Returned:{' '}
                      {transaction.returnDate}
                    </p>
                  )}

                </div>

              ))}

          </div>

        )}

      </main>

    </div>
  )
}

export default Dashboard