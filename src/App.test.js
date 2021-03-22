import React from 'react';
import ReactDOM from 'react-dom';
import { getNodeText, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';

import { gearList, clothingList, dayFoodList, overnightFoodList, campingList } from './resources/ListData';

describe('initial render is correct', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  it('displays the taglines', () => {
    render(<App />);
    const firstTagline = screen.getByText('Plan', { exact: false });
    expect(firstTagline.textContent).toBe("Plan your next adventure here.");
    const secondTagline = screen.getByText('Every', { exact: false });
    expect(secondTagline.textContent).toBe("Every successful adventure starts with a good list (or two).");
  });

  it('displays the user question and two user radio buttons, "Day trip" and "Overnight trip"', () => {
    render(<App />);

    const userQuestion = screen.getByText('Day trip or', { exact: false });
    expect(userQuestion.textContent).toBe("Day trip or overnight trip?");

    const dayTripOption = screen.getByRole('radio', { name: 'Day trip' });
    expect(dayTripOption).toBeTruthy();

    const overnightTripOption = screen.getByRole('radio', { name: 'Overnight trip' });
    expect(overnightTripOption).toBeTruthy();
  });

});

describe('the correct lists render based on user selection', () => {

  it('displays the "Gear", "Clothing" and "Food (Day Trip)" lists when the "Day trip" option is selected', () => {
    render(<App />);

    const dayTripOption = screen.getByRole('radio', { name: 'Day trip' });
    userEvent.click(dayTripOption);

    const gearListHeading = screen.getByRole('heading', { name: 'Gear' });
    const clothingListHeading = screen.getByRole('heading', { name: 'Clothing' });
    const dayTripFoodListHeading = screen.getByRole('heading', { name: 'Food (Day Trip)' });

    expect(gearListHeading).toBeTruthy();
    expect(clothingListHeading).toBeTruthy();
    expect(dayTripFoodListHeading).toBeTruthy();
  });

  it('displays the "Gear", "Clothing" and "Food (Overnight Trip)" lists when the "Overnight trip" option is selected', () => {
    render(<App />);
    const overnightTripOption = screen.getByRole('radio', { name: 'Overnight trip' });
    userEvent.click(overnightTripOption);

    const gearListHeading = screen.getByRole('heading', { name: 'Gear' });
    const clothingListHeading = screen.getByRole('heading', { name: 'Clothing' });
    const overnightTripFoodListHeading = screen.getByRole('heading', { name: 'Food (Overnight Trip)' });
    const campingListHeading = screen.getByRole('heading', { name: 'Camping' });

    expect(gearListHeading).toBeTruthy();
    expect(clothingListHeading).toBeTruthy();
    expect(overnightTripFoodListHeading).toBeTruthy();
    expect(campingListHeading).toBeTruthy();
  });

  it('when the "Overnight trip" option is selected first, then "Day trip" option is selected, displays the "Gear", "Clothing" and "Food (Day Trip)" lists', () => {
    render(<App />);

    const overnightTripOption = screen.getByRole('radio', { name: 'Overnight trip' });
    userEvent.click(overnightTripOption);

    const dayTripOption = screen.getByRole('radio', { name: 'Day trip' });
    userEvent.click(dayTripOption);

    const gearListHeading = screen.getByRole('heading', { name: 'Gear' });
    const clothingListHeading = screen.getByRole('heading', { name: 'Clothing' });
    const dayTripFoodListHeading = screen.getByRole('heading', { name: 'Food (Day Trip)' });

    expect(gearListHeading).toBeTruthy();
    expect(clothingListHeading).toBeTruthy();
    expect(dayTripFoodListHeading).toBeTruthy();
  });

});

