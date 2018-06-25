import React from 'react'
import { Link } from 'react-router-dom'
import * as BooksAPI from '../BooksAPI'

class SearchListBook extends React.Component {

    state = {
        bookResultsSearch: [],
        libraryBooks: [],
        bIDs: [],
        query: ""
    };
    
    componentDidMount() {
        let id = [];
        let books = [];
        if (this.props.booksOnShelf.length !== 0) {
            for (let i = 0; i < this.props.booksOnShelf.length; i++) {
                let bookId = this.props.booksOnShelf[i].id;
                id.push(bookId)
            }
            books = this.props.booksOnShelf;
            this.setState({libraryBooks: books, bIDs: id})
        }
        else {
            BooksAPI.getAll().then((result) => {
                for (let i = 0; i < result.length; i++) {
                    let bookId2 = result[i].id;
                    id.push(bookId2)
                }
                this.setState({libraryBooks: result, bIDs: id})
            })    
        }
    }

    onchangeLibraryResults = (id, x) => {
        let searchbooks = this.combineListObj([], this.state.bookResultsSearch);
        let theids = this.combineListObj([], this.state.bIDs);
        let bookshelf = x.target.value;
        for (let i = 0; i < searchbooks.length; i++) {
            let bookId = searchbooks[i].id;
            if (bookId === id) {        
                let book = searchbooks[i];
                book['shelf'] = bookshelf;
            }
        }
        this.setState({ bookResultsSearch: searchbooks });
        let searchbookres = this.state.bookResultsSearch.filter((bk) => bk.id === id);
        BooksAPI.update(searchbookres[0], bookshelf).then(() => {
            let libraryBooks = this.state.libraryBooks.filter((bk) => bk.id !== id);
            let lb = libraryBooks.concat(this.state.bookResultsSearch.filter((bk) => bk.id === id));
            theids.push(id);

            this.setState({ libraryBooks: lb, bIDs: theids });
            this.props.findBooksRes(lb);
        });
    };

    combineListObj(bookarray) {
        for (let i = 1; i < arguments.length; i++) {
            let a = arguments[i];
            for (let key in a) {
                if (a.hasOwnProperty(key)) {
                    bookarray[key] = a[key];
                }
            }
        }
        return bookarray;
    }
    onchangeSearch = (x) => {
        let searchquery = x.target.value;

        if (searchquery !== undefined || searchquery !== "") {
            BooksAPI.search(searchquery).then((findb) => {
                if ((findb !== "" || findb !== null) && findb !== undefined && !findb.error) {
                    let searchBookIds = [];
                    for (let i = 0; i <= findb.length - 1; i++) {
                        let b = findb[i];
                        b['shelf'] = 'none';
                        searchBookIds.push(b.id);
                        if (b.imageLinks === undefined) {
                            let linkimg = {smallThumbnail: ''};
                            b['imageLinks'] = linkimg;
                        }
                    }

                    let sr = findb.filter((book) => {
                        return this.state.bIDs.indexOf(book.id) === -1;
                    });

                    this.setState({ query: searchquery, bookResultsSearch: sr });
                }
                else {
                    let bookres = [];
                    if(findb === undefined || findb === ""){
                        bookres = [];
                    }
                    else{
                        bookres = findb;
                    }
                    this.setState({ query: searchquery, bookResultsSearch: bookres });
                }
            })
        }
        else {
            this.setState({ query: '', bookResultsSearch: []});
        }
    };
    render() {
        let currentlyreadStr = "Currently Reading";
        let wantreadStr = "Want to Read";
        let readStr = "Read";
        let noneStr = "None";
        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link to='/' className="close-search">Close</Link>
                    <div className="search-books-input-wrapper">
                        <input type="text" placeholder="Search by title or author" onChange={this.onchangeSearch}/>
                    </div>
                </div>
                <div className="search-books-results">
                    <ol className="books-grid">
                        {
                            !this.state.bookResultsSearch.error &&
                            this.state.bookResultsSearch.map((b) => (
                                <li key={b.id} >
                                <div className="book">
                                    <div className="book-top">
                                    <div className="book-cover" style={{ width: 128, height: 193,
                                        backgroundImage: `url(${b.imageLinks.smallThumbnail})`
                                        }}>
                                    </div>
                                    <div className="book-shelf-changer">
                                        <select value={b.shelf} onChange={(x) => {
                                                this.onchangeLibraryResults(b.id, x)
                                            }}>
                                            <option value="none" disabled>Move to...</option>
                                            <option value="currentlyReading">{currentlyreadStr}</option>
                                            <option value="wantToRead">{wantreadStr}</option>
                                            <option value="read">{readStr}</option>
                                            <option value="none">{noneStr}</option>
                                        </select>
                                    </div>
                                    </div>
                                    <div className="book-title">{b.title}</div>
                                </div>
                                </li>
                            ))
                        }
                        <div>No Results</div>
                    </ol>
                </div>
            </div>
        )
    }
}

export default SearchListBook;