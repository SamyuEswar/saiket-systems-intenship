// Duolingo Clone JS

const nodes = document.querySelectorAll('.node-btn');
const modal = document.getElementById('lesson-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const closeModalBtn = document.getElementById('close-modal-btn');
const startLessonBtn = document.getElementById('start-lesson-btn');

nodes.forEach(node => {
  node.addEventListener('click', () => {
    // Prevent clicking on locked nodes
    if (node.classList.contains('locked')) {
      // Small shake animation could go here
      return;
    }

    const title = node.getAttribute('data-title');
    const desc = node.getAttribute('data-desc');

    modalTitle.textContent = title;
    modalDesc.textContent = desc;

    modal.classList.add('show');
  });
});

closeModalBtn.addEventListener('click', () => {
  modal.classList.remove('show');
});

startLessonBtn.addEventListener('click', () => {
  // Simulate starting lesson
  startLessonBtn.textContent = 'LOADING...';
  setTimeout(() => {
    modal.classList.remove('show');
    startLessonBtn.textContent = 'START +10 XP';
    alert("Lesson started! (Simulation)");
  }, 800);
});

// Close modal when clicking outside content
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('show');
  }
});
