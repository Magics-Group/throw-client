import app from 'app';
import BrowserWindow from 'browser-window';
import path from 'path';
import yargs from 'yargs';


const args = yargs(process.argv.slice(1)).wrap(100).argv;

app.on('ready', () => {
    var checkingQuit = false;
    var canQuit = false;
    const screenSize = require('screen').getPrimaryDisplay().workAreaSize;

    var mainWindow = new BrowserWindow({
        width: 575,
        height: 350,
        'standard-window': true,
        'auto-hide-menu-bar': true,
        resizable: true,
        title: 'Throw Player',
        center: true,
        frame: true,
        show: false
    });

    if (args.dev) {
        mainWindow.show();
        mainWindow.toggleDevTools();
        mainWindow.focus();
        console.info('Dev Mode Active: Developer Tools Enabled.')
    }

    mainWindow.setMenu(null);

    mainWindow.loadURL(path.normalize('file://' + path.join(__dirname, '../index.html')));

    mainWindow.webContents.on('new-window', e => e.preventDefault());

    mainWindow.webContents.on('will-navigate', (e, url) => {
        if (url.indexOf('build/index.html#') < 0) {
            e.preventDefault();
        }
    });

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.setTitle('Throw Player');
        mainWindow.show();
        mainWindow.focus();
    });

    mainWindow.on('close', (event) => {
        app.quit();
    });
});


app.on('window-all-closed', app.quit);