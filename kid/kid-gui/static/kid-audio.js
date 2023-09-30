/*
 * @Author: Satya
 * @Date: 2020-12-21 16:47:55
 * @Last Modified by: Satya
 * @Last Modified time: 2020-12-21 17:12:41
 * doc:单文件音频引擎
 */

/**
 * @module 对AudioPlayer及其所有SoundPlayers的影响.
 */
class Effect {
  /**
   * @param {AudioEngine} audioEngine - audio engine this runs with
   * @param {AudioPlayer} audioPlayer - audio player this affects
   * @param {Effect} lastEffect - effect in the chain before this one
   * @constructor
   */
  constructor(audioEngine, audioPlayer, lastEffect) {
    this.audioEngine = audioEngine;
    this.audioPlayer = audioPlayer;
    this.lastEffect = lastEffect;

    this.value = this.DEFAULT_VALUE;

    this.initialized = false;

    this.inputNode = null;
    this.outputNode = null;

    this.target = null;
  }

  /**
   * Return the name of the effect.
   * @type {string}
   */
  get name() {
    throw new Error(`${this.constructor.name}.name is not implemented`);
  }

  /**
   * Default value to set the Effect to when constructed and when clear'ed.
   * @const {number}
   */
  get DEFAULT_VALUE() {
    return 0;
  }

  /**
   * Should the effect be connected to the audio graph?
   * The pitch effect is an example that does not need to be patched in.
   * Instead of affecting the graph it affects the player directly.
   * @return {boolean} is the effect affecting the graph?
   */
  get _isPatch() {
    return (
      this.initialized &&
      (this.value !== this.DEFAULT_VALUE || this.audioPlayer === null)
    );
  }

  /**
   * Get the input node.
   * @return {AudioNode} - audio node that is the input for this effect
   */
  getInputNode() {
    if (this._isPatch) {
      return this.inputNode;
    }
    return this.target.getInputNode();
  }

  /**
   * Initialize the Effect.
   * Effects start out uninitialized. Then initialize when they are first set
   * with some value.
   * @throws {Error} throws when left unimplemented
   */
  initialize() {
    throw new Error(`${this.constructor.name}.initialize is not implemented.`);
  }

  /**
   * Set the effects value.
   * @private
   * @param {number} value - new value to set effect to
   */
  _set() {
    throw new Error(`${this.constructor.name}._set is not implemented.`);
  }

  /**
   * Set the effects value.
   * @param {number} value - new value to set effect to
   */
  set(value) {
    // Initialize the node on first set.
    if (!this.initialized) {
      this.initialize();
    }

    // Store whether the graph should currently affected by this effect.
    const wasPatch = this._isPatch;
    if (wasPatch) {
      this._lastPatch = this.audioEngine.currentTime;
    }

    // Call the internal implementation per this Effect.
    this._set(value);

    // Connect or disconnect from the graph if this now applies or no longer
    // applies an effect.
    if (this._isPatch !== wasPatch && this.target !== null) {
      this.connect(this.target);
    }
  }

  /**
   * Update the effect for changes in the audioPlayer.
   */
  update() {}

  /**
   * Clear the value back to the default.
   */
  clear() {
    this.set(this.DEFAULT_VALUE);
  }

  /**
   * Connnect this effect's output to another audio node
   * @param {object} target - target whose node to should be connected
   */
  connect(target) {
    if (target === null) {
      throw new Error("target may not be null");
    }

    const checkForCircularReference = (subtarget) => {
      if (subtarget) {
        if (subtarget === this) {
          return true;
        }
        return checkForCircularReference(subtarget.target);
      }
    };
    if (checkForCircularReference(target)) {
      throw new Error("Effect cannot connect to itself");
    }

    this.target = target;

    if (this.outputNode !== null) {
      this.outputNode.disconnect();
    }

    if (
      this._isPatch ||
      this._lastPatch + this.audioEngine.DECAY_DURATION <
        this.audioEngine.currentTime
    ) {
      this.outputNode.connect(target.getInputNode());
    }

    if (this.lastEffect === null) {
      if (this.audioPlayer !== null) {
        this.audioPlayer.connect(this);
      }
    } else {
      this.lastEffect.connect(this);
    }
  }

  /**
   * Clean up and disconnect audio nodes.
   */
  dispose() {
    this.inputNode = null;
    this.outputNode = null;
    this.target = null;

    this.initialized = false;
  }
}

class EffectChain {
  /**
   * Chain of effects that can be applied to a group of SoundPlayers.
   * @param {AudioEngine} audioEngine - engine whose effects these belong to
   * @param {Array<Effect>} effects - array of Effect classes to construct
   */
  constructor(audioEngine, effects) {
    /**
     * AudioEngine whose effects these belong to.
     * @type {AudioEngine}
     */
    this.audioEngine = audioEngine;

    /**
     * Node incoming connections will attach to. This node than connects to
     * the items in the chain which finally connect to some output.
     * @type {AudioNode}
     */
    this.inputNode = this.audioEngine.audioContext.createGain();

    /**
     * List of Effect types to create.
     * @type {Array<Effect>}
     */
    this.effects = effects;

    // Effects are instantiated in reverse so that the first refers to the
    // second, the second refers to the third, etc and the last refers to
    // null.
    let lastEffect = null;
    /**
     * List of instantiated Effects.
     * @type {Array<Effect>}
     */
    this._effects = effects
      .reverse()
      .map((Effect) => {
        const effect = new Effect(audioEngine, this, lastEffect);
        this[effect.name] = effect;
        lastEffect = effect;
        return effect;
      })
      .reverse();

    /**
     * First effect of this chain.
     * @type {Effect}
     */
    this.firstEffect = this._effects[0];

    /**
     * Last effect of this chain.
     * @type {Effect}
     */
    this.lastEffect = this._effects[this._effects.length - 1];

    /**
     * A set of players this chain is managing.
     */
    this._soundPlayers = new Set();
  }

  /**
   * Create a clone of the EffectChain.
   * @returns {EffectChain} a clone of this EffectChain
   */
  clone() {
    const chain = new EffectChain(this.audioEngine, this.effects);
    if (this.target) {
      chain.connect(this.target);
    }
    return chain;
  }

  /**
   * Add a sound player.
   * @param {SoundPlayer} soundPlayer - a sound player to manage
   */
  addSoundPlayer(soundPlayer) {
    if (!this._soundPlayers.has(soundPlayer)) {
      this._soundPlayers.add(soundPlayer);
      this.update();
    }
  }

  /**
   * Remove a sound player.
   * @param {SoundPlayer} soundPlayer - a sound player to stop managing
   */
  removeSoundPlayer(soundPlayer) {
    this._soundPlayers.remove(soundPlayer);
  }

