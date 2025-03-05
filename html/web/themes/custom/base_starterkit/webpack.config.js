const path = require("path");
const fs = require("fs");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: () => {
    const componentsPath = path.resolve(__dirname, "components");
    const srcPath = path.resolve(__dirname, "src");

    const entries = {};

    // Add entries for components files
    const addComponentsEntries = (dir) => {
      fs.readdirSync(dir).forEach((file) => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
          // Process subdirectories
          addComponentsEntries(fullPath);
        } else if (file.endsWith(".source.js")) {
          // Remove ".source" from the output name and keep the same directory structure
          const outputName = fullPath?.replace(".source.js", ".js");
          entries[outputName] = fullPath;
        } else if (file.endsWith(".source.css")) {
          // Remove ".source" from the output name and keep the same directory structure
          const outputName = fullPath
            ?.replace(`${path.resolve(__dirname)}/`, "")
            ?.replace(".source.css", ".tmpCss");

          entries[outputName] = fullPath;
        }
      });
    };

    // Add entries for src files
    const addSrcEntries = (dir) => {
      fs.readdirSync(dir).forEach((file) => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
          // Process subdirectories
          addSrcEntries(fullPath);
        } else if (file.endsWith(".js")) {
          // Keep relative path from src, save in dist/js
          const outputName = `dist/js/${path.relative(srcPath, fullPath)}`;
          entries[outputName] = fullPath;
        } else if (file.endsWith(".css")) {
          // Keep relative path from src, save in dist
          const outputName = `dist/css/${path.relative(srcPath, fullPath)}`;
          entries[outputName] = fullPath;
        }
      });
    };

    addComponentsEntries(componentsPath);
    addSrcEntries(srcPath);

    return entries;
  },
  output: {
    path: path.resolve(__dirname),
    filename: (pathData) => {
      // Disable generate tmp js file from css
      if (pathData.chunk.name.endsWith(".css")) {
        //return false;
      }

      // For components: output name already includes the original directory structure
      if (!pathData.chunk.name.startsWith("dist/")) {
        return pathData.chunk.name?.replace(`${path.resolve(__dirname)}/`, "");
      }

      // For src: filenames already prepared as dist/js/*
      return pathData.chunk.name;
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Match JavaScript files
        exclude: /node_modules/, // Exclude node_modules
        use: {
          loader: "babel-loader", // Use Babel for transpiling
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // Use MiniCssExtractPlugin for CSS
          "css-loader",
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: (pathData) =>
        `${pathData.chunk.name.replace(".cssTmp", ".css")}`,
    }),
  ],
  mode: "development", // Set mode to development for easier debugging
};
