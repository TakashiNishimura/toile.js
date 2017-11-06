/***********************************************
 * Screen Class (ver.2017-10-30TXX:XX)
 * 
 *  <constructor>
 *      new SpriteSheetPlus(_path, _isAnimate=false, _rectFillColor="255,255,255", _rectLineColor="0,0,0", _rectLineWidth=4)
 * 
 *  <public method>
 *      SpriteSheetPlus.in(_sec=1)
 *      SpriteSheetPlus.out(_sec=1)
 *
 *  <event>
 *      SpriteSheetPlus.DELETE
 * 
***********************************************/

class Screen {
    static get CLOSE() { return "close"; }

    constructor(_canvas, _bitmap, _size="standard") { //or "wide"
        this.__canvas = _canvas;
        this.__bitmap = _bitmap;
        this.__size = _size; //"standard" or "wide"
        this.__closeHandler = undefined;
    }

    //=======================================
    // (2) ユーザによるイベントリスナーの定義
    //=======================================
    addEventListener(_event, _function) {
        if (_event == "close") {
            this.__closeHandler = _function;
        }
    }

    //======================
    // Screen.open()メソッド
    //======================
    open() {
        //Smallビデオのロード開始
        let _videoName = this.__bitmap.name;
        if (this.__size == "standard") {
            //console.log("A");
            this.__smallVideo = new toile.Video("mp4/" + _videoName + "_small.mp4", 480, 360);
        } else { //"wide"
            //console.log("B");
            this.__smallVideo = new toile.Video("mp4/" + _videoName + "_small.mp4", 640, 360);
        }
        this.__smallVideo.stop();
        //console.log(this.__smallVideo.autoPlay);

        //背景を暗転
        this.__bg = new toile.Rect(0, 0, this.__canvas.width, this.__canvas.height);
        this.__bg.isFill(true);
        this.__bg.fillColor = "0,0,0";
        this.__bg.lineColor = "0,0,0";
        this.__bg.alpha = 0.7;
        this.__canvas.addChild(this.__bg);

        //作品ボタンと同じサイズのスクリーンを表示
        this.__screen1 = new toile.Rect(this.__bitmap.x, this.__bitmap.y, this.__bitmap.x+140, this.__bitmap.y+200);
        this.__screen1.isFill(true);
        this.__screen1.fillColor = "254,254,254";
        this.__screen1.lineWidth = 2;
        this.__screen1.lineColor = "204,204,204";
        this.__screen1.alpha = 0.5;
        this.__canvas.addChild(this.__screen1);

        //スクリーンが拡大するアニメーションの開始
        var _sec = 2;
        this.__loopCount = 0;

        this.__timeOut1ID = setTimeout(this.__timeOut1, 700, this); //少し遅らせてScreenを拡大

        if (this.__size == "standard") {
            this.__disStartX = 440 - this.__screen1.startX;
            this.__disStartY = 204 - this.__screen1.startY;
            this.__disEndX = 920 - this.__screen1.endX;
            this.__disEndY = 564 - this.__screen1.endY;
        } else { //"wide"
            this.__disStartX = 360 - this.__screen1.startX;
            this.__disStartY = 204 - this.__screen1.startY;
            this.__disEndX = 1000 - this.__screen1.endX;
            this.__disEndY = 564 - this.__screen1.endY;
        }
        this.__originStartX = this.__screen1.startX;
        this.__originStartY = this.__screen1.startY;
        this.__originEndX = this.__screen1.endX;
        this.__originEndY = this.__screen1.endY;

        // //_hoge = new toile.Rect(440,204,920,564); //4:3 small
        // //_hoge = new toile.Rect(360,204,1000,564); //16:9 small
        // //_hoge = new toile.Rect(200,24,1160,744); //4:3 Big
        // //_hoge = new toile.Rect(40,24,1320,744); //16:9 Big
    }

    //================================================
    // 作品ボタンをタッチ（TouchEnd）して0.7秒後の処理
    //================================================
    __timeOut1(_this) {
        clearTimeout(_this.__timeOut1ID);
        _this.__sreenInLoop1ID = setInterval(_this.__sreenInLoop1, 17, _this); //≒58.8fps
    }

