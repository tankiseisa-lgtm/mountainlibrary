import { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'

function Books() {
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

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState('')
  const [isbn, setIsbn] = useState('')
  const [quantity, setQuantity] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books))
  }, [books])

  function clearForm() {
    setTitle('')
    setAuthor('')
    setGenre('')
    setIsbn('')
    setQuantity('')
    setEditingId(null)
  }

  function addOrUpdateBook(event) {
    event.preventDefault()

    if (!title || !author || !genre || !isbn || !quantity) {
      alert('Please fill in all fields.')
      return
    }

    if (Number(quantity) < 1) {
      alert('Quantity must be at least 1.')
      return
    }

    if (editingId !== null) {
      const updatedBooks = books.map((book) =>
        book.id === editingId
          ? {
              ...book,
              title,
              author,
              genre,
              isbn,
              initialQuantity: Number(quantity),
              quantity: Math.min(
                book.quantity,
                Number(quantity)
              )
            }
          : book
      )

      setBooks(updatedBooks)
      clearForm()
      return
    }

    const newBook = {
      id: Date.now(),
      title,
      author,
      genre,
      isbn,
      initialQuantity: Number(quantity),
      quantity: Number(quantity)
    }

    setBooks([...books, newBook])
    clearForm()
  }

  function editBook(book) {
    setTitle(book.title)
    setAuthor(book.author)
    setGenre(book.genre)
    setIsbn(book.isbn)
    setQuantity(book.initialQuantity)
    setEditingId(book.id)
  }

  function deleteBook(id) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this book?'
    )

    if (confirmDelete) {
      setBooks(
        books.filter((book) => book.id !== id)
      )
    }
  }

  return (
    <div className="page">

      <Navbar />

      <main className="main-content">

        <h1>Books</h1>

        <h2>Book Management</h2>

        <div className="form-box">

          <form onSubmit={addOrUpdateBook}>

            <div className="form-group">
              <label>Title</label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Enter book title"
              />
            </div>

            <div className="form-group">
              <label>Author</label>

              <input
                type="text"
                value={author}
                onChange={(e) =>
                  setAuthor(e.target.value)
                }
                placeholder="Enter author name"
              />
            </div>

            <div className="form-group">
              <label>Genre</label>

              <input
                type="text"
                value={genre}
                onChange={(e) =>
                  setGenre(e.target.value)
                }
                placeholder="Enter genre"
              />
            </div>

            <div className="form-group">
              <label>ISBN</label>

              <input
                type="text"
                value={isbn}
                onChange={(e) =>
                  setIsbn(e.target.value)
                }
                placeholder="Enter ISBN"
              />
            </div>

            <div className="form-group">
              <label>Initial Quantity</label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                placeholder="Enter quantity"
              />
            </div>

            <button
              className="primary-button"
              type="submit"
            >
              {editingId !== null
                ? 'Update Book'
                : 'Add Book'}
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

        <h2>Library Books</h2>

        {books.length === 0 ? (
          <p>No books have been added yet.</p>
        ) : (
          <div className="list-container">

            {books.map((book) => (
              <div
                className="list-item"
                key={book.id}
              >

                <h3>{book.title}</h3>

                <p>
                  Author: {book.author}
                </p>

                <p>
                  Genre: {book.genre}
                </p>

                <p>
                  ISBN: {book.isbn}
                </p>

                <p>
                  Initial Quantity: {book.initialQuantity}
                </p>

                <p>
                  Available: {book.quantity}
                </p>

                <button
                  className="primary-button"
                  onClick={() =>
                    editBook(book)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-button"
                  onClick={() =>
                    deleteBook(book.id)
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

export default Books