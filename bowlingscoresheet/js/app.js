var selectedFrameID;

// Storage Controller
const StorageCtrl = (function () {
  // Public methods
  return {
    storeItem: function (item) {
      let items;
      // Check if any items in ls
      if (localStorage.getItem("items") === null) {
        items = [];
        // Push new item
        items.push(item);
        // Set ls
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        // Get what is already in ls
        items = JSON.parse(localStorage.getItem("items"));

        // Push new item
        items.push(item);

        // Re set ls
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getScoreSheetFromStorage: function () {
      let scoreSheet;
      if (localStorage.getItem("bowlingScoreSheet") === null) {
        scoreSheet = undefined;
      } else {
        items = JSON.parse(localStorage.getItem("bowlingScoreSheet"));
      }
      return scoreSheet;
    },
    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemsFromStorage: function () {
      localStorage.removeItem("items");
    },
  };
})();

// Item Controller
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  const ScoreSheet = function (id, date, games) {
    this.id = id;
    this.date = date;
    this.games = games;
    //Possibly need array of Games in here
  };

  // Can have different num of players each game if someone leaves
  const Game = function (id, numPlayers) {
    this.id = id;
    this.numPlayers = numPlayers;
  };

  // Data Structure / State
  const data = {
    // items: [
    //   // {id: 0, name: 'Steak Dinner', calories: 1200},
    //   // {id: 1, name: 'Cookie', calories: 400},
    //   // {id: 2, name: 'Eggs', calories: 300}
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    scoreSheet: StorageCtrl.getScoreSheetFromStorage(),
    currentItem: null,
    currentGame: 1,
    totalCalories: 0,
  };

  // Public methods
  return {
    getItems: function () {
      return data.items;
    },
    getScoreSheet: function () {
      return data.scoreSheet;
    },
    getCurrentGame: function () {
      return data.currentGame;
    },
    addItem: function (name, calories) {
      let ID;
      // Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function (id) {
      let found = null;
      // Loop through items
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function (name, calories) {
      // Calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function (id) {
      // Get ids
      const ids = data.items.map(function (item) {
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function () {
      data.items = [];
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    getTotalCalories: function () {
      let total = 0;

      // Loop through items and add cals
      data.items.forEach(function (item) {
        total += item.calories;
      });

      // Set total cal in data structure
      data.totalCalories = total;

      // Return total
      return data.totalCalories;
    },
    logData: function () {
      return data;
    },
  };
})();

// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    numPlayersSelect: "#numOfPlayers",
    numGamesSelect: "#numOfGames",
    gameSelectForm: "#gameSelectForm",
    currentGameSelect: "#currentGame",
    main: "#main",
    newscoresheet: "#newscoresheet",
    startbtn: "#startbtn",
    scorecards: "#scorecards",
  };

  // Public methods
  return {
    populateNumberPlayersSelect: function () {
      let html = `<option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>`;

      // Insert into selector
      document.querySelector(UISelectors.numPlayersSelect).innerHTML = html;
    },

    populateNumGamesSelect: function () {
      let html = `<option value="1" selected>1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>`;

      // Insert into selector
      document.querySelector(UISelectors.numGamesSelect).innerHTML = html;
    },
    populateCurrentGameSelect: function (numOfGames) {
      let html;

      for (let index = 1; index <= parseInt(numOfGames); index++) {
        html += `<option value="${index}" selected>${index}</option>`;
      }

      // Insert into selector
      document.querySelector(UISelectors.currentGameSelect).innerHTML = html;
    },
    populateScoreCards: function (numOfPlayers, numOfGames) {
      let html = "";

      for (let player = 1; player <= parseInt(numOfPlayers); player++) {
        html += `<div class="card shadow mt-2">
        <div class="card-header">
          <h4 class="lead d-inline">Player ${player}</h4>
          <i class="fas fa-pencil-alt ml-3"></i>
        </div>
        <div class="card-body p-0">
        <div id="Oneplayer${player}Table" class="bowlingTable">
              <table>
                <thead>
                  <tr id="header" class="bg-primary text-light">
                    <td class="frameheader" colspan="3">1</td>
                    <td class="frameheader" colspan="3">2</td>
                    <td class="frameheader" colspan="3">3</td>
                    <td class="frameheader" colspan="3">4</td>
                    <td class="frameheader" colspan="3">5</td>
                    <td class="frameheader" colspan="3">6</td>
                    <td class="frameheader" colspan="3">7</td>
                    <td class="frameheader" colspan="3">8</td>
                    <td class="frameheader" colspan="3">9</td>
                    <td class="frameheader" colspan="3">10</td>
                    <td class="totalheader" colspan="1">
                      Total Score
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr id="balls">
                    <td
                      class="ballFrame"
                      id="1-${player}-1-1"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-1-2"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-1-3"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-2-1"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-2-2"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-2-3"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-3-1"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-3-2"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-3-3"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-4-1"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-4-2"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-4-3"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-5-1"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-5-2"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-5-3"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-6-1"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-6-2"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-6-3"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-7-1"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-7-2"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-7-3"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-8-1"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-8-2"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-8-3"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-9-1"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-9-2"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-9-3"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-10-1"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-10-2"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td
                      class="ballFrame"
                      id="1-${player}-10-3"
                      points="0"
                      pins="0-0-0-0-0"
                    ></td>
                    <td id="total-1-${player}" rowspan="2" class="totalscorebox"></td>
                  </tr>
                  <tr id="frames">
                    <td id="1-${player}-1" points="0" colspan="3"></td>
                    <td id="1-${player}-2" points="0" colspan="3"></td>
                    <td id="1-${player}-3" points="0" colspan="3"></td>
                    <td id="1-${player}-4" points="0" colspan="3"></td>
                    <td id="1-${player}-5" points="0" colspan="3"></td>
                    <td id="1-${player}-6" points="0" colspan="3"></td>
                    <td id="1-${player}-7" points="0" colspan="3"></td>
                    <td id="1-${player}-8" points="0" colspan="3"></td>
                    <td id="1-${player}-9" points="0" colspan="3"></td>
                    <td id="1-${player}-10" points="0" colspan="3"></td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
        </div>
        `;
      }

      html += `<div id="teamPinfallDiv">
      <h4>Team Total: <span class="mr-2" id="teamPinfall">0</span></h4>
    </div>`;

      // Insert into selector
      document.querySelector(UISelectors.scorecards).innerHTML = html;
    },
    getNewScoreSheetInput: function () {
      return {
        numPlayers: document.querySelector(UISelectors.numPlayersSelect).value,
        numGames: document.querySelector(UISelectors.numGamesSelect).value,
      };
    },
    hideMain: function () {
      document.querySelector(UISelectors.main).style.display = "none";
    },
    showMain: function () {
      document.querySelector(UISelectors.main).style.display = "block";
    },
    hideNewScoreSheet: function () {
      document.querySelector(UISelectors.newscoresheet).style.display = "none";
    },
    showNewScoreSheet: function () {
      document.querySelector(UISelectors.newscoresheet).style.display = "block";
    },
    hideGameSelect: function () {
      document.querySelector(UISelectors.gameSelectForm).style.display = "none";
    },
    showGameSelect: function () {
      document.querySelector(UISelectors.gameSelectForm).style.display =
        "block";
    },
    getSelectors: function () {
      return UISelectors;
    },
  };
})();

// App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function () {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    document
      .querySelector(UISelectors.numPlayersSelect)
      .addEventListener("change", changeNumberOfPlayers);

    document
      .querySelector(UISelectors.numGamesSelect)
      .addEventListener("change", changeNumberOfGames);

    document
      .querySelector(UISelectors.currentGameSelect)
      .addEventListener("change", changeCurrentGameDisplayed);

    document
      .querySelector(UISelectors.startbtn)
      .addEventListener("click", newScoreSheet);
  };

  const changeNumberOfPlayers = function (e) {
    console.log("number of players changed");
  };
  const changeNumberOfGames = function (e) {
    console.log("number of games changed");
  };
  const changeCurrentGameDisplayed = function (e) {
    console.log("Show selected game");
  };

  const newScoreSheet = function (e) {
    UICtrl.hideNewScoreSheet();
    UICtrl.showGameSelect();
    UICtrl.showMain();
    const newScoreSheetInput = UICtrl.getNewScoreSheetInput();
    UICtrl.populateCurrentGameSelect(newScoreSheetInput.numGames);
    UICtrl.populateScoreCards(
      newScoreSheetInput.numPlayers,
      newScoreSheetInput.numGames
    );
    $("#frames td").on("click", function () {
      var id = $(this).attr("id");
      var idArray = id.split("-");
      var game = idArray[0];
      var player = idArray[1];
      var frame = idArray[2];
      $("td").removeClass("active");
      $(this).addClass("active");
      $("#" + game + "-" + player + "-" + frame + "-1").addClass("active");
      selectedFrameID = id + "-1";

      setPinDeckOnSelection(selectedFrameID);
    });
    $(".ballFrame").on("click", function () {
      $("td").removeClass("active");
      //$(`#${selectedFrameID}`).removeClass("active");
      //$("#" + game + "-" + player + "-" + frame).removeClass("active");
      selectedBallFrame($(this).attr("id"));
    });
    $(".totalscorebox").on("click", function () {
      $("td").removeClass("active");
      $("#result").html("");
      selectedFrameID = null;
    });
    e.preventDefault();
  };

  // Add item submit
  const itemAddSubmit = function (e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calorie input
    if (input.name !== "" && input.calories !== "") {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //Store in localStorage
      StorageCtrl.storeItem(newItem);

      // Clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  // Click edit item
  const itemEditClick = function (e) {
    if (e.target.classList.contains("edit-item")) {
      // Get list item id (item-0, item-1)
      const listId = e.target.parentNode.parentNode.id;

      // Break into an array
      const listIdArr = listId.split("-");

      // Get the actual id
      const id = parseInt(listIdArr[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  };

  // Update item submit
  const itemUpdateSubmit = function (e) {
    // Get item input
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Update local storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Delete button event
  const itemDeleteSubmit = function (e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(clientInformation);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Clear items event
  const clearAllItemsClick = function () {
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Remove from UI
    UICtrl.removeItems();

    // Clear from local storage
    StorageCtrl.clearItemsFromStorage();

    // Hide UL
    UICtrl.hideList();
  };

  // Public methods
  return {
    init: function () {
      UICtrl.populateNumberPlayersSelect();
      UICtrl.populateNumGamesSelect();

      // Clear edit state / set initial set
      //UICtrl.clearEditState();

      // Fetch items from data structure
      //const items = ItemCtrl.getItems();
      const scoreSheet = ItemCtrl.getScoreSheet();

      // Check if Score Sheet in Progress
      if (scoreSheet === undefined) {
        // Show New Score Sheet Form
        UICtrl.hideMain();
        UICtrl.hideGameSelect();
        console.log("Show new score sheet form to start");
      } else {
        // Populate list with existing Score Sheet in progress
        console.log("Load existing Score Sheet");
      }

      // Check if any items
      /*if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }*/

      // Get total calories
      //const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      //UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

//Sets the PinDeck Selection on the UI
function setPinDeckOnSelection(ballFrameID) {
  //Get pins down from Current and set correctly
  var currentPinsDown = $("#" + ballFrameID)
    .attr("pins")
    .split("-");
  var pin1 = currentPinsDown[0];
  var pin2 = currentPinsDown[1];
  var pin3 = currentPinsDown[2];
  var pin4 = currentPinsDown[3];
  var pin5 = currentPinsDown[4];
  if (pin1 == "0") {
    $("#pin1").removeClass("pinDown");
  } else {
    $("#pin1").addClass("pinDown");
  }
  if (pin2 == "0") {
    $("#pin2").removeClass("pinDown");
  } else {
    $("#pin2").addClass("pinDown");
  }
  if (pin3 == "0") {
    $("#pin3").removeClass("pinDown");
  } else {
    $("#pin3").addClass("pinDown");
  }
  if (pin4 == "0") {
    $("#pin4").removeClass("pinDown");
  } else {
    $("#pin4").addClass("pinDown");
  }
  if (pin5 == "0") {
    $("#pin5").removeClass("pinDown");
  } else {
    $("#pin5").addClass("pinDown");
  }
}

function selectedBallFrame(ballID) {
  var idArray = ballID.split("-");
  var game = idArray[0];
  var player = idArray[1];
  var frame = idArray[2];
  var ball = idArray[3];
  $("#" + game + "-" + player + "-" + frame).addClass("active");
  $("#" + game + "-" + player + "-" + frame + "-" + ball).addClass("active");
  selectedFrameID = ballID;

  var currentPoints = $(
    "#" + game + "-" + player + "-" + frame + "-" + ball
  ).attr("points");

  if (ball == "2" || ball == "3") {
    var currentPinsDown = $(
      "#" + game + "-" + player + "-" + frame + "-" + ball
    ).attr("pins");

    if (currentPinsDown == "1-1-1-1-1" && currentPoints == "0") {
      if (frame != "10") {
        ball = parseInt(ball) - 1;
        if (ball == 2) {
          var currentPoints = $(
            "#" + game + "-" + player + "-" + frame + "-" + ball
          ).attr("points");
          var currentPinsDown = $(
            "#" + game + "-" + player + "-" + frame + "-" + ball
          ).attr("pins");
          if (currentPinsDown == "1-1-1-1-1" && currentPoints == "0") {
            ball = parseInt(ball) - 1;
          }
        }
        $("#" + game + "-" + player + "-" + frame + "-" + ball).click();
        return;
      } else {
        $("#" + selectedFrameID).attr("pins", "0-0-0-0-0");
      }
    }
  }

  setPinDeckOnSelection(selectedFrameID);
}

//Mark a selected Pin action to add points and UI
function selectedPin(pinNumber, pinValue, ballFrameID) {
  var currentSelectedItem = ballFrameID.split("-");
  var game = currentSelectedItem[0];
  var player = currentSelectedItem[1];
  var frame = currentSelectedItem[2];
  var ball = currentSelectedItem[3];

  var currentPinsDown = $("#" + ballFrameID)
    .attr("pins")
    .split("-");

  //Missed Shot
  if (currentPinsDown[pinNumber] == "-1") {
    pinCount = pinValue;
  } else if (currentPinsDown[pinNumber] == "0") {
    //If the pin was up then went down then add pin value
    currentPinsDown[pinNumber] = "1";
    pinCount = pinValue;
  } else {
    //If the pin was down then revert to up then subtract pin value
    currentPinsDown[pinNumber] = "0";
    pinCount = -pinValue;
  }

  var pin1 = currentPinsDown[0];
  var pin2 = currentPinsDown[1];
  var pin3 = currentPinsDown[2];
  var pin4 = currentPinsDown[3];
  var pin5 = currentPinsDown[4];

  //Have separate function to add points based on ballFrameID
  //Have spearate function on add display to UI based on ballFrameID

  //Store value to localStorage
  localStorage["bsc-" + game + "-" + player + "-" + frame + "-" + ball] =
    pin1 + "-" + pin2 + "-" + pin3 + "-" + pin4 + "-" + pin5;

  var currentPoints = $("#" + selectedFrameID).attr("points");
  var newPoints = parseInt(currentPoints) + pinCount;
  $("#" + selectedFrameID).attr("points", newPoints);

  if (
    pin1 + "-" + pin2 + "-" + pin3 + "-" + pin4 + "-" + pin5 == "1-1-1-1-1" &&
    ball == "1"
  ) {
    $("#" + selectedFrameID).text("X");
  } else if (
    pin1 + "-" + pin2 + "-" + pin3 + "-" + pin4 + "-" + pin5 == "1-1-1-1-0" &&
    ball == "1"
  ) {
    $("#" + selectedFrameID).text("R");
  } else if (
    pin1 + "-" + pin2 + "-" + pin3 + "-" + pin4 + "-" + pin5 == "0-1-1-1-1" &&
    ball == "1"
  ) {
    $("#" + selectedFrameID).text("L");
  } else if (
    pin1 + "-" + pin2 + "-" + pin3 + "-" + pin4 + "-" + pin5 == "0-1-1-1-0" &&
    ball == "1"
  ) {
    $("#" + selectedFrameID).text("A");
  } else if (
    pin1 + "-" + pin2 + "-" + pin3 + "-" + pin4 + "-" + pin5 == "1-1-1-0-0" &&
    ball == "1"
  ) {
    $("#" + selectedFrameID).text("C");
  } else if (
    pin1 + "-" + pin2 + "-" + pin3 + "-" + pin4 + "-" + pin5 == "0-0-1-1-1" &&
    ball == "1"
  ) {
    $("#" + selectedFrameID).text("C");
  } else if (
    pin1 + "-" + pin2 + "-" + pin3 + "-" + pin4 + "-" + pin5 == "0-0-1-0-0" &&
    ball == "1"
  ) {
    $("#" + selectedFrameID).text("H");
  } else if (
    pin1 + "-" + pin2 + "-" + pin3 + "-" + pin4 + "-" + pin5 == "0-0-1-1-0" &&
    ball == "1"
  ) {
    $("#" + selectedFrameID).text("S");
  } else if (
    pin1 + "-" + pin2 + "-" + pin3 + "-" + pin4 + "-" + pin5 == "0-1-1-0-0" &&
    ball == "1"
  ) {
    $("#" + selectedFrameID).text("S");
  } else if (
    pin1 + "-" + pin2 + "-" + pin3 + "-" + pin4 + "-" + pin5 == "1-1-1-1-1" &&
    ball == "2" &&
    $("#" + selectedFrameID).attr("points") != "15"
  ) {
    $("#" + selectedFrameID).text("/");
  } else if (
    pin1 + "-" + pin2 + "-" + pin3 + "-" + pin4 + "-" + pin5 == "1-1-1-1-1" &&
    ball == "2" &&
    $("#" + selectedFrameID).attr("points") == "15" &&
    frame == "10"
  ) {
    $("#" + selectedFrameID).text("X");
  } else if (
    pin1 + "-" + pin2 + "-" + pin3 + "-" + pin4 + "-" + pin5 == "1-1-1-1-1" &&
    frame == "10" &&
    ball == "3" &&
    $("#" + game + "-" + player + "-" + frame + "-1").attr("points") == "15" &&
    "15" &&
    $("#" + game + "-" + player + "-" + frame + "-2").attr("points") != "15"
  ) {
    $("#" + selectedFrameID).text("/");
  } else if (
    pin1 + "-" + pin2 + "-" + pin3 + "-" + pin4 + "-" + pin5 == "1-1-1-1-1" &&
    frame == "10" &&
    ball == "3" &&
    $("#" + game + "-" + player + "-" + frame + "-1").attr("points") == "15" &&
    $("#" + game + "-" + player + "-" + frame + "-2").attr("points") == "15"
  ) {
    $("#" + selectedFrameID).text("X");
  } else if (
    pin1 + "-" + pin2 + "-" + pin3 + "-" + pin4 + "-" + pin5 == "1-1-1-1-1" &&
    frame == "10" &&
    ball == "3" &&
    $("#" + game + "-" + player + "-" + frame + "-2").attr("pins") ==
      "1-1-1-1-1" &&
    $("#" + game + "-" + player + "-" + frame + "-2").attr("points") != "15"
  ) {
    $("#" + selectedFrameID).text("X");
  } else {
    $("#" + selectedFrameID).text(newPoints.toString());
  }

  $("#" + selectedFrameID).attr(
    "pins",
    pin1 + "-" + pin2 + "-" + pin3 + "-" + pin4 + "-" + pin5
  );
  ball = parseInt(ball) + 1;
  if (ball < 4) {
    $("#" + game + "-" + player + "-" + frame + "-" + ball.toString()).attr(
      "pins",
      pin1 + "-" + pin2 + "-" + pin3 + "-" + pin4 + "-" + pin5
    );
    $("#" + game + "-" + player + "-" + frame + "-" + ball.toString()).attr(
      "points",
      "0"
    );
    $("#" + game + "-" + player + "-" + frame + "-" + ball.toString()).text("");
  }
  ball = ball + 1;
  if (ball < 4) {
    $("#" + game + "-" + player + "-" + frame + "-" + ball.toString()).attr(
      "pins",
      pin1 + "-" + pin2 + "-" + pin3 + "-" + pin4 + "-" + pin5
    );
    $("#" + game + "-" + player + "-" + frame + "-" + ball.toString()).attr(
      "points",
      "0"
    );
    $("#" + game + "-" + player + "-" + frame + "-" + ball.toString()).text("");
  }

  onChangeCalculateAllFrameTotals(selectedFrameID);
}

function onChangeCalculateAllFrameTotals(ballFrameID) {
  var currentSelectedItem = ballFrameID.split("-");
  var game = currentSelectedItem[0];
  var player = currentSelectedItem[1];
  var frame = currentSelectedItem[2];
  var ball = currentSelectedItem[3];

  var framePoints =
    parseInt($("#" + game + "-" + player + "-" + frame + "-1").attr("points")) +
    parseInt($("#" + game + "-" + player + "-" + frame + "-2").attr("points")) +
    parseInt($("#" + game + "-" + player + "-" + frame + "-3").attr("points"));

  if (frame == "1") {
    $("#" + game + "-" + player + "-" + frame).attr(
      "points",
      framePoints.toString()
    );
    $("#" + game + "-" + player + "-" + frame).text(framePoints.toString());
    $("#total-" + game + "-" + player).text(framePoints.toString());
  }
  if (frame == "2") {
    $("#" + game + "-" + player + "-" + frame).attr(
      "points",
      framePoints.toString()
    );

    //if previous a single Strike
    if ($("#" + game + "-" + player + "-1-1").attr("pins") == "1-1-1-1-1") {
      var previousframePoints =
        15 +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        ) +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-2").attr("points")
        );
      $("#" + game + "-" + player + "-1").text(previousframePoints.toString());
    }
    //if previous a spare
    if (
      $("#" + game + "-" + player + "-1-2").attr("pins") == "1-1-1-1-1" &&
      $("#" + game + "-" + player + "-1-2").attr("points") != "0"
    ) {
      var previousframePoints =
        15 +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        );
      $("#" + game + "-" + player + "-1").text(previousframePoints.toString());
    }

    framePoints =
      parseInt($("#" + game + "-" + player + "-1").text()) + framePoints;
    $("#" + game + "-" + player + "-" + frame).text(framePoints.toString());
    $("#total-" + game + "-" + player).text(framePoints.toString());
  }
  if (frame == "3") {
    $("#" + game + "-" + player + "-" + frame).attr(
      "points",
      framePoints.toString()
    );

    //if previous Double
    if (
      $("#" + game + "-" + player + "-1-1").attr("pins") == "1-1-1-1-1" &&
      $("#" + game + "-" + player + "-2-1").attr("pins") == "1-1-1-1-1"
    ) {
      var previousframePoints =
        30 +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        );
      $("#" + game + "-" + player + "-1").text(previousframePoints.toString());
    }
    //if previous a single Strike
    if ($("#" + game + "-" + player + "-2-1").attr("pins") == "1-1-1-1-1") {
      var previousframePoints =
        parseInt($("#" + game + "-" + player + "-1").text()) +
        15 +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        ) +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-2").attr("points")
        );
      $("#" + game + "-" + player + "-2").text(previousframePoints.toString());
    }
    //if previous a spare
    if (
      $("#" + game + "-" + player + "-2-2").attr("pins") == "1-1-1-1-1" &&
      $("#" + game + "-" + player + "-2-2").attr("points") != "0"
    ) {
      var previousframePoints =
        parseInt($("#" + game + "-" + player + "-1").text()) +
        15 +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        );
      $("#" + game + "-" + player + "-2").text(previousframePoints.toString());
    }

    framePoints =
      parseInt($("#" + game + "-" + player + "-2").text()) + framePoints;
    $("#" + game + "-" + player + "-" + frame).text(framePoints.toString());
    $("#total-" + game + "-" + player).text(framePoints.toString());
  }
  if (frame == "4") {
    $("#" + game + "-" + player + "-" + frame).attr(
      "points",
      framePoints.toString()
    );

    //if previous Double
    if (
      $("#" + game + "-" + player + "-2-1").attr("pins") == "1-1-1-1-1" &&
      $("#" + game + "-" + player + "-3-1").attr("pins") == "1-1-1-1-1"
    ) {
      var previousframePoints =
        parseInt($("#" + game + "-" + player + "-1").text()) +
        30 +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        );
      $("#" + game + "-" + player + "-2").text(previousframePoints.toString());
    }
    //if previous a single Strike
    if ($("#" + game + "-" + player + "-3-1").attr("pins") == "1-1-1-1-1") {
      var previousframePoints =
        parseInt($("#" + game + "-" + player + "-2").text()) +
        15 +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        ) +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-2").attr("points")
        );
      $("#" + game + "-" + player + "-3").text(previousframePoints.toString());
    }
    //if previous a spare
    if (
      $("#" + game + "-" + player + "-3-2").attr("pins") == "1-1-1-1-1" &&
      $("#" + game + "-" + player + "-3-2").attr("points") != "0"
    ) {
      var previousframePoints =
        parseInt($("#" + game + "-" + player + "-2").text()) +
        15 +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        );
      $("#" + game + "-" + player + "-3").text(previousframePoints.toString());
    }

    framePoints =
      parseInt($("#" + game + "-" + player + "-3").text()) + framePoints;
    $("#" + game + "-" + player + "-" + frame).text(framePoints.toString());
    $("#total-" + game + "-" + player).text(framePoints.toString());
  } else if (frame == "5") {
    $("#" + game + "-" + player + "-" + frame).attr(
      "points",
      framePoints.toString()
    );

    //if previous Double
    if (
      $("#" + game + "-" + player + "-3-1").attr("pins") == "1-1-1-1-1" &&
      $("#" + game + "-" + player + "-4-1").attr("pins") == "1-1-1-1-1"
    ) {
      var previousframePoints =
        parseInt($("#" + game + "-" + player + "-2").text()) +
        30 +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        );
      $("#" + game + "-" + player + "-3").text(previousframePoints.toString());
    }
    //if previous a single Strike
    if ($("#" + game + "-" + player + "-4-1").attr("pins") == "1-1-1-1-1") {
      var previousframePoints =
        parseInt($("#" + game + "-" + player + "-3").text()) +
        parseInt($("#" + game + "-" + player + "-4").attr("points")) +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        ) +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-2").attr("points")
        );
      $("#" + game + "-" + player + "-4").text(previousframePoints.toString());
    }
    //if previous a spare
    if (
      $("#" + game + "-" + player + "-4-2").attr("pins") == "1-1-1-1-1" &&
      $("#" + game + "-" + player + "-4-2").attr("points") != "0"
    ) {
      var previousframePoints =
        parseInt($("#" + game + "-" + player + "-3").text()) +
        parseInt($("#" + game + "-" + player + "-4").attr("points")) +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        );
      $("#" + game + "-" + player + "-4").text(previousframePoints.toString());
    }

    framePoints =
      parseInt($("#" + game + "-" + player + "-4").text()) + framePoints;
    $("#" + game + "-" + player + "-" + frame).text(framePoints.toString());
    $("#total-" + game + "-" + player).text(framePoints.toString());
  } else if (frame == "6") {
    $("#" + game + "-" + player + "-" + frame).attr(
      "points",
      framePoints.toString()
    );

    //if previous Double
    if (
      $("#" + game + "-" + player + "-4-1").attr("pins") == "1-1-1-1-1" &&
      $("#" + game + "-" + player + "-5-1").attr("pins") == "1-1-1-1-1"
    ) {
      var previousframePoints =
        parseInt($("#" + game + "-" + player + "-3").text()) +
        30 +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        );
      $("#" + game + "-" + player + "-4").text(previousframePoints.toString());
    }
    //if previous a single Strike
    if ($("#" + game + "-" + player + "-5-1").attr("pins") == "1-1-1-1-1") {
      var previousframePoints =
        parseInt($("#" + game + "-" + player + "-4").text()) +
        parseInt($("#" + game + "-" + player + "-5").attr("points")) +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        ) +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-2").attr("points")
        );
      $("#" + game + "-" + player + "-5").text(previousframePoints.toString());
    }
    //if previous a spare
    if (
      $("#" + game + "-" + player + "-5-2").attr("pins") == "1-1-1-1-1" &&
      $("#" + game + "-" + player + "-5-2").attr("points") != "0"
    ) {
      var previousframePoints =
        parseInt($("#" + game + "-" + player + "-4").text()) +
        parseInt($("#" + game + "-" + player + "-5").attr("points")) +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        );
      $("#" + game + "-" + player + "-5").text(previousframePoints.toString());
    }

    framePoints =
      parseInt($("#" + game + "-" + player + "-5").text()) + framePoints;
    $("#" + game + "-" + player + "-" + frame).text(framePoints.toString());
    $("#total-" + game + "-" + player).text(framePoints.toString());
  } else if (frame == "7") {
    $("#" + game + "-" + player + "-" + frame).attr(
      "points",
      framePoints.toString()
    );

    //if previous Double
    if (
      $("#" + game + "-" + player + "-5-1").attr("pins") == "1-1-1-1-1" &&
      $("#" + game + "-" + player + "-6-1").attr("pins") == "1-1-1-1-1"
    ) {
      var previousframePoints =
        parseInt($("#" + game + "-" + player + "-4").text()) +
        30 +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        );
      $("#" + game + "-" + player + "-5").text(previousframePoints.toString());
    }
    //if previous a single Strike
    if ($("#" + game + "-" + player + "-6-1").attr("pins") == "1-1-1-1-1") {
      var previousframePoints =
        parseInt($("#" + game + "-" + player + "-5").text()) +
        parseInt($("#" + game + "-" + player + "-6").attr("points")) +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        ) +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-2").attr("points")
        );
      $("#" + game + "-" + player + "-6").text(previousframePoints.toString());
    }
    //if previous a spare
    if (
      $("#" + game + "-" + player + "-6-2").attr("pins") == "1-1-1-1-1" &&
      $("#" + game + "-" + player + "-6-2").attr("points") != "0"
    ) {
      var previousframePoints =
        parseInt($("#" + game + "-" + player + "-5").text()) +
        parseInt($("#" + game + "-" + player + "-6").attr("points")) +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        );
      $("#" + game + "-" + player + "-6").text(previousframePoints.toString());
    }

    framePoints =
      parseInt($("#" + game + "-" + player + "-6").text()) + framePoints;
    $("#" + game + "-" + player + "-" + frame).text(framePoints.toString());
    $("#total-" + game + "-" + player).text(framePoints.toString());
  } else if (frame == "8") {
    $("#" + game + "-" + player + "-" + frame).attr(
      "points",
      framePoints.toString()
    );

    //if previous Double
    if (
      $("#" + game + "-" + player + "-6-1").attr("pins") == "1-1-1-1-1" &&
      $("#" + game + "-" + player + "-7-1").attr("pins") == "1-1-1-1-1"
    ) {
      var previousframePoints =
        parseInt($("#" + game + "-" + player + "-5").text()) +
        30 +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        );
      $("#" + game + "-" + player + "-6").text(previousframePoints.toString());
    }
    //if previous a single Strike
    if ($("#" + game + "-" + player + "-7-1").attr("pins") == "1-1-1-1-1") {
      var previousframePoints =
        parseInt($("#" + game + "-" + player + "-6").text()) +
        parseInt($("#" + game + "-" + player + "-7").attr("points")) +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        ) +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-2").attr("points")
        );
      $("#" + game + "-" + player + "-7").text(previousframePoints.toString());
    }
    //if previous a spare
    if (
      $("#" + game + "-" + player + "-7-2").attr("pins") == "1-1-1-1-1" &&
      $("#" + game + "-" + player + "-7-2").attr("points") != "0"
    ) {
      var previousframePoints =
        parseInt($("#" + game + "-" + player + "-6").text()) +
        parseInt($("#" + game + "-" + player + "-7").attr("points")) +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        );
      $("#" + game + "-" + player + "-7").text(previousframePoints.toString());
    }

    framePoints =
      parseInt($("#" + game + "-" + player + "-7").text()) + framePoints;
    $("#" + game + "-" + player + "-" + frame).text(framePoints.toString());
    $("#total-" + game + "-" + player).text(framePoints.toString());
  } else if (frame == "9") {
    $("#" + game + "-" + player + "-" + frame).attr(
      "points",
      framePoints.toString()
    );

    //if previous Double
    if (
      $("#" + game + "-" + player + "-7-1").attr("pins") == "1-1-1-1-1" &&
      $("#" + game + "-" + player + "-8-1").attr("pins") == "1-1-1-1-1"
    ) {
      var previousframePoints =
        parseInt($("#" + game + "-" + player + "-6").text()) +
        30 +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        );
      $("#" + game + "-" + player + "-7").text(previousframePoints.toString());
    }
    //if previous a single Strike
    if ($("#" + game + "-" + player + "-8-1").attr("pins") == "1-1-1-1-1") {
      var previousframePoints =
        parseInt($("#" + game + "-" + player + "-7").text()) +
        parseInt($("#" + game + "-" + player + "-8").attr("points")) +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        ) +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-2").attr("points")
        );
      $("#" + game + "-" + player + "-8").text(previousframePoints.toString());
    }
    //if previous a spare
    if (
      $("#" + game + "-" + player + "-8-2").attr("pins") == "1-1-1-1-1" &&
      $("#" + game + "-" + player + "-8-2").attr("points") != "0"
    ) {
      var previousframePoints =
        parseInt($("#" + game + "-" + player + "-7").text()) +
        parseInt($("#" + game + "-" + player + "-8").attr("points")) +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        );
      $("#" + game + "-" + player + "-8").text(previousframePoints.toString());
    }

    framePoints =
      parseInt($("#" + game + "-" + player + "-8").text()) + framePoints;
    $("#" + game + "-" + player + "-" + frame).text(framePoints.toString());
    $("#total-" + game + "-" + player).text(framePoints.toString());
  } else if (frame == "10") {
    $("#" + game + "-" + player + "-" + frame).attr(
      "points",
      framePoints.toString()
    );

    //if previous Double
    if (
      $("#" + game + "-" + player + "-8-1").attr("pins") == "1-1-1-1-1" &&
      $("#" + game + "-" + player + "-9-1").attr("pins") == "1-1-1-1-1"
    ) {
      var previousframePoints =
        parseInt($("#" + game + "-" + player + "-7").text()) +
        30 +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        );
      $("#" + game + "-" + player + "-8").text(previousframePoints.toString());
    }
    //if previous a single Strike
    if ($("#" + game + "-" + player + "-9-1").attr("pins") == "1-1-1-1-1") {
      var previousframePoints =
        parseInt($("#" + game + "-" + player + "-8").text()) +
        parseInt($("#" + game + "-" + player + "-9").attr("points")) +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        ) +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-2").attr("points")
        );
      $("#" + game + "-" + player + "-9").text(previousframePoints.toString());
    }
    //if previous a spare
    if (
      $("#" + game + "-" + player + "-9-2").attr("pins") == "1-1-1-1-1" &&
      $("#" + game + "-" + player + "-9-2").attr("points") != "0"
    ) {
      var previousframePoints =
        parseInt($("#" + game + "-" + player + "-8").text()) +
        parseInt($("#" + game + "-" + player + "-9").attr("points")) +
        parseInt(
          $("#" + game + "-" + player + "-" + frame + "-1").attr("points")
        );
      $("#" + game + "-" + player + "-9").text(previousframePoints.toString());
    }

    framePoints =
      parseInt($("#" + game + "-" + player + "-9").text()) + framePoints;
    $("#" + game + "-" + player + "-" + frame).text(framePoints.toString());
    $("#total-" + game + "-" + player).text(framePoints.toString());
  }

  calculateTeamPinfall(game);
}