    //=======================================================================
    // スクリーンを640x360（Wide）か480x360（Standard）のサイズに拡大していく
    //=======================================================================
    __sreenInLoop1(_this) {//Rect.startX, Rect.startY用
        //console.log(_this.__smallVideo.currentTime); //DEBUG

        _this.__loopCount += 0.03; //値が大きいほど高速
        let _sin = Math.sin(_this.__loopCount);

        if (_sin < 0.998) {
            _this.__screen1.startX = _this.__originStartX + _this.__disStartX * _sin;
            _this.__screen1.startY = _this.__originStartY + _this.__disStartY * _sin;
            _this.__screen1.endX = _this.__originEndX + _this.__disEndX * _sin;
            _this.__screen1.endY = _this.__originEndY + _this.__disEndY * _sin;
        } else {

            if (_this.__size == "standard") {
                _this.__screen1.startX = 440;
                _this.__screen1.startY = 204;
                _this.__screen1.endX = 920;
                _this.__screen1.endY = 564;
            } else { //"wide"}
                _this.__screen1.startX = 360;
                _this.__screen1.startY = 204;
                _this.__screen1.endX = 1000;
                _this.__screen1.endY = 564;
            }

            clearInterval(_this.__sreenInLoop1ID);
            _this.__sreenInLoop1ID = undefined;

            //第二スクリーン登場
            _this.__screen2 = new toile.Rect(_this.__screen1.x, _this.__screen1.y, _this.__screen1.endX, _this.__screen1.startY);
            _this.__screen2.isFill(true);
            _this.__screen2.fillColor = "254,254,254";
            _this.__screen2.lineWidth = 2;
            _this.__screen2.lineColor = "204,204,204";
            _this.__screen2.alpha = 0;
            _this.__canvas.addChild(_this.__screen2);
            _this.__timeOut2ID = setTimeout(_this.__timeOut2, 350, _this); //少し遅らせて第二スクリーンを下ろす
        }
    }

    //===========================================================
    // スクリーンが640x360または480x360になってから0.35秒後の処理
    //===========================================================
    __timeOut2(_this) {
        clearTimeout(_this.__timeOut2ID);
        _this.__timeOut2ID = undefined;

        //第二スクリーンを上から下ろしていくための処理
        _this.__sreenInLoop2ID = setInterval(_this.__sreenInLoop2, 17, _this); //≒58.8fps
        _this.__loopCount = - Math.PI/2;
        _this.__screen2.alpha = 0.6;
    }

    //=======================================
    // 第二スクリーンを上から下ろしていく処理
    //=======================================
    __sreenInLoop2(_this) { //Rect.endX, Rect.endY用
        //console.log(_this.__smallVideo.currentTime); //DEBUG
        
        _this.__loopCount += 0.04; //値が大きいほど高速
        let _sin = (Math.sin(_this.__loopCount) + 1)/2; //イーズイン＆イーズアウト（POINT）

        if (_sin < 0.998) {
            _this.__screen2.endY = _this.__screen1.startY + 360 * _sin;
            _this.__bg.alpha += 0.002;
        } else {
            _this.__screen2.endY = _this.__screen1.startY + 360; //XXX_small.mp4の高さ（360px）
            
            clearInterval(_this.__sreenInLoop2ID);
            _this.__sreenInLoop2ID = undefined;

            //EXITボタンを表示するタイミング（映像のロード完了）を調べるための処理
            _this.__smallVideoLoadCheckLoopID = setInterval(_this.__smallVideoLoadCheckLoop, 200, _this); //=5fps
        }
    }

    //============================================================
    // 小さい映像（XXX_small.mp4）がロードされたらEXITボタンを表示
    //============================================================
    __smallVideoLoadCheckLoop(_this) {
        if (_this.__smallVideo.isLoaded()) {
            clearInterval(_this.__smallVideoLoadCheckLoopID);
            _this.__smallVideoLoadCheckLoopID = undefined;

            //小さな映像再生
            _this.__canvas.addChild(_this.__smallVideo);
            _this.__smallVideo.x = _this.__screen2.x;
            _this.__smallVideo.y = _this.__screen2.y;
            _this.__smallVideo.play();

            //exitボタンの表示
            _this.__exitButton = new toile.Bitmap("exit.png");
            _this.__exitButton.__this = _this; //力技
            _this.__exitButton.addEventListener("mouseup", _this.mouseup_exitButton, true);
            _this.__exitButton.x = _this.__screen2.x;
            _this.__exitButton.y = _this.__screen2.y;
            _this.__canvas.addChild(_this.__exitButton);

            //大きな映像のロード開始
            let _videoName = _this.__bitmap.name;
            if (_this.__size == "standard") {
                //console.log("C");
                _this.__bigVideo = new toile.Video("mp4/" + _videoName + ".mp4", 960, 720);
            } else { //"wide"
                //console.log("D");
                _this.__bigVideo = new toile.Video("mp4/" + _videoName + ".mp4", 1280, 720);
            }
            _this.__bigVideo.stop();
            //console.log(_this.__bigVideo.autoPlay);

            //拡大ボタンを表示するタイミング（大きな映像のロード完了）を調べるための処理
            _this.__bigVideoLoadCheckLoopID = setInterval(_this.__bigVideoLoadCheckLoop, 100, _this); //=10fps
        }
    }

