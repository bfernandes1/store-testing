import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, EMPTY, switchMap } from "rxjs";
import { map } from "rxjs/operators";
import { GoogleBooksService } from "../book-list/books.service";
import { retrieveBooksListAction, retrieveBooksListSuccessAction } from "./books.actions";

@Injectable()
export class BooksEffects {

  getPatientInfo$ = createEffect(() =>
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

  constructor(
    private actions$: Actions,
    private store: Store,
    private booksService: GoogleBooksService
  ) {}
}
