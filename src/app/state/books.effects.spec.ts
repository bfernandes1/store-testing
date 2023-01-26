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

    // create an action to dispatch to the store
    const action = retrieveBooksListAction();
    // create the expected outcome, which is the success action with the books data
    const outcome = retrieveBooksListSuccessAction({ books: mockBooks });

    // set the actions stream to the retrieveBooksListAction
    actions.stream = hot('-a', { a: action });
    // mock the service's getBooks method to return the mock books data
    const response = cold('-a|', { a: mockBooks });
    // set the expected outcome for the getBooks$ observable
    const expected = cold('--b', { b: outcome });
    booksService.getBooks = jest.fn(() => response);

    // assert that the getBooks$ observable emits the expected outcome
    expect(booksEffects.getBooks$).toBeObservable(expected);
    // assert that the booksService's getBooks method was called
    expect(booksService.getBooks).toHaveBeenCalled();
  });

  it('should handle errors when retrieving books', () => {
    const action = retrieveBooksListAction();
    const error = 'Some error';
    const outcome = retrieveBooksListFailureAction({ error: error });

    // Set the stream of actions to emit the retrieveBooksListAction
    actions.stream = hot('-a', { a: action });

    // Create a cold response observable that emits an error
    const response = cold('-#|', {}, error);

    // Create the expected observable that emits the retrieveBooksListFailureAction
    const expected = cold('--b', { b: outcome });

    // Mock the service's getBooks method to return the error response observable
    booksService.getBooks = jest.fn(() => response);

    // Assert that the getBooks$ effect's observable matches the expected observable
    expect(booksEffects.getBooks$).toBeObservable(expected);

    // Assert that the getBooks method was called
    expect(booksService.getBooks).toHaveBeenCalled();
  });
});
