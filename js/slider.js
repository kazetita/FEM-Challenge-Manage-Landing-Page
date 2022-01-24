function Slider(rootId) {
  const root = document.querySelector(rootId);
  const slidesContainer = root.querySelector('.slider__items'); 
  const dots = Array.from(root.querySelectorAll('.slider__dot'));
  const MODES = {MOBILE:0, DESKTOP:1};
  let sliderMode;
  
  /* ================== *  
   *  GENERAL FUNCTIONS
   * ================== */
  const getDotActive = () => dots.find(dot => dot.classList.contains('slider__dot--active'))
  const getDotByNroSlide = nroSlide => dots.find(dot => dot.dataset.target == nroSlide);
  const isDotActive = dot => dot.classList.contains('slider__dot--active');
  const activateDot = dot => setDotState(dot, true);
  const desactivateDot = dot => setDotState(dot, false);
  const setDotState = function(dot, setLikeActive) {
    if(setLikeActive && !isDotActive(dot)) {
      dot.classList.add('slider__dot--active');
    }

    if(!setLikeActive && isDotActive(dot)) {
      dot.classList.remove('slider__dot--active');
    }
  };

  /* ================== *  
   *  REFRESH SLIDER
   * ================== */
  const getOffsetXSlide = nroSlide => (nroSlide - 1) * - 100;
  
  const refreshSlider = function(dot) {
    const offsetX = getOffsetXSlide(dot.dataset.target);
    slidesContainer.style.transform = `translateX(${offsetX}%)`;
  };

  /* ================== *  
   *  SWITCH SLIDER
   * ================== */
  const switchSlide = function(nroSlide) {
    const newDotActive = getDotByNroSlide(nroSlide);
    if(isDotActive(newDotActive)) return;
    
    const oldDotActive = getDotActive();
    desactivateDot(oldDotActive);
    activateDot(newDotActive);
    refreshSlider(newDotActive);
  };

  /* ================== *  
   *  AUTO SLIDER
   * ================== */

  const autoSliderDesktop = (function() {

    const getOffsetXAnimation= function() {
      const visibleWidthSlider = slidesContainer.offsetWidth;
      const totalWidthSlider = Math.max(
        slidesContainer.scrollWidth,
        slidesContainer.offsetWidth,
        slidesContainer.clientWidth
      );

      return visibleWidthSlider - totalWidthSlider;
    };
    
    const removeAnimation = function() {
      root.classList.remove('slider--animate');
      slidesContainer.setAttribute('style', '');
    }

    const addAnimation = function() {
      if(slidesContainer.style.getPropertyValue('--slides-count') === '') {
        slidesContainer.style.setProperty('--slides-count', slidesContainer.children.length);
      }

      const offsetX = getOffsetXAnimation() + 'px';
      slidesContainer.style.setProperty('--offsetX', offsetX);
      root.classList.add('slider--animate');
    }
    
    const refreshAnimation = function() {
      removeAnimation();
      addAnimation();
    };

    const removeListeners = () => window.removeEventListener('resize', refreshAnimation);

    const addListeners = function() {
      window.addEventListener('resize', refreshAnimation);
    }

    const stop = function() {
      removeAnimation();
      removeListeners();
    }

    const start = function() {
      addListeners();
      refreshAnimation();
    };

    return { start, stop };
  })();

  const autoSliderMobile = (function(customDelay) {
    let toRight = true;
    let delay = customDelay || 4000;
    let timer;

    const updateDirectionSlider = function() {
      const dotActive = getDotActive();
      if(dotActive.nextElementSibling == null && toRight) toRight = false;
      if(dotActive.previousElementSibling == null && !toRight) toRight = true;
    };

    const getNextDotActive = function() {
      const dotActive = getDotActive();
      updateDirectionSlider();

      return toRight 
        ? dotActive.nextElementSibling 
        : dotActive.previousElementSibling;
    };
    
    const autoSwitchSlide = function() {
      const nextDotActive = getNextDotActive();
      switchSlide(nextDotActive.dataset.target);
    };

    const stop = function() {
      clearInterval(timer);
      slidesContainer.setAttribute('style', '');
    };

    const restart = function() {
      clearInterval(timer);
      start();
    }

    const start = function() {
     timer = setInterval(autoSwitchSlide, delay);
    };

    return {start, restart, stop};
  })();

  /* ================== *  
   *  SLIDER MODE
   * ================== */
  const getWidthScreen = () => (
    window.innerWidth 
    || window.document.documentElement.clientWidth 
    || document.body.clientWidth
  );

  const updateSliderMode = function() {
    const width = getWidthScreen()
    if(width < 1100 && sliderMode !== MODES.MOBILE){
      sliderMode = MODES.MOBILE;
      autoSliderDesktop.stop();
      autoSliderMobile.start()
    }

    if(width >= 1100 && sliderMode !== MODES.DESKTOP){
      sliderMode = MODES.DESKTOP;
      autoSliderMobile.stop()
      autoSliderDesktop.start();
    }
  };

  /* ================== *  
   *  EVENTS SLIDER
   * ================== */
  const handlerDotClick = function() {
    switchSlide(this.dataset.target);
    //reset timer auto slide
    autoSliderMobile.restart();
  };

  const addDotEvents = function() {
    dots.forEach(function(dot) {
      dot.addEventListener('click', handlerDotClick);
    });
  };

  const addSliderModeEvent = function() {
    window.addEventListener('resize', function() {
      updateSliderMode();
    });
  };

  const addListeners = function() {
    addDotEvents();    
    addSliderModeEvent();
  };

  const start = function() {
    //addEventListener
    //start autoSlide (inside this check screen size)
    refreshSlider(getDotActive());
    addListeners();
    updateSliderMode();
  };


  return { start };
}

Slider("#testimonials-slider").start();


