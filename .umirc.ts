export default {
  ssr: {},
  hash: true,
  title: 'paxy-ui',
  mode: 'doc',
  navs: {
    'en-US': [
      null,
      { title: 'GitHub', path: 'https://github.com/paxy-dev/paxy-ui' },
      { title: 'Changelog', path: 'https://github.com/paxy-dev/paxy-ui/releases' },
    ],
  },
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
      },
    ],
  ],
};
