/*
 * @Author: Satya
 * @Date: 2020-12-22 11:56:45
 * @Last Modified by: Satya
 * @Last Modified time: 2020-12-22 12:04:24
 * doc:合并音频的一些功能扩展
 */
import "get-float-time-domain-data";
import getUserMedia from "get-user-media-promise";
import WavEncoder from "wav-encoder";

const SOUND_BYTE_LIMIT = 10 * 1000 * 1000; // 10mb

const computeRMS = function (samples, scaling = 0.55) {
  if (samples.length === 0) return 0;
  // Calculate RMS, adapted from https://github.com/Tonejs/Tone.js/blob/master/Tone/component/Meter.js#L88
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i];
    sum += Math.pow(sample, 2);
  }
  const rms = Math.sqrt(sum / samples.length);
  const val = rms / scaling;
  return Math.sqrt(val);
};

const computeChunkedRMS = function (samples, chunkSize = 1024) {
  const sampleCount = samples.length;
  const chunkLevels = [];
  for (let i = 0; i < sampleCount; i += chunkSize) {
    const maxIndex = Math.min(sampleCount, i + chunkSize);
    chunkLevels.push(computeRMS(samples.slice(i, maxIndex)));
  }
  return chunkLevels;
};

const encodeAndAddSoundToVM = function (
  vm,
  samples,
  sampleRate,
  name,
  callback
) {
  WavEncoder.encode({
    sampleRate: sampleRate,
    channelData: [samples],
  }).then((wavBuffer) => {
    const vmSound = {
      format: "",
      dataFormat: "wav",
      rate: sampleRate,
      sampleCount: samples.length,
    };

    // Create an asset from the encoded .wav and get resulting md5
    const storage = vm.runtime.storage;
    vmSound.asset = storage.createAsset(
      storage.AssetType.Sound,
      storage.DataFormat.WAV,
      new Uint8Array(wavBuffer),
      null,
      true // generate md5
    );
    vmSound.assetId = vmSound.asset.assetId;

    // update vmSound object with md5 property
    vmSound.md5 = `${vmSound.assetId}.${vmSound.dataFormat}`;
    // The VM will update the sound name to a fresh name
    vmSound.name = name;

    vm.addSound(vmSound).then(() => {
      if (callback) callback();
    });
  });
};
class EchoEffect {
  static get DELAY_TIME() {
    return 0.25;
  }
  static get TAIL_SECONDS() {
    return 0.75;
  }
  constructor(audioContext, startTime, endTime) {
    this.audioContext = audioContext;
    this.input = this.audioContext.createGain();
    this.output = this.audioContext.createGain();

    this.effectInput = this.audioContext.createGain();
    this.effectInput.gain.value = 0;

    this.effectInput.gain.setValueAtTime(0.75, startTime);
    this.effectInput.gain.setValueAtTime(0, endTime);

    this.delay = this.audioContext.createDelay(1);
    this.delay.delayTime.value = EchoEffect.DELAY_TIME;
    this.decay = this.audioContext.createGain();
    this.decay.gain.value = 0.3;

    this.compressor = this.audioContext.createDynamicsCompressor();
    this.compressor.threshold.value = -5;
    this.compressor.knee.value = 15;
    this.compressor.ratio.value = 12;
    this.compressor.attack.value = 0;
    this.compressor.release.value = 0.25;

    this.input.connect(this.effectInput);
    this.effectInput.connect(this.delay);
    this.delay.connect(this.compressor);
    this.input.connect(this.compressor);
    this.delay.connect(this.decay);
    this.decay.connect(this.delay);
    this.compressor.connect(this.output);
  }
}

