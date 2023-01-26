import { Book } from "../book-list/book.model";
import { createAction, createActionGroup, props } from '@ngrx/store';

export const BooksActions = createActionGroup({
  source: 'Books',
  events: {
    'Add Book': props<{ bookId: string }>(),
    'Remove Book': props<{ bookId: string }>(),
  },
});

export const retrieveBooksListAction = createAction(
  'Retrieved Book List');


export const retrieveBooksListSuccessAction = createAction(
  'Retrieved Book List',
  props<{ books: ReadonlyArray<Book> }>()
);
export const retrieveBooksListFailureAction = createAction(
  'Retrieved Error from BookService',
  props<{ error: string }>()
);

