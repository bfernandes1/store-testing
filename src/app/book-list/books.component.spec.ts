import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Injector } from '@angular/core';

describe('Books Component', () => {
  let store: MockStore;
  const initialState = { books: ['Book 1', 'Book 2', 'Book 3'] };

  beforeEach(() => {
    const injector = Injector.create({
      providers: [
        provideMockStore({ initialState }),
      ],
    });

    store = injector.get(MockStore);
  });
});