  /**
   * Get the audio input node.
   * @returns {AudioNode} audio node the upstream can connect to
   */
  getInputNode() {
    return this.inputNode;
  }

  /**
   * Connnect this player's output to another audio node.
   * @param {object} target - target whose node to should be connected
   */
  connect(target) {
    const { firstEffect, lastEffect } = this;

    if (target === lastEffect) {
      this.inputNode.disconnect();
      this.inputNode.connect(lastEffect.getInputNode());

      return;
    } else if (target === firstEffect) {
      return;
    }

    this.target = target;

    firstEffect.connect(target);
  }

  /**
   * Array of SoundPlayers managed by this EffectChain.
   * @returns {Array<SoundPlayer>} sound players managed by this chain
   */
  getSoundPlayers() {
    return [...this._soundPlayers];
  }

  /**
   * Set Effect values with named values on target.soundEffects if it exist
   * and then from target itself.
   * @param {Target} target - target to set values from
   */
  setEffectsFromTarget(target) {
    this._effects.forEach((effect) => {
      if ("soundEffects" in target && effect.name in target.soundEffects) {
        effect.set(target.soundEffects[effect.name]);
      } else if (effect.name in target) {
        effect.set(target[effect.name]);
      }
    });
  }

  /**
   * Set an effect value by its name.
   * @param {string} effect - effect name to change
   * @param {number} value - value to set effect to
   */
  set(effect, value) {
    if (effect in this) {
      this[effect].set(value);
    }
  }

  /**
   * Update managed sound players with the effects on this chain.
   */
  update() {
    this._effects.forEach((effect) => effect.update());
  }

  /**
   * Clear all effects to their default values.
   */
  clear() {
    this._effects.forEach((effect) => effect.clear());
  }

  /**
   * Dispose of all effects in this chain. Nothing is done to managed
   * SoundPlayers.
   */
  dispose() {
    this._soundPlayers = null;
    this._effects.forEach((effect) => effect.dispose());
    this._effects = null;
  }
}

/**
 * @module 平移效果，将声音在扬声器之间向左或向右移动效果值-100将音频完全放在左声道，0居中，100放在右边.
 */
class PanEffect extends Effect {
  /**
   * @param {AudioEngine} audioEngine - audio engine this runs with
   * @param {AudioPlayer} audioPlayer - audio player this affects
   * @param {Effect} lastEffect - effect in the chain before this one
   * @constructor
   */
  constructor(audioEngine, audioPlayer, lastEffect) {
    super(audioEngine, audioPlayer, lastEffect);

    this.leftGain = null;
    this.rightGain = null;
    this.channelMerger = null;
  }

  /**
   * Return the name of the effect.
   * @type {string}
   */
  get name() {
    return "pan";
  }

  /**
   * Initialize the Effect.
   * Effects start out uninitialized. Then initialize when they are first set
   * with some value.
   * @throws {Error} throws when left unimplemented
   */
  initialize() {
    const audioContext = this.audioEngine.audioContext;

    this.inputNode = audioContext.createGain();
    this.leftGain = audioContext.createGain();
    this.rightGain = audioContext.createGain();
    this.channelMerger = audioContext.createChannelMerger(2);
    this.outputNode = this.channelMerger;

    this.inputNode.connect(this.leftGain);
    this.inputNode.connect(this.rightGain);
    this.leftGain.connect(this.channelMerger, 0, 0);
    this.rightGain.connect(this.channelMerger, 0, 1);

    this.initialized = true;
  }

  /**
   * Set the effect value
   * @param {number} value - the new value to set the effect to
   */
  _set(value) {
    this.value = value;

    // Map the scratch effect value (-100 to 100) to (0 to 1)
    const p = (value + 100) / 200;

    // Use trig functions for equal-loudness panning
    // See e.g. https://docs.cycling74.com/max7/tutorials/13_panningchapter01
    const leftVal = Math.cos((p * Math.PI) / 2);
    const rightVal = Math.sin((p * Math.PI) / 2);

    const { currentTime, DECAY_WAIT, DECAY_DURATION } = this.audioEngine;
    this.leftGain.gain.setTargetAtTime(
      leftVal,
      currentTime + DECAY_WAIT,
      DECAY_DURATION
    );
    this.rightGain.gain.setTargetAtTime(
      rightVal,
      currentTime + DECAY_WAIT,
      DECAY_DURATION
    );
  }

  /**
   * Clean up and disconnect audio nodes.
   */
  dispose() {
    if (!this.initialized) {
      return;
    }

    this.inputNode.disconnect();
    this.leftGain.disconnect();
    this.rightGain.disconnect();
    this.channelMerger.disconnect();

    this.inputNode = null;
    this.leftGain = null;
    this.rightGain = null;
    this.channelMerger = null;
    this.outputNode = null;
    this.target = null;

    this.initialized = false;
  }
}

/**
 * @module 音高变化效果，可改变声音的播放速率以更改其音高：降低播放速率会降低音高，增大播放速度会提高音高。声音的持续时间也改变了.
 *
 * Changing the value of the pitch effect by 10 causes a change in pitch by 1
 * semitone (i.e. a musical half-step, such as the difference between C and C#)
 * Changing the pitch effect by 120 changes the pitch by one octave (12
 * semitones)
 *
 * The value of this effect is not clamped (i.e. it is typically between -120
 * and 120, but can be set much higher or much lower, with weird and fun
 * results). We should consider what extreme values to use for clamping it.
 *
 * Note that this effect functions differently from the other audio effects. It
 * is not part of a chain of audio nodes. Instead, it provides a way to set the
 * playback on one SoundPlayer or a group of them.
 */
class PitchEffect extends Effect {
  /**
   * @param {AudioEngine} audioEngine - audio engine this runs with
   * @param {AudioPlayer} audioPlayer - audio player this affects
   * @param {Effect} lastEffect - effect in the chain before this one
   * @constructor
   */
  constructor(audioEngine, audioPlayer, lastEffect) {
    super(audioEngine, audioPlayer, lastEffect);

    /**
     * The playback rate ratio
     * @type {Number}
     */
    this.ratio = 1;
  }

  /**
   * Return the name of the effect.
   * @type {string}
   */
  get name() {
    return "pitch";
  }

  /**
   * Should the effect be connected to the audio graph?
   * @return {boolean} is the effect affecting the graph?
   */
  get _isPatch() {
    return false;
  }

  /**
   * Get the input node.
   * @return {AudioNode} - audio node that is the input for this effect
   */
  getInputNode() {
    return this.target.getInputNode();
  }