describe('lists display the appropriate list items as provided for in ListData.js', () => {

  it('"Gear" list contains the correct number of checkbox list items', () => {
    render(<App />);
    const dayTripOption = screen.getByRole('radio', { name: 'Day trip' });
    userEvent.click(dayTripOption);

    const gearListSection = screen.getByTestId(gearList.listId);
    const numberOfItemsFromData = gearList.itemNames.length;
    const numberOfItemsDisplayed = within(gearListSection).getAllByRole('checkbox').length;
    expect(numberOfItemsDisplayed).toBe(numberOfItemsFromData);
  });

  it('"Gear" list displays all the relevant items', () => {
    render(<App />);
    const dayTripOption = screen.getByRole('radio', { name: 'Day trip' });
    userEvent.click(dayTripOption);

    const gearListSection = screen.getByTestId(gearList.listId);
    const listItems = gearList.itemNames;
    listItems.forEach(listItem => expect(within(gearListSection).getByText(listItem)).toBeTruthy());
  });

  it('"Camping" list contains the correct number of checkbox list items', () => {
    render(<App />);
    const overnightTripOption = screen.getByRole('radio', { name: 'Overnight trip' });
    userEvent.click(overnightTripOption);

    const campingListSection = screen.getByTestId(campingList.listId);
    const numberOfItemsFromData = campingList.itemNames.length;
    const numberOfItemsDisplayed = within(campingListSection).getAllByRole('checkbox').length;
    expect(numberOfItemsDisplayed).toBe(numberOfItemsFromData);
  });

  it('"Camping" list displays all the relevant items', () => {
    render(<App />);
    const overnightTripOption = screen.getByRole('radio', { name: 'Overnight trip' });
    userEvent.click(overnightTripOption);

    const campingListSection = screen.getByTestId(campingList.listId);
    const listItems = campingList.itemNames;
    listItems.forEach(listItem => expect(within(campingListSection).getByText(listItem)).toBeTruthy());
  });

});

describe('delete button works correctly', () => {

  it('deletes the second item from the clothing list correctly', () => {
    render(<App />);
    const overnightTripOption = screen.getByRole('radio', { name: 'Overnight trip' });
    userEvent.click(overnightTripOption);

    // Confirm the second item (item at index 1) is displayed in the list to begin with
    const clothingListSection = screen.getByTestId(clothingList.listId);
    const secondClothingItem = within(clothingListSection).getByLabelText(clothingList.itemNames[1]);
    expect(secondClothingItem).toBeTruthy();

    // Simulate user click on the relevant delete button
    const secondClothingItemDeleteBtn = screen.getByTestId(clothingList.listId + '-item-1-delete');
    userEvent.click(secondClothingItemDeleteBtn);

    // The second item should now be gone
    expect(within(clothingListSection).queryByLabelText(clothingList.itemNames[1])).toBeNull();

    // All other items should remain
    const updatedListItemsExpected = clothingList.itemNames.filter((item, index) => index !== 1);
    const updatedClothingListSection = screen.getByTestId(clothingList.listId);
    updatedListItemsExpected.forEach(listItem => expect(within(updatedClothingListSection).getByText(listItem)).toBeTruthy());
  });

  it('after deleting the second item in clothing list, delete the fifth item correctly', () => {
    render(<App />);
    const overnightTripOption = screen.getByRole('radio', { name: 'Overnight trip' });
    userEvent.click(overnightTripOption);

    // Delete second item
    const secondClothingItemDeleteBtn = screen.getByTestId(clothingList.listId + '-item-1-delete');
    userEvent.click(secondClothingItemDeleteBtn);

    // Delete fifth item
    const fifthClothingItemDeleteBtn = screen.getByTestId(clothingList.listId + '-item-4-delete');
    userEvent.click(fifthClothingItemDeleteBtn);

    // The fifth item should now be gone
    const clothingListSection = screen.getByTestId(clothingList.listId);
    expect(within(clothingListSection).queryByLabelText(clothingList.itemNames[1])).toBeNull();

    // All other items should remain
    const updatedListItemsExpected = clothingList.itemNames.filter((item, index) => index !== 1 && index !== 4);
    const updatedClothingListSection = screen.getByTestId(clothingList.listId);
    updatedListItemsExpected.forEach(listItem => expect(within(updatedClothingListSection).getByText(listItem)).toBeTruthy());
  });

});

