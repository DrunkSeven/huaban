
var ispringPresentationConnector = {},
  playbackController,
  playerView,
  pptContent = "",
  BASE_DEBOUNCE_INTERVAL = 50;


function debounce(fn, delay) {
  var timer;
  return function () {
    var context = this;
    var arg = Array.prototype.slice.call(arguments);
    timer && clearTimeout(timer);
    timer = setTimeout(
      function () {
        timer = null;
        fn.apply(context, arg);
      },
      delay
    );
  };
}

function getContainer() {
  return document.querySelector('#playerView').firstChild;
}

function sendMessage(data) {
  window.parent.postMessage(
    data,
    '*'
  );
}
var page, step = 0, pageCount, loaded;
ispringPresentationConnector.register = function (player) {
  if (!document.createElement("canvas").getContext)
    return document.getElementById("resizer").innerHTML = "",
      void (
        document.body.innerHTML = "<h2>Oops! Your browser does not support HTML5. You need to upgrade your browser to view this content.</h2>");

  playerView = player.view()
  playbackController = player.view().playbackController();

  // var page, step = 0, pageCount, loaded;
  var pageOperationQueue = [];

  function getBaseData() {
    var container = getContainer();
    return {
      value: {
        slide: page + 1,
        step,
        pageCount,
        width: container.offsetWidth,
        height: container.offsetHeight,
      }
    };
  }

  var onPageChange = debounce(
    function (slideIndex) {
      if (slideIndex < 0) {
        return;
      }

      if (loaded) {
        var data = getBaseData();
        data.type = 'pagechange';
        sendMessage(data);
      }
    },
    BASE_DEBOUNCE_INTERVAL * 2
  );

  var onStepChange = debounce(
    function (stepIndex, isTriggerByGoTo) {
      if (stepIndex < 0) {
        return;
      }

      var data = getBaseData();
      if (loaded) {
        data.type = 'stepchange';
        data.isTriggerByGoTo = isTriggerByGoTo;
        if (data.value.step === 0) {
          return
        }
      }
      else {
        loaded = true;
        pptContent = playerView.displayObject().firstChild
        data = {
          type: 'PPTInfo',
          value: { cw: parseInt(pptContent.style.width), ch: parseInt(pptContent.style.height), mt: parseInt(pptContent.style.top || 0), detail: { TotalSlides: playbackController.lastSlideIndex(), width: player.presentation().slideWidth(), height: player.presentation().slideHeight() } }
        }
      }
      sendMessage(data);
    },
    BASE_DEBOUNCE_INTERVAL * 2
  );

  playbackController.slideChangeEvent().addHandler(
    function (slideIndex) {
      page = slideIndex;
      onPageChange(slideIndex);
    }
  );

  playbackController.stepChangeEvent().addHandler(
    function (stepIndex) {
      step = stepIndex;
      if (pageOperationQueue[0] === page + '-' + step) {
        pageOperationQueue.shift();
        onStepChange(stepIndex, true);
      }
      else {
        onStepChange(stepIndex, false);
      }
    }
  );

  function goto(targetPage, targetStep) {
    console.log(targetStep, step);
    if (targetPage !== page || targetStep !== step) {
      pageOperationQueue.push(targetPage + '-' + targetStep);
      playbackController.gotoTimestamp(targetPage, targetStep, 0, true);
    }
  }
  //获取iframe发来的消息
  window.addEventListener(
    "message",
    event => {
      var data = event.data;
      switch (data.data) {
        case 'goPage':
          const { slide, step } = data.value
          goto(slide - 1, step);


          break;
        case 'preStep':
          playbackController.gotoPreviousStep()
          break;
        case 'nextStep':
          playbackController.gotoNextStep()
          break;
      }
    })

  // 监听 resize 事件（发送 ppt 长宽等信息）
  var sendPptSize = true
  window.addEventListener("resize", () => {
    if (sendPptSize) {
      sendPptSize = false;
      setTimeout(() => {
        pptContent = playerView.displayObject().firstChild
        window.parent.postMessage({ type: 'PPTResize', value: [parseInt(pptContent.style.width), parseInt(pptContent.style.height), parseInt(pptContent.style.top || 0)] }, "*");
        sendPptSize = true;
      }, 50);
    }
  });
};


