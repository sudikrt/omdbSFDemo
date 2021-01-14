import { LightningElement, api } from 'lwc';
import emptyListMessage from '@salesforce/label/c.Movie_List_Empty_Text'
export default class MovieList extends LightningElement {
    @api movies;
    label = {
        emptyListMessage
    };
    get hasMovies () {
        return this.movies && typeof this.movies !== 'undefined' && this.movies.length > 0;
    }
}