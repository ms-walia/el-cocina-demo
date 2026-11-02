/* Signature dishes: the sticky photo changes as you scroll from one course to the next */
(() => {
  const photo = document.querySelector('#carte .ca__photo');
  const courses = document.querySelectorAll('#carte .ca__course');
  if (!photo || !courses.length || !('IntersectionObserver' in window)) return;
  const show = id => photo.querySelectorAll('img').forEach(img => img.classList.toggle('is-active', img.dataset.course === id));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) show(e.target.id.replace('carte-', '')); });
  }, { rootMargin: '-40% 0px -52% 0px' });
  courses.forEach(c => io.observe(c));
})();
