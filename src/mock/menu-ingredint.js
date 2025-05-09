import { run } from "./run.js";

const menuIngr = [
  {
    "menuId": 1,
    "ingredients": [
      {
        "ingredientId": 9,
        "quantity": 4
      },
      {
        "ingredientId": 7,
        "quantity": 5
      },
      {
        "ingredientId": 18,
        "quantity": 2
      },
      {
        "ingredientId": 21,
        "quantity": 4
      },
      {
        "ingredientId": 3,
        "quantity": 3
      }
    ]
  },
  {
    "menuId": 2,
    "ingredients": [
      {
        "ingredientId": 4,
        "quantity": 3
      },
      {
        "ingredientId": 1,
        "quantity": 4
      },
      {
        "ingredientId": 6,
        "quantity": 4
      },
      {
        "ingredientId": 22,
        "quantity": 2
      },
      {
        "ingredientId": 17,
        "quantity": 4
      }
    ]
  },
  {
    "menuId": 3,
    "ingredients": [
      {
        "ingredientId": 2,
        "quantity": 4
      },
      {
        "ingredientId": 19,
        "quantity": 3
      },
      {
        "ingredientId": 8,
        "quantity": 5
      },
      {
        "ingredientId": 25,
        "quantity": 3
      },
      {
        "ingredientId": 15,
        "quantity": 4
      }
    ]
  },
  {
    "menuId": 4,
    "ingredients": [
      {
        "ingredientId": 5,
        "quantity": 2
      },
      {
        "ingredientId": 12,
        "quantity": 4
      },
      {
        "ingredientId": 20,
        "quantity": 3
      },
      {
        "ingredientId": 29,
        "quantity": 2
      },
      {
        "ingredientId": 24,
        "quantity": 4
      }
    ]
  },
  {
    "menuId": 5,
    "ingredients": [
      {
        "ingredientId": 6,
        "quantity": 4
      },
      {
        "ingredientId": 13,
        "quantity": 3
      },
      {
        "ingredientId": 28,
        "quantity": 2
      },
      {
        "ingredientId": 30,
        "quantity": 3
      },
      {
        "ingredientId": 10,
        "quantity": 3
      }
    ]
  },
  {
    "menuId": 6,
    "ingredients": [
      {
        "ingredientId": 8,
        "quantity": 3
      },
      {
        "ingredientId": 14,
        "quantity": 4
      },
      {
        "ingredientId": 18,
        "quantity": 3
      },
      {
        "ingredientId": 1,
        "quantity": 3
      },
      {
        "ingredientId": 26,
        "quantity": 3
      }
    ]
  },
  {
    "menuId": 7,
    "ingredients": [
      {
        "ingredientId": 16,
        "quantity": 2
      },
      {
        "ingredientId": 3,
        "quantity": 4
      },
      {
        "ingredientId": 4,
        "quantity": 3
      },
      {
        "ingredientId": 22,
        "quantity": 3
      },
      {
        "ingredientId": 7,
        "quantity": 3
      }
    ]
  },
  {
    "menuId": 8,
    "ingredients": [
      {
        "ingredientId": 12,
        "quantity": 4
      },
      {
        "ingredientId": 27,
        "quantity": 3
      },
      {
        "ingredientId": 14,
        "quantity": 4
      },
      {
        "ingredientId": 17,
        "quantity": 3
      },
      {
        "ingredientId": 30,
        "quantity": 4
      }
    ]
  },
  {
    "menuId": 9,
    "ingredients": [
      {
        "ingredientId": 5,
        "quantity": 4
      },
      {
        "ingredientId": 9,
        "quantity": 3
      },
      {
        "ingredientId": 16,
        "quantity": 2
      },
      {
        "ingredientId": 19,
        "quantity": 4
      },
      {
        "ingredientId": 24,
        "quantity": 3
      }
    ]
  },
  {
    "menuId": 10,
    "ingredients": [
      {
        "ingredientId": 3,
        "quantity": 2
      },
      {
        "ingredientId": 4,
        "quantity": 4
      },
      {
        "ingredientId": 21,
        "quantity": 4
      },
      {
        "ingredientId": 10,
        "quantity": 3
      },
      {
        "ingredientId": 13,
        "quantity": 3
      }
    ]
  },
  {
    "menuId": 11,
    "ingredients": [
      {
        "ingredientId": 19,
        "quantity": 4
      },
      {
        "ingredientId": 12,
        "quantity": 4
      },
      {
        "ingredientId": 23,
        "quantity": 3
      },
      {
        "ingredientId": 28,
        "quantity": 3
      },
      {
        "ingredientId": 5,
        "quantity": 3
      }
    ]
  },
  {
    "menuId": 12,
    "ingredients": [
      {
        "ingredientId": 6,
        "quantity": 2
      },
      {
        "ingredientId": 2,
        "quantity": 4
      },
      {
        "ingredientId": 8,
        "quantity": 5
      },
      {
        "ingredientId": 18,
        "quantity": 2
      },
      {
        "ingredientId": 20,
        "quantity": 2
      }
    ]
  },
  {
    "menuId": 13,
    "ingredients": [
      {
        "ingredientId": 15,
        "quantity": 4
      },
      {
        "ingredientId": 17,
        "quantity": 3
      },
      {
        "ingredientId": 26,
        "quantity": 3
      },
      {
        "ingredientId": 11,
        "quantity": 3
      },
      {
        "ingredientId": 23,
        "quantity": 4
      }
    ]
  },
  {
    "menuId": 14,
    "ingredients": [
      {
        "ingredientId": 22,
        "quantity": 2
      },
      {
        "ingredientId": 13,
        "quantity": 3
      },
      {
        "ingredientId": 4,
        "quantity": 3
      },
      {
        "ingredientId": 6,
        "quantity": 4
      },
      {
        "ingredientId": 3,
        "quantity": 2
      }
    ]
  },
  {
    "menuId": 15,
    "ingredients": [
      {
        "ingredientId": 19,
        "quantity": 4
      },
      {
        "ingredientId": 2,
        "quantity": 3
      },
      {
        "ingredientId": 10,
        "quantity": 2
      },
      {
        "ingredientId": 9,
        "quantity": 3
      },
      {
        "ingredientId": 27,
        "quantity": 3
      }
    ]
  },
  {
    "menuId": 16,
    "ingredients": [
      {
        "ingredientId": 7,
        "quantity": 4
      },
      {
        "ingredientId": 6,
        "quantity": 2
      },
      {
        "ingredientId": 20,
        "quantity": 3
      },
      {
        "ingredientId": 11,
        "quantity": 3
      },
      {
        "ingredientId": 3,
        "quantity": 3
      }
    ]
  },
  {
    "menuId": 17,
    "ingredients": [
      {
        "ingredientId": 8,
        "quantity": 3
      },
      {
        "ingredientId": 1,
        "quantity": 3
      },
      {
        "ingredientId": 24,
        "quantity": 3
      },
      {
        "ingredientId": 16,
        "quantity": 2
      },
      {
        "ingredientId": 29,
        "quantity": 3
      }
    ]
  },
  {
    "menuId": 18,
    "ingredients": [
      {
        "ingredientId": 2,
        "quantity": 3
      },
      {
        "ingredientId": 19,
        "quantity": 4
      },
      {
        "ingredientId": 4,
        "quantity": 4
      },
      {
        "ingredientId": 11,
        "quantity": 4
      },
      {
        "ingredientId": 17,
        "quantity": 2
      }
    ]
  },
  {
    "menuId": 19,
    "ingredients": [
      {
        "ingredientId": 23,
        "quantity": 4
      },
      {
        "ingredientId": 14,
        "quantity": 3
      },
      {
        "ingredientId": 18,
        "quantity": 3
      },
      {
        "ingredientId": 9,
        "quantity": 5
      },
      {
        "ingredientId": 1,
        "quantity": 2
      }
    ]
  },
  {
    "menuId": 20,
    "ingredients": [
      {
        "ingredientId": 9,
        "quantity": 4
      },
      {
        "ingredientId": 6,
        "quantity": 2
      },
      {
        "ingredientId": 8,
        "quantity": 4
      },
      {
        "ingredientId": 7,
        "quantity": 5
      },
      {
        "ingredientId": 26,
        "quantity": 3
      }
    ]
  }
]


run(menuIngr, "/menus/add-ingredients");









