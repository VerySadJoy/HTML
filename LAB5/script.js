// infinite scroll
window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        document.querySelector('body').style.background = 'blue';
    } else {
        document.querySelector('body').style.background = 'white';
    }
}

//fetch
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

    finalList = products;
    updateDisplay();

    categoryList = [];
    finalList = [];

    searchBtn.addEventListener('click', selectCategory);

    function selectCategory(e) {
        e.preventDefault();
        categoryList = [];
        finalList = [];

        if (category.value === 'All') {
            categoryList = products;
            selectProducts();
        } else {
            categoryList = products.filter(product => product.type === category.value);
            selectProducts();
        }
    }

    function selectProducts() {
        if (searchTerm.value.trim() === '') {
            finalList = categoryList;
        } else {
            const lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
            finalList = categoryList.filter(product => product.name.includes(lowerCaseSearchTerm));
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
            for (const product of finalList) {
                fetchBlob(product);
            }
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

        imgbox.setAttribute('class', 'imgbox');
        imgbox.setAttribute('class', product.type);
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