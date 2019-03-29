import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'hy-img',
  outputTargets:[
    { type: 'dist' },
    { type: 'docs' },
  ],
};