  /**
   * Initialize the Effect.
   * Effects start out uninitialized. Then initialize when they are first set
   * with some value.
   * @throws {Error} throws when left unimplemented
   */
  initialize() {
    this.initialized = true;
  }

  /**
   * Set the effect value.
   * @param {number} value - the new value to set the effect to
   */
  _set(value) {
    this.value = value;
    this.ratio = this.getRatio(this.value);
    this.updatePlayers(this.audioPlayer.getSoundPlayers());
  }

  /**
   * Update the effect for changes in the audioPlayer.
   */
  update() {
    this.updatePlayers(this.audioPlayer.getSoundPlayers());
  }

  /**
   * Compute the playback ratio for an effect value.
   * The playback ratio is scaled so that a change of 10 in the effect value
   * gives a change of 1 semitone in the ratio.
   * @param {number} val - an effect value
   * @returns {number} a playback ratio
   */
  getRatio(val) {
    const interval = val / 10;
    // Convert the musical interval in semitones to a frequency ratio
    return Math.pow(2, interval / 12);
  }

  /**
   * Update a sound player's playback rate using the current ratio for the
   * effect
   * @param {object} player - a SoundPlayer object
   */
  updatePlayer(player) {
    player.setPlaybackRate(this.ratio);
  }

  /**
   * Update a sound player's playback rate using the current ratio for the
   * effect
   * @param {object} players - a dictionary of SoundPlayer objects to update,
   *     indexed by md5
   */
  updatePlayers(players) {
    if (!players) return;

    for (const id in players) {
      if (players.hasOwnProperty(id)) {
        this.updatePlayer(players[id]);
      }
    }
  }
}

/**
 * @module 影响效果链的数量.
 */
class VolumeEffect extends Effect {
  /**
   * Default value to set the Effect to when constructed and when clear'ed.
   * @const {number}
   */
  get DEFAULT_VALUE() {
    return 100;
  }

  /**
   * Return the name of the effect.
   * @type {string}
   */
  get name() {
    return "volume";
  }

  /**
   * Initialize the Effect.
   * Effects start out uninitialized. Then initialize when they are first set
   * with some value.
   * @throws {Error} throws when left unimplemented
   */
  initialize() {
    this.inputNode = this.audioEngine.audioContext.createGain();
    this.outputNode = this.inputNode;

    this.initialized = true;
  }

  /**
   * Set the effects value.
   * @private
   * @param {number} value - new value to set effect to
   */
  _set(value) {
    this.value = value;

    const { gain } = this.outputNode;
    const { currentTime, DECAY_DURATION } = this.audioEngine;
    gain.linearRampToValueAtTime(value / 100, currentTime + DECAY_DURATION);
  }

  /**
   * Clean up and disconnect audio nodes.
   */
  dispose() {
    if (!this.initialized) {
      return;
    }

    this.outputNode.disconnect();

    this.inputNode = null;
    this.outputNode = null;
    this.target = null;

    this.initialized = false;
  }
}

class Loudness {
  /**
   * Instrument and detect a loudness value from a local microphone.
   * @param {AudioContext} audioContext - context to create nodes from for
   *     detecting loudness
   * @constructor
   */
  constructor(audioContext) {
    /**
     * AudioContext the mic will connect to and provide analysis of
     * @type {AudioContext}
     */
    this.audioContext = audioContext;

    /**
     * Are we connecting to the mic yet?
     * @type {Boolean}
     */
    this.connectingToMic = false;

    /**
     * microphone, for measuring loudness, with a level meter analyzer
     * @type {MediaStreamSourceNode}
     */
    this.mic = null;
  }

  /**
   * Get the current loudness of sound received by the microphone.
   * Sound is measured in RMS and smoothed.
   * Some code adapted from Tone.js: https://github.com/Tonejs/Tone.js
   * @return {number} loudness scaled 0 to 100
   */
  getLoudness() {
    // The microphone has not been set up, so try to connect to it
    if (!this.mic && !this.connectingToMic) {
      this.connectingToMic = true; // prevent multiple connection attempts
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          this.audioStream = stream;
          this.mic = this.audioContext.createMediaStreamSource(stream);
          this.analyser = this.audioContext.createAnalyser();
          this.mic.connect(this.analyser);
          this.micDataArray = new Float32Array(this.analyser.fftSize);
        })
        .catch((err) => {
          console.warn(err);
        });
    }

    // If the microphone is set up and active, measure the loudness
    if (this.mic && this.audioStream.active) {
      this.analyser.getFloatTimeDomainData(this.micDataArray);
      let sum = 0;
      // compute the RMS of the sound
      for (let i = 0; i < this.micDataArray.length; i++) {
        sum += Math.pow(this.micDataArray[i], 2);
      }
      let rms = Math.sqrt(sum / this.micDataArray.length);
      // smooth the value, if it is descending
      if (this._lastValue) {
        rms = Math.max(rms, this._lastValue * 0.6);
      }
      this._lastValue = rms;

      // Scale the measurement so it's more sensitive to quieter sounds
      rms *= 1.63;
      rms = Math.sqrt(rms);
      // Scale it up to 0-100 and round
      rms = Math.round(rms * 100);
      // Prevent it from going above 100
      rms = Math.min(rms, 100);
      return rms;
    }

    // if there is no microphone input, return -1
    return -1;
  }
}

/**
 * 表示将要实现的所有目标的符号.
 * @const {string}
 */
const ALL_TARGETS = "*";

class SoundBank {
  /**
   * A bank of sounds that can be played.
   * @constructor
   * @param {AudioEngine} audioEngine - related AudioEngine
   * @param {EffectChain} effectChainPrime - original EffectChain cloned for
   *     playing sounds
   */
  constructor(audioEngine, effectChainPrime) {
    /**
     * AudioEngine this SoundBank is related to.
     * @type {AudioEngine}
     */
    this.audioEngine = audioEngine;

    /**
     * Map of ids to soundPlayers.
     * @type {object<SoundPlayer>}
     */
    this.soundPlayers = {};

    /**
     * Map of targets by sound id.
     * @type {Map<string, Target>}
     */
    this.playerTargets = new Map();

    /**
     * Map of effect chains by sound id.
     * @type {Map<string, EffectChain}
     */
    this.soundEffects = new Map();

    /**
     * Original EffectChain cloned for every playing sound.
     * @type {EffectChain}
     */
    this.effectChainPrime = effectChainPrime;
  }

  /**
   * Add a sound player instance likely from AudioEngine.decodeSoundPlayer
   * @param {SoundPlayer} soundPlayer - SoundPlayer to add
   */
  addSoundPlayer(soundPlayer) {
    this.soundPlayers[soundPlayer.id] = soundPlayer;
  }