describe('undo button works correctly', () => {
  it('when nothing has been deleted from the gear list, clicking the undo button does not affect the list, and the app does not crash', () => {
    render(<App />);
    const dayTripOption = screen.getByRole('radio', { name: 'Day trip' });
    userEvent.click(dayTripOption);
    const gearListSection = screen.getByTestId(gearList.listId);

    // Click on the undo button in the "Food (Day Trip)" list
    const undoBtn = within(gearListSection).getByRole('button', { name: 'undo delete' });
    userEvent.click(undoBtn);

    // All of the original gear list items should still be there
    const listItems = gearList.itemNames;
    listItems.forEach(listItem => expect(within(gearListSection).getByText(listItem)).toBeTruthy());
  });

  it('when the third item from the "Food (Day Trip)" list is deleted, clicking the undo-delete button restores it at its original spot in the list', () => {
    render(<App />);
    const dayTripOption = screen.getByRole('radio', { name: 'Day trip' });
    userEvent.click(dayTripOption);
    const dayFoodListSection = screen.getByTestId(dayFoodList.listId);

    // Delete third item
    const thirdFoodItemDeleteBtn = screen.getByTestId(dayFoodList.listId + '-item-2-delete');
    userEvent.click(thirdFoodItemDeleteBtn);

    // The third item should now be gone
    expect(within(dayFoodListSection).queryByLabelText(dayFoodList.itemNames[2])).toBeNull();

    // Click on the undo button in the "Food (Day Trip)" list
    const undoBtn = within(dayFoodListSection).getByRole('button', { name: 'undo delete' });
    userEvent.click(undoBtn);

    // The third item should be be back in the list 
    expect(within(dayFoodListSection).queryByLabelText(dayFoodList.itemNames[2])).toBeTruthy();

    // The third item in the list should back in its originally spot
    const displayedListItemElements = within(dayFoodListSection).getAllByTestId(/-item-label/);
    const displayedListItems = displayedListItemElements.map(element => getNodeText(element));
    expect(displayedListItems[2]).toBe(dayFoodList.itemNames[2]);
  });

  it('when two items from the "Food (Overnight Trip)" list are deleted (the second and sixth), clicking the undo-delete button twice restores them both to their original spots in the list', () => {
    render(<App />);
    const overnightTripOption = screen.getByRole('radio', { name: 'Overnight trip' });
    userEvent.click(overnightTripOption);
    const overnightFoodListSection = screen.getByTestId(overnightFoodList.listId);

    // Delete sixth item
    const sixthFoodItemDeleteBtn = screen.getByTestId(overnightFoodList.listId + '-item-5-delete');
    userEvent.click(sixthFoodItemDeleteBtn);

    // The sixth item should now be gone
    expect(within(overnightFoodListSection).queryByLabelText(overnightFoodList.itemNames[5])).toBeNull();

    // Delete second item
    const secondFoodItemDeleteBtn = screen.getByTestId(overnightFoodList.listId + '-item-1-delete');
    userEvent.click(secondFoodItemDeleteBtn);

    // The second item should now be gone
    expect(within(overnightFoodListSection).queryByLabelText(overnightFoodList.itemNames[1])).toBeNull();

    // Click on the undo button in the "Food (Day Trip)" list twice
    const undoBtn = within(overnightFoodListSection).getByRole('button', { name: 'undo delete' });
    userEvent.click(undoBtn);
    userEvent.click(undoBtn);

    // The 6th and 2nd items should be be back in the list 
    expect(within(overnightFoodListSection).queryByLabelText(overnightFoodList.itemNames[5])).toBeTruthy();
    expect(within(overnightFoodListSection).queryByLabelText(overnightFoodList.itemNames[1])).toBeTruthy();

    // The 6th and 2nd items should be back in their original spots
    const displayedListItemElements = within(overnightFoodListSection).getAllByTestId(/-item-label/);
    const displayedListItems = displayedListItemElements.map(element => getNodeText(element));
    expect(displayedListItems[5]).toBe(overnightFoodList.itemNames[5]);
    expect(displayedListItems[1]).toBe(overnightFoodList.itemNames[1]);
  });

  it('when the 1st item from the "Clothing" list is deleted, then the 4th item from the "Camping" list is deleted, clicking their respective undo-delete buttons restores the items at their original spots in their respective lists', () => {

    render(<App />);
    const overnightTripOption = screen.getByRole('radio', { name: 'Overnight trip' });
    userEvent.click(overnightTripOption);
    const clothingListSection = screen.getByTestId(clothingList.listId);
    const campingListSection = screen.getByTestId(campingList.listId);

    // Delete 1st item on the clothing list
    const clothingItemDeleteBtn = screen.getByTestId(clothingList.listId + '-item-0-delete');
    userEvent.click(clothingItemDeleteBtn);

    // The 1st item on the clothing list should now be gone
    expect(within(clothingListSection).queryByLabelText(clothingList.itemNames[0])).toBeNull();

    // Delete fourth item from the camping list
    const campingItemDeleteBtn = screen.getByTestId(campingList.listId + '-item-3-delete');
    userEvent.click(campingItemDeleteBtn);

    // The fourth item from the camping list should now be gone
    expect(within(campingListSection).queryByLabelText(campingList.itemNames[3])).toBeNull();

    // Click on the undo button the camping list and in the clothing list
    const campingUndoBtn = within(campingListSection).getByRole('button', { name: 'undo delete' });
    userEvent.click(campingUndoBtn);
    const clothingUndoBtn = within(clothingListSection).getByRole('button', { name: 'undo delete' });
    userEvent.click(clothingUndoBtn);

    // The items should be be back in their respective lists 
    expect(within(clothingListSection).queryByLabelText(clothingList.itemNames[0])).toBeTruthy();
    expect(within(campingListSection).queryByLabelText(campingList.itemNames[3])).toBeTruthy();

    // The items should be back in their original spots
    const displayedClothingListItemElements = within(clothingListSection).getAllByTestId(/-item-label/);
    const displayedClothingListItems = displayedClothingListItemElements.map(element => getNodeText(element));
    expect(displayedClothingListItems[0]).toBe(clothingList.itemNames[0]);

    const displayedCampingListItemElements = within(campingListSection).getAllByTestId(/-item-label/);
    const displayedCampingListItems = displayedCampingListItemElements.map(element => getNodeText(element));
    expect(displayedCampingListItems[3]).toBe(campingList.itemNames[3]);
  });

});

