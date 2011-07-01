package {
    import flash.display.*;
    import flash.events.*;
    import flash.external.*;
    import flash.net.*;
    import flash.media.*;
    import flash.system.*;

    public class sound extends Sprite {

        private var _sound:Sound;
        private var channel:SoundChannel = new SoundChannel();
        private var position:Number = 0;
        private var volume:Number = 1;
        private var playing:Boolean = false;

        public function sound() {
            Security.allowDomain('*');

            var id:String = root.loaderInfo.parameters.id;
            var src:String = root.loaderInfo.parameters.src;
            _sound = new Sound(new URLRequest(src));
            _sound.addEventListener(Event.COMPLETE, function(e:Event):void {
                ExternalInterface.call([
                    'function() {',
                        'enchant.Sound["', id, '"].dispatchEvent(new Event("load"));',
                    '}'
                ].join(''));

                ExternalInterface.addCallback('play', play);
                ExternalInterface.addCallback('pause', pause);
                ExternalInterface.addCallback('stop', stop);
                ExternalInterface.addCallback('getCurrentTime', getCurrentTime);
                ExternalInterface.addCallback('setCurrentTime', setCurrentTime);
                ExternalInterface.addCallback('getDuration', getDuration);
                ExternalInterface.addCallback('getVolume', getVolume);
                ExternalInterface.addCallback('setVolume', setVolume);
            });
            _sound.addEventListener(IOErrorEvent.IO_ERROR, function(e:Event):void {
                ExternalInterface.call([
                    'function() {',
                        'throw new Error("Cannot load an asset: ', src, '");',
                    '}'
                ].join(''));
            });
        }

        public function play():void {
            channel = _sound.play(position);
            setVolume(volume);
            playing = true;
        }

        public function pause():void {
            position = channel.position;
            channel.stop();
            playing = false;
        }

        public function stop():void {
            position = 0;
            channel.stop();
            playing = false;
        }

        public function getCurrentTime():Number {
            return (playing ? channel.position : position) / 1000;
        }

        public function setCurrentTime(time:Number):void {
            position = time * 1000;
            if (position > _sound.length) position = _sound.length;
            if (position < 0) position = 0;
            if (playing) play();
        }

        public function getDuration():Number {
            return _sound.length / 1000;
        }

        public function getVolume():Number {
            return volume;
        }

        public function setVolume(vol:Number):void {
            volume = vol;
            var transform:SoundTransform = channel.soundTransform;
            if (vol < 0) vol = 0;
            if (vol > 1) vol = 1;
            transform.volume = vol;
            channel.soundTransform = transform;
        }
    }
}
