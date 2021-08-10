// Short for Navigator, which is a reserved word in JavaScript
export class Navi {
  init(elements) {
    elements.nav.addEventListener('click', (event) => {
      this.parse(event, elements);
    });
  }

  parse(event, elements) {
    switch (event.target.id) {
      case 'to-settings':
        this.resetNav(elements, event.target);
        elements.wrapper.classList.add('config');
        break;
      case 'to-simulation':
        this.resetNav(elements, event.target);
        elements.wrapper.classList.add('auto-translate');
        break;
      case 'to-manual-translate':
        this.resetNav(elements, event.target);
        elements.wrapper.classList.add('manual-translate');
        break;
      case 'to-logs':
        this.resetNav(elements, event.target);
        elements.wrapper.classList.add('logs');
        break;
    }
  }

  resetNav(elements, buttonClicked) {
    elements.wrapper.classList = [];
    elements.nav.querySelectorAll('*').forEach(el => el.classList.remove('selected'));
    buttonClicked.classList.add('selected');
  }
}
