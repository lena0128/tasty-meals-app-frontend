
class Meal{

    static all = []
    static mealList = document.getElementById("meal-list")

    // similar to initialize method in Ruby
    // invoke new method to trigger constructor to run in the console
    constructor({id, name, thumb, ingredients, instruction, categoryId}) {
       // setting the properties of each meal
       this.id = id
       this.name = name
       this.thumb = thumb
       this.ingredients = ingredients
       this.instruction = instruction
       this.categoryId = categoryId

       
       // setup the HTML element that will contain the meal
       this.element = document.createElement("div")  // mealDiv
       this.element.dataset["id"] = id
       this.element.id = `meal-div-${id}`

       this.element.addEventListener("click", this.handleMealDivClick)

       // remembering all the meal objects
       // this respresents the current meal object
       Meal.all.push(this)  
    }


    // filter by category functionality
    // display only the meals in the active category
    // display all if no categories are active
    static filterByCategory(filteredCategory) {
        if(filteredCategory) {
            for(const meal of Meal.all) {
                if(meal.categoryId === parseInt(filteredCategory.id)) {
                    // unhide element
                    meal.element.style.display = "";
                } else {
                    // hide element 
                    meal.element.style.display = "none"
                }
            }
        } else {
            for (const meal of Meal.all) {
                meal.element.style.display = ""
            }
        }
    }

    // this is an arrow function b/c it is used as a callback in an event listener 
    handleMealDivClick = (e) => {
        // console.log(this) => the frontend meal object 
        // debugger
        if(e.target.innerText === "Edit") {
           // change the button to display "save"
            e.target.innerText = "Save"
            // replace the div with different input tags
            this.createEditFields(e.target)
        } else if (e.target.innerText === "Delete") {
            this.deleteMeal(e)
        } else if (e.target.innerText === "Save") {
            e.target.innerText = "Edit"
            // also save this update info to the DB
            // turn all input fields back into the previous
            this.saveUpdatedMeal(e.target)
        }
     }


    render() {
       this.element.innerHTML = `
         <div data-id="${this['id']}" class="meal-div text-left rounded">
           <img src="${this['thumb']}" alt="${this["name"]}" class="thumb rounded float-right">
           <h4 class="name">${this["name"]}</h4>
           <b>Ingredients:</b><p class="ingredients"> ${this["ingredients"]}</p>
           <b>Instruction:</b><p class="instruction"> ${this["instruction"]}</p>
           <button data-id="${this['id']}" class="edit btn-sm btn-info">Edit</button>
           <button data-id="${this['id']}" class="delete btn-sm btn-info">Delete</button>
         </div>
         <br>
      `
        return this.element
    }


    // single responsibility which will take the RENDERED this.element in and attach it to the DOM
    attachToDom() {
        this.render()
        Meal.mealList.append(this.element)
        // Meal.mealList.append(this.render())
    }


    createEditFields = (editBtn) => {
        const mealDiv = editBtn.parentElement
        // let newUrl = mealDiv.children[0]
        let newName = mealDiv.children[1]
        let newIngredients = mealDiv.children[3]
        let newInstruction = mealDiv.children[5]
        
            newName.innerHTML = `Name:
              <input type="text" class="edit-name" value="${newName.innerText}"> 
            `
            newIngredients.innerHTML =  `
              <input type="text" class="edit-ingredients" value="${newIngredients.innerText}"> 
            `
            newInstruction.innerHTML =  `
               <input type="text" class="edit-instruction" value="${newInstruction.innerText}"> 
            `
        }


        saveUpdatedMeal = () => {
            console.log(this)
            // const div = saveBtn.parentElement
            // const id = div.dataset.id
            this.name = this.element.querySelector(".edit-name").value
            this.ingredients = this.element.querySelector(".edit-ingredients").value
            this.instruction = this.element.querySelector(".edit-instruction").value
        
            mealApi.sendPatch(this)
        }


        deleteMeal = (e) => {
            this.element.remove()  // optimistic rendering - remove it before the fetch request
            mealApi.deleteMeal(this.id)  
        }     
        
        

    }

