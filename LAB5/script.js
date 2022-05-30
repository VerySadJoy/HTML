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
    let row_counter

    finalList = products;
    updateDisplay();

    categoryList = [];
    finalList = [];

    searchBtn.addEventListener('click', selectCategory);

    window.onscroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            updateDisplay();
        }
    }

    function selectCategory(e) {
        e.preventDefault();
        categoryList = [];
        finalList = [];
        row_counter = 1;

        if (category.value === 'All') {
            categoryList = products;
            selectProducts();
        } else {
            categoryList = products.filter(product => product.category === category.value);
            selectProducts();
        }
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
        while (productArea.firstChild) {
            productArea.removeChild(productArea.firstChild);
        }

        if (finalList.length === 0) {
            const paragraph = document.createElement('p');
            paragraph.textContent = 'No Results';
            productArea.append(paragraph);
        } else {
            // for (const product of finalList) {
            //     fetchBlob(product);
            // }
            for (let col_counter = 0; col_counter < 3; col_counter++) {
                fetchBlob(finalList[row_counter * col_counter]);
            }
            row_counter++;
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
    }
}