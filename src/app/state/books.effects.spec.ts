import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { Observable, of } from "rxjs";
import { Book } from "../book-list/book.model";
import { GoogleBooksService } from "../book-list/books.service";
import { BooksEffects } from "./books.effects";


export class mockBooksService {
  getBooks(): Observable<Array<Book>> {
    return of([ {
      id: 'firstId',
      volumeInfo: {
        title: 'First Title',
        authors: ['First Author'],
      },
    },])
  }
}

describe('getBooks service call is successful', () => {

  let actions$: Observable<any>;
  let effects: BooksEffects;
  let bookService: GoogleBooksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BooksEffects,
        { provide: bookService, useClass: mockBooksService },
        provideMockActions(() => actions$)
      ]
    });
    effects = TestBed.inject(BooksEffects);
  });


  it('loadProducts$ should return [Product API] Load Products Success on success', () => {
  })
});