class RobotEffect {
  constructor(audioContext, startTime, endTime) {
    this.audioContext = audioContext;

    this.input = this.audioContext.createGain();
    this.output = this.audioContext.createGain();
    this.passthrough = this.audioContext.createGain();
    this.effectInput = this.audioContext.createGain();

    this.passthrough.gain.value = 1;
    this.effectInput.gain.value = 0;

    this.passthrough.gain.setValueAtTime(0, startTime);
    this.passthrough.gain.setValueAtTime(1, endTime);

    this.effectInput.gain.setValueAtTime(1, startTime);
    this.effectInput.gain.setValueAtTime(0, endTime);

    // Ring modulator inspired by BBC Dalek voice
    // http://recherche.ircam.fr/pub/dafx11/Papers/66_e.pdf
    // https://github.com/bbc/webaudio.prototyping.bbc.co.uk

    // > There are four parallel signal paths, two which process the
    // > combination Vc + Vin / 2 and two which process Vc - Vin/2.
    // > Each branch consists of a non-linearity [diode]...
    const createDiodeNode = () => {
      const node = this.audioContext.createWaveShaper();

      // Piecewise function given by (2) in Parker paper
      const transform = (v, vb = 0.2, vl = 0.4, h = 0.65) => {
        if (v <= vb) return 0;
        if (v <= vl) return h * (Math.pow(v - vb, 2) / (2 * vl - 2 * vb));
        return h * v - h * vl + h * (Math.pow(v - vb, 2) / (2 * vl - 2 * vb));
      };

      // Create the waveshaper curve with the voltage transform above
      const bufferLength = 1024;
      const curve = new Float32Array(bufferLength);
      for (let i = 0; i < bufferLength; i++) {
        const voltage = 2 * (i / bufferLength) - 1;
        curve[i] = transform(voltage);
      }
      node.curve = curve;
      return node;
    };

    const oscillator = this.audioContext.createOscillator();
    oscillator.frequency.value = 50;
    oscillator.start(0);

    const vInGain = this.audioContext.createGain();
    vInGain.gain.value = 0.5;

    const vInInverter1 = this.audioContext.createGain();
    vInInverter1.gain.value = -1;

    const vInInverter2 = this.audioContext.createGain();
    vInInverter2.gain.value = -1;

    const vInDiode1 = createDiodeNode(this.audioContext);
    const vInDiode2 = createDiodeNode(this.audioContext);

    const vInInverter3 = this.audioContext.createGain();
    vInInverter3.gain.value = -1;

    const vcInverter1 = this.audioContext.createGain();
    vcInverter1.gain.value = -1;

    const vcDiode3 = createDiodeNode(this.audioContext);
    const vcDiode4 = createDiodeNode(this.audioContext);

    const compressor = this.audioContext.createDynamicsCompressor();
    compressor.threshold.value = -5;
    compressor.knee.value = 15;
    compressor.ratio.value = 12;
    compressor.attack.value = 0;
    compressor.release.value = 0.25;

    const biquadFilter = this.audioContext.createBiquadFilter();
    biquadFilter.type = "highpass";
    biquadFilter.frequency.value = 1000;
    biquadFilter.gain.value = 1.25;

    this.input.connect(this.effectInput);
    this.input.connect(this.passthrough);

    this.passthrough.connect(this.output);

    this.effectInput.connect(vcInverter1);
    this.effectInput.connect(vcDiode4);

    vcInverter1.connect(vcDiode3);

    oscillator.connect(vInGain);
    vInGain.connect(vInInverter1);
    vInGain.connect(vcInverter1);
    vInGain.connect(vcDiode4);

    vInInverter1.connect(vInInverter2);
    vInInverter1.connect(vInDiode2);
    vInInverter2.connect(vInDiode1);

    vInDiode1.connect(vInInverter3);
    vInDiode2.connect(vInInverter3);

    vInInverter3.connect(compressor);
    vcDiode3.connect(compressor);
    vcDiode4.connect(compressor);

    this.effectInput.connect(biquadFilter);
    biquadFilter.connect(compressor);

    compressor.connect(this.output);
  }
}

class VolumeEffectExpand {
  constructor(audioContext, volume, startSeconds, endSeconds) {
    this.audioContext = audioContext;

    this.input = this.audioContext.createGain();
    this.output = this.audioContext.createGain();

    this.gain = this.audioContext.createGain();

    // 在开始时间之前平滑地增加增益，在结束时间之后平滑地降低增益.
    this.rampLength = 0.01;
    this.gain.gain.setValueAtTime(
      1.0,
      Math.max(0, startSeconds - this.rampLength)
    );
    this.gain.gain.exponentialRampToValueAtTime(volume, startSeconds);
    this.gain.gain.setValueAtTime(volume, endSeconds);
    this.gain.gain.exponentialRampToValueAtTime(
      1.0,
      endSeconds + this.rampLength
    );

    this.input.connect(this.gain);
    this.gain.connect(this.output);
  }
}

class FadeEffect {
  constructor(audioContext, fadeIn, startSeconds, endSeconds) {
    this.audioContext = audioContext;

    this.input = this.audioContext.createGain();
    this.output = this.audioContext.createGain();

    this.gain = this.audioContext.createGain();

    this.gain.gain.setValueAtTime(1, 0);

    if (fadeIn) {
      this.gain.gain.setValueAtTime(0, startSeconds);
      this.gain.gain.linearRampToValueAtTime(1, endSeconds);
    } else {
      this.gain.gain.setValueAtTime(1, startSeconds);
      this.gain.gain.linearRampToValueAtTime(0, endSeconds);
    }

    this.gain.gain.setValueAtTime(1, endSeconds);

    this.input.connect(this.gain);
    this.gain.connect(this.output);
  }
}

