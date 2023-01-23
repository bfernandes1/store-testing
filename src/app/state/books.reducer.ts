import { state } from "@angular/animations";
import { createReducer, on } from '@ngrx/store';
import { EMPTY } from "rxjs";
import { Book } from "../book-list/book.model";

import { retrieveBooksListAction, retrieveBooksListSuccessAction } from './books.actions';

export const initialState: ReadonlyArray<Book> = [];

export const booksReducer = createReducer(
  initialState,
  on(retrieveBooksListAction, (_state) => _state),
  on(retrieveBooksListSuccessAction, (_state, { books }) => books)
);
