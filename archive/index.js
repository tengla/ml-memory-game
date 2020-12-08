
const url = "https://teachablemachine.withgoogle.com/models/Rza-yJgJW/";
let model, webcam, labelContainer,
  headerElement, resolvedContainer;
let iterations = 0;
let last, cur;

document.addEventListener('prediction', e => {
  const current = e.detail.current;
  if (!Game.currentHand) {
    Game.currentHand = Game.randomHand();
    headerElement.innerHTML = `What beats ${Game.currentHand}?`;
  }
  const isWin = Game.shake(current.className, Game.currentHand);
  console.log('isWin!', isWin, current.className, Game.currentHand);
  if (isWin) {
    Game.resolve(Game.currentHand);
    Game.currentHand = Game.randomHand();
    headerElement.innerHTML = `What beats ${Game.currentHand}?`;
    resolvedContainer.innerHTML = `${Game.resolved.length}`;
  } else {
    if (Game.resolved > 0) {
      resolvedContainer.innerHTML = `
    <div>
      <h3>Failed!</h3>
      <div>${Game.resolved.length} in ${Game.timeUsed()}</div>
    </div>
    `;
    }
    console.log('Fail!');
    Game.currentHand = null;
    Game.resolved = [];
  }
  // labelContainer.innerHTML = `${current.className} : ${current.probability.toFixed(2)} [${iterations}]`;
});

// Load the image model and setup the webcam
async function init() {

  headerElement = document.getElementById("h");
  labelContainer = document.getElementById("lc");
  resolvedContainer = document.getElementById("c");

  const modelURL = url + "model.json";
  const metadataURL = url + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  headerElement.innerHTML = 'Setting up camera';
  // Convenience function to setup a webcam
  const flip = true; // whether to flip the webcam
  webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();

  headerElement.innerHTML = 'Can u beat me?';
  window.requestAnimationFrame(loop);
  // append elements to the DOM
  document.getElementById("wc").appendChild(webcam.canvas);
};

async function loop() {
  if (iterations % 10 === 0) {
    webcam.update(); // update the webcam frame
    await predict();
  }
  window.requestAnimationFrame(loop);
  iterations = iterations < 1000 ? iterations + 1 : 0;
};

const eq = (a, b) => {
  return (a && b) && (a.className === b.className);
};

const getP = (prediction) => {
  const p = prediction.reduce((prev, cur) => {
    if (cur.probability > prev.probability) {
      return cur;
    }
    return prev;
  }, { className: '', probability: 0 });
  return p;
};

const nextMove = () => {
  if (Game.shake(cur.className, currentHand)) {
    console.log('beat me', cur.className, currentHand);
    resolved.push(cur.className);
    currentHand = null;
  }
};

// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcam.canvas);
  const cur = getP(prediction);
  if (cur.probability < 0.80 || eq(cur, last)) {
    return;
  }
  document.dispatchEvent(new CustomEvent('prediction', {
    detail: { current: cur }
  }));
  last = cur;
}

init();