  /**
   * Get a sound player by id.
   * @param {string} soundId - sound to look for
   * @returns {SoundPlayer} instance of sound player for the id
   */
  getSoundPlayer(soundId) {
    if (!this.soundPlayers[soundId]) {
      console.error(
        `SoundBank.getSoundPlayer(${soundId}): called missing sound in bank`
      );
    }

    return this.soundPlayers[soundId];
  }

  /**
   * Get a sound EffectChain by id.
   * @param {string} sound - sound to look for an EffectChain
   * @returns {EffectChain} available EffectChain for this id
   */
  getSoundEffects(sound) {
    if (!this.soundEffects.has(sound)) {
      this.soundEffects.set(sound, this.effectChainPrime.clone());
    }

    return this.soundEffects.get(sound);
  }

  /**
   * Play a sound.
   * @param {Target} target - Target to play for
   * @param {string} soundId - id of sound to play
   * @returns {Promise} promise that resolves when the sound finishes playback
   */
  playSound(target, soundId) {
    const effects = this.getSoundEffects(soundId);
    const player = this.getSoundPlayer(soundId);

    if (this.playerTargets.get(soundId) !== target) {
      // make sure to stop the old sound, effectively "forking" the output
      // when the target switches before we adjust it's effects
      player.stop();
    }

    this.playerTargets.set(soundId, target);
    effects.addSoundPlayer(player);
    effects.setEffectsFromTarget(target);
    player.connect(effects);

    player.play();

    return player.finished();
  }

  /**
   * Set the effects (pan, pitch, and volume) from values on the given target.
   * @param {Target} target - target to set values from
   */
  setEffects(target) {
    this.playerTargets.forEach((playerTarget, key) => {
      if (playerTarget === target) {
        this.getSoundEffects(key).setEffectsFromTarget(target);
      }
    });
  }

  /**
   * Stop playback of sound by id if was lasted played by the target.
   * @param {Target} target - target to check if it last played the sound
   * @param {string} soundId - id of the sound to stop
   */
  stop(target, soundId) {
    if (this.playerTargets.get(soundId) === target) {
      this.soundPlayers[soundId].stop();
    }
  }

  /**
   * Stop all sounds for all targets or a specific target.
   * @param {Target|string} target - a symbol for all targets or the target
   *     to stop sounds for
   */
  stopAllSounds(target = ALL_TARGETS) {
    this.playerTargets.forEach((playerTarget, key) => {
      if (target === ALL_TARGETS || playerTarget === target) {
        this.getSoundPlayer(key).stop();
      }
    });
  }

  /**
   * Dispose of all EffectChains and SoundPlayers.
   */
  dispose() {
    this.playerTargets.clear();
    this.soundEffects.forEach((effects) => effects.dispose());
    this.soundEffects.clear();
    for (const soundId in this.soundPlayers) {
      if (this.soundPlayers.hasOwnProperty(soundId)) {
        this.soundPlayers[soundId].dispose();
      }
    }
    this.soundPlayers = {};
  }
}

class ArrayBufferStream {
  /**
   * ArrayBufferStream wraps the built-in javascript ArrayBuffer, adding the ability to access
   * data in it like a stream, tracking its position.
   * You can request to read a value from the front of the array, and it will keep track of the position
   * within the byte array, so that successive reads are consecutive.
   * The available types to read include:
   * Uint8, Uint8String, Int16, Uint16, Int32, Uint32
   * @param {ArrayBuffer} arrayBuffer - array to use as a stream
   * @param {number} start - the start position in the raw buffer. position
   * will be relative to the start value.
   * @param {number} end - the end position in the raw buffer. length and
   * bytes available will be relative to the end value.
   * @param {ArrayBufferStream} parent - if passed reuses the parent's
   * internal objects
   * @constructor
   */
  constructor(
    arrayBuffer,
    start = 0,
    end = arrayBuffer.byteLength,
    { _uint8View = new Uint8Array(arrayBuffer) } = {}
  ) {
    /**
     * Raw data buffer for stream to read.
     * @type {ArrayBufferStream}
     */
    this.arrayBuffer = arrayBuffer;

    /**
     * Start position in arrayBuffer. Read values are relative to the start
     * in the arrayBuffer.
     * @type {number}
     */
    this.start = start;

    /**
     * End position in arrayBuffer. Length and bytes available are relative
     * to the start, end, and _position in the arrayBuffer;
     * @type {number};
     */
    this.end = end;

    /**
     * Cached Uint8Array view of the arrayBuffer. Heavily used for reading
     * Uint8 values and Strings from the stream.
     * @type {Uint8Array}
     */
    this._uint8View = _uint8View;

    /**
     * Raw position in the arrayBuffer relative to the beginning of the
     * arrayBuffer.
     * @type {number}
     */
    this._position = start;
  }

  /**
   * Return a new ArrayBufferStream that is a slice of the existing one
   * @param  {number} length - the number of bytes of extract
   * @return {ArrayBufferStream} the extracted stream
   */
  extract(length) {
    return new ArrayBufferStream(
      this.arrayBuffer,
      this._position,
      this._position + length,
      this
    );
  }

  /**
   * @return {number} the length of the stream in bytes
   */
  getLength() {
    return this.end - this.start;
  }

  /**
   * @return {number} the number of bytes available after the current position in the stream
   */
  getBytesAvailable() {
    return this.end - this._position;
  }

  /**
   * Position relative to the start value in the arrayBuffer of this
   * ArrayBufferStream.
   * @type {number}
   */
  get position() {
    return this._position - this.start;
  }

  /**
   * Set the position to read from in the arrayBuffer.
   * @type {number}
   * @param {number} value - new value to set position to
   */
  set position(value) {
    this._position = value + this.start;
    return value;
  }

  /**
   * Read an unsigned 8 bit integer from the stream
   * @return {number} the next 8 bit integer in the stream
   */
  readUint8() {
    const val = this._uint8View[this._position];
    this._position += 1;
    return val;
  }

  /**
   * Read a sequence of bytes of the given length and convert to a string.
   * This is a convenience method for use with short strings.
   * @param {number} length - the number of bytes to convert
   * @return {string} a String made by concatenating the chars in the input
   */
  readUint8String(length) {
    const arr = this._uint8View;
    let str = "";
    const end = this._position + length;
    for (let i = this._position; i < end; i++) {
      str += String.fromCharCode(arr[i]);
    }
    this._position += length;
    return str;
  }