class MuteEffect {
  constructor(audioContext, startSeconds, endSeconds) {
    this.audioContext = audioContext;

    this.input = this.audioContext.createGain();
    this.output = this.audioContext.createGain();

    this.gain = this.audioContext.createGain();

    // Smoothly ramp the gain down before the start time, and up after the end time.
    this.rampLength = 0.001;
    this.gain.gain.setValueAtTime(
      1.0,
      Math.max(0, startSeconds - this.rampLength)
    );
    this.gain.gain.linearRampToValueAtTime(0, startSeconds);
    this.gain.gain.setValueAtTime(0, endSeconds);
    this.gain.gain.linearRampToValueAtTime(1.0, endSeconds + this.rampLength);

    this.input.connect(this.gain);
    this.gain.connect(this.output);
  }
}

const effectTypes = {
  ROBOT: "robot",
  REVERSE: "reverse",
  LOUDER: "higher",
  SOFTER: "lower",
  FASTER: "faster",
  SLOWER: "slower",
  ECHO: "echo",
  FADEIN: "fade in",
  FADEOUT: "fade out",
  MUTE: "mute",
};

class AudioEffects {
  static get effectTypes() {
    return effectTypes;
  }
  constructor(buffer, name, trimStart, trimEnd) {
    this.trimStartSeconds = (trimStart * buffer.length) / buffer.sampleRate;
    this.trimEndSeconds = (trimEnd * buffer.length) / buffer.sampleRate;
    this.adjustedTrimStartSeconds = this.trimStartSeconds;
    this.adjustedTrimEndSeconds = this.trimEndSeconds;

    // Some effects will modify the playback rate and/or number of samples.
    // Need to precompute those values to create the offline audio context.
    const pitchRatio = Math.pow(2, 4 / 12); // A major third
    let sampleCount = buffer.length;
    const affectedSampleCount = Math.floor(
      (this.trimEndSeconds - this.trimStartSeconds) * buffer.sampleRate
    );
    let adjustedAffectedSampleCount = affectedSampleCount;
    const unaffectedSampleCount = sampleCount - affectedSampleCount;

    this.playbackRate = 1;
    switch (name) {
      case effectTypes.ECHO:
        sampleCount = Math.max(
          sampleCount,
          Math.floor(
            (this.trimEndSeconds + EchoEffect.TAIL_SECONDS) * buffer.sampleRate
          )
        );
        break;
      case effectTypes.FASTER:
        this.playbackRate = pitchRatio;
        adjustedAffectedSampleCount = Math.floor(
          affectedSampleCount / this.playbackRate
        );
        sampleCount = unaffectedSampleCount + adjustedAffectedSampleCount;

        break;
      case effectTypes.SLOWER:
        this.playbackRate = 1 / pitchRatio;
        adjustedAffectedSampleCount = Math.floor(
          affectedSampleCount / this.playbackRate
        );
        sampleCount = unaffectedSampleCount + adjustedAffectedSampleCount;
        break;
    }

    const durationSeconds = sampleCount / buffer.sampleRate;
    this.adjustedTrimEndSeconds =
      this.trimStartSeconds + adjustedAffectedSampleCount / buffer.sampleRate;
    this.adjustedTrimStart = this.adjustedTrimStartSeconds / durationSeconds;
    this.adjustedTrimEnd = this.adjustedTrimEndSeconds / durationSeconds;

    if (window.OfflineAudioContext) {
      this.audioContext = new window.OfflineAudioContext(
        1,
        sampleCount,
        buffer.sampleRate
      );
    } else {
      // Need to use webkitOfflineAudioContext, which doesn't support all sample rates.
      // Resample by adjusting sample count to make room and set offline context to desired sample rate.
      const sampleScale = 44100 / buffer.sampleRate;
      this.audioContext = new window.webkitOfflineAudioContext(
        1,
        sampleScale * sampleCount,
        44100
      );
    }

    // For the reverse effect we need to manually reverse the data into a new audio buffer
    // to prevent overwriting the original, so that the undo stack works correctly.
    // Doing buffer.reverse() would mutate the original data.
    if (name === effectTypes.REVERSE) {
      const originalBufferData = buffer.getChannelData(0);
      const newBuffer = this.audioContext.createBuffer(
        1,
        buffer.length,
        buffer.sampleRate
      );
      const newBufferData = newBuffer.getChannelData(0);
      const bufferLength = buffer.length;

      const startSamples = Math.floor(
        this.trimStartSeconds * buffer.sampleRate
      );
      const endSamples = Math.floor(this.trimEndSeconds * buffer.sampleRate);
      let counter = 0;
      for (let i = 0; i < bufferLength; i++) {
        if (i >= startSamples && i < endSamples) {
          newBufferData[i] = originalBufferData[endSamples - counter - 1];
          counter++;
        } else {
          newBufferData[i] = originalBufferData[i];
        }
      }
      this.buffer = newBuffer;
    } else {
      // All other effects use the original buffer because it is not modified.
      this.buffer = buffer;
    }

    this.source = this.audioContext.createBufferSource();
    this.source.buffer = this.buffer;
    this.name = name;
  }
  process(done) {
    // Some effects need to use more nodes and must expose an input and output
    let input;
    let output;
    switch (this.name) {
      case effectTypes.FASTER:
      case effectTypes.SLOWER:
        this.source.playbackRate.setValueAtTime(
          this.playbackRate,
          this.adjustedTrimStartSeconds
        );
        this.source.playbackRate.setValueAtTime(
          1.0,
          this.adjustedTrimEndSeconds
        );
        break;
      case effectTypes.LOUDER:
        ({ input, output } = new VolumeEffectExpand(
          this.audioContext,
          1.25,
          this.adjustedTrimStartSeconds,
          this.adjustedTrimEndSeconds
        ));
        break;
      case effectTypes.SOFTER:
        ({ input, output } = new VolumeEffectExpand(
          this.audioContext,
          0.75,
          this.adjustedTrimStartSeconds,
          this.adjustedTrimEndSeconds
        ));
        break;
      case effectTypes.ECHO:
        ({ input, output } = new EchoEffect(
          this.audioContext,
          this.adjustedTrimStartSeconds,
          this.adjustedTrimEndSeconds
        ));
        break;
      case effectTypes.ROBOT:
        ({ input, output } = new RobotEffect(
          this.audioContext,
          this.adjustedTrimStartSeconds,
          this.adjustedTrimEndSeconds
        ));
        break;
      case effectTypes.FADEIN:
        ({ input, output } = new FadeEffect(
          this.audioContext,
          true,
          this.adjustedTrimStartSeconds,
          this.adjustedTrimEndSeconds
        ));
        break;
      case effectTypes.FADEOUT:
        ({ input, output } = new FadeEffect(
          this.audioContext,
          false,
          this.adjustedTrimStartSeconds,
          this.adjustedTrimEndSeconds
        ));
        break;
      case effectTypes.MUTE:
        ({ input, output } = new MuteEffect(
          this.audioContext,
          this.adjustedTrimStartSeconds,
          this.adjustedTrimEndSeconds
        ));
        break;
    }

    if (input && output) {
      this.source.connect(input);
      output.connect(this.audioContext.destination);
    } else {
      // No effects nodes are needed, wire directly to the output
      this.source.connect(this.audioContext.destination);
    }

    this.source.start();

    this.audioContext.startRendering();
    this.audioContext.oncomplete = ({ renderedBuffer }) => {
      done(renderedBuffer, this.adjustedTrimStart, this.adjustedTrimEnd);
    };
  }
}

