import { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'

function Transactions() {
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

  const [selectedBook, setSelectedBook] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [action, setAction] = useState('borrow')

  const currentUser = (() => {
    const savedUser =
      localStorage.getItem('currentUser')

    if (!savedUser) {
      return null
    }

    try {
      return JSON.parse(savedUser)
    } catch {
      localStorage.removeItem('currentUser')
      return null
    }
  })()

  useEffect(() => {
    localStorage.setItem(
      'transactions',
      JSON.stringify(transactions)
    )
  }, [transactions])

  useEffect(() => {
    localStorage.setItem(
      'books',
      JSON.stringify(books)
    )
  }, [books])

  const myTransactions = transactions.filter(
    (transaction) =>
      transaction.membershipId ===
      currentUser?.membershipId
  )

  function handleTransaction(event) {
    event.preventDefault()

    if (!selectedBook) {
      alert('Please select a book.')
      return
    }

    const amount = Number(quantity)

    if (amount < 1) {
      alert('Quantity must be at least 1.')
      return
    }

    const book = books.find(
      (book) => book.id === Number(selectedBook)
    )

    if (!book) {
      alert('Book not found.')
      return
    }

    if (action === 'borrow') {
      borrowBook(book, amount)
    } else {
      returnBook(book, amount)
    }

    setSelectedBook('')
    setQuantity(1)
  }

  function borrowBook(book, amount) {
    if (book.quantity < amount) {
      alert(
        `Only ${book.quantity} copy/copies of this book are available.`
      )
      return
    }

    const updatedBooks = books.map(
      (bookItem) =>
        bookItem.id === book.id
          ? {
              ...bookItem,
              quantity:
                bookItem.quantity - amount
            }
          : bookItem
    )

    setBooks(updatedBooks)

    const newTransaction = {
      id: Date.now(),
      bookId: book.id,
      bookTitle: book.title,
      userName: currentUser.name,
      membershipId:
        currentUser.membershipId,
      quantity: amount,
      date:
        new Date().toLocaleDateString(),
      status: 'Borrowed'
    }

    setTransactions([
      ...transactions,
      newTransaction
    ])

    alert(
      'Book borrowed successfully.'
    )
  }

  function returnBook(book, amount) {
    const borrowedAmount =
      myTransactions
        .filter(
          (transaction) =>
            transaction.bookId === book.id &&
            transaction.status === 'Borrowed'
        )
        .reduce(
          (total, transaction) =>
            total + transaction.quantity,
          0
        )

    if (borrowedAmount === 0) {
      alert(
        'You have not borrowed this book.'
      )
      return
    }

    if (amount > borrowedAmount) {
      alert(
        `You only have ${borrowedAmount} copy/copies to return.`
      )
      return
    }

    const updatedBooks = books.map(
      (bookItem) =>
        bookItem.id === book.id
          ? {
              ...bookItem,
              quantity:
                bookItem.quantity + amount
            }
          : bookItem
    )

    setBooks(updatedBooks)

    let remainingToReturn = amount

    const updatedTransactions =
      transactions.map(
        (transaction) => {

          if (
            transaction.membershipId ===
              currentUser.membershipId &&
            transaction.bookId === book.id &&
            transaction.status ===
              'Borrowed' &&
            remainingToReturn > 0
          ) {

            if (
              transaction.quantity <=
              remainingToReturn
            ) {
              remainingToReturn -=
                transaction.quantity

              return {
                ...transaction,
                status: 'Returned',
                returnDate:
                  new Date().toLocaleDateString()
              }
            }

            const returnedQuantity =
              remainingToReturn

            remainingToReturn = 0

            return {
              ...transaction,
              quantity:
                transaction.quantity -
                returnedQuantity
            }
          }

          return transaction
        }
      )

    setTransactions(
      updatedTransactions
    )

    alert(
      'Book returned successfully.'
    )
  }

  return (
    <div className="page">

      <Navbar />

      <main className="main-content">

        <h1>My Library Activity</h1>

        <h2>
          Welcome, {currentUser?.name}
        </h2>

        <div className="form-box">

          <form
            onSubmit={handleTransaction}
          >

            <div className="form-group">

              <label>Action</label>

              <select
                value={action}
                onChange={(e) =>
                  setAction(e.target.value)
                }
              >

                <option value="borrow">
                  Borrow Book
                </option>

                <option value="return">
                  Return Book
                </option>

              </select>

            </div>

            <div className="form-group">

              <label>Book</label>

              <select
                value={selectedBook}
                onChange={(e) =>
                  setSelectedBook(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Select a book
                </option>

                {books.map((book) => (
                  <option
                    key={book.id}
                    value={book.id}
                  >
                    {book.title} - Available:{' '}
                    {book.quantity}
                  </option>
                ))}

              </select>

            </div>

            <div className="form-group">

              <label>Quantity</label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    e.target.value
                  )
                }
              />

            </div>

            <button
              className="primary-button"
              type="submit"
            >
              {action === 'borrow'
                ? 'Borrow Book'
                : 'Return Book'}
            </button>

          </form>

        </div>

        <h2>My Activity</h2>

        {myTransactions.length === 0 ? (

          <div className="list-item">

            <p>
              You have no library activity yet.
            </p>

          </div>

        ) : (

          <div className="list-container">

            {[...myTransactions]
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
                    Quantity:{' '}
                    {transaction.quantity}
                  </p>

                  <p>
                    Date:{' '}
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

export default Transactions