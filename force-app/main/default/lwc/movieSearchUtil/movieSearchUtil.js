import {
    LightningElement, wire
} from 'lwc';
import getEndPoint from '@salesforce/apex/MovieSearchUtil.getEndPoint';

import header from '@salesforce/label/c.Movie_Search_Util_Header';
import btnPrevious from '@salesforce/label/c.Movie_Search_Util_Btn_Previous';
import btnNext from '@salesforce/label/c.Movie_Search_Util_Btn_Next'; 
import invalidNamedCredMessage from '@salesforce/label/c.Movie_Search_Invalid_Credentials'; 
import unknownErrorMessage from '@salesforce/label/c.Movie_Search_Unknown_Error_Message'; 
import errorText from '@salesforce/label/c.Movie_Error_Text'; 

const API_RESPONSE_PAGE_ITEM_COUNT = 10;
export default class MovieSearchUtil extends LightningElement {
    movieSearchText = '';
    _totalPages = 1;
    _currentPage = 1;
    _hasEndPoint = false;
    _endPoint;
    error = '';
    isSuccess = false;
    movies = [];
    isLoading = false;

    label = {
        header,
        btnPrevious,
        btnNext,
        invalidNamedCredMessage,
        unknownErrorMessage,
        errorText
    };

    @wire (getEndPoint)
    endPoint ({ error, data }) {
        if (data) {
            this._hasEndPoint = true;
            this._endPoint = data;
        } 
        if (error) {
            this._endPoint = '';
            this._hasEndPoint = false;

            this.error = this.label.unknownErrorMessage;
            if (Array.isArray(error.body)) {
                this.error = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                this.error = error.body.message;
            }
        }
    }

    isFirstPage() {
        return this._currentPage === 1;
    }
    isLastPage() {
        return this._currentPage >= this._totalPages;
    }
    handlePrevious() {
        if (!this.isFirstPage()) {
            this.searchMoviesByName(this.movieSearchText, --this._currentPage);
        }
    }
    handleNext() {
        if (!this.isLastPage()) {
            this.searchMoviesByName(this.movieSearchText, ++this._currentPage);
        }
    }
    get isNextDisabled() {
        return this.isLastPage();
    }
    get isPreviousDisabled() {
        return this.isFirstPage();
    }
    onSearchTextChange(event) {
        const searchBox = this.template.querySelector('c-movie-search-box');
        if (searchBox) {
            this.movieSearchText = searchBox.searchText;
        } else {
            this.movieSearchText = '';
        }
        this.reset();
    }
    reset() {
        this._currentPage = 1;
        this._totalPages = 1;
        this.movies = [];
        this.error = '';
        this.isSuccess = false;
    }
    constructor() {
        super();
    }
    handleOnSearchClick(event) {
        if (this.movieSearchText && typeof this.movieSearchText !== undefined && this.movieSearchText !== null) {
            this.searchMoviesByName(this.movieSearchText, this._currentPage);
        }
    }
    searchMoviesByName(name, page) {
        if (!this._hasEndPoint) {
            this.error = this.label.invalidNamedCredMessage;
            return;
        }

        this.error = '';
        this.movies = [];
        let endPoint = this._endPoint;
        endPoint += `&s=${name}`;
        endPoint += `&page=${page}`;
        console.log('endpoint :' + endPoint);

        this.isLoading = true;
        fetch(endPoint, {
                method: "GET"
            }).then((response) => response.json()).then((response) => {
                if (response && response.Response && response.Response === 'True') {
                    this._totalPages = Math.ceil(response.totalResults / API_RESPONSE_PAGE_ITEM_COUNT);
                    this.movies = response.Search;
                    console.log(`Response ${JSON.stringify (response)}`);
                    this.isSuccess = true;
                } else if (response && response.Response && response.Response === 'False') {
                    console.error(`Response ${JSON.stringify (response)}`);
                    this.error = response.Error;
                    this.isSuccess = false;
                } else {
                    console.error(`Response unknown error : ${JSON.stringify (response)}`);
                    this.error = this.label.unknownErrorMessage;
                    this.isSuccess = false;
                }
                this.isLoading = false;
            })
            .catch((error) => {
                this.isLoading = false;
                console.error(JSON.stringify(error));
                this.error = `${this.label.unknownErrorMessage} : ${JSON.stringify(error)}`;
            });
    }
}