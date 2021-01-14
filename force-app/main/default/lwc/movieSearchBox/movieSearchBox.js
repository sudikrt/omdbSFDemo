import {
    LightningElement, api
} from 'lwc';
import movieSearchBoxPlaceHolder from '@salesforce/label/c.Movie_Search_Box_Place_Holder';
import movieSearchBtnLabel from '@salesforce/label/c.Movie_Search_Button_Label';

export default class MovieSearchBox extends LightningElement {
    //movieSearchBox
    movieSearchText = '';
    label = {
        movieSearchBoxPlaceHolder,
        movieSearchBtnLabel
    };
    @api 
    set searchText (val) {
        this.movieSearchText = val;
    }
    get searchText () {
        return this.movieSearchText;
    }
    handleOnKeyUp (event) {
        if (event.keyCode === 13 && this.containsValidSearchText ()) {
            const searchEvent = new CustomEvent('searchclicked', { detail: this.movieSearchText });
            this.dispatchEvent(searchEvent);
        }
    }
    handleOnSearchClick(event) {
        if (this.containsValidSearchText ()) {
            const searchEvent = new CustomEvent('searchclicked', { detail: this.movieSearchText });
            this.dispatchEvent(searchEvent);
        }
    }
    onSearchTextChange (event) {
        this.movieSearchText = event.target.value;
        const searchTextChange = new CustomEvent('searchtextchanged', { detail: this.movieSearchText });
        this.dispatchEvent(searchTextChange);
    }
    containsValidSearchText () {
        return [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputCmp) => {
                        inputCmp.reportValidity();
                        return validSoFar && inputCmp.checkValidity();
            }, true)
    }
}