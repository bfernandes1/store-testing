import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, EMPTY, switchMap } from "rxjs";
import { map } from "rxjs/operators";
import { GoogleBooksService } from "../book-list/books.service";
import { retrieveBooksListAction, retrieveBooksListSuccessAction } from "./books.actions";

@Injectable()
export class BooksEffects {

  getBooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(retrieveBooksListAction),
      switchMap((action) => {
        return this.booksService.getBooks().pipe(
          map(books => {
            return retrieveBooksListSuccessAction({ books: books })
          }),
          catchError(() => EMPTY)
        );
      })
    )
  );

  get actions(): Actions {
    return this.actions$;
  }

  constructor(
    private actions$: Actions,
    private booksService: GoogleBooksService
  ) {}
}