describe('edit feature works correctly', () => {
  it('clicking on the edit button of the 2nd item of the "Gear" list displays a text box, which value is the item name we are editing', () => {
    render(<App />);
    const overnightTripOption = screen.getByRole('radio', { name: 'Overnight trip' });
    userEvent.click(overnightTripOption);
    const gearListSection = screen.getByTestId(gearList.listId);

    // To begin, there should not be any edit-item forms displayed
    let anyEditForms = within(gearListSection).queryAllByTestId(/edit-form/);
    expect(anyEditForms.length).toBe(0);

    // Click the edit button
    const gearItemEditBtn = screen.getByTestId(gearList.listId + '-item-1-edit');
    userEvent.click(gearItemEditBtn);

    // There should be one edit-item forms displayed
    anyEditForms = within(gearListSection).queryAllByTestId(/edit-form/);
    expect(anyEditForms.length).toBe(1);

    // The edit form should have a textbox, which value is the item name of the list item we are editing
    const editItemFormElement = within(gearListSection).getByTestId(gearList.listId + '-item-1-edit-form');
    const textbox = within(editItemFormElement).getByRole('textbox');
    expect(textbox.value).toBe(gearList.itemNames[1]);
  });

  it('edits the name of the 4th item of the "Clothing" list to "Hello, world"', () => {
    render(<App />);
    const dayTripOption = screen.getByRole('radio', { name: 'Day trip' });
    userEvent.click(dayTripOption);
    const clothingListSection = screen.getByTestId(clothingList.listId);

    // Click the edit button
    const clothingItemEditBtn = screen.getByTestId(clothingList.listId + '-item-3-edit');
    userEvent.click(clothingItemEditBtn);

    // Clear the textbox and type "Hello, world", and click the 'done' button
    const editItemFormElement = within(clothingListSection).getByTestId(clothingList.listId + '-item-3-edit-form');
    const textbox = within(editItemFormElement).getByRole('textbox');
    userEvent.clear(textbox);
    userEvent.type(textbox, 'Hello, world');
    const doneButton = within(editItemFormElement).getByRole('button', {name: 'Submit'});
    userEvent.click(doneButton);

    // The 4th item in the list should now be "Hello, world"
    const displayedListItemElements = within(clothingListSection).getAllByTestId(/-item-label/);
    const displayedListItems = displayedListItemElements.map(element => getNodeText(element));
    expect(displayedListItems[3]).toBe('Hello, world');
  });
    
  it('edits more than one item at a time (2nd and 5th on "Gear" list)', () => {
    render(<App />);
    const overnightTripOption = screen.getByRole('radio', { name: 'Overnight trip' });
    userEvent.click(overnightTripOption);
    const gearListSection = screen.getByTestId(gearList.listId);

    // Click the both edit buttons
    const secondGearItemEditBtn = screen.getByTestId(gearList.listId + '-item-1-edit');
    userEvent.click(secondGearItemEditBtn);
    const fifthGearItemEditBtn = screen.getByTestId(gearList.listId + '-item-4-edit');
    userEvent.click(fifthGearItemEditBtn);

    // Clear both textboxes and type "I'm edited!"
    const secondEditItemFormElement = within(gearListSection).getByTestId(gearList.listId + '-item-1-edit-form');
    const secondItemTextbox = within(secondEditItemFormElement).getByRole('textbox');
    userEvent.clear(secondItemTextbox);
    userEvent.type(secondItemTextbox, "I'm edited!");

    const fifthEditItemFormElement = within(gearListSection).getByTestId(gearList.listId + '-item-4-edit-form');
    const fifthItemTextbox = within(fifthEditItemFormElement).getByRole('textbox');
    userEvent.clear(fifthItemTextbox);
    userEvent.type(fifthItemTextbox, "I'm also edited.");

    // Click the 'done' buttons
    const secondDoneButton = within(secondEditItemFormElement).getByRole('button', {name: 'Submit'});
    userEvent.click(secondDoneButton);
    const fifthDoneButton = within(fifthEditItemFormElement).getByRole('button', {name: 'Submit'});
    userEvent.click(fifthDoneButton);

    // The 2nd item in the list should now be "I'm edited!" and the fifth item, "I'm also edited."
    const displayedListItemElements = within(gearListSection).getAllByTestId(/-item-label/);
    const displayedListItems = displayedListItemElements.map(element => getNodeText(element));
    expect(displayedListItems[1]).toBe("I'm edited!");
    expect(displayedListItems[4]).toBe("I'm also edited.");
    
  });
});

