// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
      exports: 'named',
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      clean: true,
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          declarationDir: 'dist',
        },
        exclude: ['**/__tests__', '**/*.test.ts', '**/*.test.tsx']
      }
    }),
    terser(), // Minify the output
  ],
  external: ['react', 'react-dom'],
};