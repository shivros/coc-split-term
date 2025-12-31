import { commands, ExtensionContext, Terminal, window, workspace } from 'coc.nvim';

let terminal: Terminal | null = null;
let showing = false;

export async function activate(context: ExtensionContext): Promise<void> {
  window.showInformationMessage(`werd ${Math.floor(Math.random() * 10000 + 1)}`);

  context.subscriptions.push(
    commands.registerCommand('split-term.Toggle', async () => {
      await toggle();
    }),
    commands.registerCommand('split-term.Hide', async () => {
      await hide();
    }),

    commands.registerCommand('split-term.Show', async () => {
      await show();
    }),

    commands.registerCommand('split-term.Destroy', () => {
      if (terminal) {
        terminal.dispose();
        terminal = null;
        showing = false;
      }
    }),

    workspace.registerKeymap(
      ['n'],
      'split-term-toggle',
      async () => {
        window.showInformationMessage(`tog: PID ${terminal ? await terminal.processId : -1}`);
        await toggle();
      },
      { sync: false }
    ),

    workspace.registerKeymap(
      ['n'],
      'split-term-hide',
      async () => {
        window.showInformationMessage(`hide: PID ${terminal ? await terminal.processId : -1}`);
        await hide();
      },
      { sync: false }
    ),

    workspace.registerKeymap(
      ['n'],
      'split-term-show',
      async () => {
        window.showInformationMessage(`show: PID ${terminal ? await terminal.processId : -1}`);
        await show();
      },
      { sync: false }
    )
  );
}

async function setTerminal(): Promise<boolean> {
  if (terminal) {
    return true;
  } else {
    terminal = await window.createTerminal({ name: 'coc-terminal' });
    if (terminal) {
      window.onDidCloseTerminal((closed) => {
        if (closed === terminal) {
          window.showWarningMessage(`terminal closed: ${closed.name}`);
          terminal = null;
          showing = false;
        }
      });
      return true;
    }
  }
  window.showErrorMessage(`Create terminal failed`);
  return false;
}

async function hide(): Promise<void> {
  if (terminal) {
    window.showInformationMessage(`term: ${terminal}`);
    terminal.hide();
  }

  showing = false;
}

async function show(): Promise<void> {
  if (!(await setTerminal())) {
    showing = false;
    window.showErrorMessage(`Show terminal failed`);
    return;
  }

  if (!terminal) {
    return;
  }

  if (!(await terminal.show())) {
    terminal = null;
    await show();
  }
  showing = true;
}

async function toggle(): Promise<void> {
  if (showing) {
    await hide();
  } else {
    await show();
  }
}
