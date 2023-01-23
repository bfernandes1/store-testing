import { MockStore, getMockStore } from '@ngrx/store/testing';

describe('Books Component', () => {
  let store: MockStore;
  const initialState = { books: ['Book 1', 'Book 2', 'Book 3'] };

  beforeEach(() => {
    store = getMockStore({ initialState });
  });
});
