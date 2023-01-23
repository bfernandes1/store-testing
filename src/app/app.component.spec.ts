import { TestBed } from "@angular/core/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { selectBooks } from "./state/books.selector";

describe('AppComponent reset selectors', () => {
  let store: MockStore;

  afterEach(() => {
    store?.resetSelectors();
  });

  it('should return the mocked value', (done: any) => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectBooks,
              value: [
                {
                  id: 'mockedId',
                  volumeInfo: {
                    title: 'Mocked Title',
                    authors: ['Mocked Author'],
                  },
                },
              ],
            },
          ],
        }),
      ],
    });

    store = TestBed.inject(MockStore);

    store.select(selectBooks).subscribe((mockBooks) => {
      expect(mockBooks).toEqual([
        {
          id: 'mockedId',
          volumeInfo: {
            title: 'Mocked Title',
            authors: ['Mocked Author'],
          },
        },
      ]);
      done();
    });
  });
});
