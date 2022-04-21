"use strict";
class Test {
  constructor() {
    // Added button container so we can clear it from the screen to make way for the weather panel.
    // Also I had to switch out getElementsByClassName with querySelector because the former didn't render the
    // new HTML after adding the template literal to { innerHTML }. I genuinely have no idea why this is the case because,
    // to be frank, I'm really not that experienced with manipulating the DOM without frameworks. 
    this.testdata = document.querySelector(".testData");
    this.initButton = document.querySelector(".buttonContainer");
  }

  async run() {
    console.log(new Date().toISOString(), "[Test]", "Running the test");
    try {
      this.initButton.remove();
      const response = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather?lat=36.0331&lon=-86.7828&units=imperial&appid=25e989bd41e3e24ce13173d8126e0fd6"
      );
      this.setdata(response.data);
    } catch (e) {
      this.setError(e);
    }
  }

  setError(message) {
    console.log(message);
    this.testdata.innerHTML = `
      <div class="error">
        <p>An error occurred. Please fix the issue displayed below and refresh the page:</p>
        <p>${message}</p>
      </div>`;
  }

  setdata(data) {
    // Make all the calculations necessary and save them to variables so we can use them in the template literal
    // There's probably a more programmatic way to do this, especially in regards to dynamically creating the rows, but I ran out of time :/

    // Options for time formatting after we've converted the Unix time handed to us by openweather API
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const temp = Math.round(data.main.temp);
    const tempFeel = Math.round(data.main.feels_like);
    const description = data.weather[0].description
      .split(" ")
      .map(s => {
        return s.charAt(0).toUpperCase() + s.substring(1);
      })
      .join(" ");
    const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    const humidity = `${data.main.humidity}%`;
    const pressure = `${Math.round(data.main.pressure * 0.03)} in`;
    const visibility = `${Math.round(data.visibility * 0.0006)} mi`;
    const time = `${new Date(data.dt * 1000).toLocaleString(
      "en-US",
      options
    )}`;
    const dawnDusk = `${new Date(
      data.sys.sunrise * 1000
    ).toLocaleString("en-US", options)}/${new Date(
      data.sys.sunset * 1000
    ).toLocaleString("en-US", options)}`;
    const wind = `${Math.round(data.wind.speed)} MPH`;
    this.testdata.innerHTML = 
    `<div class="weatherCard">
      <div class="topPanel">
        <h1>${data.name}, TN</h1>
        <h2>${time}</h2>
      </div>
      <div class="bottomPanel">
        <div class="bottomLeft">
          <div class="imgPanel">
            <img src=${icon} />
            <p>${description}</p>
          </div>
          <div class="temperaturePanel">
            <h3>${temp}°F</h3>
          </div>
        </div>
        <div class="bottomRight">
          <div class="row">
            <div class="label">
              <img src="./img/thermometer.svg" />
              <p>Feels Like</p>
            </div>
            <p>${tempFeel}°F</p>
          </div>
          <div class="row">
            <div class="label">
              <img src="./img/wind.svg" />
              <p>Wind</p>
            </div>
            <p>${wind}</p>
          </div>
          <div class="row">
            <div class="label">
              <img src="./img/compress-vertical.svg" />
              <p>Pressure</p>
            </div>
            <p>${pressure}</p>
          </div>
          <div class="row">
            <div class="label">
              <img src="./img/drop-humidity.svg" />
              <p>Humidity</p>
            </div>
            <p>${humidity}</p>
          </div>
          <div class="row">
            <div class="label">
              <img src="./img/eye.svg" />
              <p>Visibility</p>
            </div>
            <p>${visibility}</p>
          </div>
          <div class="row">
            <div class="label">
              <img src="./img/sunrise.svg" />
              <p>Dawn/Dusk</p>
            </div>
            <p>${dawnDusk}</p>
          </div>
        </div>
      </div>
    </div>`;
  }
}

 /**
       * Creates a button for kicking off the test and adds it to the DOM.
       *
       * @param {HTMLElement} context  the parent element to add the button to
       * @param {Test}        test     the test to be executed
       * @returns {HTMLElement} the button added to the test
       */
  function addButtonForTest(context, test) {
    let testButton = document.createElement("button");

    testButton.type = "button";
    testButton.innerText = "Get the Nashville Weather";
    testButton.onclick = () => test.run();

    context.appendChild(testButton);

    return testButton;
  }

  // Create the Test and add a button to the UI for running the test
  const test = new Test();
  const buttonContainer =
    document.getElementsByClassName("buttonContainer")[0];

  addButtonForTest(buttonContainer, test);