function calculateTeamPinfall(game) {
  var teamPinfall = 0;
  if ($("#total-" + game + "-1").text() != "") {
    teamPinfall += parseInt($("#total-" + game + "-1").text(), 10);
  }
  if ($("#total-" + game + "-2").text() != "") {
    teamPinfall += parseInt($("#total-" + game + "-2").text(), 10);
  }
  if ($("#total-" + game + "-3").text() != "") {
    teamPinfall += parseInt($("#total-" + game + "-3").text(), 10);
  }
  if ($("#total-" + game + "-4").text() != "") {
    teamPinfall += parseInt($("#total-" + game + "-4").text(), 10);
  }
  if ($("#total-" + game + "-5").text() != "") {
    teamPinfall += parseInt($("#total-" + game + "-5").text(), 10);
  }
  if ($("#total-" + game + "-6").text() != "") {
    teamPinfall += parseInt($("#total-" + game + "-6").text(), 10);
  }
  $("#teamPinfall").text(teamPinfall.toString());
}

//Listens to click on pin on the pin deck
$("#pin1").on("click", function () {
  $(this).toggleClass("pinDown");
  selectedPin(0, 2, selectedFrameID);
});
$("#pin2").on("click", function () {
  $(this).toggleClass("pinDown");
  selectedPin(1, 3, selectedFrameID);
});
$("#pin3").on("click", function () {
  $(this).toggleClass("pinDown");
  selectedPin(2, 5, selectedFrameID);
});
$("#pin4").on("click", function () {
  $(this).toggleClass("pinDown");
  selectedPin(3, 3, selectedFrameID);
});
$("#pin5").on("click", function () {
  $(this).toggleClass("pinDown");
  selectedPin(4, 2, selectedFrameID);
});
$("#missedBtn").on("click", function () {
  selectedPin(-1, 0, selectedFrameID);
});
$("#nextBtn").on("click", function () {
  //Check if nothing is selected
  if (selectedFrameID != undefined) {
    var currentSelectedItem = selectedFrameID.split("-");
    var game = currentSelectedItem[0];
    var player = currentSelectedItem[1];
    var frame = currentSelectedItem[2];
    var ball = currentSelectedItem[3];

    if (ball < 3) {
      ball++;
    } else {
      frame++;
      ball = 1;
    }

    var currentPoints = $(
      "#" + game + "-" + player + "-" + frame + "-" + ball
    ).attr("points");

    console.log("currentPoints: " + currentPoints);

    if (ball == "2" || ball == "3") {
      var currentPinsDown = $(
        "#" + game + "-" + player + "-" + frame + "-" + ball
      ).attr("pins");

      console.log("currentPinsDown: " + currentPinsDown);

      if (currentPinsDown == "1-1-1-1-1" && currentPoints == "0") {
        if (frame != "10") {
          if (ball == 2) {
            //var currentPoints = $(
            //  "#" + game + "-" + player + "-" + frame + "-" + ball
            //).attr("points");
            //var currentPinsDown = $(
            //  "#" + game + "-" + player + "-" + frame + "-" + ball
            //).attr("pins");
            console.log("points: " + currentPoints);
            console.log("pinsdown: " + currentPinsDown);
            if (currentPinsDown == "1-1-1-1-1" && currentPoints == "0") {
              //ball = parseInt(ball) - 1;
              //frame++;
              //ball = 1;
            }
          }
        } else {
          $("#" + selectedFrameID).attr("pins", "0-0-0-0-0");
        }
      } else {
      }
    } else {
      //ball++;
    }

    selectedFrameID = `${game}-${player}-${frame}-${ball}`;
    console.log(selectedFrameID);
    $(`#${selectedFrameID}`).click();
  }
});
$("#prevBtn").on("click", function () {
  if (selectedFrameID != undefined) {
    console.log(selectedFrameID);
    var currentSelectedItem = selectedFrameID.split("-");
    var game = currentSelectedItem[0];
    var player = currentSelectedItem[1];
    var frame = currentSelectedItem[2];
    var ball = currentSelectedItem[3];
  }
});

// Initialize App
App.init();