describe('add new item feature works correctly', () => {
  
  it('clicking the add button of the Camping list when the textbox is empty does not affect the list', () => {
    render(<App />);
    const overnightTripOption = screen.getByRole('radio', { name: 'Overnight trip' });
    userEvent.click(overnightTripOption);
    const campingListSection = screen.getByTestId(campingList.listId);

    // The textbox should be empty
    const addItemTextbox = within(campingListSection).getByRole('textbox');
    expect(addItemTextbox.value.length).toBe(0);

    // Click the add button
    const addButton = within(campingListSection).getByRole('button', {name:'Submit'});
    userEvent.click(addButton);

    // The number of list items displayed should be the same as the number of items that were originally in the list
    const displayedListItemElements = within(campingListSection).getAllByTestId(/-item-label/);
    const numOfListItemElementsDisplayed = displayedListItemElements.length;
    expect(numOfListItemElementsDisplayed).toBe(campingList.itemNames.length);
  });

  it('adds a new user-inputted item to the "Camping" list, at the bottom of the list, then clears the textbox', () => {
    render(<App />);
    const overnightTripOption = screen.getByRole('radio', { name: 'Overnight trip' });
    userEvent.click(overnightTripOption);
    const campingListSection = screen.getByTestId(campingList.listId);

    // Verify "roller blades" is not a list item
    let anyRollerBlades = within(campingListSection).queryByText("roller blades");
    expect(anyRollerBlades).toBeNull();

    // Select the textbox, and input "roller blades"
    const addItemTextbox = within(campingListSection).getByRole('textbox');
    userEvent.type(addItemTextbox, 'roller blades');

    // The textbox should have the value just typed
    expect(addItemTextbox.value).toBe("roller blades");

    // Click the add button
    const addButton = within(campingListSection).getByRole('button', {name:'Submit'});
    userEvent.click(addButton);

    // "roller blades" should now be in the list
    anyRollerBlades = within(campingListSection).queryByText("roller blades");
    expect(anyRollerBlades).toBeTruthy();

    // "roller blades" should be the last item on the list
    const displayedListItemElements = within(campingListSection).getAllByTestId(/-item-label/);
    const displayedListItems = displayedListItemElements.map(element => getNodeText(element));
    expect(displayedListItems[displayedListItems.length - 1]).toBe("roller blades");

    // The textbox should be empty now
    expect(addItemTextbox.value.length).toBe(0);
  });

  it('adds two new user-inputted items to the "clothing" list', () => {
    render(<App />);
    const dayTripOption = screen.getByRole('radio', { name: 'Day trip' });
    userEvent.click(dayTripOption);
    const clothingListSection = screen.getByTestId(clothingList.listId);

    // Verify "Batman" and "Robin" are not list items
    let anyBatmans = within(clothingListSection).queryByText("Batman");
    expect(anyBatmans).toBeNull();
    let anyRobins = within(clothingListSection).queryByText("Robin");
    expect(anyRobins).toBeNull();

    // Select the textbox, and input "Batman"
    const addItemTextbox = within(clothingListSection).getByRole('textbox');
    userEvent.type(addItemTextbox, 'Batman');

    // Click the add button
    const addButton = within(clothingListSection).getByRole('button', {name:'Submit'});
    userEvent.click(addButton);

    // Input "Robin" and click the add button
    userEvent.type(addItemTextbox, 'Robin');
    userEvent.click(addButton);

    // "Batman" and "Robin" should now be the last two items in the list
    const displayedListItemElements = within(clothingListSection).getAllByTestId(/-item-label/);
    const displayedListItems = displayedListItemElements.map(element => getNodeText(element));
    expect(displayedListItems[displayedListItems.length - 1]).toBe("Robin");
    expect(displayedListItems[displayedListItems.length - 2]).toBe("Batman");
  });
});

