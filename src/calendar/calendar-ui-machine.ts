import { createMachine, assign } from "xstate";

type UiContext = {
    pageIndex: number,
    nbPage: number,
    isFirstPage: boolean
    isLastPage: boolean,
}

const increment = (context: UiContext) => context.pageIndex + 1
const decrement = (context: UiContext) => context.pageIndex - 1
const isLastPage = (context: UiContext) => context.pageIndex >= context.nbPage - 1
const isFirstPage = (context: UiContext) => context.pageIndex <= 0

export const calendarUiMachine = (nbPage: number) => 
createMachine({
  context: {
    pageIndex: 0,
    nbPage: nbPage,
    isFirstPage: true,
    isLastPage: false
  },
  schema: {
    context: {} as UiContext,
    events: {} as
    | { type: 'NEXT_PAGE' }
    | { type: 'PREVIOUS_PAGE' }
  },
  id: "(machine)",
  initial: "page_0",
  states: {
    page_0: {
      on: {
        NEXT_PAGE: {
          target: "page_i",
          actions: assign<UiContext>({ pageIndex: increment }),
        },
      },
      always: [
        {
          cond: context => context.nbPage === 1,
          target: "single_page"
        }
      ],
      entry: assign({ isFirstPage: true })
    },
    single_page: {
      entry: assign({ isFirstPage: true, isLastPage: true })
    },
    page_i: {
      always: [
        {
          cond: isLastPage,
          target: "page_n",
        },
        {
          cond: isFirstPage,
          target: "page_0",
        }
      ],
      on: {
        NEXT_PAGE: {
          actions: assign<UiContext>({ pageIndex: increment }),
          target: "page_i",
        },
        PREVIOUS_PAGE: {
          actions: assign<UiContext>({ pageIndex: decrement }),
          target: "page_i",
        }
      },
      entry: assign({ isFirstPage: false, isLastPage: false })
    },
    page_n: {
      always: {
        cond: isFirstPage,
        target: "page_0",
      },
      on: {
        PREVIOUS_PAGE: {
          actions: assign<UiContext>({ pageIndex: decrement }),
          target: "page_i",
        },
      },
      entry: assign({ isLastPage: true })
    }
  }
})

