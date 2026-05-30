// Stripe Clone JS

const navItems = document.querySelectorAll('.nav-item[data-menu]');
const dropdownBg = document.getElementById('dropdown-bg');
const menus = document.querySelectorAll('.menu-content');
const navbar = document.querySelector('.navbar');

let activeTimer;
let leaveTimer;

navItems.forEach(item => {
  item.addEventListener('mouseenter', function() {
    clearTimeout(leaveTimer);
    
    const menuId = this.getAttribute('data-menu');
    const menuElement = document.getElementById(`${menuId}-menu`);
    
    if (!menuElement) return;

    // Show the background box
    dropdownBg.classList.add('show');
    
    // Hide all menus
    menus.forEach(m => m.classList.remove('show'));
    
    // Show the specific menu
    menuElement.classList.add('show');

    // Calculate dimensions of the menu content to resize the background box
    const rect = menuElement.getBoundingClientRect();
    const navRect = navbar.getBoundingClientRect();
    
    // Position and size the background based on the item position and menu content size
    const itemRect = this.getBoundingClientRect();
    
    // Assuming a fixed size for simplicity in this clone, but moving it horizontally
    // to align roughly with the hovered item.
    const leftOffset = itemRect.left - navRect.left - 50; 
    
    dropdownBg.style.transform = `translateX(${leftOffset}px) scaleY(1)`;
    dropdownBg.style.width = '300px'; 
    dropdownBg.style.height = menuId === 'products' ? '120px' : '150px';
    
    menuElement.style.left = `${leftOffset}px`;
  });
});

navbar.addEventListener('mouseleave', () => {
  leaveTimer = setTimeout(() => {
    dropdownBg.classList.remove('show');
    menus.forEach(m => m.classList.remove('show'));
  }, 200);
});
