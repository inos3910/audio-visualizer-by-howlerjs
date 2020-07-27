import {Howl, Howler} from 'howler';

export class Main {
  constructor() {
    this.createVisualizerData();
    this.fadeOutAudioListner()
  }

  //オーディオビジュアライザーで扱うデータを生成
  createVisualizerData(){
    this.drawTimer  = null;
    this.playButton = document.getElementById('js-play');
    this.svg        = document.getElementById('js-svg');
    this.svgPath    = this.svg.querySelector('path');
    this.sound      = new Howl({
      src : ['assets/audio/audio.mp3']
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
  stopAudio(duration = 1000){
    this.sound.fade(1, 0, duration, this.playingSound);
    this.gainNode.gain.linearRampToValueAtTime(0, Howler.ctx.currentTime + 1 );
  }

  //音源を再生
  playAudio() {
    this.initAudioVisualizer();
    this.sound.load();
    this.playingSound = this.sound.play();
    this.playButton.classList.add('is-play');
    this.drawAudioVisualizer();
  }

  //オーディオビジュアライザーの初期設定 各ノードをつなぐ
  initAudioVisualizer(){
    this.analyserNode = Howler.ctx.createAnalyser();
    this.freqs = new Uint8Array(this.analyserNode.frequencyBinCount);

    this.gainNode = Howler.ctx.createGain();
    this.gainNode.gain.setValueAtTime(1, Howler.ctx.currentTime);

    Howler.masterGain.connect(this.analyserNode);
    this.analyserNode.connect(this.gainNode);
    this.gainNode.connect(Howler.ctx.destination);
  }

  //オーディオビジュアライザーのSVGを描画
  drawAudioVisualizer(){
    if(this.gainNode.gain.value === 0){
      if(this.drawTimer){
        window.cancelAnimationFrame(this.drawTimer);
        return;
      }
    }
    // 0~1まで設定でき、0に近いほど描画の更新がスムーズになり, 1に近いほど描画の更新が鈍くなる
    this.analyserNode.smoothingTimeConstant = 0.1;
    // FFTサイズ
    this.analyserNode.fftSize = 2048 * 2;
    // 周波数領域の波形データを引数の配列に格納する
    this.analyserNode.getByteFrequencyData(this.freqs);
    const barWidth = this.svg.width.baseVal.value * 2 / this.analyserNode.frequencyBinCount;
    //SVGのpathに適用（左）
    let ld = 'M';
    this.freqs.forEach((y, i) => {
      if(i % 3 === 0){
        return;
      }
      const x       = i * barWidth;
      const value   = this.freqs[i];
      const percent = value / 255;
      const yBase   = i % 2 === 0 ? 1 : -1
      const height  = this.svg.height.baseVal.value/2 + (this.svg.height.baseVal.value/2 * percent * -1) * yBase * this.gainNode.gain.value;
      ld += `${x} ${height},`;
    });
    this.svgPath.setAttribute('d', ld);

    this.drawTimer = window.requestAnimationFrame(this.drawAudioVisualizer.bind(this));
  }
}

export default Main;