  /**
   * Read a 16 bit integer from the stream
   * @return {number} the next 16 bit integer in the stream
   */
  readInt16() {
    const val = new Int16Array(this.arrayBuffer, this._position, 1)[0];
    this._position += 2; // one 16 bit int is 2 bytes
    return val;
  }

  /**
   * Read an unsigned 16 bit integer from the stream
   * @return {number} the next unsigned 16 bit integer in the stream
   */
  readUint16() {
    const val = new Uint16Array(this.arrayBuffer, this._position, 1)[0];
    this._position += 2; // one 16 bit int is 2 bytes
    return val;
  }

  /**
   * Read a 32 bit integer from the stream
   * @return {number} the next 32 bit integer in the stream
   */
  readInt32() {
    let val;
    if (this._position % 4 === 0) {
      val = new Int32Array(this.arrayBuffer, this._position, 1)[0];
    } else {
      // Cannot read Int32 directly out because offset is not multiple of 4
      // Need to slice out the values first
      val = new Int32Array(
        this.arrayBuffer.slice(this._position, this._position + 4)
      )[0];
    }
    this._position += 4; // one 32 bit int is 4 bytes
    return val;
  }

  /**
   * Read an unsigned 32 bit integer from the stream
   * @return {number} the next unsigned 32 bit integer in the stream
   */
  readUint32() {
    const val = new Uint32Array(this.arrayBuffer, this._position, 1)[0];
    this._position += 4; // one 32 bit int is 4 bytes
    return val;
  }
}

/**
 * Data used by the decompression algorithm
 * @type {Array}
 */
const STEP_TABLE = [
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  16,
  17,
  19,
  21,
  23,
  25,
  28,
  31,
  34,
  37,
  41,
  45,
  50,
  55,
  60,
  66,
  73,
  80,
  88,
  97,
  107,
  118,
  130,
  143,
  157,
  173,
  190,
  209,
  230,
  253,
  279,
  307,
  337,
  371,
  408,
  449,
  494,
  544,
  598,
  658,
  724,
  796,
  876,
  963,
  1060,
  1166,
  1282,
  1411,
  1552,
  1707,
  1878,
  2066,
  2272,
  2499,
  2749,
  3024,
  3327,
  3660,
  4026,
  4428,
  4871,
  5358,
  5894,
  6484,
  7132,
  7845,
  8630,
  9493,
  10442,
  11487,
  12635,
  13899,
  15289,
  16818,
  18500,
  20350,
  22385,
  24623,
  27086,
  29794,
  32767,
];

/**
 * Data used by the decompression algorithm
 * @type {Array}
 */
const INDEX_TABLE = [-1, -1, -1, -1, 2, 4, 6, 8, -1, -1, -1, -1, 2, 4, 6, 8];

let _deltaTable = null;

/**
 * Build a table of deltas from the 89 possible steps and 16 codes.
 * @return {Array<number>} computed delta values
 */
const deltaTable = function () {
  if (_deltaTable === null) {
    const NUM_STEPS = STEP_TABLE.length;
    const NUM_INDICES = INDEX_TABLE.length;
    _deltaTable = new Array(NUM_STEPS * NUM_INDICES).fill(0);
    let i = 0;

    for (let index = 0; index < NUM_STEPS; index++) {
      for (let code = 0; code < NUM_INDICES; code++) {
        const step = STEP_TABLE[index];

        let delta = 0;
        if (code & 4) delta += step;
        if (code & 2) delta += step >> 1;
        if (code & 1) delta += step >> 2;
        delta += step >> 3;
        _deltaTable[i++] = code & 8 ? -delta : delta;
      }
    }
  }

  return _deltaTable;
};

/**
 * Decode wav audio files that have been compressed with the ADPCM format.
 * This is necessary because, while web browsers have native decoders for many audio
 * formats, ADPCM is a non-standard format used by Scratch since its early days.
 * This decoder is based on code from Scratch-Flash:
 * https://github.com/LLK/scratch-flash/blob/master/src/sound/WAVFile.as
 */
class ADPCMSoundDecoder {
  /**
   * @param {AudioContext} audioContext - a webAudio context
   * @constructor
   */
  constructor(audioContext) {
    this.audioContext = audioContext;
  }

  /**
   * Data used by the decompression algorithm
   * @type {Array}
   */
  static get STEP_TABLE() {
    return STEP_TABLE;
  }

  /**
   * Data used by the decompression algorithm
   * @type {Array}
   */
  static get INDEX_TABLE() {
    return INDEX_TABLE;
  }

  /**
   * Decode an ADPCM sound stored in an ArrayBuffer and return a promise
   * with the decoded audio buffer.
   * @param  {ArrayBuffer} audioData - containing ADPCM encoded wav audio
   * @return {AudioBuffer} the decoded audio buffer
   */
  decode(audioData) {
    return new Promise((resolve, reject) => {
      const stream = new ArrayBufferStream(audioData);

      const riffStr = stream.readUint8String(4);
      if (riffStr !== "RIFF") {
        console.warn("incorrect adpcm wav header");
        reject();
      }

      const lengthInHeader = stream.readInt32();
      if (lengthInHeader + 8 !== audioData.byteLength) {
        console.warn(
          `adpcm wav length in header: ${lengthInHeader} is incorrect`
        );
      }

      const wavStr = stream.readUint8String(4);
      if (wavStr !== "WAVE") {
        console.warn("incorrect adpcm wav header");
        reject();
      }

      const formatChunk = this.extractChunk("fmt ", stream);
      this.encoding = formatChunk.readUint16();
      this.channels = formatChunk.readUint16();
      this.samplesPerSecond = formatChunk.readUint32();
      this.bytesPerSecond = formatChunk.readUint32();
      this.blockAlignment = formatChunk.readUint16();
      this.bitsPerSample = formatChunk.readUint16();
      formatChunk.position += 2; // skip extra header byte count
      this.samplesPerBlock = formatChunk.readUint16();
      this.adpcmBlockSize = (this.samplesPerBlock - 1) / 2 + 4; // block size in bytes

      const compressedData = this.extractChunk("data", stream);
      const sampleCount = this.numberOfSamples(
        compressedData,
        this.adpcmBlockSize
      );

      const buffer = this.audioContext.createBuffer(
        1,
        sampleCount,
        this.samplesPerSecond
      );
      this.imaDecompress(
        compressedData,
        this.adpcmBlockSize,
        buffer.getChannelData(0)
      );

      resolve(buffer);
    });
  }

