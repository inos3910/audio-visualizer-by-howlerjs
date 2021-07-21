import {Howl, Howler} from 'howler';

export class Main {
  constructor() {
    this.createVisualizerData();
    this.fadeOutAudioListner()
  }

  //オーディオビジュアライザーで扱うデータを生成
  createVisualizerData(){
    this.loading    = false;
    this.audio      = null;
    this.drawTimer  = null;
    this.playButton = document.getElementById('js-play');
    this.svg        = document.getElementById('js-svg');
    this.svgPath    = this.svg.querySelector('path');
    this.sound      = new Howl({
      // src : ['assets/audio/audio.mp3']
      src : ['https://pool.anison.fm:9000/AniSonFM(320)'],
      html5: true
    });
  }

  //フェードアウト後の処理
  fadeOutAudioListner(){
    this.sound.on('fade', () => {
      this.sound.stop(this.playingSound);
      this.playButton.classList.remove('is-play');
    }, this.playingSound);
  }

  playAudioHandler(){
    if (this.sound.playing()){
      this.stopAudio();
    }
    else{
      this.playAudio();
    }
  }

  //音源を停止
  stopAudio(duration = 300){
    //フェードアウト
    this.sound.fade(1, 0, duration, this.playingSound);
    //gainNodeをendTime（第二引数）までに0（第一引数）にする
    this.gainNode.gain.linearRampToValueAtTime(0, Howler.ctx.currentTime + 2 );
  }

  //音源を再生
  playAudio() {
    this.loading = true;
    this.playButton.classList.add('is-loading');
    this.sound.load();
    this.initAudioVisualizer();
    this.playingSound = this.sound.play();
    this.playButton.classList.add('is-play');
    this.drawAudioVisualizer();
  }

  //オーディオビジュアライザーの初期設定 各ノードをつなぐ
  initAudioVisualizer(){
    //音源を視覚化するために波形データの配列を取得する
    this.analyserNode = Howler.ctx.createAnalyser();

    this.audio = !this.audio ? Howler._html5AudioPool.slice(-1)[0] : this.audio;
    this.audio.crossOrigin = 'anonymous';
    this.sourceAudio = !this.sourceAudio ? Howler.ctx.createMediaElementSource(this.audio): this.sourceAudio;
    this.sourceAudio.connect(this.analyserNode);

    const source = Howler.ctx.createBufferSource();
    const mediaStreamDest = Howler.ctx.createMediaStreamDestination();
    source.connect(mediaStreamDest);
    const {stream} = mediaStreamDest;
    const input  = Howler.ctx.createMediaStreamSource(stream);
    input.connect(this.analyserNode);

    this.freqs = new Uint8Array(this.analyserNode.frequencyBinCount);
    this._freqs = new Uint8Array(1);

    //ボリュームコントローラ
    Howler.ctx.createGain = Howler.ctx.createGain || Howler.ctx.createGainNode;
    this.gainNode = Howler.ctx.createGain();
    this.gainNode.gain.setValueAtTime(1, Howler.ctx.currentTime);
    //各ノードをつなぐ
    Howler.masterGain.connect(this.analyserNode);
    this.analyserNode.connect(this.gainNode);
    this.gainNode.connect(Howler.ctx.destination);
  }

  //オーディオビジュアライザーのSVGを描画
  drawAudioVisualizer(){
    //gainが0になるとアニメーションを終了
    if(this.gainNode.gain.value === 0){
      if(this.drawTimer){
        window.cancelAnimationFrame(this.drawTimer);
        return;
      }
    }
    // 0~1 0に近い方が描画がスムーズになる
    this.analyserNode.smoothingTimeConstant = 0.05;
    // FFTサイズ
    this.analyserNode.fftSize = 1024;
    // 周波数領域の波形データを引数の配列に格納する
    this.analyserNode.getByteFrequencyData(this.freqs);
    this.analyserNode.getByteFrequencyData(this._freqs)

    if(this._freqs[0]){
      this.loading = false;
      this.playButton.classList.remove('is-loading');
    }

    //SVG横幅が波形データに対してどのくらいの長さになるか
    const barWidth = this.svg.width.baseVal.value * 1.5 / this.analyserNode.frequencyBinCount;

    //SVGのpathに適用
    this.drawSvgPath(barWidth);

    //毎フレームごとに描画
    this.drawTimer = window.requestAnimationFrame(this.drawAudioVisualizer.bind(this));
  }

  //SVGパスを描画
  drawSvgPath(barWidth){
    let d = 'M';
    this.freqs.forEach((y, i) => {
      // if(i % 3 === 0){
      //   return;
      // }
      const x       = i * barWidth;
      const value   = this.freqs[i];
      const percent = value / 255;
      const yBase   = i % 2 === 0 ? 1 : -1
      const height  = this.svg.height.baseVal.value/2 + (this.svg.height.baseVal.value/2 * percent * -1) * yBase * this.gainNode.gain.value;
      d += `${x} ${height},`;
    });
    this.svgPath.setAttribute('d', d);
  }
}

export default Main;