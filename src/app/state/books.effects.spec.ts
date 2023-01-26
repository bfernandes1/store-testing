import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, TestBed } from "@angular/core/testing";
import { Actions, EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { cold, hot } from "jasmine-marbles";
import { empty, Observable, of, throwError } from "rxjs";
import { Book } from "../book-list/book.model";
import { GoogleBooksService } from "../book-list/books.service";
import {
  retrieveBooksListAction,
  retrieveBooksListFailureAction,
  retrieveBooksListSuccessAction
} from "./books.actions";
import { BooksEffects } from "./books.effects";

export class TestActions extends Actions {
  constructor() {
    super(empty());
  }

  set stream(source: Observable<any>) {
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

describe('getBooks$ effect', () => {
  let actions: TestActions;
  let booksEffects: BooksEffects;
  let booksService: GoogleBooksService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([])
      ],
      providers: [
        BooksEffects,
        {
          provide: Actions,
          useFactory: getActions
        },
        {
          provide: GoogleBooksService,
          useValue: {
            getBooks: jest.fn()
          }
        }
      ]
    });

    actions = TestBed.get(Actions);
    booksEffects = TestBed.inject(BooksEffects);
    booksService = TestBed.inject(GoogleBooksService);

  });

  it('should retrieve books (without marble testing)', async(() => {
    let book: Book = { id: '1', volumeInfo: { title: 'Book 1', authors: ['Mocked Author'] } };
    const mockBooks = [book];

    // Create the action that will trigger the effect
    const action = retrieveBooksListAction();
    // Create the expected outcome action that will be dispatched to the store
    const outcome = retrieveBooksListSuccessAction({ books: mockBooks });

    // mock the service's getBooks method to return the mocked books
    booksService.getBooks = jest.fn(() => of(mockBooks));
    // set the actions stream to the retrieveBooksListAction
    actions.stream = of(action);

    // subscribe to the getBooks$ effect
    booksEffects.getBooks$.subscribe(result => {
      // assert that the result of the effect is the expected outcome
      expect(result).toEqual(outcome);
      // assert that the service's getBooks method has been called
      expect(booksService.getBooks).toHaveBeenCalled();
    });
  }));




  it('should handle errors when retrieving books (without marble testing)', async () => {
    const error = 'Error occurred while retrieving books';
    // Create the action that will trigger the effect
    const action = retrieveBooksListAction();
    // Create the expected outcome action that will be dispatched to the store
    const outcome = retrieveBooksListFailureAction({ error });

    // mock the service's getBooks method to return the mocked books
    booksService.getBooks = jest.fn(() => throwError(error));

    // set the actions stream to the retrieveBooksListAction
    actions.stream = of(action);


    // Subscribing to the effect should return the expected outcome
    booksEffects.getBooks$.subscribe(result => {
      expect(result).toEqual(outcome);
    });

    // The service's getBooks method should have been called
    expect(booksService.getBooks).toHaveBeenCalled();
  });

  it('should retrieve books', () => {
    let book: Book = { id: '1', volumeInfo: { title: 'Book 1', authors: ['Mocked Author'] } };
    const mockBooks = [book];

    const action = retrieveBooksListAction();
    const outcome = retrieveBooksListSuccessAction({ books: mockBooks });

    actions.stream = hot('-a', { a: action });
    const response = cold('-a|', { a: mockBooks });
    const expected = cold('--b', { b: outcome });
    booksService.getBooks = jest.fn(() => response);

    expect(booksEffects.getBooks$).toBeObservable(expected);
    expect(booksService.getBooks).toHaveBeenCalled();
  });

  it('should handle errors when retrieving books', () => {
    const action = retrieveBooksListAction();
    const error = 'Some error';
    const outcome = retrieveBooksListFailureAction({ error: error });

    actions.stream = hot('-a', { a: action });
    const response = cold('-#|', {}, error);
    const expected = cold('--b', { b: outcome });
    booksService.getBooks = jest.fn(() => response);

    expect(booksEffects.getBooks$).toBeObservable(expected);
    expect(booksService.getBooks).toHaveBeenCalled();
  });
});
