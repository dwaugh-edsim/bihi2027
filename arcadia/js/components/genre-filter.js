// Interactive Genre Filtering for Slate and Archive
(function () {
  'use strict';

  function initGenreFilter() {
    const filterBar = document.querySelector('.genre-filter');
    if (!filterBar) return;

    const buttons = filterBar.querySelectorAll('.genre-filter__btn');
    const shows = document.querySelectorAll('.show[data-genre]');
    const archiveCards = document.querySelectorAll('.archive-card[data-genre]');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const selectedGenre = btn.getAttribute('data-genre') || btn.getAttribute('data-filter') || 'all';

        buttons.forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle('is-active', isActive);
          b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Filter Slate shows
        shows.forEach((show) => {
          const showGenres = (show.getAttribute('data-genre') || '').split(' ');
          const matches = selectedGenre === 'all' || showGenres.includes(selectedGenre);
          show.classList.toggle('is-filtered-out', !matches);
        });

        // Filter Archive cards
        archiveCards.forEach((card) => {
          const cardGenres = (card.getAttribute('data-genre') || '').split(' ');
          const matches = selectedGenre === 'all' || cardGenres.includes(selectedGenre);
          card.style.display = matches ? '' : 'none';
        });

        // Refresh ScrollTrigger if available
        if (window.ScrollTrigger) {
          ScrollTrigger.refresh();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGenreFilter);
  } else {
    initGenreFilter();
  }
})();
