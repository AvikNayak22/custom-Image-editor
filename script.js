const fileInput = document.querySelector(".file-input");
const filterOptions = document.querySelectorAll(".filter button");
const filterName = document.querySelector(".filter-info .name");
const filterValue = document.querySelector(".filter-info .value");
const filterSlider = document.querySelector(".slider input");
const rotateOptions = document.querySelectorAll(".rotate button");
const previewImg = document.querySelector(".preview-img img");
const resetFilterBtn = document.querySelector(".reset-filter");
const chooseImgBtn = document.querySelector(".choose-img");
const saveImgBtn = document.querySelector(".save-img");

let brightness = 100,
  saturation = 100,
  inversion = 0,
  greyscale = 0;

let rotate = 0,
  flipHorizontal = 1,
  flipVertical = 1;

const applyFilters = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal} , ${flipVertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${greyscale}%)`;
};

const loadImage = () => {
  let file = fileInput.files[0]; //getting user selected file
  if (!file) return; //return if user hasn't selected file
  previewImg.src = URL.createObjectURL(file); //passing file url as preview img src
  previewImg.addEventListener("load", () => {
    resetFilterBtn.click(); //clicking reset btn,so the filter value reset if the user select new image
    document.querySelector(".container").classList.remove("disable");
  });
};

filterOptions.forEach((option) => {
  //adding click event listener to all the buttons
  option.addEventListener("click", () => {
    document.querySelector(".filter .active").classList.remove("active");
    option.classList.add("active");
    filterName.innerText = option.innerText;

    if (option.id === "brightness") {
      filterSlider.max = "200";
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (option.id === "saturation") {
      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`;
    } else if (option.id === "inversion") {
      filterSlider.max = "100";
      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;
    } else {
      filterSlider.max = "100";
      filterSlider.value = greyscale;
      filterValue.innerText = `${greyscale}%`;
    }
  });
});

const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`;
  const selectedFilter = document.querySelector(".filter .active"); //getting selected filter btn

  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  } else {
    greyscale = filterSlider.value;
  }
  applyFilters();
};

rotateOptions.forEach((option) => {
  //adding click event listeners to all rotate/flip buttons
  option.addEventListener("click", () => {
    if (option.id === "left") {
      rotate -= 90; //if clicked btn is a left rotate,decrement rotate value by -90
    } else if (option.id === "right") {
      rotate += 90; //if clicked btn is a right rotate,decrement rotate value by +90
    } else if (option.id === "horizontal") {
      //if flip horizontal value is 1 set this value to -1 else set 1
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
      //if flip vertcal value is 1 set this to -1 else set 1
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilters();
  });
});

const resetFilter = () => {
  //resetting all variable values to its default values
  brightness = 100;
  saturation = 100;
  inversion = 0;
  greyscale = 0;
  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;
  filterOptions[0].click(); //click brightness btn , so the brightness selected by default
  applyFilters();
};

const saveImage = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d"); //canvas.getContext return a drawing context on the canvas
  canvas.width = previewImg.naturalWidth; //setting canvas width to actual image width
  canvas.height = previewImg.naturalHeight; //setting canvas height to actual image height

  //applying user selected filter to canvas filter
  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${greyscale}%)`;
  ctx.translate(canvas.width / 2, canvas.height / 2); //translating canvas from center
  if (rotate !== 0) {
    //if rotate value isn't 0,rotate the canvas
    ctx.rotate((rotate * Math.PI) / 180);
  }
  ctx.scale(flipHorizontal, flipVertical); //flip canvas, horizontally/vertically
  ctx.drawImage(
    previewImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );

  const link = document.createElement("a"); //create <a> element
  link.download = "image.jpg"; //passing <a> tag download value to "image.jpg"
  link.href = canvas.toDataURL(); //passing <a> tag href value to canvas data url
  link.click(); //click <a> tag so the image download
};

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
chooseImgBtn.addEventListener("click", () => {
  fileInput.click();
});
