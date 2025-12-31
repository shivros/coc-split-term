type Callback = (...args: any[]) => any;

const registeredCommands: Record<string, Callback> = {};
const registeredKeymaps: Record<string, Callback> = {};
let closeHandlers: Array<(terminal: any) => void> = [];

const createDisposable = () => ({ dispose: jest.fn() });

const window = {
  showInformationMessage: jest.fn(),
  showErrorMessage: jest.fn(),
  showWarningMessage: jest.fn(),
  createTerminal: jest.fn(),
  onDidCloseTerminal: jest.fn((callback: (terminal: any) => void) => {
    closeHandlers.push(callback);
    return createDisposable();
  }),
};

const workspace = {
  registerKeymap: jest.fn((_, name: string, callback: Callback) => {
    registeredKeymaps[name] = callback;
    return createDisposable();
  }),
};

const commands = {
  registerCommand: jest.fn((name: string, callback: Callback) => {
    registeredCommands[name] = callback;
    return createDisposable();
  }),
};

const reset = () => {
  Object.keys(registeredCommands).forEach((name) => delete registeredCommands[name]);
  Object.keys(registeredKeymaps).forEach((name) => delete registeredKeymaps[name]);
  closeHandlers = [];
  window.showInformationMessage.mockReset();
  window.showErrorMessage.mockReset();
  window.showWarningMessage.mockReset();
  window.createTerminal.mockReset();
  window.onDidCloseTerminal.mockClear();
  window.onDidCloseTerminal.mockImplementation((callback: (terminal: any) => void) => {
    closeHandlers.push(callback);
    return createDisposable();
  });
  commands.registerCommand.mockClear();
  workspace.registerKeymap.mockClear();
};

export { commands, window, workspace };
export const __mock = {
  registeredCommands,
  registeredKeymaps,
  getCloseHandlers: () => closeHandlers,
  reset,
};

export type ExtensionContext = { subscriptions: Array<{ dispose?: () => void }> };
export type Terminal = any;