describe('compound use of features - add, edit, delete and undo features', () => {

  it('adds two items, edits one of them, deletes the other, then undoes the delete', () => {
    render(<App />);
    const dayTripOption = screen.getByRole('radio', { name: 'Day trip' });
    userEvent.click(dayTripOption);
    const dayFoodListSection = screen.getByTestId(dayFoodList.listId);

    // Verify "pineapple" and "Seahorse" are not list items
    let anyPineapples = within(dayFoodListSection).queryByText("pineapple");
    expect(anyPineapples).toBeNull();
    let anySeahorses = within(dayFoodListSection).queryByText("Seahorse");
    expect(anySeahorses).toBeNull();

    // Select the textbox, and input "pineapple"
    const addItemTextbox = within(dayFoodListSection).getByRole('textbox');
    userEvent.type(addItemTextbox, 'pineapple');

    // Click the add button
    const addButton = within(dayFoodListSection).getByRole('button', {name:'Submit'});
    userEvent.click(addButton);

    // Input "Seahorse" and click the add button
    userEvent.type(addItemTextbox, 'Seahorse');
    userEvent.click(addButton);

    // "pineapple" and "Seahorse" should now be the last two items in the list
    let displayedListItemElements = within(dayFoodListSection).getAllByTestId(/-item-label/);
    let displayedListItems = displayedListItemElements.map(element => getNodeText(element));
    const lastIndex = displayedListItems.length - 1;
    const secondLastIndex = displayedListItems.length - 2;
    expect(displayedListItems[lastIndex]).toBe("Seahorse");
    expect(displayedListItems[secondLastIndex]).toBe("pineapple");

    // Click the edit button of the "Seahorse" list item
    const lastItemEditBtn = screen.getByTestId(`${dayFoodList.listId}-item-${lastIndex}-edit`);
    userEvent.click(lastItemEditBtn);

    // Clear the textbox and type "land horse", and click the 'done' button
    const editItemFormElement = within(dayFoodListSection).getByTestId(`${dayFoodList.listId}-item-${lastIndex}-edit-form`);
    const textbox = within(editItemFormElement).getByRole('textbox');
    userEvent.clear(textbox);
    userEvent.type(textbox, 'land horse');
    const doneButton = within(editItemFormElement).getByRole('button', {name: 'Submit'});
    userEvent.click(doneButton);

    // The last item in the list should now be "land horse"
    displayedListItemElements = within(dayFoodListSection).getAllByTestId(/-item-label/);
    displayedListItems = displayedListItemElements.map(element => getNodeText(element));
    expect(displayedListItems[lastIndex]).toBe('land horse');

    // Delete second last item
    const secondLastItemDeleteBtn = screen.getByTestId(`${dayFoodList.listId}-item-${secondLastIndex}-delete`);
    userEvent.click(secondLastItemDeleteBtn);

    // The item "pinapple" should now be gone
    expect(within(dayFoodListSection).queryByLabelText("pineapple")).toBeNull();

    // Click on the undo button in the "Food (Day Trip)" list
    const undoBtn = within(dayFoodListSection).getByRole('button', { name: 'undo delete' });
    userEvent.click(undoBtn);

    // The second last list item should once again be "pinapple"
    displayedListItemElements = within(dayFoodListSection).getAllByTestId(/-item-label/);
    displayedListItems = displayedListItemElements.map(element => getNodeText(element));
    expect(displayedListItems[secondLastIndex]).toBe("pineapple");
  });

});
