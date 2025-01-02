const container = document.querySelector('.featured-petitions-container');
const scrollLeft = document.getElementById('scroll-left');
const scrollRight = document.getElementById('scroll-right');

export default function FeaturePetitions() {
scrollLeft.addEventListener('click', () => {
  container.scrollBy({ left: -300, behavior: 'smooth' });
});

scrollRight.addEventListener('click', () => {
  container.scrollBy({ left: 300, behavior: 'smooth' });
});
}