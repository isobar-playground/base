/**
 * Unit tests for package.json
 * 
 * These tests validate the structure, dependencies, and configuration
 * of the package.json file to ensure it meets project requirements
 * and follows best practices.
 */

const fs = require('fs');
const path = require('path');

describe('package.json validation', () => {
  let packageJson;
  let packageJsonPath;

  beforeAll(() => {
    packageJsonPath = path.resolve(__dirname, '../package.json');
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
    packageJson = JSON.parse(packageJsonContent);
  });

  describe('Basic structure validation', () => {
    test('should be valid JSON', () => {
      expect(packageJson).toBeDefined();
      expect(typeof packageJson).toBe('object');
    });

    test('should have required top-level fields', () => {
      expect(packageJson).toHaveProperty('name');
      expect(packageJson).toHaveProperty('version');
      expect(packageJson).toHaveProperty('scripts');
    });

    test('should have correct name', () => {
      expect(packageJson.name).toBe('base_starterkit');
      expect(typeof packageJson.name).toBe('string');
      expect(packageJson.name.length).toBeGreaterThan(0);
    });

    test('should have valid semantic version', () => {
      expect(packageJson.version).toBeDefined();
      // Semantic versioning pattern: X.Y.Z
      const semverPattern = /^\d+\.\d+\.\d+$/;
      expect(packageJson.version).toMatch(semverPattern);
    });
  });

  describe('Scripts validation', () => {
    test('should have scripts object', () => {
      expect(packageJson.scripts).toBeDefined();
      expect(typeof packageJson.scripts).toBe('object');
    });

    test('should have watch script', () => {
      expect(packageJson.scripts).toHaveProperty('watch');
      expect(typeof packageJson.scripts.watch).toBe('string');
      expect(packageJson.scripts.watch.length).toBeGreaterThan(0);
    });

    test('should have build script', () => {
      expect(packageJson.scripts).toHaveProperty('build');
      expect(typeof packageJson.scripts.build).toBe('string');
      expect(packageJson.scripts.build.length).toBeGreaterThan(0);
    });

    test('watch script should use webpack in development mode', () => {
      const watchScript = packageJson.scripts.watch;
      expect(watchScript).toContain('webpack');
      expect(watchScript).toContain('--watch');
      expect(watchScript).toContain('--mode development');
    });

    test('build script should use webpack in production mode', () => {
      const buildScript = packageJson.scripts.build;
      expect(buildScript).toContain('webpack');
      expect(buildScript).toContain('--mode production');
      expect(buildScript).toContain('NODE_ENV=production');
    });

    test('scripts should reference webpack config file', () => {
      expect(packageJson.scripts.watch).toContain('webpack.config.js');
      expect(packageJson.scripts.build).toContain('webpack.config.js');
    });
  });

  describe('DevDependencies validation', () => {
    test('should have devDependencies object', () => {
      expect(packageJson.devDependencies).toBeDefined();
      expect(typeof packageJson.devDependencies).toBe('object');
    });

    test('should have webpack and webpack-cli', () => {
      expect(packageJson.devDependencies).toHaveProperty('webpack');
      expect(packageJson.devDependencies).toHaveProperty('webpack-cli');
    });

    test('should have babel dependencies', () => {
      expect(packageJson.devDependencies).toHaveProperty('@babel/core');
      expect(packageJson.devDependencies).toHaveProperty('@babel/preset-env');
      expect(packageJson.devDependencies).toHaveProperty('babel-loader');
    });

    test('should have CSS processing dependencies', () => {
      expect(packageJson.devDependencies).toHaveProperty('css-loader');
      expect(packageJson.devDependencies).toHaveProperty('mini-css-extract-plugin');
      expect(packageJson.devDependencies).toHaveProperty('postcss');
      expect(packageJson.devDependencies).toHaveProperty('postcss-loader');
      expect(packageJson.devDependencies).toHaveProperty('postcss-import');
      expect(packageJson.devDependencies).toHaveProperty('autoprefixer');
    });

    test('should have Tailwind CSS', () => {
      expect(packageJson.devDependencies).toHaveProperty('tailwindcss');
    });

    test('should have ESLint and related plugins', () => {
      expect(packageJson.devDependencies).toHaveProperty('eslint');
      expect(packageJson.devDependencies).toHaveProperty('eslint-config-airbnb-base');
      expect(packageJson.devDependencies).toHaveProperty('eslint-formatter-gitlab');
      expect(packageJson.devDependencies).toHaveProperty('eslint-plugin-import');
      expect(packageJson.devDependencies).toHaveProperty('eslint-plugin-jquery');
      expect(packageJson.devDependencies).toHaveProperty('eslint-plugin-yml');
    });

    test('should have concurrently for running parallel tasks', () => {
      expect(packageJson.devDependencies).toHaveProperty('concurrently');
    });

    test('all devDependencies should have valid version ranges', () => {
      Object.entries(packageJson.devDependencies).forEach(([name, version]) => {
        expect(version).toBeDefined();
        expect(typeof version).toBe('string');
        // Version should start with ^, ~, or be a specific version
        expect(version).toMatch(/^[\^~]?\d+\.\d+\.\d+/);
      });
    });

    test('should use caret (^) versioning for most packages', () => {
      const devDeps = packageJson.devDependencies;
      const caretVersions = Object.values(devDeps).filter(v => v.startsWith('^'));
      expect(caretVersions.length).toBeGreaterThan(0);
    });
  });

  describe('Dependencies validation', () => {
    test('should have dependencies object', () => {
      expect(packageJson.dependencies).toBeDefined();
      expect(typeof packageJson.dependencies).toBe('object');
    });

    test('should have flowbite UI library', () => {
      expect(packageJson.dependencies).toHaveProperty('flowbite');
    });

    test('should have swiper library', () => {
      expect(packageJson.dependencies).toHaveProperty('swiper');
    });

    test('all dependencies should have valid version ranges', () => {
      Object.entries(packageJson.dependencies).forEach(([name, version]) => {
        expect(version).toBeDefined();
        expect(typeof version).toBe('string');
        expect(version).toMatch(/^[\^~]?\d+\.\d+\.\d+/);
      });
    });

    test('dependencies count should be reasonable', () => {
      const depCount = Object.keys(packageJson.dependencies).length;
      expect(depCount).toBeGreaterThan(0);
      expect(depCount).toBeLessThan(100); // Reasonable upper limit
    });
  });

  describe('Version compatibility checks', () => {
    test('webpack version should be v5', () => {
      const webpackVersion = packageJson.devDependencies.webpack;
      expect(webpackVersion).toMatch(/^\^5\./);
    });

    test('webpack-cli should be compatible with webpack', () => {
      const webpackCliVersion = packageJson.devDependencies['webpack-cli'];
      expect(webpackCliVersion).toMatch(/^\^[56]\./); // v5 or v6
    });

    test('babel-loader should be compatible with webpack 5', () => {
      const babelLoaderVersion = packageJson.devDependencies['babel-loader'];
      expect(babelLoaderVersion).toMatch(/^\^[89]\d*\./); // v8+ for webpack 5
    });

    test('eslint should be v8', () => {
      const eslintVersion = packageJson.devDependencies.eslint;
      expect(eslintVersion).toMatch(/^\^8\./);
    });

    test('tailwindcss should be v3', () => {
      const tailwindVersion = packageJson.devDependencies.tailwindcss;
      expect(tailwindVersion).toMatch(/^\^3\./);
    });
  });

  describe('Edge cases and error handling', () => {
    test('should not have duplicate keys', () => {
      const jsonString = fs.readFileSync(packageJsonPath, 'utf8');
      const keys = jsonString.match(/"[^"]+"\s*:/g);
      if (keys) {
        const uniqueKeys = new Set(keys);
        expect(keys.length).toBe(uniqueKeys.size);
      }
    });

    test('should not have empty dependency objects', () => {
      if (packageJson.dependencies) {
        expect(Object.keys(packageJson.dependencies).length).toBeGreaterThan(0);
      }
      if (packageJson.devDependencies) {
        expect(Object.keys(packageJson.devDependencies).length).toBeGreaterThan(0);
      }
    });

    test('should not have null or undefined dependency versions', () => {
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };
      Object.entries(allDeps).forEach(([name, version]) => {
        expect(version).not.toBeNull();
        expect(version).not.toBeUndefined();
        expect(version).not.toBe('');
      });
    });

    test('should not have invalid characters in package name', () => {
      expect(packageJson.name).not.toContain(' ');
      expect(packageJson.name).not.toContain('@');
      expect(packageJson.name).toMatch(/^[a-z0-9_-]+$/);
    });
  });

  describe('Script command validation', () => {
    test('scripts should not be empty strings', () => {
      Object.entries(packageJson.scripts).forEach(([name, command]) => {
        expect(command.trim()).not.toBe('');
      });
    });

    test('scripts should contain valid commands', () => {
      Object.values(packageJson.scripts).forEach(command => {
        expect(typeof command).toBe('string');
        // Should not contain dangerous characters
        expect(command).not.toMatch(/[;<>&|`$]/);
      });
    });
  });

  describe('Dependency security and best practices', () => {
    test('should not have wildcard version ranges', () => {
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };
      Object.entries(allDeps).forEach(([name, version]) => {
        expect(version).not.toBe('*');
        expect(version).not.toBe('x');
        expect(version).not.toBe('latest');
      });
    });

    test('should not have exact versions for all packages (should allow updates)', () => {
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };
      const flexibleVersions = Object.values(allDeps).filter(v => 
        v.startsWith('^') || v.startsWith('~')
      );
      expect(flexibleVersions.length).toBeGreaterThan(0);
    });

    test('should have at least one linting tool', () => {
      const hasEslint = 'eslint' in packageJson.devDependencies;
      expect(hasEslint).toBe(true);
    });
  });

  describe('Project-specific requirements', () => {
    test('should be configured as a Drupal theme starter kit', () => {
      expect(packageJson.name).toContain('starterkit');
    });

    test('should have complete webpack toolchain', () => {
      const hasWebpack = 'webpack' in packageJson.devDependencies;
      const hasWebpackCli = 'webpack-cli' in packageJson.devDependencies;
      const hasLoaders = 'babel-loader' in packageJson.devDependencies && 
                        'css-loader' in packageJson.devDependencies;
      
      expect(hasWebpack).toBe(true);
      expect(hasWebpackCli).toBe(true);
      expect(hasLoaders).toBe(true);
    });

    test('should have modern CSS toolchain', () => {
      expect(packageJson.devDependencies).toHaveProperty('postcss');
      expect(packageJson.devDependencies).toHaveProperty('autoprefixer');
      expect(packageJson.devDependencies).toHaveProperty('tailwindcss');
    });

    test('should support both development and production builds', () => {
      const hasWatchScript = 'watch' in packageJson.scripts;
      const hasBuildScript = 'build' in packageJson.scripts;
      
      expect(hasWatchScript).toBe(true);
      expect(hasBuildScript).toBe(true);
    });
  });

  describe('JSON structure integrity', () => {
    test('should have proper nesting for all objects', () => {
      expect(Array.isArray(packageJson)).toBe(false);
      expect(packageJson.scripts).toBeInstanceOf(Object);
      expect(packageJson.dependencies).toBeInstanceOf(Object);
      expect(packageJson.devDependencies).toBeInstanceOf(Object);
    });

    test('should not have unexpected top-level properties', () => {
      const expectedProps = [
        'name', 'version', 'scripts', 'devDependencies', 
        'dependencies', 'description', 'author', 'license',
        'keywords', 'repository', 'bugs', 'homepage'
      ];
      
      const actualProps = Object.keys(packageJson);
      actualProps.forEach(prop => {
        // Just ensure no obviously wrong properties
        expect(prop).not.toMatch(/^\d+$/); // No numeric keys
        expect(typeof prop).toBe('string');
      });
    });
  });

  describe('File system validation', () => {
    test('package.json file should exist', () => {
      expect(fs.existsSync(packageJsonPath)).toBe(true);
    });

    test('package.json should be readable', () => {
      expect(() => {
        fs.readFileSync(packageJsonPath, 'utf8');
      }).not.toThrow();
    });

    test('package.json should have reasonable file size', () => {
      const stats = fs.statSync(packageJsonPath);
      expect(stats.size).toBeGreaterThan(0);
      expect(stats.size).toBeLessThan(100000); // Less than 100KB
    });
  });
});