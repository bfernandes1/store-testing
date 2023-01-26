import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Actions, EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { cold, hot } from "jasmine-marbles";
import { BehaviorSubject, empty, Observable, of } from "rxjs";
import { Book } from "../book-list/book.model";
import { GoogleBooksService } from "../book-list/books.service";
import { retrieveBooksListAction, retrieveBooksListSuccessAction } from "./books.actions";
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

});
