document.getElementById("gamescreen").width = window.innerWidth;
document.getElementById("gamescreen").height = window.innerHeight;
const ctx = document.getElementById("gamescreen").getContext("2d");
ctx.font = "68px PixeloidSans";
ctx.fillStyle = "limegreen";
let started = false;
let algae = [];
let energy = 1;
let temperature = 0;
let chlorophyll = 2;
let nutrients = 0;
const image = new Image();
image.src = "Algae.png";
const sun = new Image();
sun.src = "Sun.png"
let seconds_to_duplicate = 5;
let seconds_to_produce = 10;
let shopping = false;
let bgm = new Audio("frozen-sea-184613.mp3");
bgm.loop = true;
class Algae {
  x = getRandomInt(0, document.getElementById("gamescreen").width - 30);
  y = getRandomInt(0, document.getElementById("gamescreen").height - 130);
}
class bubble {
  x = getRandomInt(0, document.getElementById("gamescreen").width);
  y = document.getElementById("gamescreen").height;
}
let sunButton = {
  x: getRandomInt(0, document.getElementById("gamescreen").width - 80),
  y: getRandomInt(0, document.getElementById("gamescreen").height - 180),
  drawing: false,
  onClick: function() {
    energy += Math.pow(algae.length, 2);
    this.drawing = false;
    return;
  },
  inBounds: function(mouseX, mouseY) {
    return !(mouseX < this.x || mouseX > this.x + this.w || mouseY < this.y || mouseY > this.y + this.h);
  }
}
algae.push(new Algae());
let algaeInterval = setInterval(() => {
  if (algae.length < 300) {
    for (let i = 0; i <= chlorophyll; i++) {
      if (algae.length < 300) {
        algae.push(new Algae());
      }
      else {
        break;
      }
    }
  }
}, seconds_to_duplicate * 1000);
let energyInterval = setInterval(() => {
  for (let i = 0; i < algae.length - 1; i++) {
    energy++;
  }
}, seconds_to_produce * 1000);

let sunInterval = setInterval(() => {
  sunButton.drawing = true;
  sunButton.x = getRandomInt(0, document.getElementById("gamescreen").width - 80);
  sunButton.y = getRandomInt(0, document.getElementById("gamescreen").height - 180);
  setTimeout(function() {
    if (sunButton.drawing) {
      sunButton.drawing = false;
    }
  }, Math.random() * 4000);
}, Math.random() * 7000);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let buttons = [
  {
    x: 25,
    y: 25,
    w: 450,
    h: 50,
    price: 50,
    onClick: function() {
      let upgraded = false;
      if (energy >= this.price) {
        if (!upgraded) {
          chlorophyll *= 4;
          energy -= this.price;
          this.price *= 3;
          upgraded = true;
        }
      }
    },
    inBounds: function(mouseX, mouseY) {
      return !(mouseX < this.x || mouseX > this.x + this.w || mouseY < this.y || mouseY > this.y + this.h);
    }
  },
  {
    x: 25,
    y: 225,
    w: 500,
    h: 50,
    price: 50,
    onClick: function() {
      let upgraded = false;
      if (energy >= this.price) {
        if (seconds_to_produce >= 1 && !upgraded) {
          seconds_to_produce--;
          energy -= this.price;
          this.price *= 3;
          upgraded = true;
          clearInterval(energyInterval);
          energyInterval = setInterval(() => {
            for (let i = 0; i < algae.length - 1; i++) {
              energy++;
            }
          }, seconds_to_produce * 1000);
        }
      }
    },
    inBounds: function(mouseX, mouseY) {
      return !(mouseX < this.x || mouseX > this.x + this.w || mouseY < this.y || mouseY > this.y + this.h);
    }
  },
  {
    x: 25,
    y: 425,
    w: 400,
    h: 50,
    price: 30,
    onClick: function() {
      let upgraded = false;
      if (energy >= this.price && algae.length < 300) {
        if (seconds_to_duplicate >= 1 && !upgraded) {
          seconds_to_duplicate--;
          energy -= this.price;
          this.price *= 3;
          upgraded = true;
          clearInterval(algaeInterval);
          algaeInterval = setInterval(() => {
            if (algae.length < 300) {
              for (let i = 0; i <= chlorophyll; i++) {
                if (algae.length < 300) {
                  algae.push(new Algae());
                }
                else {
                  break;
                }
              }
            }
          }, seconds_to_duplicate * 1000);
        }
      }
    },
    inBounds: function(mouseX, mouseY) {
      return !(mouseX < this.x || mouseX > this.x + this.w || mouseY < this.y || mouseY > this.y + this.h);
    }
  }
];

document.addEventListener("keydown", function(event) {
  if (event.key == "s" && !shopping) {
    event.preventDefault();
    shopping = true;
  }
  if (event.key == "r" && shopping) {
    event.preventDefault();
    shopping = false;
  }
});

