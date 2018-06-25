import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import Library from './components/Library'
import SearchListBook from './components/SearchListBook'
import { Route, Link } from 'react-router-dom';

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */

    showSearchPage: false,
    books: []
  };
    componentDidMount() {
        this.retrieveBooks();
    }
    retrieveBooks() {
        BooksAPI.getAll()
            .then((res) => {
                this.setState(() => ({ books: res }))
            });
    };

    placebooktoLibrary(bid, val) {
        let bookstate = this.state.books;
        let ltolib = bookstate.filter((book) => book.id === bid);
        //console.log(ltolib);
        ltolib[0].shelf = val;

        let updateBooks = bookstate.filter((book) => book.id !== bid);

        this.setState({updateBooks})
    };

    updateLibrary = (x, bid) => {
        let bks = this.state.books.filter((book) => book.id === bid);
        let bookshelfval = x.target.value;
        let btest = bks[0];
        BooksAPI.update(btest, bookshelfval).then(() => {
            this.placebooktoLibrary(bid, bookshelfval)
        });
    };


    render() {
        let currentlyreadStr = "Currently Reading";
        let wantreadStr = "Want to Read";
        let readStr = "Read";
        return (
            <div className="app">
                <Route exact path='/' render={()=>(
                    <div className="list-books">
                        <div className="list-books-title">
                            <h1>MyReads</h1>
                        </div>
                        <div className="list-books-content container">
                            <div>
                                <Library bookshelftitle = {currentlyreadStr} books = {this.state.books.filter((book) => book.shelf === 'currentlyReading')} findBooksRes = {this.updateLibrary} />
                                <Library bookshelftitle = {wantreadStr} books = {this.state.books.filter((book) => book.shelf === 'wantToRead')} findBooksRes = {this.updateLibrary} />
                                <Library bookshelftitle = {readStr} books = {this.state.books.filter((book) => book.shelf === 'read')} findBooksRes = {this.updateLibrary} />
                            </div>
                        </div>
                        <div className="open-search">
                            <Link to='/search'>Add a book</Link>
                        </div>
                    </div>
                )}/>
                <Route path='/search' render={()=>(
                    <div>
                        <SearchListBook booksOnShelf={this.state.books} findBooksRes={(books) => {
                            this.setState({books: books} )}} />
                    </div>
                )}/>
            </div>
        )
    }
}

export default BooksApp
