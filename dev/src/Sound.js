/* jshint newcap: false */
/**
 * サウンドクラス。
 * WebAudio API が利用できるならば, WebAudioSound, DOMSound へのエイリアスとなる。
 * @class
 * @type {*}
 */
enchant.Sound = window.AudioContext && enchant.ENV.USE_WEBAUDIO ? enchant.WebAudioSound : enchant.DOMSound;
