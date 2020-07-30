import del from "rollup-plugin-delete";
import dts from "rollup-plugin-dts";
import typescript from "rollup-plugin-typescript2";

// eslint-disable-next-line import/no-dynamic-require, @typescript-eslint/no-var-requires
const pkg = require(`${process.cwd()}/package.json`);

const dirs = {
  input: "src",
  output: "dist",
};

const override = {
  compilerOptions: {
    declaration: true,
    declarationDir: `${dirs.output}/tmp_types`,
  },
};

export default [
  {
    input: `${dirs.input}/index.ts`,
    output: [
      {
        file: `${dirs.output}/es/index.js`,
        format: "es",
        sourcemap: true,
      },
      {
        file: `${dirs.output}/cjs/index.js`,
        format: "cjs",
        sourcemap: true,
      },
    ],
    plugins: [
      del({
        targets: dirs.output,
      }),
      typescript({
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
        format: "es",
      },
    ],
    plugins: [
      dts(),
      del({
        targets: `${dirs.output}/tmp_types`,
        hook: "buildEnd",
      }),
    ],
  },
];