    //======================================================
    // 大きな映像（XXX.mp4）がロードされたら拡大ボタンを表示
    //======================================================
    __bigVideoLoadCheckLoop(_this) {
        if (_this.__bigVideo.isLoaded()) {
            clearInterval(_this.__bigVideoLoadCheckLoopID);
            _this.__bigVideoLoadCheckLoopID = undefined;

            _this.__bigButtonFadeinLoopID = setInterval(_this.__bigButtonFadeinLoop, 50, _this); //≒20fps

            //拡大ボタンを表示
            _this.__bigButton = new toile.Bitmap("big.png");
            _this.__bigButton.__this = _this; //力技
            if (_this.__size == "standard") {
                var _theWidth = 480;
            } else { //"wide"
                _theWidth = 640;
            }
            _this.__bigButton.x = _this.__screen2.x + _theWidth - 48;
            _this.__bigButton.y = _this.__screen2.y + 360 - 48;
            _this.__bigButton.alpha = 0;
            _this.__canvas.addChild(_this.__bigButton);
        }
    }

    //=======================================
    // 拡大ボタンをフェードインで表示する処理
    //======================================
    __bigButtonFadeinLoop(_this) {
        if (_this.__bigButton.alpha < 1) {
            _this.__bigButton.alpha += 0.07;
        } else { //拡大ボタンが完全に表示されたら...
            clearInterval(_this.__bigButtonFadeinLoopID);
            _this.__bigButtonFadeinLoopID = undefined;
            _this.__bigButton.alpha = 1;
            _this.__bigButton.addEventListener("mouseup", _this.mouseup_bigButton, true);
        }
    }

    //================================================
    // EXIT（×）ボタンをタッチ（TouchEnd）した時の処理
    //================================================
    mouseup_exitButton(_bitmap) {
        var _this = _bitmap.__this; //力技
        
        _this.__canvas.deleteChild(_this.__smallVideo); //映像を消す
        _this.__smallVideo.stop(); //映像･音を止める

        _this.__canvas.deleteChild(_this.__exitButton); //exitボタンを消す

        //拡大ボタンを消す
        _this.__canvas.deleteChild(_this.__bigButton);
        if (_this.__bigVideoLoadCheckLoopID != undefined) {
            clearInterval(_this.__bigVideoLoadCheckLoopID);
            _this.__bigVideoLoadCheckLoopID = undefined;
        } 

        _this.__canvas.deleteChild(_this.__screen2); //スクリーン2は消す
        _this.__screen1.alpha = 0.8; //スクリーン1のアルファ値を0.5→0.8へ

        _this.__timeOut3ID = setTimeout(_this.__timeOut3, 350, _this); //少し遅らせて第二スクリーンを下ろす
    }

    //===========================================
    // 拡大ボタンをタッチ（TouchEnd）した時の処理
    //===========================================
    mouseup_bigButton(_bitmap) {
        var _this = _bitmap.__this; //力技

         //大きな映像の枠を作成
        _this.__screenBig = new toile.Rect(_this.__screen1.x, _this.__screen1.y, _this.__screen1.endX, _this.__screen1.endY);
        _this.__screenBig.lineWidth = 2;
        _this.__screenBig.lineColor = "204,204,204";
        _this.__screenBig.alpha = 0.8;
        _this.__canvas.addChild(_this.__screenBig);

        _this.__timeInBigScreenID = setTimeout(_this.__timeInBigScreen, 350, _this); //0.35秒遅らせて大画面用スクリーンを広げる
    }

    //=====================================================
    // 拡大ボタンをタッチ（TouchEnd）してから0.35秒後の処理
    //=====================================================
    __timeInBigScreen(_this) {
        clearTimeout(_this.__timeInBigScreenID);
        _this.__timeInBigScreenID = undefined;

        //大きな映像用のスクリーンを拡大していく処理開始
        _this.__sreenBigInLoopID = setInterval(_this.__sreenBigInLoop, 17, _this); //≒58.8fps
        _this.__loopCount = - Math.PI/2;
        //_this.__screen2.alpha = 0.6;

        if (_this.__size == "standard") {
            _this.__disStartX = 200 - _this.__screen1.startX;
            _this.__disStartY = 24 - _this.__screen1.startY;
            _this.__disEndX = 1160 - _this.__screen1.endX;
            _this.__disEndY = 744 - _this.__screen1.endY;
        } else { //"wide"
            _this.__disStartX = 40 - _this.__screen1.startX;
            _this.__disStartY = 24 - _this.__screen1.startY;
            _this.__disEndX = 1320 - _this.__screen1.endX;
            _this.__disEndY = 744 - _this.__screen1.endY;
        }
        _this.__originStartX = _this.__screen1.startX;
        _this.__originStartY = _this.__screen1.startY;
        _this.__originEndX = _this.__screen1.endX;
        _this.__originEndY = _this.__screen1.endY;

        //小さな映像を停止
        _this.__smallVideo.pause();
    }