  /**
   * Extract a chunk of audio data from the stream, consisting of a set of audio data bytes
   * @param  {string} chunkType - the type of chunk to extract. 'data' or 'fmt' (format)
   * @param  {ArrayBufferStream} stream - an stream containing the audio data
   * @return {ArrayBufferStream} a stream containing the desired chunk
   */
  extractChunk(chunkType, stream) {
    stream.position = 12;
    while (stream.position < stream.getLength() - 8) {
      const typeStr = stream.readUint8String(4);
      const chunkSize = stream.readInt32();
      if (typeStr === chunkType) {
        const chunk = stream.extract(chunkSize);
        return chunk;
      }
      stream.position += chunkSize;
    }
  }

  /**
   * Count the exact number of samples in the compressed data.
   * @param {ArrayBufferStream} compressedData - the compressed data
   * @param {number} blockSize - size of each block in the data in bytes
   * @return {number} number of samples in the compressed data
   */
  numberOfSamples(compressedData, blockSize) {
    if (!compressedData) return 0;

    compressedData.position = 0;

    const available = compressedData.getBytesAvailable();
    const blocks = (available / blockSize) | 0;
    // Number of samples in full blocks.
    const fullBlocks = blocks * (2 * (blockSize - 4)) + 1;
    // Number of samples in the last incomplete block. 0 if the last block
    // is full.
    const subBlock = Math.max((available % blockSize) - 4, 0) * 2;
    // 1 if the last block is incomplete. 0 if it is complete.
    const incompleteBlock = Math.min(available % blockSize, 1);
    return fullBlocks + subBlock + incompleteBlock;
  }

  /**
   * Decompress sample data using the IMA ADPCM algorithm.
   * Note: Handles only one channel, 4-bits per sample.
   * @param  {ArrayBufferStream} compressedData - a stream of compressed audio samples
   * @param  {number} blockSize - the number of bytes in the stream
   * @param  {Float32Array} out - the uncompressed audio samples
   */
  imaDecompress(compressedData, blockSize, out) {
    let sample;
    let code;
    let delta;
    let index = 0;
    let lastByte = -1; // -1 indicates that there is no saved lastByte

    // Bail and return no samples if we have no data
    if (!compressedData) return;

    compressedData.position = 0;

    const size = out.length;
    const samplesAfterBlockHeader = (blockSize - 4) * 2;

    const DELTA_TABLE = deltaTable();

    let i = 0;
    while (i < size) {
      // read block header
      sample = compressedData.readInt16();
      index = compressedData.readUint8();
      compressedData.position++; // skip extra header byte
      if (index > 88) index = 88;
      out[i++] = sample / 32768;

      const blockLength = Math.min(samplesAfterBlockHeader, size - i);
      const blockStart = i;
      while (i - blockStart < blockLength) {
        // read 4-bit code and compute delta from previous sample
        lastByte = compressedData.readUint8();
        code = lastByte & 0xf;
        delta = DELTA_TABLE[index * 16 + code];
        // compute next index
        index += INDEX_TABLE[code];
        if (index > 88) index = 88;
        else if (index < 0) index = 0;
        // compute and output sample
        sample += delta;
        if (sample > 32767) sample = 32767;
        else if (sample < -32768) sample = -32768;
        out[i++] = sample / 32768;

        // use 4-bit code from lastByte and compute delta from previous
        // sample
        code = (lastByte >> 4) & 0xf;
        delta = DELTA_TABLE[index * 16 + code];
        // compute next index
        index += INDEX_TABLE[code];
        if (index > 88) index = 88;
        else if (index < 0) index = 0;
        // compute and output sample
        sample += delta;
        if (sample > 32767) sample = 32767;
        else if (sample < -32768) sample = -32768;
        out[i++] = sample / 32768;
      }
    }
  }
}

/**
 * 表示播放已结束的事件的名称.
 * @const {string}
 */
const ON_ENDED = "ended";

class SoundPlayer extends EventEmitter {
  /**
   * Play sounds that stop without audible clipping.
   *
   * @param {AudioEngine} audioEngine - engine to play sounds on
   * @param {object} data - required data for sound playback
   * @param {string} data.id - a unique id for this sound
   * @param {ArrayBuffer} data.buffer - buffer of the sound's waveform to play
   * @constructor
   */
  constructor(audioEngine, { id, buffer }) {
    super();

    /**
     * Unique sound identifier set by AudioEngine.
     * @type {string}
     */
    this.id = id;

    /**
     * AudioEngine creating this sound player.
     * @type {AudioEngine}
     */
    this.audioEngine = audioEngine;

    /**
     * Decoded audio buffer from audio engine for playback.
     * @type {AudioBuffer}
     */
    this.buffer = buffer;

    /**
     * Output audio node.
     * @type {AudioNode}
     */
    this.outputNode = null;

    /**
     * VolumeEffect used to fade out playing sounds when stopping them.
     * @type {VolumeEffect}
     */
    this.volumeEffect = null;

    /**
     * Target engine, effect, or chain this player directly connects to.
     * @type {AudioEngine|Effect|EffectChain}
     */
    this.target = null;

    /**
     * Internally is the SoundPlayer initialized with at least its buffer
     * source node and output node.
     * @type {boolean}
     */
    this.initialized = false;

    /**
     * Is the sound playing or starting to play?
     * @type {boolean}
     */
    this.isPlaying = false;

    /**
     * Timestamp sound is expected to be starting playback until. Once the
     * future timestamp is reached the sound is considered to be playing
     * through the audio hardware and stopping should fade out instead of
     * cutting off playback.
     * @type {number}
     */
    this.startingUntil = 0;

    /**
     * Rate to play back the audio at.
     * @type {number}
     */
    this.playbackRate = 1;

    // handleEvent is a EventTarget api for the DOM, however the
    // web-audio-test-api we use uses an addEventListener that isn't
    // compatable with object and requires us to pass this bound function
    // instead
    this.handleEvent = this.handleEvent.bind(this);
  }

  /**
   * Is plaback currently starting?
   * @type {boolean}
   */
  get isStarting() {
    return this.isPlaying && this.startingUntil > this.audioEngine.currentTime;
  }

  /**
   * Handle any event we have told the output node to listen for.
   * @param {Event} event - dom event to handle
   */
  handleEvent(event) {
    if (event.type === ON_ENDED) {
      this.onEnded();
    }
  }

  /**
   * Event listener for when playback ends.
   */
  onEnded() {
    this.emit("stop");

    this.isPlaying = false;
  }

  /**
   * Create the buffer source node during initialization or secondary
   * playback.
   */
  _createSource() {
    if (this.outputNode !== null) {
      this.outputNode.removeEventListener(ON_ENDED, this.handleEvent);
      this.outputNode.disconnect();
    }

    this.outputNode = this.audioEngine.audioContext.createBufferSource();
    this.outputNode.playbackRate.value = this.playbackRate;
    this.outputNode.buffer = this.buffer;

    this.outputNode.addEventListener(ON_ENDED, this.handleEvent);

    if (this.target !== null) {
      this.connect(this.target);
    }
  }

