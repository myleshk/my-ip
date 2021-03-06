// vue.config.js
module.exports = {
	chainWebpack: config => {
		// GraphQL Loader
		config.module
			.rule("markdown")
			.test(/\.md$/i)
			.use('raw-loader')
			.loader('raw-loader')
			.end()
	}
};
