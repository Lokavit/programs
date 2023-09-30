const StringUtil = require("../util/string-util");

/**
 * Initialize a sound from an asset asynchronously.
 * @param {!object} sound - the Scratch sound object.
 * @property {string} md5 - the MD5 and extension of the sound to be loaded.
 * @property {Buffer} data - sound data will be written here once loaded.
 * @param {!Asset} soundAsset - the asset loaded from storage.
 * @param {!Runtime} runtime - Scratch runtime, used to access the storage module.
 * @param {SoundBank} soundBank - Scratch Audio SoundBank to add sounds to.
 * @returns {!Promise} - a promise which will resolve to the sound when ready.
 */
const loadSoundFromAsset = function (sound, soundAsset, runtime, soundBank) {
  sound.assetId = soundAsset.assetId;
  if (!runtime.audioEngine) {
    console.error(
      "No audio engine present; cannot load sound asset: ",
      sound.md5
    );
    return Promise.resolve(sound);
  }
  return runtime.audioEngine
    .decodeSoundPlayer(Object.assign({}, sound, { data: soundAsset.data }))
    .then((soundPlayer) => {
      sound.soundId = soundPlayer.id;
      // 由于声音被音频引擎重新采样，因此根据来自音频引擎的音频缓冲区设置声音采样率和采样计数
      const soundBuffer = soundPlayer.buffer;
      sound.rate = soundBuffer.sampleRate;
      sound.sampleCount = soundBuffer.length;

      if (soundBank !== null) {
        soundBank.addSoundPlayer(soundPlayer);
      }

      return sound;
    });
};

/**
 * Load a sound's asset into memory asynchronously.
 * @param {!object} sound - the Scratch sound object.
 * @property {string} md5 - the MD5 and extension of the sound to be loaded.
 * @property {Buffer} data - sound data will be written here once loaded.
 * @param {!Runtime} runtime - Scratch runtime, used to access the storage module.
 * @param {SoundBank} soundBank - Scratch Audio SoundBank to add sounds to.
 * @returns {!Promise} - a promise which will resolve to the sound when ready.
 */
const loadSound = function (sound, runtime, soundBank) {
  if (!runtime.storage) {
    console.error(
      "No storage module present; cannot load sound asset: ",
      sound.md5
    );
    return Promise.resolve(sound);
  }
  const idParts = StringUtil.splitFirst(sound.md5, ".");
  const md5 = idParts[0];
  const ext = idParts[1].toLowerCase();
  sound.dataFormat = ext;
  return (
    (sound.asset && Promise.resolve(sound.asset)) ||
    runtime.storage.load(runtime.storage.AssetType.Sound, md5, ext)
  ).then((soundAsset) => {
    sound.asset = soundAsset;
    return loadSoundFromAsset(sound, soundAsset, runtime, soundBank);
  });
};

module.exports = {
  loadSound,
  loadSoundFromAsset,
};
