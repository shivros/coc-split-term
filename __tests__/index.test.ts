const createTerminal = () => ({
  name: 'coc-terminal',
  hide: jest.fn(),
  show: jest.fn().mockResolvedValue(true),
  dispose: jest.fn(),
  processId: Promise.resolve(42),
});

const setup = async () => {
  jest.resetModules();
  const coc = require('coc.nvim');
  coc.__mock.reset();
  const terminal = createTerminal();
  coc.window.createTerminal.mockResolvedValue(terminal);

  const { activate } = await import('../src/index');
  await activate({ subscriptions: [] } as any);

  return { coc, terminal };
};

describe('coc-split-term commands', () => {
  it('toggles terminal visibility via split-term.Toggle', async () => {
    const { coc, terminal } = await setup();

    await coc.__mock.registeredCommands['split-term.Toggle']();
    expect(coc.window.createTerminal).toHaveBeenCalledTimes(1);
    expect(terminal.show).toHaveBeenCalledTimes(1);

    await coc.__mock.registeredCommands['split-term.Toggle']();
    expect(terminal.hide).toHaveBeenCalledTimes(1);
  });

  it('recreates the terminal when it is closed externally', async () => {
    const { coc, terminal } = await setup();

    await coc.__mock.registeredCommands['split-term.Toggle']();
    const closeHandler = coc.__mock.getCloseHandlers()[0];
    closeHandler(terminal);

    await coc.__mock.registeredCommands['split-term.Toggle']();
    expect(coc.window.createTerminal).toHaveBeenCalledTimes(2);
  });

  it('retries showing when terminal.show returns false', async () => {
    jest.resetModules();
    const coc = require('coc.nvim');
    coc.__mock.reset();
    const terminal = createTerminal();
    terminal.show.mockResolvedValueOnce(false).mockResolvedValue(true);
    coc.window.createTerminal.mockResolvedValue(terminal);

    const { activate } = await import('../src/index');
    await activate({ subscriptions: [] } as any);

    await coc.__mock.registeredCommands['split-term.Show']();

    expect(coc.window.createTerminal).toHaveBeenCalledTimes(2);
    expect(terminal.show).toHaveBeenCalledTimes(2);
  });
});
