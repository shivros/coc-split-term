module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  collectCoverageFrom: ['src/**/*.ts'],
  moduleNameMapper: {
    '^coc\\.nvim$': '<rootDir>/__mocks__/coc.nvim.ts',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
    },
  },
};
