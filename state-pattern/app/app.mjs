https://juejin.im/post/5c2c47dcf265da616d544a53
// app.js
import Router from './modules/Router';
import Track from './modules/Track';

class App {
    constructor(options) {
        this.options = options;
        this.router = new Router();
        this.track = new Track();

        this.init();
    }

    init() {
        window.addEventListener('DOMContentLoaded', () => {
            this.router.to('home');
            this.track.tracking();
            this.options.onReady();
        });
    }
}

// index.js
import App from 'path/to/App';
new App({
    onReady() {
        // do something here...
    },
});
