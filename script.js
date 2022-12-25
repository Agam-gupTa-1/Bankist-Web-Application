'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('nav');
const header = document.querySelector('.header');
const lazyImg = document.querySelectorAll('.lazy-img');
///////////////////////////////////////
// Modal window
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


////////////////////////////
// button scrolling
btnScrollTo.addEventListener('click', function (e) {
  // console.log(e.target);
  // coordinates of section 1 (relative); exact location of element
  const s1Coords = section1.getBoundingClientRect();
  // console.log(s1Coords);
  //console.log(e.target.getBoundingClientRect());// giving coordinates from the viewport
  //console.log('Scroll(X/Y)', window.pageXOffset, window.pageYOffset);// current location of the page

  // Old conventional  method
  /*
  1 find coordinates of element to which you want to scroll(relative position)
  2 select scroll from global window object
  3 absolute position == window.pageXOffset+ele.left/top
  */
  // window.scrollTo({
  //   left:s1Coords.left+window.pageXOffset, // current location+left coordinate == absolute location
  //   top: s1Coords.top+window.pageYOffset,
  //   behavior: 'smooth'
  // }
  // )
  //Modern way
  // take element to which you want to scroll
  // section1.scrollIntoView({ behavior: 'smooth' });
});



//////////////////////////////////////////
// adding cookie element
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML = 'We uses cookies to improve your experience with us!! <button class = "btn btn--close-cookie">Got it!</button>';
document.querySelector('.header').prepend(message);
message.style.backgroundColor = '#37383d';
message.style.width = '110%';
// console.log(message.style.height);// it sets or gives inline css only

// however, getComputedStyle(ele) -> gives all the properties of HTML elemet 'ele'

// console.log( Number.parseFloat(getComputedStyle(message).height));
message.style.height = Number.parseFloat(getComputedStyle(message).height) + 20 + 'px';
// header.append(message);
// header.before(message);
// header.after(message.cloneNode(true));

//////////////////////////////////
// removing cookie message after clicking on it
document.querySelector('.btn--close-cookie').addEventListener('click', () => {
  // message.remove();
  // console.log(message.parentElement);
  message.parentElement.removeChild(message);
})

/////////////////////////
// NAVIGATION PAGE

// this is not an efficient way, suppose there are 10000 links then 10000 eventhandler copies are created --> performance affected
/*
document.querySelectorAll('.nav__link').forEach(function(el){
  el.addEventListener('click', function(e){
    e.preventDefault();
    // console.log(e.target === this);
    const id = e.target.getAttribute('href'); // this.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  })
})
*/

// event bubbling --> event delegation
// attaching event handler to the common parent
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // matching strategy
  if (e.target.classList.contains('nav__link') && !e.target.classList.contains('nav__link--btn')) {
    const id = e.target.getAttribute('href');
    // console.log(this, e.target); 
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
})



////////// Tabbed Component ///////////////////////
// not an efficient way to add events to all tabs instead use event delegation
// tabs.forEach(t=>t.addEventListener('click', ()=> console.log('TAB')));
tabContainer.addEventListener('click', function (e) {
  // console.log(e.target.parentElement);
  // upward ke liye parentNodes parentElement, closest
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  // to get the unselected effect first remove the active class from all the tabs
  // in-activate the tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  // activate tab
  clicked.classList.add('operations__tab--active');

  console.log(clicked.getAttribute('data-tab'));

  // content removal
  tabContent.forEach(c => c.classList.remove('operations__content--active'));
  // content activation
  document.querySelector(`.operations__content--${+clicked.getAttribute('data-tab')}`).classList.add('operations__content--active');

});

////////////////////////////////////////////////
// Menu fade animation

// wants to fade logo and other nav links when one is hovered
// common parent of logo and links
const handleHover = function (e) {
  // console.log(this);
  const clicked = e.target;
  if (clicked.classList.contains('nav__link')) {
    const siblings = clicked.closest('.nav').querySelectorAll('.nav__link');
    const logo = clicked.closest('.nav').querySelector('#logo');
    siblings.forEach((el) => {
      if (el !== clicked)
        el.style.opacity = this;
    })
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

/////////////////////////////////
// Sticky Navigation bar
// sticking nav bar when window scrolls to section1
// we want nav bar to be sticky when it is completly move out of the viewport
// Inefficient method
/*
const initialCoords = section1.getBoundingClientRect();
window.addEventListener('scroll', function(e){
  console.log(window.scrollY);
  if(window.scrollY > initialCoords.top)
     nav.classList.add('sticky');
})
*/
// Modern way invoking callback function only when the header is out of viewport

const headerObserver = new IntersectionObserver(function (entries, headerObserver) {
  // console.log(entries);
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting)
    nav.classList.add('sticky');
  else
    nav.classList.remove('sticky');
}, { root: null, threshold: 0, rootMargin: '-5%' })
headerObserver.observe(header);




///////////////////////
// Reveal Section
const obsCallback = function (entries, observer) {
  // console.log(entries);
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  sectionObserver.unobserve(entry.target);
};
const allSections = document.querySelectorAll('.section');
const sectionObserver = new IntersectionObserver(obsCallback, {
  root: null,
  threshold: 0.15
});
allSections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});



