const numberOfBars = 64;
window.addEventListener("load", function () {
  const container = document.getElementById("container");
  const canvas = document.getElementById("canvas");
  const canvas2 = document.getElementById("canvas2");

  canvas.width = 500;
  canvas.height = 500;
  const ctx = canvas.getContext("2d");
  let audioSource;
  let analyzer;

  canvas2.width = 500;
  canvas2.height = 500;
  const ctx2 = canvas2.getContext("2d");

  container.addEventListener("click", () => {
    const audio = document.getElementById("audio");

    audio.src = "";

    audio.play();
    const audioCtx = new AudioContext();

    if (!audioSource) {
      audioSource = audioCtx.createMediaElementSource(audio);
      analyzer = audioCtx.createAnalyser();
      audioSource.connect(analyzer);
      analyzer.connect(audioCtx.destination);
    }

    analyzer.fftSize = numberOfBars;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = canvas.width / bufferLength;
    let barHeight;
    let x;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx2.clearRect(0, 0, canvas.width, canvas.height);
      x = 0;
      analyzer.getByteFrequencyData(dataArray);
      drawCircularVisualizer(
        bufferLength,
        x,
        barWidth,
        barHeight,
        dataArray,
        ctx2
      );
      drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray, ctx);

      requestAnimationFrame(animate);
    }
    animate();
  });
});

const musicFile = document.getElementById("musicFile");

musicFile.addEventListener("change", function () {
  const audio = document.getElementById("audio");

  const files = this.files;
  console.log(this.files, "files");

  audio.src = URL.createObjectURL(files[0]);
  audio.load();
  audio.play();
  const audioCtx = new AudioContext();

  if (!audioSource) {
    audioSource = audioCtx.createMediaElementSource(audio);
    analyzer = audioCtx.createAnalyser();
    audioSource.connect(analyzer);
    analyzer.connect(audioCtx.destination);
  }

  analyzer.fftSize = numberOfBars;

  const bufferLength = analyzer.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const barWidth = canvas.width / bufferLength;
  let barHeight;
  let x;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx2.clearRect(0, 0, canvas.width, canvas.height);
    x = 0;
    analyzer.getByteFrequencyData(dataArray);
    drawCircularVisualizer(
      bufferLength,
      x,
      barWidth,
      barHeight,
      dataArray,
      ctx2
    );
    drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray, ctx);
    requestAnimationFrame(animate);
  }
  animate();
});

function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray, ctx) {
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i];

    const gradient =
      (barHeight - Math.min(...dataArray)) /
      (Math.max(...dataArray) - Math.min(...dataArray));

    const r = Math.floor(255 * gradient);
    const g = Math.floor(255 * (1 - Math.abs(0.5 - gradient) * 2));
    const b = Math.floor(255 * (1 - gradient));

    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}

function drawCircularVisualizer(
  bufferLength,
  x,
  barWidth,
  barHeight,
  dataArray,
  ctx
) {
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * 1.5;
    ctx.save();
    let x = Math.sin((i * Math.PI) / 180);
    let y = Math.cos((i * Math.PI) / 180);

    ctx.translate(canvas.width / 2 + x, canvas.height / 2);
    ctx.rotate(i + (Math.PI * 2) / bufferLength);

    const hue = i * 0.6 + 200;
    ctx.strokeStyle = "hsl(" + hue + ",100%, 50%)";

    const barWidth = Math.random() * 10 + 1;
    const r = barHeight * Math.random(0.5, 2);
    const g = barHeight * Math.random(0.5, 2);
    const b = barHeight * Math.random(0.5, 2);
    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    ctx.fillRect(x, y, barWidth, barHeight);
    x += barWidth;
    ctx.restore();
  }
}
