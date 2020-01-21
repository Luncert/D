import {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} from "electron";
import * as path from "path";
import * as url from "url";
import { Channels, WINDOW_STATE } from '../common/window';

let window: Electron.BrowserWindow;

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

function fetchWindowState() {
    if (window.isFullScreen()) {
        return WINDOW_STATE.FULLSCREEN;
    }
    if (window.isMaximized()) {
        return WINDOW_STATE.MAXIMIZED;
    }
    if (window.isMinimized()) {
        return WINDOW_STATE.MINIMIZED;
    }
    if (!window.isVisible()) {
        return WINDOW_STATE.HIDDEN;
    }
    return WINDOW_STATE.NORMAL;
}

function createWindow() {
    // Create the browser window.
    window = new BrowserWindow({
        height: 600,
        width: 800,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
        minWidth: 500,
        minHeight: 400
    });

    window.loadURL(url.format({
        pathname: path.resolve(__dirname, "./index.html"),
        protocol: "file:",
        slashes: true,
    }));

    // window.loadURL("http://127.0.0.1:5500/build/index.html");
    // window.webContents.openDevTools();

    Menu.setApplicationMenu(null);

    // listen window control event
    ipcMain.on(Channels.FetchWindowState, (event) => {
        event.returnValue = fetchWindowState();
    });
    ipcMain.on(Channels.MinimizeWindow, (event) => {
        if (window.minimizable) {
            window.minimize();
        }
        event.returnValue = fetchWindowState();
    });
    ipcMain.on(Channels.MaximizeWindow, (event) => {
        if (window.maximizable) {
            window.maximize();
        }
        event.returnValue = fetchWindowState();
    });
    ipcMain.on(Channels.UnmaximizeWindow, (event) => {
        window.unmaximize();
        event.returnValue = fetchWindowState();
    })
    ipcMain.on(Channels.CloseWindow, (event) => {
        window.close();
        event.returnValue = WINDOW_STATE.HIDDEN;
    });

    // load components
    // let componentFactory = new ComponentFactory();
    // componentFactory.loadComponent(new ShellCom());
    // componentFactory.serve();

    // Emitted when the window is closed.
    window.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        // componentFactory.stop();
        window = null as any;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (window === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.