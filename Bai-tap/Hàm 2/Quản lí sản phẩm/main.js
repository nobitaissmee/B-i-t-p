let products = ["Sony Xperia"];

// Add product to table
function showProduct() {
  let tbProducts = document.getElementById("tbody");
  tbProducts.innerHTML = "";
  for (let item of products) {
    tbProducts.innerHTML += `
    <tr>
    <td>${item}</td>
    <td>
      <a href="javascript:;" class="btn btn-edit" onclick='Edit("${item}")'>Edit</a>
      <a href="javascrip:;" class="btn btn-remove" onclick='Remove("${item}")'>Remove</a>
    </td>
  </tr>`;
  }
}

// Return product from input to table
function addProduct() {
  // s1:check product null or empty
  // s2:product name is not existed
  // s3: clear unnesesary white space
  // s4: format productname
  let productname = document.getElementById("add").value;
  if (isNullOrEmpty(productname)) {
    alert("Product is required");
    return;
  }
  productname = doClearAndFomat(productname);
  if (!isProductExisted(productname)) {
    products.push(productname);
    document.getElementById("add").value = "";
    showProduct();
  } else {
    alert(`Product name is ${productname} is existed`);
  }
}

// check product null or empty
function isNullOrEmpty(str) {
  return str === null || str.trim() == "";
}

// check product name is not existed
function isProductExisted(productname) {
  return products.indexOf(productname) !== -1;
}

// clear whitespace and format

function doClearAndFomat(str) {
  str = str.trim();
  str = str.toLowerCase();
  let chars = str.split("");
  chars[0] = chars[0].toUpperCase();
  for (let i = 0; i < chars.length - 1; i++) {
    while (chars[i] == " " && chars[i + 1] == " ") {
      chars.splice(i, 1);
    }
    while (chars[i] == " " && chars[i + 1] !== " ") {
      chars[i + 1] = chars[i + 1].toUpperCase();
    }
  }
  return chars.join("");
}

function Edit(name) {
  let newname = prompt("Enter new name:");
  if (isNullOrEmpty(newname)) {
    alert("Newname is required");
    return;
  }
  newname = doClearAndFomat(newname);
  if (newname == name) return;
  if (!isProductExisted(newname)) {
    let index = products.indexOf(name);
    products[index] = newname;
    showProduct();
    alert("Changed");
  } else {
    alert(`${newname} is existed`);
  }
}

function Remove(name) {
  let answer = window.confirm(`Are you sure remove ${name}?`);
  if (answer) {
    let index = products.indexOf(name);
    products.splice(index, 1);
    showProduct();
  }
}

function documentReady() {
  showProduct();
}

documentReady();