class AudioBufferPlayer {
  constructor(samples, sampleRate) {
    this.audioContext = getContext();
    this.buffer = this.audioContext.createBuffer(1, samples.length, sampleRate);
    this.buffer.getChannelData(0).set(samples);
    this.source = null;

    this.startTime = null;
    this.updateCallback = null;
    this.trimStart = null;
    this.trimEnd = null;
  }

  play(trimStart, trimEnd, onUpdate, onEnded) {
    this.updateCallback = onUpdate;
    this.trimStart = trimStart;
    this.trimEnd = trimEnd;
    this.startTime = Date.now();

    const trimStartTime = this.buffer.duration * trimStart;
    const trimmedDuration = this.buffer.duration * trimEnd - trimStartTime;

    this.source = this.audioContext.createBufferSource();
    this.source.onended = onEnded;
    this.source.buffer = this.buffer;
    this.source.connect(this.audioContext.destination);
    this.source.start(0, trimStartTime, trimmedDuration);

    this.update();
  }

  update() {
    const timeSinceStart = (Date.now() - this.startTime) / 1000;
    const percentage = timeSinceStart / this.buffer.duration;
    if (percentage + this.trimStart < this.trimEnd && this.source.onended) {
      requestAnimationFrame(this.update.bind(this));
      this.updateCallback(percentage + this.trimStart);
    } else {
      this.updateCallback = null;
    }
  }

