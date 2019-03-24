import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'hy-img',
  minifyJs: false,
  outputTargets:[
    { type: 'dist' },
    { type: 'www' },
    { type: 'docs' },
    // { type: 'www' },
  ],
};