    //========================================================================
    // スクリーンを1280x720（Wide）か960x720（Standard）のサイズに拡大していく
    //========================================================================
    __sreenBigInLoop(_this) {
        _this.__loopCount += 0.04; //値が大きいほど高速
        let _sin = Math.cos(_this.__loopCount);

        if (_sin < 0.998) {
            _this.__screenBig.startX = _this.__originStartX + _this.__disStartX * _sin;
            _this.__screenBig.startY = _this.__originStartY + _this.__disStartY * _sin;
            _this.__screenBig.endX = _this.__originEndX + _this.__disEndX * _sin;
            _this.__screenBig.endY = _this.__originEndY + _this.__disEndY * _sin;
        } else {
            if (_this.__size == "standard") {
                _this.__screenBig.startX = 200; //440;
                _this.__screenBig.startY = 24; //204;
                _this.__screenBig.endX = 1160; //920;
                _this.__screenBig.endY = 744; //564;
            } else { //"wide"}
                _this.__screenBig.startX = 40; //360;
                _this.__screenBig.startY = 24; //204;
                _this.__screenBig.endX = 1320; //1000;
                _this.__screenBig.endY = 744; //564;
            }

            //大きな映像再生（再生中の XXX_small.mp4 の情報を取得）
            _this.__bigVideo.currentTime = _this.__smallVideo.currentTime; // + 0.23; //遅れを補正（秒）
            _this.__canvas.addChild(_this.__bigVideo);
            _this.__bigVideo.x = _this.__screenBig.startX;
            _this.__bigVideo.y = _this.__screenBig.startY;
            _this.__bigVideo.play();

            clearInterval(_this.__sreenBigInLoopID);
            _this.__sreenBigInLoopID = undefined;
        }
    }

    //======================================================
    // EXIT（×）ボタンをタッチ（TouchEnd）して0.35秒後の処理
    //======================================================
    __timeOut3(_this) {
        clearTimeout(_this.__timeOut3ID);
        _this.__timeOut3ID = undefined;
        
        _this.__sreenOutLoopID = setInterval(_this.__sreenOutLoop, 17, _this); //≒58.8fps
        _this.__loopCount = - Math.PI/2;

        _this.__originStartX = _this.__screen1.startX;
        _this.__originStartY = _this.__screen1.startY;
        _this.__originEndX = _this.__screen1.endX;
        _this.__originEndY = _this.__screen1.endY;
    }

    //===================================================
    // スクリーンを元の作品ボタンのサイズに戻していく処理
    //===================================================
    __sreenOutLoop(_this) {//Rect.startX, Rect.startY用
        _this.__loopCount += 0.03; //値が大きいほど高速
        let _sin = Math.cos(_this.__loopCount); //-1 => 0 => 1（イーズイン・イーズアウト）

        if (_sin < 0.998) {
            _this.__screen1.startX = _this.__originStartX - _this.__disStartX * _sin;
            _this.__screen1.startY = _this.__originStartY - _this.__disStartY * _sin;
            _this.__screen1.endX = _this.__originEndX - _this.__disEndX * _sin;
            _this.__screen1.endY = _this.__originEndY - _this.__disEndY * _sin;
            _this.__screen1.alpha -= 0.006;
            _this.__bg.alpha -= 0.003;
        } else {
            _this.__screen1.startX = _this.__originStartX - _this.__disStartX;
            _this.__screen1.startY = _this.__originStartY - _this.__disStartY;
            _this.__screen1.endX = _this.__originEndX - _this.__disEndX;
            _this.__screen1.endY = _this.__originEndY - _this.__disEndY;

            clearInterval(_this.__sreenOutLoopID);
            _this.__sreenOutLoopID = undefined;

            _this.__timeOut4ID = setTimeout(_this.__timeOut4, 350, _this); //少し遅らせて初期状態に戻す
        }
    }

    //=============================================================
    // スクリーンが元の作品ボタンのサイズに戻ってから0.35秒後の処理
    //=============================================================
    __timeOut4(_this) {
        clearTimeout(_this.__timeOut4ID);
        _this.__timeOut4ID = undefined;

        _this.__canvas.deleteChild(_this.__screen1); //スクリーン2を消す
        _this.__canvas.deleteChild(_this.__bg); //背景（暗転用）を消す

        _this.__closeHandler(_this); //Screen.CLOSEイベントの発生!!!
    }
}