  /**
   * Initialize the player for first playback.
   */
  initialize() {
    this.initialized = true;

    this._createSource();
  }

  /**
   * Connect the player to the engine or an effect chain.
   * @param {object} target - object to connect to
   * @returns {object} - return this sound player
   */
  connect(target) {
    if (target === this.volumeEffect) {
      this.outputNode.disconnect();
      this.outputNode.connect(this.volumeEffect.getInputNode());
      return;
    }

    this.target = target;

    if (!this.initialized) {
      return;
    }

    if (this.volumeEffect === null) {
      this.outputNode.disconnect();
      this.outputNode.connect(target.getInputNode());
    } else {
      this.volumeEffect.connect(target);
    }

    return this;
  }

  /**
   * Teardown the player.
   */
  dispose() {
    if (!this.initialized) {
      return;
    }

    this.stopImmediately();

    if (this.volumeEffect !== null) {
      this.volumeEffect.dispose();
      this.volumeEffect = null;
    }

    this.outputNode.disconnect();
    this.outputNode = null;

    this.target = null;

    this.initialized = false;
  }

  /**
   * Take the internal state of this player and create a new player from
   * that. Restore the state of this player to that before its first playback.
   *
   * The returned player can be used to stop the original playback or
   * continue it without manipulation from the original player.
   *
   * @returns {SoundPlayer} - new SoundPlayer with old state
   */
  take() {
    if (this.outputNode) {
      this.outputNode.removeEventListener(ON_ENDED, this.handleEvent);
    }

    const taken = new SoundPlayer(this.audioEngine, this);
    taken.playbackRate = this.playbackRate;
    if (this.isPlaying) {
      taken.startingUntil = this.startingUntil;
      taken.isPlaying = this.isPlaying;
      taken.initialized = this.initialized;
      taken.outputNode = this.outputNode;
      taken.outputNode.addEventListener(ON_ENDED, taken.handleEvent);
      taken.volumeEffect = this.volumeEffect;
      if (taken.volumeEffect) {
        taken.volumeEffect.audioPlayer = taken;
      }
      if (this.target !== null) {
        taken.connect(this.target);
      }

      this.emit("stop");
      taken.emit("play");
    }

    this.outputNode = null;
    this.volumeEffect = null;
    this.initialized = false;
    this.startingUntil = 0;
    this.isPlaying = false;

    return taken;
  }

  /**
   * Start playback for this sound.
   *
   * If the sound is already playing it will stop playback with a quick fade
   * out.
   */
  play() {
    if (this.isStarting) {
      this.emit("stop");
      this.emit("play");
      return;
    }

    if (this.isPlaying) {
      this.stop();
    }

    if (this.initialized) {
      this._createSource();
    } else {
      this.initialize();
    }

    this.outputNode.start();

    this.isPlaying = true;

    const { currentTime, DECAY_DURATION } = this.audioEngine;
    this.startingUntil = currentTime + DECAY_DURATION;

    this.emit("play");
  }

  /**
   * Stop playback after quickly fading out.
   */
  stop() {
    if (!this.isPlaying) {
      return;
    }

    // always do a manual stop on a taken / volume effect fade out sound
    // player take will emit "stop" as well as reset all of our playing
    // statuses / remove our nodes / etc
    const taken = this.take();
    taken.volumeEffect = new VolumeEffect(taken.audioEngine, taken, null);

    taken.volumeEffect.connect(taken.target);
    // volumeEffect will recursively connect to us if it needs to, so this
    // happens too:
    // taken.connect(taken.volumeEffect);

    taken.finished().then(() => taken.dispose());

    taken.volumeEffect.set(0);
    const { currentTime, DECAY_DURATION } = this.audioEngine;
    taken.outputNode.stop(currentTime + DECAY_DURATION);
  }

  /**
   * Stop immediately without fading out. May cause audible clipping.
   */
  stopImmediately() {
    if (!this.isPlaying) {
      return;
    }

    this.outputNode.stop();

    this.isPlaying = false;
    this.startingUntil = 0;

    this.emit("stop");
  }

  /**
   * Return a promise that resolves when the sound next finishes.
   * @returns {Promise} - resolves when the sound finishes
   */
  finished() {
    return new Promise((resolve) => {
      this.once("stop", resolve);
    });
  }

  /**
   * Set the sound's playback rate.
   * @param {number} value - playback rate. Default is 1.
   */
  setPlaybackRate(value) {
    this.playbackRate = value;

    if (this.initialized) {
      this.outputNode.playbackRate.value = value;
    }
  }
}

/**
 * Legal characters for the unique ID.
 * Should be all on a US keyboard.  No XML special characters or control codes.
 * Removed $ due to issue 251.
 * @private
 */
const soup_ =
  "!#%()*+,-./:;=?@[]^_`{|}~" +
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Generate a unique ID, from Blockly.  This should be globally unique.
 * 87 characters ^ 20 length > 128 bits (better than a UUID).
 * @return {string} A globally unique ID string.
 */
const uid = function () {
  const length = 20;
  const soupLength = soup_.length;
  const id = [];
  for (let i = 0; i < length; i++) {
    id[i] = soup_.charAt(Math.random() * soupLength);
  }
  return id.join("");
};

/**
 * Wrapper to ensure that audioContext.decodeAudioData is a promise
 * @param {object} audioContext The current AudioContext
 * @param {ArrayBuffer} buffer Audio data buffer to decode
 * @return {Promise} A promise that resolves to the decoded audio
 */
const decodeAudioData = function (audioContext, buffer) {
  // Check for newer promise-based API
  if (audioContext.decodeAudioData.length === 1) {
    return audioContext.decodeAudioData(buffer);
  }
  // Fall back to callback API
  return new Promise((resolve, reject) => {
    audioContext.decodeAudioData(
      buffer,
      (decodedAudio) => resolve(decodedAudio),
      (error) => reject(error)
    );
  });
};

var OfflineContext =
  window.OfflineAudioContext || window.webkitOfflineAudioContext;
var Context = window.AudioContext || window.webkitAudioContext;

var cache = {};

