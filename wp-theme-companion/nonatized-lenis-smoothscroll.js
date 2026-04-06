const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => 1 - Math.pow(1 - t, 4), // smooth ease-out
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: true,
  touchMultiplier: 2,
  infinite: false,
})

// animation loop
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)
