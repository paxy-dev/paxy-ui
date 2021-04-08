const isProd = process.env.NODE_ENV === 'prod';

export default [
  {
    target: 'node',
    cjs: { type: 'babel', lazy: true },
    disableTypeCheck: true,
    extraBabelPlugins: [
      [
        'babel-plugin-import',
        { libraryName: 'antd', libraryDirectory: 'es', style: true },
        'antd',
      ],
    ],
  },
  {
    entry: 'components/index.tsx',
    esm: 'rollup',
    extraExternals: ['antd', 'react', 'react-dom', 'xterm'],
    typescriptOpts: {
      check: false,
      globals: {
        antd: 'window.antd',
        react: 'window.React',
        'react-dom': 'window.ReactDOM',
      },
    },
    extraBabelPlugins: [
      [
        'babel-plugin-import',
        { libraryName: 'antd', libraryDirectory: 'es', style: true },
        'antd',
      ],
    ],
  },
];