  stop() {
    if (this.source) {
      this.source.onended = null; // Do not call onEnded callback if manually stopped
      try {
        this.source.stop();
      } catch (e) {
        // This is probably Safari, which dies when you call stop more than once
        // which the spec says is allowed: https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode
        console.log("Caught error while stopping buffer source node."); // eslint-disable-line no-console
      }
    }
  }
}

class AudioRecorder {
  constructor() {
    this.audioContext = getContext();
    this.bufferLength = 8192;

    this.userMediaStream = null;
    this.mediaStreamSource = null;
    this.sourceNode = null;
    this.scriptProcessorNode = null;

    this.recordedSamples = 0;
    this.recording = false;
    this.started = false;
    this.buffers = [];

    this.disposed = false;
  }

  startListening(onStarted, onUpdate, onError) {
    try {
      getUserMedia({ audio: true })
        .then((userMediaStream) => {
          if (!this.disposed) {
            this.started = true;
            onStarted();
            this.attachUserMediaStream(userMediaStream, onUpdate);
          }
        })
        .catch((e) => {
          if (!this.disposed) {
            onError(e);
          }
        });
    } catch (e) {
      if (!this.disposed) {
        onError(e);
      }
    }
  }

  startRecording() {
    this.recording = true;
  }

  attachUserMediaStream(userMediaStream, onUpdate) {
    this.userMediaStream = userMediaStream;
    this.mediaStreamSource = this.audioContext.createMediaStreamSource(
      userMediaStream
    );
    this.sourceNode = this.audioContext.createGain();
    this.scriptProcessorNode = this.audioContext.createScriptProcessor(
      this.bufferLength,
      1,
      1
    );

    this.scriptProcessorNode.onaudioprocess = (processEvent) => {
      if (this.recording && !this.disposed) {
        this.buffers.push(
          new Float32Array(processEvent.inputBuffer.getChannelData(0))
        );
      }
    };

    this.analyserNode = this.audioContext.createAnalyser();

    this.analyserNode.fftSize = 2048;

    const bufferLength = this.analyserNode.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);

    const update = () => {
      if (this.disposed) return;
      this.analyserNode.getFloatTimeDomainData(dataArray);
      onUpdate(computeRMS(dataArray));
      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);

    // Wire everything together, ending in the destination
    this.mediaStreamSource.connect(this.sourceNode);
    this.sourceNode.connect(this.analyserNode);
    this.analyserNode.connect(this.scriptProcessorNode);
    this.scriptProcessorNode.connect(this.audioContext.destination);
  }

  stop() {
    const buffer = new Float32Array(this.buffers.length * this.bufferLength);

    let offset = 0;
    for (let i = 0; i < this.buffers.length; i++) {
      const bufferChunk = this.buffers[i];
      buffer.set(bufferChunk, offset);
      offset += bufferChunk.length;
    }

    const chunkLevels = computeChunkedRMS(buffer);
    const maxRMS = Math.max.apply(null, chunkLevels);
    const threshold = maxRMS / 8;

    let firstChunkAboveThreshold = null;
    let lastChunkAboveThreshold = null;
    for (let i = 0; i < chunkLevels.length; i++) {
      if (chunkLevels[i] > threshold) {
        if (firstChunkAboveThreshold === null) firstChunkAboveThreshold = i + 1;
        lastChunkAboveThreshold = i + 1;
      }
    }

    let trimStart =
      Math.max(2, firstChunkAboveThreshold - 2) / this.buffers.length;
    let trimEnd =
      Math.min(this.buffers.length - 2, lastChunkAboveThreshold + 2) /
      this.buffers.length;

    // With very few samples, the automatic trimming can produce invalid values
    if (trimStart >= trimEnd) {
      trimStart = 0;
      trimEnd = 1;
    }

    return {
      levels: chunkLevels,
      samples: buffer,
      sampleRate: this.audioContext.sampleRate,
      trimStart: trimStart,
      trimEnd: trimEnd,
    };
  }

  dispose() {
    if (this.started) {
      this.scriptProcessorNode.onaudioprocess = null;
      this.scriptProcessorNode.disconnect();
      this.analyserNode.disconnect();
      this.sourceNode.disconnect();
      this.mediaStreamSource.disconnect();
      this.userMediaStream.getAudioTracks()[0].stop();
    }
    this.disposed = true;
  }
}

export {
  AudioEffects,
  AudioBufferPlayer,
  AudioRecorder,
  computeRMS,
  computeChunkedRMS,
  encodeAndAddSoundToVM,
  SOUND_BYTE_LIMIT,
};
