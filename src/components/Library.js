import React from 'react'

class Library extends React.Component {
    render() {
        return (
            <div>
                <div className="bookshelf">
                <h2 className="bookshelf-title">{this.props.bookshelftitle}</h2>
                    <div className="bookshelf-books">
                    <ol className="books-grid">
                        {this.props.books.map((b) => (
                            <li key={b.id} >
                            <div className="book">
                                <div className="book-top">
                                <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${b.imageLinks.smallThumbnail})` }}></div>
                                <div className="book-shelf-changer">
                                    <select defaultValue={b.shelf} onChange={(x) => {
                                            this.props.findBooksRes(x, b.id)
                                        }}>
                                        <option value="none" disabled>Move to...</option>
                                        <option value="currentlyReading">Currently Reading</option>
                                        <option value="wantToRead">Want to Read</option>
                                        <option value="read">Read</option>
                                        <option value="none">None</option>
                                    </select>
                                </div>
                                </div>
                                <div className="book-title">{b.title}</div>
                            </div>
                            </li>
                        ))}                  
                    </ol>
                    </div>
                </div>
            </div>
        )
    }
}

export default Library