document.getElementById("gamescreen").addEventListener("click", function(event) {
  if (started) {
    let x = event.pageX - (document.getElementById("gamescreen").clientLeft + document.getElementById("gamescreen").offsetLeft);
    let y = event.pageY - (document.getElementById("gamescreen").clientTop + document.getElementById("gamescreen").offsetTop);
    if (shopping) {
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].inBounds(x, y)) buttons[i].onClick();
      }
    }
    else {
      if (sunButton.inBounds(x, y) && sunButton.drawing) sunButton.onClick();
    }
  }
  else {
    started = true;
    bgm.play();
  }
});

function gameLoop() {
  ctx.clearRect(0, 0, document.getElementById("gamescreen").width, document.getElementById("gamescreen").height);
  console.log(sunInterval);
  if (started) {
    if (!shopping) {
      ctx.font = "68px PixeloidSans";
      algae.forEach(function(al) {
        ctx.drawImage(image, 0, 0, 320, 320, al.x, al.y, 30, 30);
      });
      ctx.drawImage(image, 0, 0, 320, 320, 50, document.getElementById("gamescreen").height - 100, 68, 68);
      ctx.drawImage(sun, 0, 0, 320, 320, document.getElementById("gamescreen").width * .75 - 100, document.getElementById("gamescreen").height - 110, 80, 80);
      ctx.fillText(`${algae.length}`, 150, document.getElementById("gamescreen").height - 50);
      ctx.fillText("S-Shop", document.getElementById("gamescreen").width / 2 - 250, document.getElementById("gamescreen").height - 50);
      if (energy < 100000)
        ctx.fillText(`${energy}`, document.getElementById("gamescreen").width * .75, document.getElementById("gamescreen").height - 50);
      else
        ctx.fillText("100,000+", document.getElementById("gamescreen").width * .75, document.getElementById("gamescreen").height - 50);
      if (sunButton.drawing) {
        ctx.drawImage(sun, 0, 0, 320, 320, sunButton.x, sunButton.y, 80, 80);
      }
    }
    else {
      ctx.font = "68px PixeloidSans";
      if (energy < buttons[0].price) {
        ctx.fillText("+Chlorophyll <- Not enough", 25, 75);
      }
      else {
        ctx.fillText("+Chlorophyll <- Select 'Chlorophyll'", 25, 75);
      }
      if (energy < buttons[1].price) {
        ctx.fillText("+Temperature <- Not enough", 25, 275);
      }
      else {
        if (seconds_to_produce <= 1) {
          ctx.fillText("Max speed reached", 25, 275);
        }
        else {
          ctx.fillText("+Temperature <- Select 'Temp'", 25, 275);
        }
      }
      if (energy < buttons[2].price) {
        ctx.fillText("+Nutrients <- Not enough", 25, 475);
      }
      else {
        if (algae.length == 300) {
          ctx.fillText("+Nutrients <- Limit reached", 25, 475);
        }
        else if (seconds_to_duplicate === 1) {
          ctx.fillText("Max speed reached", 25, 275);
        }
        else {
          ctx.fillText("+Nutrients <- Select 'Nutrients'", 25, 475);
        }
      }
      ctx.fillText("R-Return", document.getElementById("gamescreen").width / 2 - 200, document.getElementById("gamescreen").height - 50);
      ctx.drawImage(sun, 0, 0, 320, 320, document.getElementById("gamescreen").width * .75 - 100, document.getElementById("gamescreen").height - 110, 80, 80);
      if (energy < 100000)
        ctx.fillText(`${energy}`, document.getElementById("gamescreen").width * .75, document.getElementById("gamescreen").height - 50);
      else
        ctx.fillText("100,000+", document.getElementById("gamescreen").width * .75, document.getElementById("gamescreen").height - 50);
      ctx.font = "20px PixeloidSans";
      ctx.fillText("Increases energy production and the number of algae. Price: " + buttons[0].price, 25, 150);
      if (seconds_to_produce > 1)
        ctx.fillText("Increases the rate at which energy production happens. Price: " + buttons[1].price, 25, 350);
      if (seconds_to_duplicate > 1) {
        ctx.fillText("Increases the rate at which reproduction happens, provided that there are 300 or less algae.", 25, 550);
        ctx.fillText("Price: " + buttons[2].price, 25, 600);
      }
    }
  }
  else {
    ctx.font = "68px PixeloidSans";
    ctx.fillText("Cultivation", document.getElementById("gamescreen").width / 2 - 200, document.getElementById("gamescreen").height / 4);
    ctx.font = "20px PixeloidSans";
    ctx.fillText("Press the screen to play", document.getElementById("gamescreen").width / 2 - 150, document.getElementById("gamescreen").height / 2);
  }
  requestAnimationFrame(gameLoop);
}
gameLoop();
