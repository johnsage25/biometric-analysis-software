/* eslint-disable import/no-extraneous-dependencies */
/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2021-06-17 12:29:42
*------------------------------------------------------- */
const path = require('path');
const webpack = require('webpack');


const { processEnv } = require('@next/env');

const withAntdLess = require('next-plugin-antd-less');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
});
const lessToJS = require('less-vars-to-js');
const fs = require('fs');


// module.exports = function loadEnvConfig({ dir = process.cwd(), dev = false } = {}) {
// 	const mode = process.env.NODE_ENV || (dev ? 'development' : 'production');
// 	const dotenvFiles = [
// 		`.env.${mode}.local`,
// 		'.env.local',
// 		`.env.${mode}`,
// 		'.env',
// 	];

// 	const cachedLoadedEnvFiles = [];

// 	for (const envFile of dotenvFiles) {
// 		// only load .env if the user provided has an env config file
// 		const dotEnvPath = path.join(dir, envFile);

// 		try {
// 			const stats = fs.statSync(dotEnvPath);

// 			// make sure to only attempt to read files
// 			if (!stats.isFile()) {
// 				continue;
// 			}

// 			const contents = fs.readFileSync(dotEnvPath, 'utf8');
// 			cachedLoadedEnvFiles.push({
// 				path: envFile,
// 				contents,
// 			});
// 		} catch (err) {
// 			if (err.code !== 'ENOENT') {
// 				console.error(`Failed to load env from ${envFile}`, err);
// 			}
// 		}
// 	}

// 	const combinedEnv = processEnv(cachedLoadedEnvFiles, dir);

// 	return { combinedEnv, loadedEnvFiles: cachedLoadedEnvFiles };
// };


// const antdVariables = lessToJS(fs.readFileSync(path.resolve(__dirname, './styles/variables.less'), 'utf8'));

module.exports = withBundleAnalyzer(withAntdLess({
	// modifyVars: {
	// 	'hack': 'true;@import "~antd/lib/style/themes/compact.less";',
	// 	...antdVariables,
	// },
	lessVarsFilePath: './src/styles/variables.less',
	lessVarsFilePathAppendToEndOfContent: true,
	// optional https://github.com/webpack-contrib/css-loader#object
	cssLoaderOptions: {
		modules: {
			localIdentName: process.env.NODE_ENV !== 'production' ? '[folder]__[local]__[hash:4]' : '[hash:8]',
		},
	},

	// for Next.js ONLY
	nextjs: {
		localIdentNameFollowDev: true, // default false, for easy to debug on PROD mode
	},



	// output: 'standalone',
	// Other Config Here...
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},

	webpack(config) {
		config.module.rules.push({
			test: /\.md$/,
			use: 'frontmatter-markdown-loader',
		});

		// config.plugins.push(
		// 	new webpack.EnvironmentPlugin({
		// 		NODE_ENV: process.env.NODE_ENV,
		// 		// 'THEME': { ...antdVariables },
		// 	}),
		// );

		return config;
	},
}));