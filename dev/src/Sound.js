/* jshint newcap: false */

enchant.Sound = window.AudioContext && enchant.ENV.USE_WEBAUDIO ? enchant.WebAudioSound : enchant.DOMSound;