package {
    import flash.display.*;
    import flash.events.*;
    import flash.external.*;
    import flash.net.*;
    import flash.media.*;
    import flash.system.*;

    public class sound extends Sprite {

        private var _sound:Sound;
        private var channel:SoundChannel;
        private var position:Number = 0;
        private var volume:Number = 1;
        private var playing:Boolean = false;

        public function sound() {
            Security.allowDomain('*');

            var id:String = root.loaderInfo.parameters.id;
            _sound = new Sound(new URLRequest(root.loaderInfo.parameters.src));
            _sound.addEventListener(Event.COMPLETE, function(e:Event):void {
                ExternalInterface.call([
                    'function() {',
                        'var sound = enchant.Sound["', id, '"];',
                        'sound.duration = ', _sound.length / 1000, ';',
                        'sound.dispatchEvent(new Event("load"));',
                    '}'
                ].join(''));

                ExternalInterface.addCallback('play', play);
                ExternalInterface.addCallback('pause', pause);
                ExternalInterface.addCallback('stop', stop);
                ExternalInterface.addCallback('getCurrentTime', getCurrentTime);
                ExternalInterface.addCallback('setCurrentTime', setCurrentTime);
                ExternalInterface.addCallback('getVolume', getVolume);
                ExternalInterface.addCallback('setVolume', setVolume);
            });
            _sound.addEventListener(IOErrorEvent.IO_ERROR, function(e:Event):void {
                ExternalInterface.call([
                    'function() {',
                        'enchant._sound["', id, '"].dispatchEvent(new Event("error"));',
                    '}'
                ].join(''));
            });
        }

        public function play():void {
            if (!playing) {
                channel = _sound.play(position);
                setVolume(volume);
                playing = true;
            }
        }

        public function pause():void {
            if (playing) {
                position = channel.position;
                channel.stop();
                playing = false;
            }
        }

        public function stop():void {
            if (playing) {
                channel.stop();
                playing = false;
            }
            position = 0;
        }

        public function getCurrentTime():Number {
            return (playing ? channel.position : position) / 1000;
        }

        public function setCurrentTime(time:Number):void {
            if (playing) {
                channel.stop();
                channel = _sound.play(time * 1000);
            } else {
                position = time * 1000;
            }
        }

        public function getVolume():Number {
            return volume;
        }

        public function setVolume(vol:Number):void {
            volume = vol;
            if (playing) {
                var transform:SoundTransform = channel.soundTransform;
                if (vol < 0) vol = 0;
                if (vol > 1) vol = 1;
                transform.volume = vol;
                channel.soundTransform = transform;
            }
        }
    }
}