///////////////////////////////////
// lazy loading of images

// we want to load the image when we enters that image div
const imgCallback = function (entries, imgObserver) {
  const entry = entries[0];
  // console.log(entry);
  if (!entry.isIntersecting) return;

  entry.target.setAttribute('src', entry.target.dataset.src);

  entry.target.addEventListener('load', () => {
    // console.log('loaded');
    entry.target.classList.remove('lazy-img');
  })
  imgObserver.unobserve(entry.target);
}
const imgObserver = new IntersectionObserver(imgCallback, {
  root: null,
  threshold: 0.1
})
// attaching observer to all lazy-img elements
lazyImg.forEach(img => {
  imgObserver.observe(img);
})

////////////////////////////////////
// Slide Section
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

// slider.style.transform = 'scale(0.4) translateX(-500px)';// just for implementation
// slider.style.overflow = 'visible';

const slideMovement = function (factor) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${(i - factor) * 100}%)`;
  })
};
// we have to put the slides one after one
// means translate in x   0% 100% 200% 300%
slideMovement(0);

let btnClicked = 0;
const maxSlides = slides.length;

// dot color effect 
const dotEffect = function (slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
  document.querySelector(`.dots__dot[data-slide='${slide}']`).classList.add('dots__dot--active');
}
// next slide
const nextSlide = function () {
  if (btnClicked === maxSlides - 1)
    btnClicked = 0;
  else
    btnClicked++;
  // console.log(btnClicked);
  slideMovement(btnClicked);
  dotEffect(btnClicked);

};
// move the slides to left each time right button is clicked
btnRight.addEventListener('click', nextSlide)

// prev slide
const prevSlide = function () {
  if (btnClicked !== 0)
    btnClicked--;
  else
    btnClicked = maxSlides - 1;
  slideMovement(btnClicked);
  dotEffect(btnClicked);
};
// left button movement
btnLeft.addEventListener('click', prevSlide);

// same functionality using left and right arrow buttons of keyboard
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    // next slide
    nextSlide();
  }
  else if (e.key === 'ArrowLeft') {
    // prev slide
    prevSlide();
  }
})
/////////////////////////////////////
// DOTS section
const dotContainer = document.querySelector('.dots');
// dots creation
slides.forEach((_, i) => {
  dotContainer.insertAdjacentHTML('beforeend', `<button class = "dots__dot" data-slide = ${i}> </button>`);
});
// ==== at very begining add active dot class to  0th dot
dotEffect(0);
// dot pr click krte hi particular slide pr poch jaye
// again event delegation
dotContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('dots__dot'))
    return;
  const slide = e.target.dataset.slide;
  // console.log(slide);
  // call krna hai goto slide form slide number 'slide'
  slideMovement(slide);
  // color bhi change krna hai active  dot ka

  dotEffect(slide);
})
///////////////////////////////////////
// Redirecting to login page
const redirect = document.querySelectorAll('.redirect');
redirect.forEach((ele) => {
  ele.addEventListener('click', function (e) {
    // preventDefault();
    window.location.assign("2ndpage/index1.html");
  })
})



//////////////////////////////////////////
// PRACTICE
// we can set the property of css variables
// document.documentElement.style.setProperty('--color-primary','orangered');

// attributes
// const img = document.querySelector('.nav__logo');
// console.log(img.src);
// img.alt = 'Beautiful minimalist logo';
// console.log(img.className);
// console.log(img.getAttribute('class'));

// Learn more button


// Events -- anything that happens on the web page is an event
/*
const h1 = document.querySelector('h1');
const h1Handler = function (e) {
  // console.log(e);
  alert('You are reading the Heading :)');
  // can also remove the event listners
  // 1 time listner
  h1.removeEventListener('mouseenter', h1Handler);
  // h1.parentElement.removeChild(h1);
};
*/
// h1.addEventListener('mouseenter', h1Handler);
// setInterval(()=>h1.removeEventListener('mouseenter', h1Handler), 4000);



// random value generation
// between 2 and 6
// const num = Math.trunc(Math.random()*(6-2+1))+2;
// console.log(num);



/*
const randomColor = (min, max) => Math.trunc(Math.random() * (max - min + 1)) + min;
const fun = function (e) {

  this.style.backgroundColor = `rgb(${randomColor(0,255)},${randomColor(0,255)},${randomColor(0,255)})`;

  console.log(e.target, e.currentTarget=== this);
}
document.querySelector('.nav__link').addEventListener('click', fun);
document.querySelector('.nav__links').addEventListener('click', fun);
document.querySelector('.nav').addEventListener('click', fun);*/




//// Intersection Observer API

// const observer = new IntersectionObserver(function(entries, observer){
//   entries.forEach(entry => console.log(entry));
// }, {root: null, threshold: [0, 0.2]});

// observer.observe(section1);

/*
document.addEventListener('DOMContentLoaded', function(e){
  console.log(e);
  console.log('HTML document is parsed');
})
// load is window event
window.addEventListener('load', ()=>{
  console.log('HTML page is completely loaded');
})

window.addEventListener('beforeunload', (e)=>{
  console.log(e);
  e.returnValue = '';
})
*/

