cn = {
  // jquery, jq-mobiを使わない
  createKeyframe : function(name, frame) {
    var styleTag = document.createElement('style')
    styleTag.type = 'text/css'
    textNode = document.createTextNode('@-webkit-keyframes ' + name + '{' + frame.join(' ') + '}')
    styleTag.appendChild(textNode)
    document.getElementsByTagName('head')[0].appendChild(styleTag)
  },
  // 複次元mergeも自前
  merge : function(base, value) {
    for (var key in value) {
      if (base.hasOwnProperty(key)) {
        if (typeof base[key] == 'object' && typeof value[key] == 'object') {
          base[key] = cn.merge(base[key], value[key])
        } else {
          base[key] = value[key]
        }
      } else {
        base[key] = value[key]
      }
    }
    return base
  },
  // fadein animation
  messageFadeInOut : function(conf) {
    
    // アニメーション定義
    conf = cn.merge({
      anim: {
        'name': 'fadeInOut',
        'iteration-count': '1',
        'timing-function': 'ease-in-out',
        'fill-mode': 'both',
        'keyframe': [
          '0% {opacity: 0;}',
          '10% {opacity: 0.99;}',
          '90% {opacity: 0.99;}',
          '100% {opacity: 0;}',
        ]
      }
    }, conf)
    
    // keyframe作成
    cn.createKeyframe(conf.anim.name, conf.anim.keyframe)
    
    // message box作成
    cn.cnMessage(conf)
  },
  // slidein animation
  messageSlideInOut : function(conf) {
    
    // アニメーション定義
    conf = cn.merge({
      anim: {
        'name': 'slideInOut',
        'iteration-count': '1',
        'timing-function': 'ease-in-out',
        'keyframe': [
          '0% {left: 1500px;}',
          '10% {left: 40px;opacity: 0.99;}',
          '90% {left: 40px;opacity: 0.99;}',
          '100% {left: -1500px;}',
        ]
      }
    }, conf)
    
    // keyframe作成
    cn.createKeyframe(conf.anim.name, conf.anim.keyframe)
    
    // message box作成
    cn.cnMessage(conf)
  },
  // bound animation
  messageDoubleBoundIn : function(conf) {
    
    // アニメーション定義
    conf = cn.merge({
      anim: {
        'name': 'boubleBoundIn',
        'iteration-count': '1',
        'timing-function': 'ease-in-out',
        'keyframe': [
          '0% {opacity: 0; -webkit-transform: scale(1)}',
          '3% {opacity: 1; -webkit-transform: scale(1.2)}',
          '6% {opacity: 1; -webkit-transform: scale(1)}',
          '9% {opacity: 1; -webkit-transform: scale(1.2)}',
          '12% {opacity: 1; -webkit-transform: scale(1)}',
          '90% {opacity: 1;}',
          '100% {opacity: 0;}',
        ]
      }
    }, conf)
    
    // keyframe作成
    cn.createKeyframe(conf.anim.name, conf.anim.keyframe)
    
    // message box作成
    cn.cnMessage(conf)
  },
  // [core] message box作成
  cnMessage : function(conf) {
    
    // デフォルト
    conf = cn.merge({
      message: '',
      timing: {
        st: 1000,
        ed: 3000,
      },
      image: '',
      position: {
        x: 40,
        y: 75,
      },
      size: {
        x: 320,
        y: 125,
      },
      l_css: {
        color: 'white',
        'font-size': '20px',
      },
      b_css: {
        backgroundColor: 'black',
        'z-index': 100,
        opacity: 0,
      },
      anim: {},
      withFlush: false,
    }, conf)
    
    // 親div作成
    var box = document.createElement('div')
    box.style.position = 'absolute'
    box.style.top = conf.position.y + 'px'
    box.style.left = conf.position.x + 'px'
    box.style.width = conf.size.x + 'px'
    box.style.height = conf.size.y + 'px'
    box.style.backgroundColor = conf.b_css.backgroundColor
    box.style.opacity = conf.b_css.opacity
    box.style.zIndex = conf.b_css['z-index']
    
    // 画像を入れる
    var image = document.createElement('div')
    image.style.backgroundImage = 'url(' + conf.image + ')'
    image.style.backgroundRepeat = 'no-repeat'
    var imageHeight = (conf.size.y - 30)
    image.style.webkitBackgroundSize =
        conf.size.x + 'px, ' + imageHeight + 'px';
    image.style.width = conf.size.x + 'px'
    image.style.height = imageHeight + 'px'
    
    // 画像にflushを入れる場合
    if (conf.withFlush) {
      if (typeof created == 'undefined') {
        cn.createKeyframe('lineFlush', [
          '0% {-webkit-transform: skew(-40deg) translateX(-100px);}',
          '100% {-webkit-transform: skew(-40deg) translateX(400px);}',
        ])
        created = true
      }
      var flush = document.createElement('div')
      flush.style.width = '40px'
      flush.style.height = conf.size.y + 200 + 'px'
      flush.style.position = 'relative'
      flush.style.top = '0px'
      flush.style.left = '-100px'
      flush.style.backgroundColor = 'white'
      flush.style.opacity = 0.9
      flush = cn.setAnimStyles(flush, {
        name: 'lineFlush',
        duration: '600ms',
        delay: (conf.timing.st + 700) + 'ms',
        'iteration-count': 1,
        'fill-mode': 'both'
      })
      flush.style.display = 'block'
      image.style.overflow = 'hidden'
      image.appendChild(flush)
    }
    box.appendChild(image)
    
    // メッセージラベル
    var label = document.createElement('div')
    label.style.position = 'relative'
    label.style.top = '0px'
    label.style.left = '10px'
    label.innerHTML = conf.message
    label.style.color = conf.l_css.color
    label.style.fontSize = conf.l_css['font-size']
    box.appendChild(label)
    
    // animation
    conf.anim['delay'] = conf.timing.st + 'ms'
    conf.anim['duration'] = (conf.timing.ed - conf.timing.st) + 'ms'
    box = cn.setAnimStyles(box, conf.anim)
    document.getElementsByTagName('body')[0].appendChild(box)
  },
  // confに応じたアニメーション設定(just webkit)
  setAnimStyles : function(elem, conf) {
    for (i in conf) {
      switch (i) {
        case 'name':
          elem.style.webkitAnimationName = conf[i]
          break
        case 'iteration-count':
          elem.style.webkitAnimationIterationCount = conf[i]
          break
        case 'timing-function':
          elem.style.webkitAnimationTimingFunction = conf[i]
          break
        case 'delay':
          elem.style.webkitAnimationDelay = conf[i]
          break
        case 'duration':
          elem.style.webkitAnimationDuration = conf[i]
          break
        case 'fill-mode':
          elem.style.webkitAnimationFillMode = conf[i]
          break
      }
    }
    return elem
  }
}