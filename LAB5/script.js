// fetch
fetch('products.json')
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP Problem: ${response.status}`);
    }
    return response.json();
})
.then(json => initialize(json))
.catch(err => console.error(`Fetch Problem: ${err.message}`));

function initialize(products) {
    const category = document.querySelector('#category');
    const searchTerm = document.querySelector('#searchTerm');
    const searchBtn = document.querySelector('#searchBtn');
    const productArea = document.querySelector('#items');

    let categoryList;
    let finalList;
    let loadCounter = 0;

    finalList = products;
    updateDisplay();

    window.onscroll = () => {
        if (window.innerHeight + window.scrollY > document.body.offsetHeight) {
            console.log(loadCounter);
            updateDisplay();
        }
    }

    searchBtn.addEventListener('click', selectCategory);

    function selectCategory(e) {
        e.preventDefault();
        categoryList = [];
        finalList = [];
        loadCounter = 0;

        while (productArea.firstChild) {
            productArea.removeChild(productArea.firstChild);
        }

        if (category.value === 'All') {
            categoryList = products;
            selectProducts();
        } else {
            categoryList = products.filter(product => product.category === category.value);
            selectProducts();
        }

        const productHeading = document.querySelector('#productHeading');
        productHeading.innerHTML = `Products > ${category.value} > '${searchTerm.value}'`;
    }

    function selectProducts() {
        if (searchTerm.value.trim() === '') {
            finalList = categoryList;
        } else {
            const lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
            finalList = categoryList.filter(product => product.name.toLowerCase().includes(lowerCaseSearchTerm));
        }

        updateDisplay();
    }

    function updateDisplay() {


        if (finalList.length === 0) {
            const paragraph = document.createElement('p');
            paragraph.textContent = 'No Results';
            productArea.append(paragraph);
        } else {
            console.log(finalList, loadCounter);
            for (let i = 0; i < 3; i++) {
                if (finalList[loadCounter + i]) fetchBlob(finalList[loadCounter + i]);
            }
            loadCounter += 3;
        }
    }

    function fetchBlob(product) {
        const url = `images/${product.image}`;
        fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Problem: ${response.status}`);
            }
            return response.blob();
        })
        .then(blob => showProduct(blob, product))
        .catch(err => console.error(`Fetch Problem: ${err.message}`));
    }

    function showProduct(blob, product) {
        const objectURL = URL.createObjectURL(blob);
        const imgbox = document.createElement('div');
        const name = document.createElement('h3');
        const description = document.createElement('p');
        const price = document.createElement('p');
        const image = document.createElement('img');

        imgbox.setAttribute('class', `imgbox ${product.category}`);
        name.setAttribute('class', 'name');
        description.setAttribute('class', 'description');
        price.setAttribute('class', 'price');

        name.textContent = product.name;
        description.textContent = product.description;
        price.textContent = `KRW ${product.price}`;

        image.src = objectURL;
        image.alt = product.name;

        productArea.appendChild(imgbox);
        imgbox.append(image);
        imgbox.append(name);
        imgbox.append(description);
        imgbox.append(price);

        imgbox.addEventListener('click', e => {
            price.style.visibility = 'visible';
            description.style.visibility = 'visible';
        })
    }
}