function getContext(options) {
  if (!Context) return null;

  if (typeof options === "number") {
    options = { sampleRate: options };
  }

  var sampleRate = options && options.sampleRate;

  if (options && options.offline) {
    if (!OfflineContext) return null;

    return new OfflineContext(
      options.channels || 2,
      options.length,
      sampleRate || 44100
    );
  }

  //cache by sampleRate, rather strong guess
  var ctx = cache[sampleRate];

  if (ctx) return ctx;

  //several versions of firefox have issues with the
  //constructor argument
  //see: https://bugzilla.mozilla.org/show_bug.cgi?id=1361475
  try {
    ctx = new Context(options);
  } catch (err) {
    ctx = new Context();
  }
  cache[ctx.sampleRate] = cache[sampleRate] = ctx;

  return ctx;
}

/**
 * There is a single instance of the AudioEngine. It handles global audio
 * properties and effects, loads all the audio buffers for sounds belonging to
 * sprites.
 */
class AudioEngine {
  constructor(audioContext = getContext()) {
    /**
     * AudioContext to play and manipulate sounds with a graph of source
     * and effect nodes.
     * @type {AudioContext}
     */
    this.audioContext = audioContext;
    // StartAudioContext(this.audioContext);

    /**
     * Master GainNode that all sounds plays through. Changing this node
     * will change the volume for all sounds.
     * @type {GainNode}
     */
    this.inputNode = this.audioContext.createGain();
    this.inputNode.connect(this.audioContext.destination);

    /**
     * a map of soundIds to audio buffers, holding sounds for all sprites
     * @type {Object<String, ArrayBuffer>}
     */
    this.audioBuffers = {};

    /**
     * A Loudness detector.
     * @type {Loudness}
     */
    this.loudness = null;

    /**
     * Array of effects applied in order, left to right,
     * Left is closest to input, Right is closest to output
     */
    this.effects = [PanEffect, PitchEffect, VolumeEffect];
  }

  /**
   * Current time in the AudioEngine.
   * @type {number}
   */
  get currentTime() {
    return this.audioContext.currentTime;
  }

  /**
   * Names of the audio effects.
   * @enum {string}
   */
  get EFFECT_NAMES() {
    return {
      pitch: "pitch",
      pan: "pan",
    };
  }

  /**
   * A short duration to transition audio prarameters.
   *
   * Used as a time constant for exponential transitions. A general value
   * must be large enough that it does not cute off lower frequency, or bass,
   * sounds. Human hearing lower limit is ~20Hz making a safe value 25
   * milliseconds or 0.025 seconds, where half of a 20Hz wave will play along
   * with the DECAY. Higher frequencies will play multiple waves during the
   * same amount of time and avoid clipping.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime}
   * @const {number}
   */
  get DECAY_DURATION() {
    return 0.025;
  }

  /**
   * Some environments cannot smoothly change parameters immediately, provide
   * a small delay before decaying.
   *
   * @see {@link https://bugzilla.mozilla.org/show_bug.cgi?id=1228207}
   * @const {number}
   */
  get DECAY_WAIT() {
    return 0.05;
  }

  /**
   * Get the input node.
   * @return {AudioNode} - audio node that is the input for this effect
   */
  getInputNode() {
    return this.inputNode;
  }

  /**
   * Decode a sound, decompressing it into audio samples.
   * @param {object} sound - an object containing audio data and metadata for
   *     a sound
   * @param {Buffer} sound.data - sound data loaded from scratch-storage
   * @returns {?Promise} - a promise which will resolve to the sound id and
   *     buffer if decoded
   */
  _decodeSound(sound) {
    // Make a copy of the buffer because decoding detaches the original
    // buffer
    const bufferCopy1 = sound.data.buffer.slice(0);

    // todo: multiple decodings of the same buffer create duplicate decoded
    // copies in audioBuffers. Create a hash id of the buffer or deprecate
    // audioBuffers to avoid memory issues for large audio buffers.
    const soundId = uid();

    // Attempt to decode the sound using the browser's native audio data
    // decoder If that fails, attempt to decode as ADPCM
    const decoding = decodeAudioData(this.audioContext, bufferCopy1)
      .catch(() => {
        // If the file is empty, create an empty sound
        if (sound.data.length === 0) {
          return this._emptySound();
        }

        // The audio context failed to parse the sound data
        // we gave it, so try to decode as 'adpcm'

        // First we need to create another copy of our original data
        const bufferCopy2 = sound.data.buffer.slice(0);
        // Try decoding as adpcm
        return new ADPCMSoundDecoder(this.audioContext)
          .decode(bufferCopy2)
          .catch(() => this._emptySound());
      })
      .then(
        (buffer) => [soundId, buffer],
        (error) => {
          console.warn("audio data could not be decoded", error);
        }
      );

    return decoding;
  }

  /**
   * An empty sound buffer, for use when we are unable to decode a sound file.
   * @returns {AudioBuffer} - an empty audio buffer.
   */
  _emptySound() {
    return this.audioContext.createBuffer(1, 1, this.audioContext.sampleRate);
  }

  /**
   * Decode a sound, decompressing it into audio samples.
   *
   * Store a reference to it the sound in the audioBuffers dictionary,
   * indexed by soundId.
   *
   * @param {object} sound - an object containing audio data and metadata for
   *     a sound
   * @param {Buffer} sound.data - sound data loaded from scratch-storage
   * @returns {?Promise} - a promise which will resolve to the sound id
   */
  decodeSound(sound) {
    return this._decodeSound(sound).then(([id, buffer]) => {
      this.audioBuffers[id] = buffer;
      return id;
    });
  }

  /**
   * Decode a sound, decompressing it into audio samples.
   *
   * Create a SoundPlayer instance that can be used to play the sound and
   * stop and fade out playback.
   *
   * @param {object} sound - an object containing audio data and metadata for
   *     a sound
   * @param {Buffer} sound.data - sound data loaded from scratch-storage
   * @returns {?Promise} - a promise which will resolve to the buffer
   */
  decodeSoundPlayer(sound) {
    return this._decodeSound(sound).then(
      ([id, buffer]) => new SoundPlayer(this, { id, buffer })
    );
  }

  /**
   * Get the current loudness of sound received by the microphone.
   * Sound is measured in RMS and smoothed.
   * @return {number} loudness scaled 0 to 100
   */
  getLoudness() {
    // The microphone has not been set up, so try to connect to it
    if (!this.loudness) {
      this.loudness = new Loudness(this.audioContext);
    }

    return this.loudness.getLoudness();
  }

  /**
   * Create an effect chain.
   * @returns {EffectChain} chain of effects defined by this AudioEngine
   */
  createEffectChain() {
    const effects = new EffectChain(this, this.effects);
    effects.connect(this);
    return effects;
  }

  /**
   * Create a sound bank and effect chain.
   * @returns {SoundBank} a sound bank configured with an effect chain
   *     defined by this AudioEngine
   */
  createBank() {
    return new SoundBank(this, this.createEffectChain());
  }
}
