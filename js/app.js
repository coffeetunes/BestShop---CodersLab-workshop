document.addEventListener("DOMContentLoaded", function () {
  const calcSection = document.querySelector(".calc");
  const calcForm = calcSection.querySelector(".calc__form");
  const calcInputs = calcForm.querySelectorAll("input");
  const packageInput = calcForm.querySelector("#package");
  const calcSummary = calcSection.querySelector(".calc__summary");
  const totalPriceElement = calcSummary.querySelector("#total-price");

  let currentSummary = 0;

  //wyświetlenie elementu z podsumowaniem ceny
  totalPriceElement.style.display = 'flex';

  //definiowanie cen pakietów
const packages = {
    basic: 10,
    professional: 20,
    premium: 30
  }

  // definiowanie cen produktów i zamówień
const prices = {
    products: 0.5,
    orders: 1.5,
    accounting: 50,
    terminal: 70
  }

  //obiekt kalkulatora, gdzie będą przypisywane aktualne parametry
const Calculator =  {
  products: null,
  orders: null,
  package: null,
  accounting: false,
  terminal: false
}

function removeClassOpen() {
  packageInput.classList.remove('open');
}

// obliczenie podsumowania
  function updateSummary() {
    currentSummary = 0;
    for (let key in Calculator) {
      const value = Calculator[key];
      if (key === 'package') {
        // dodaje wartość wybranego pakietu lub 0 gdy nie ma takiego elementu, przydaje się na początku
        currentSummary += packages[value] || 0;
        // sprawdza czy wartości są liczbami całkowitymi
      }
      // sprawdza czy wartość jest typu boolean, w mnożeniu true jako 1, a false jako 0
      else if (typeof value === 'boolean') {
        currentSummary += value * prices[key];
      }
      else {
        currentSummary += value * (prices[key] || 0);
      }

    }
    totalPriceElement.querySelector(".total__price").innerText = `$${currentSummary}`;
  }

function getValue() {
    // pobranie odpowiedniego elementu w podsumowaniu
    const summaryItem=document.querySelector(`[data-id=${this.id}]`);

  // pobieranie wartości z inputów
  if(this.type === "checkbox") {
    Calculator[this.id] = this.checked;
    //przypisanie wartości do odpowiedniego elementu w liście
    summaryItem.querySelector(".item__price").innerText = `$${prices[this.id]}`;
    if(this.checked) {
      // wyświetlenie elementu w podsumowaniu, gdy checkbox zaznaczony
      summaryItem.style.display = 'flex';
    }
    else {
      // schowanie elementu w podsumowaniu, gdy checkbox odznaczony
      summaryItem.style.display = 'none';
    }
    //sprawdzanie, czy wartość jest liczbą całkowitą
  } else if (Number.isInteger(Number(this.value))) {
    Calculator[this.id] = this.value;
    //przypisanie wartości do podsumowania
    summaryItem.querySelector(".item__calc").innerText = `${this.value} * $${prices[this.id]}`;
    summaryItem.querySelector(".item__price").innerText = `$${this.value * prices[this.id]}`;
    if (this.value > 0) {

      summaryItem.style.display = 'flex';
    }
    else {
      summaryItem.style.display = 'none';
    }

  }
  // wywołanie przeliczenia podsumowania
  updateSummary();
}

// pobieranie wartości z informacją o pakiecie
function choosePackage(event) {
  // dodane, żeby kliknięcie nie wywołało funkcji chowania listy pakietów
event.stopPropagation();
  const summaryItem=document.querySelector(`[data-id=${this.id}]`);
   this.classList.toggle('open');

   Array.from(Array.from(this.children)[1].children).forEach(function(element) {
     element.addEventListener('click', function() {

       // przypisanie wartości atrybutu data-value
       element.parentElement.parentElement.dataset.value = element.dataset.value;
       // przypisanie odpowiedniej wartości do obiektu kalkulatora
       Calculator[element.parentElement.parentElement.id] = element.dataset.value;
       // ustawienie widocznego tekstu w divie w sekcji formularza
       element.parentElement.previousElementSibling.innerText = element.innerText;
       //wyświetlenie odpowiedniego elementu w podsumowaniu
       summaryItem.style.display = 'flex';
       //przypisanie wartości do podsumowania
       summaryItem.querySelector(".item__calc").innerText = element.innerText;
       //pobranie wartości zdefiniowanej w obiekcie packages odpowiadającej wybranemu pakietowi
       summaryItem.querySelector(".item__price").innerText = `$${packages[element.dataset.value]}`;

     })

     element.addEventListener('click', function(event) {
       // żeby nie było wywoływane wielokrotnie przeliczenie
       event.stopImmediatePropagation();
     // wywołanie przeliczenia podsumowania
     updateSummary();
     removeClassOpen();
     })
   })

}

//inicjalne wywołanie kalkulatora
updateSummary();



//wywołanie nasłuchiwań
calcInputs.forEach(function(element) {
  element.addEventListener('input', getValue);
})

packageInput.addEventListener('click',choosePackage);

// kliknięcie gdziekolwiek, żeby zamknąć listę z pakietami
document.addEventListener('click', removeClassOpen);


})