// @flow
/* eslint-disable import/no-dynamic-require */

import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import globby from "globby";
import {pascalCase} from "pascal-case";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

// $FlowFixMe
const pkg = require(`${process.cwd()}/package.json`);

const dirs = {
  input: "src",
  output: "dist",
  compat: "compat",
};

const plugins = {
  babel: babel({
    configFile: "../../.babelrc",
    exclude: ["node_modules/**", "../../node_modules/**"],
    babelHelpers: "runtime",
  }),
  commonjs: commonjs({}),
  resolve: resolve(),
  typescript: typescript(),
};

const getCjsAndEsConfig = (fileName) => ({
  input: `${dirs.input}/${fileName}`,
  output: [
    {
      file: `${dirs.output}/${fileName}`,
      format: "es",
      sourcemap: true,
    },
    {
      file: `${dirs.compat}/cjs/${fileName}`,
      format: "cjs",
      sourcemap: true,
    },
  ],
  plugins: [plugins.babel],
});

const sources = globby.sync("**/*js", {cwd: dirs.input});

// eslint-disable-next-line no-unused-vars
const getUnscopedName = (pkg) => {
  const [scope, name] = pkg.name.split("/");

  return pascalCase(scope) + pascalCase(name);
};

export default [
  {
    input: `${dirs.input}/index.js`,
    output: {
      file: `${dirs.compat}/umd/index.js`,
      format: "umd",
      name: pascalCase(getUnscopedName(pkg)),
      sourcemap: true,
    },
    plugins: [
      plugins.babel,
      plugins.resolve,
      plugins.commonjs,
      plugins.typescript,
    ],
  },
  ...sources.map(getCjsAndEsConfig),
];
