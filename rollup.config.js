import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';
import typescript from 'rollup-plugin-typescript2';
import path from 'path';

const dirs = {
  input: 'src',
  output: 'dist',
};

const override = {
  compilerOptions: {
    declarationDir: `${dirs.output}/tmp_types`,
  },
};

const external = [
  'fast-deep-equal',
  'zen-observable',
  'fp-ts/lib/Array',
  'fp-ts/lib/ReadonlyArray',
  'fp-ts/lib/function',
  'graphql',
  '@apollo/client/core',
  '@absinthe/socket',
];

export default [
  {
    input: `${dirs.input}/index.ts`,
    output: [
      {
        file: `${dirs.output}/es/index.js`,
        format: 'es',
        sourcemap: true,
        exports: 'auto',
      },
      {
        file: `${dirs.output}/cjs/index.js`,
        format: 'cjs',
        sourcemap: true,
        exports: 'auto',
      },
    ],
    external,
    plugins: [
      del({
        targets: dirs.output,
      }),
      typescript({
        // Keep cache for each package in root
        cacheRoot: path.join(__dirname, 'node_modules/.cache/rpt2'),
        useTsconfigDeclarationDir: true,
        tsconfigOverride: override,
      }),
    ],
  },
  {
    input: `${dirs.output}/tmp_types/index.d.ts`,
    output: [
      {
        file: `${dirs.output}/types/index.d.ts`,
        format: 'es',
      },
    ],
    plugins: [
      dts(),
      del({
        targets: `${dirs.output}/tmp_types`,
        hook: 'buildEnd',
      }),
    ],
  },
];
