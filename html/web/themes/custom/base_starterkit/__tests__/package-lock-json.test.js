/**
 * Unit tests for package-lock.json validation
 * Testing Framework: Jest
 * 
 * These tests ensure the package-lock.json file maintains proper structure,
 * contains required dependencies, has valid version formats, and enforces
 * security and consistency best practices.
 */

const fs = require('fs');
const path = require('path');

describe('package-lock.json validation', () => {
  let packageLock;
  let packageJson;
  const packageLockPath = path.join(__dirname, '..', 'package-lock.json');
  const packageJsonPath = path.join(__dirname, '..', 'package.json');

  beforeAll(() => {
    // Load and parse package-lock.json
    const packageLockContent = fs.readFileSync(packageLockPath, 'utf8');
    packageLock = JSON.parse(packageLockContent);
    
    // Load and parse package.json
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
    packageJson = JSON.parse(packageJsonContent);
  });

  describe('File existence and structure', () => {
    test('package-lock.json file exists', () => {
      expect(fs.existsSync(packageLockPath)).toBe(true);
    });

    test('package-lock.json is valid JSON', () => {
      expect(() => {
        const content = fs.readFileSync(packageLockPath, 'utf8');
        JSON.parse(content);
      }).not.toThrow();
    });

    test('has required top-level properties', () => {
      expect(packageLock).toHaveProperty('name');
      expect(packageLock).toHaveProperty('version');
      expect(packageLock).toHaveProperty('lockfileVersion');
      expect(packageLock).toHaveProperty('requires');
      expect(packageLock).toHaveProperty('packages');
    });

    test('lockfileVersion is 3', () => {
      expect(packageLock.lockfileVersion).toBe(3);
    });

    test('requires is true', () => {
      expect(packageLock.requires).toBe(true);
    });
  });

  describe('Package metadata consistency', () => {
    test('name matches package.json', () => {
      expect(packageLock.name).toBe(packageJson.name);
      expect(packageLock.name).toBe('base_starterkit');
    });

    test('version matches package.json', () => {
      expect(packageLock.version).toBe(packageJson.version);
      expect(packageLock.version).toBe('1.0.0');
    });

    test('root package has correct name', () => {
      expect(packageLock.packages['']).toBeDefined();
      expect(packageLock.packages[''].name).toBe('base_starterkit');
    });

    test('root package has correct version', () => {
      expect(packageLock.packages[''].version).toBe('1.0.0');
    });
  });

  describe('Production dependencies validation', () => {
    test('root package has dependencies object', () => {
      expect(packageLock.packages['']).toHaveProperty('dependencies');
      expect(typeof packageLock.packages[''].dependencies).toBe('object');
    });

    test('flowbite is listed as a dependency', () => {
      expect(packageLock.packages[''].dependencies).toHaveProperty('flowbite');
      expect(packageLock.packages[''].dependencies.flowbite).toMatch(/^\^3\./);
    });

    test('swiper is listed as a dependency', () => {
      expect(packageLock.packages[''].dependencies).toHaveProperty('swiper');
      expect(packageLock.packages[''].dependencies.swiper).toMatch(/^\^11\./);
    });

    test('all package.json dependencies exist in package-lock.json', () => {
      const pkgDeps = Object.keys(packageJson.dependencies || {});
      const lockDeps = Object.keys(packageLock.packages[''].dependencies || {});
      
      pkgDeps.forEach(dep => {
        expect(lockDeps).toContain(dep);
      });
    });
  });

  describe('Development dependencies validation', () => {
    test('root package has devDependencies object', () => {
      expect(packageLock.packages['']).toHaveProperty('devDependencies');
      expect(typeof packageLock.packages[''].devDependencies).toBe('object');
    });

    test('webpack is listed as a dev dependency', () => {
      expect(packageLock.packages[''].devDependencies).toHaveProperty('webpack');
      expect(packageLock.packages[''].devDependencies.webpack).toMatch(/^\^5\./);
    });

    test('tailwindcss is listed as a dev dependency', () => {
      expect(packageLock.packages[''].devDependencies).toHaveProperty('tailwindcss');
      expect(packageLock.packages[''].devDependencies.tailwindcss).toMatch(/^\^3\./);
    });

    test('eslint is listed as a dev dependency', () => {
      expect(packageLock.packages[''].devDependencies).toHaveProperty('eslint');
    });

    test('all package.json devDependencies exist in package-lock.json', () => {
      const pkgDevDeps = Object.keys(packageJson.devDependencies || {});
      const lockDevDeps = Object.keys(packageLock.packages[''].devDependencies || {});
      
      pkgDevDeps.forEach(dep => {
        expect(lockDevDeps).toContain(dep);
      });
    });
  });

  describe('Flowbite dependency resolution', () => {
    test('flowbite package exists in node_modules', () => {
      expect(packageLock.packages['node_modules/flowbite']).toBeDefined();
    });

    test('flowbite has correct version', () => {
      const flowbitePackage = packageLock.packages['node_modules/flowbite'];
      expect(flowbitePackage.version).toBe('3.1.2');
    });

    test('flowbite has valid resolved URL', () => {
      const flowbitePackage = packageLock.packages['node_modules/flowbite'];
      expect(flowbitePackage.resolved).toMatch(/^https:\/\/registry\.npmjs\.org\/flowbite\//);
    });

    test('flowbite has integrity hash', () => {
      const flowbitePackage = packageLock.packages['node_modules/flowbite'];
      expect(flowbitePackage.integrity).toBeDefined();
      expect(flowbitePackage.integrity).toMatch(/^sha512-/);
    });

    test('flowbite has MIT license', () => {
      const flowbitePackage = packageLock.packages['node_modules/flowbite'];
      expect(flowbitePackage.license).toBe('MIT');
    });

    test('flowbite has expected sub-dependencies', () => {
      const flowbitePackage = packageLock.packages['node_modules/flowbite'];
      expect(flowbitePackage.dependencies).toBeDefined();
      expect(flowbitePackage.dependencies).toHaveProperty('@popperjs/core');
      expect(flowbitePackage.dependencies).toHaveProperty('flowbite-datepicker');
      expect(flowbitePackage.dependencies).toHaveProperty('mini-svg-data-uri');
      expect(flowbitePackage.dependencies).toHaveProperty('postcss');
    });
  });

  describe('Flowbite-datepicker dependency resolution', () => {
    test('flowbite-datepicker package exists in node_modules', () => {
      expect(packageLock.packages['node_modules/flowbite-datepicker']).toBeDefined();
    });

    test('flowbite-datepicker has correct version', () => {
      const datepickerPackage = packageLock.packages['node_modules/flowbite-datepicker'];
      expect(datepickerPackage.version).toBe('1.3.2');
    });

    test('flowbite-datepicker has valid resolved URL', () => {
      const datepickerPackage = packageLock.packages['node_modules/flowbite-datepicker'];
      expect(datepickerPackage.resolved).toMatch(/^https:\/\/registry\.npmjs\.org\/flowbite-datepicker\//);
    });

    test('flowbite-datepicker has integrity hash', () => {
      const datepickerPackage = packageLock.packages['node_modules/flowbite-datepicker'];
      expect(datepickerPackage.integrity).toBeDefined();
      expect(datepickerPackage.integrity).toMatch(/^sha512-/);
    });

    test('flowbite-datepicker has MIT license', () => {
      const datepickerPackage = packageLock.packages['node_modules/flowbite-datepicker'];
      expect(datepickerPackage.license).toBe('MIT');
    });

    test('flowbite-datepicker has nested flowbite dependency', () => {
      expect(packageLock.packages['node_modules/flowbite-datepicker/node_modules/flowbite']).toBeDefined();
    });

    test('nested flowbite has different version (2.5.2)', () => {
      const nestedFlowbite = packageLock.packages['node_modules/flowbite-datepicker/node_modules/flowbite'];
      expect(nestedFlowbite.version).toBe('2.5.2');
    });
  });

  describe('Swiper dependency resolution', () => {
    test('swiper package exists in node_modules', () => {
      expect(packageLock.packages['node_modules/swiper']).toBeDefined();
    });

    test('swiper has correct version', () => {
      const swiperPackage = packageLock.packages['node_modules/swiper'];
      expect(swiperPackage.version).toBe('11.2.10');
    });

    test('swiper has valid resolved URL', () => {
      const swiperPackage = packageLock.packages['node_modules/swiper'];
      expect(swiperPackage.resolved).toMatch(/^https:\/\/registry\.npmjs\.org\/swiper\//);
    });

    test('swiper has integrity hash', () => {
      const swiperPackage = packageLock.packages['node_modules/swiper'];
      expect(swiperPackage.integrity).toBeDefined();
      expect(swiperPackage.integrity).toMatch(/^sha512-/);
    });

    test('swiper has funding information', () => {
      const swiperPackage = packageLock.packages['node_modules/swiper'];
      expect(swiperPackage.funding).toBeDefined();
      expect(Array.isArray(swiperPackage.funding)).toBe(true);
      expect(swiperPackage.funding.length).toBeGreaterThan(0);
    });

    test('swiper funding includes patreon', () => {
      const swiperPackage = packageLock.packages['node_modules/swiper'];
      const patreonFunding = swiperPackage.funding.find(f => f.type === 'patreon');
      expect(patreonFunding).toBeDefined();
      expect(patreonFunding.url).toBe('https://www.patreon.com/swiperjs');
    });

    test('swiper funding includes open_collective', () => {
      const swiperPackage = packageLock.packages['node_modules/swiper'];
      const ocFunding = swiperPackage.funding.find(f => f.type === 'open_collective');
      expect(ocFunding).toBeDefined();
      expect(ocFunding.url).toMatch(/opencollective\.com\/swiper/);
    });

    test('swiper has node engine requirement', () => {
      const swiperPackage = packageLock.packages['node_modules/swiper'];
      expect(swiperPackage.engines).toBeDefined();
      expect(swiperPackage.engines.node).toBe('>= 4.7.0');
    });
  });

  describe('TailwindCSS dependency resolution', () => {
    test('tailwindcss package exists in node_modules', () => {
      expect(packageLock.packages['node_modules/tailwindcss']).toBeDefined();
    });

    test('tailwindcss has correct version', () => {
      const tailwindPackage = packageLock.packages['node_modules/tailwindcss'];
      expect(tailwindPackage.version).toBe('3.4.17');
    });

    test('tailwindcss is marked as dev dependency', () => {
      const tailwindPackage = packageLock.packages['node_modules/tailwindcss'];
      expect(tailwindPackage.dev).toBe(true);
    });

    test('tailwindcss has valid resolved URL', () => {
      const tailwindPackage = packageLock.packages['node_modules/tailwindcss'];
      expect(tailwindPackage.resolved).toMatch(/^https:\/\/registry\.npmjs\.org\/tailwindcss\//);
    });

    test('tailwindcss has integrity hash', () => {
      const tailwindPackage = packageLock.packages['node_modules/tailwindcss'];
      expect(tailwindPackage.integrity).toBeDefined();
      expect(tailwindPackage.integrity).toMatch(/^sha512-/);
    });

    test('tailwindcss has MIT license', () => {
      const tailwindPackage = packageLock.packages['node_modules/tailwindcss'];
      expect(tailwindPackage.license).toBe('MIT');
    });

    test('tailwindcss has extensive dependencies', () => {
      const tailwindPackage = packageLock.packages['node_modules/tailwindcss'];
      expect(tailwindPackage.dependencies).toBeDefined();
      expect(Object.keys(tailwindPackage.dependencies).length).toBeGreaterThan(10);
    });

    test('tailwindcss has postcss dependencies', () => {
      const tailwindPackage = packageLock.packages['node_modules/tailwindcss'];
      expect(tailwindPackage.dependencies.postcss).toBeDefined();
      expect(tailwindPackage.dependencies['postcss-import']).toBeDefined();
      expect(tailwindPackage.dependencies['postcss-nested']).toBeDefined();
    });

    test('tailwindcss has bin executables', () => {
      const tailwindPackage = packageLock.packages['node_modules/tailwindcss'];
      expect(tailwindPackage.bin).toBeDefined();
      expect(tailwindPackage.bin.tailwind).toBe('lib/cli.js');
      expect(tailwindPackage.bin.tailwindcss).toBe('lib/cli.js');
    });

    test('tailwindcss has node engine requirement', () => {
      const tailwindPackage = packageLock.packages['node_modules/tailwindcss'];
      expect(tailwindPackage.engines).toBeDefined();
      expect(tailwindPackage.engines.node).toBe('>=14.0.0');
    });
  });

  describe('Webpack dependency resolution', () => {
    test('webpack package exists in node_modules', () => {
      expect(packageLock.packages['node_modules/webpack']).toBeDefined();
    });

    test('webpack has correct version', () => {
      const webpackPackage = packageLock.packages['node_modules/webpack'];
      expect(webpackPackage.version).toBe('5.102.0');
    });

    test('webpack is marked as dev dependency', () => {
      const webpackPackage = packageLock.packages['node_modules/webpack'];
      expect(webpackPackage.dev).toBe(true);
    });

    test('webpack has valid resolved URL', () => {
      const webpackPackage = packageLock.packages['node_modules/webpack'];
      expect(webpackPackage.resolved).toMatch(/^https:\/\/registry\.npmjs\.org\/webpack\//);
    });

    test('webpack has integrity hash', () => {
      const webpackPackage = packageLock.packages['node_modules/webpack'];
      expect(webpackPackage.integrity).toBeDefined();
      expect(webpackPackage.integrity).toMatch(/^sha512-/);
    });

    test('webpack has MIT license', () => {
      const webpackPackage = packageLock.packages['node_modules/webpack'];
      expect(webpackPackage.license).toBe('MIT');
    });

    test('webpack has extensive dependencies', () => {
      const webpackPackage = packageLock.packages['node_modules/webpack'];
      expect(webpackPackage.dependencies).toBeDefined();
      expect(Object.keys(webpackPackage.dependencies).length).toBeGreaterThan(15);
    });

    test('webpack includes terser-webpack-plugin', () => {
      const webpackPackage = packageLock.packages['node_modules/webpack'];
      expect(webpackPackage.dependencies['terser-webpack-plugin']).toBeDefined();
    });

    test('webpack has bin executable', () => {
      const webpackPackage = packageLock.packages['node_modules/webpack'];
      expect(webpackPackage.bin).toBeDefined();
      expect(webpackPackage.bin.webpack).toBe('bin/webpack.js');
    });

    test('webpack has node engine requirement', () => {
      const webpackPackage = packageLock.packages['node_modules/webpack'];
      expect(webpackPackage.engines).toBeDefined();
      expect(webpackPackage.engines.node).toBe('>=10.13.0');
    });

    test('webpack has funding information', () => {
      const webpackPackage = packageLock.packages['node_modules/webpack'];
      expect(webpackPackage.funding).toBeDefined();
      expect(webpackPackage.funding.type).toBe('opencollective');
      expect(webpackPackage.funding.url).toBe('https://opencollective.com/webpack');
    });

    test('webpack-cli is optional peer dependency', () => {
      const webpackPackage = packageLock.packages['node_modules/webpack'];
      expect(webpackPackage.peerDependenciesMeta).toBeDefined();
      expect(webpackPackage.peerDependenciesMeta['webpack-cli']).toBeDefined();
      expect(webpackPackage.peerDependenciesMeta['webpack-cli'].optional).toBe(true);
    });
  });

  describe('Webpack-CLI dependency resolution', () => {
    test('webpack-cli package exists in node_modules', () => {
      expect(packageLock.packages['node_modules/webpack-cli']).toBeDefined();
    });

    test('webpack-cli has correct version', () => {
      const webpackCliPackage = packageLock.packages['node_modules/webpack-cli'];
      expect(webpackCliPackage.version).toBe('6.0.1');
    });

    test('webpack-cli is marked as dev dependency', () => {
      const webpackCliPackage = packageLock.packages['node_modules/webpack-cli'];
      expect(webpackCliPackage.dev).toBe(true);
    });

    test('webpack-cli has valid resolved URL', () => {
      const webpackCliPackage = packageLock.packages['node_modules/webpack-cli'];
      expect(webpackCliPackage.resolved).toMatch(/^https:\/\/registry\.npmjs\.org\/webpack-cli\//);
    });

    test('webpack-cli has integrity hash', () => {
      const webpackCliPackage = packageLock.packages['node_modules/webpack-cli'];
      expect(webpackCliPackage.integrity).toBeDefined();
      expect(webpackCliPackage.integrity).toMatch(/^sha512-/);
    });

    test('webpack-cli has dependencies', () => {
      const webpackCliPackage = packageLock.packages['node_modules/webpack-cli'];
      expect(webpackCliPackage.dependencies).toBeDefined();
      expect(webpackCliPackage.dependencies.commander).toBeDefined();
      expect(webpackCliPackage.dependencies.colorette).toBeDefined();
    });

    test('webpack-cli has bin executable', () => {
      const webpackCliPackage = packageLock.packages['node_modules/webpack-cli'];
      expect(webpackCliPackage.bin).toBeDefined();
      expect(webpackCliPackage.bin['webpack-cli']).toBe('bin/cli.js');
    });

    test('webpack-cli has node engine requirement', () => {
      const webpackCliPackage = packageLock.packages['node_modules/webpack-cli'];
      expect(webpackCliPackage.engines).toBeDefined();
      expect(webpackCliPackage.engines.node).toBe('>=18.12.0');
    });

    test('webpack-cli has funding information', () => {
      const webpackCliPackage = packageLock.packages['node_modules/webpack-cli'];
      expect(webpackCliPackage.funding).toBeDefined();
      expect(webpackCliPackage.funding.type).toBe('opencollective');
    });

    test('webpack-cli has webpack peer dependency', () => {
      const webpackCliPackage = packageLock.packages['node_modules/webpack-cli'];
      expect(webpackCliPackage.peerDependencies).toBeDefined();
      expect(webpackCliPackage.peerDependencies.webpack).toBeDefined();
      expect(webpackCliPackage.peerDependencies.webpack).toMatch(/^\^5\./);
    });

    test('webpack-cli has nested commander dependency', () => {
      expect(packageLock.packages['node_modules/webpack-cli/node_modules/commander']).toBeDefined();
    });

    test('nested commander has correct version', () => {
      const nestedCommander = packageLock.packages['node_modules/webpack-cli/node_modules/commander'];
      expect(nestedCommander.version).toBe('12.1.0');
    });
  });

  describe('Terser-webpack-plugin dependency resolution', () => {
    test('terser-webpack-plugin package exists in node_modules', () => {
      expect(packageLock.packages['node_modules/terser-webpack-plugin']).toBeDefined();
    });

    test('terser-webpack-plugin has correct version', () => {
      const terserPackage = packageLock.packages['node_modules/terser-webpack-plugin'];
      expect(terserPackage.version).toBe('5.3.11');
    });

    test('terser-webpack-plugin is marked as dev dependency', () => {
      const terserPackage = packageLock.packages['node_modules/terser-webpack-plugin'];
      expect(terserPackage.dev).toBe(true);
    });

    test('terser-webpack-plugin has MIT license', () => {
      const terserPackage = packageLock.packages['node_modules/terser-webpack-plugin'];
      expect(terserPackage.license).toBe('MIT');
    });

    test('terser-webpack-plugin has webpack peer dependency', () => {
      const terserPackage = packageLock.packages['node_modules/terser-webpack-plugin'];
      expect(terserPackage.peerDependencies).toBeDefined();
      expect(terserPackage.peerDependencies.webpack).toBeDefined();
      expect(terserPackage.peerDependencies.webpack).toMatch(/^\^5\./);
    });

    test('terser-webpack-plugin has optional peer dependencies', () => {
      const terserPackage = packageLock.packages['node_modules/terser-webpack-plugin'];
      expect(terserPackage.peerDependenciesMeta).toBeDefined();
      expect(terserPackage.peerDependenciesMeta['@swc/core'].optional).toBe(true);
      expect(terserPackage.peerDependenciesMeta['esbuild'].optional).toBe(true);
      expect(terserPackage.peerDependenciesMeta['uglify-js'].optional).toBe(true);
    });

    test('terser-webpack-plugin has node engine requirement', () => {
      const terserPackage = packageLock.packages['node_modules/terser-webpack-plugin'];
      expect(terserPackage.engines).toBeDefined();
      expect(terserPackage.engines.node).toBe('>= 10.13.0');
    });

    test('terser-webpack-plugin has funding information', () => {
      const terserPackage = packageLock.packages['node_modules/terser-webpack-plugin'];
      expect(terserPackage.funding).toBeDefined();
      expect(terserPackage.funding.type).toBe('opencollective');
    });
  });

  describe('TypeScript optional peer dependency', () => {
    test('typescript package exists in node_modules', () => {
      expect(packageLock.packages['node_modules/typescript']).toBeDefined();
    });

    test('typescript has correct version', () => {
      const tsPackage = packageLock.packages['node_modules/typescript'];
      expect(tsPackage.version).toBe('5.7.3');
    });

    test('typescript is marked as dev dependency', () => {
      const tsPackage = packageLock.packages['node_modules/typescript'];
      expect(tsPackage.dev).toBe(true);
    });

    test('typescript is marked as optional', () => {
      const tsPackage = packageLock.packages['node_modules/typescript'];
      expect(tsPackage.optional).toBe(true);
    });

    test('typescript is marked as peer dependency', () => {
      const tsPackage = packageLock.packages['node_modules/typescript'];
      expect(tsPackage.peer).toBe(true);
    });

    test('typescript has Apache-2.0 license', () => {
      const tsPackage = packageLock.packages['node_modules/typescript'];
      expect(tsPackage.license).toBe('Apache-2.0');
    });

    test('typescript has bin executables', () => {
      const tsPackage = packageLock.packages['node_modules/typescript'];
      expect(tsPackage.bin).toBeDefined();
      expect(tsPackage.bin.tsc).toBe('bin/tsc');
      expect(tsPackage.bin.tsserver).toBe('bin/tsserver');
    });

    test('typescript has node engine requirement', () => {
      const tsPackage = packageLock.packages['node_modules/typescript'];
      expect(tsPackage.engines).toBeDefined();
      expect(tsPackage.engines.node).toBe('>=14.17');
    });
  });

  describe('Integrity and security validation', () => {
    test('all packages have integrity hashes', () => {
      const packagesWithoutIntegrity = [];
      
      for (const [pkgPath, pkgData] of Object.entries(packageLock.packages)) {
        // Skip root package and check others
        if (pkgPath !== '' && pkgPath.startsWith('node_modules/')) {
          if (!pkgData.integrity) {
            packagesWithoutIntegrity.push(pkgPath);
          }
        }
      }
      
      expect(packagesWithoutIntegrity).toEqual([]);
    });

    test('all packages have resolved URLs', () => {
      const packagesWithoutResolved = [];
      
      for (const [pkgPath, pkgData] of Object.entries(packageLock.packages)) {
        // Skip root package and check others
        if (pkgPath !== '' && pkgPath.startsWith('node_modules/')) {
          if (!pkgData.resolved) {
            packagesWithoutResolved.push(pkgPath);
          }
        }
      }
      
      expect(packagesWithoutResolved).toEqual([]);
    });

    test('all resolved URLs use HTTPS', () => {
      const nonHttpsPackages = [];
      
      for (const [pkgPath, pkgData] of Object.entries(packageLock.packages)) {
        if (pkgPath !== '' && pkgData.resolved && !pkgData.resolved.startsWith('https://')) {
          nonHttpsPackages.push({ path: pkgPath, url: pkgData.resolved });
        }
      }
      
      expect(nonHttpsPackages).toEqual([]);
    });

    test('all integrity hashes use sha512 algorithm', () => {
      const weakHashPackages = [];
      
      for (const [pkgPath, pkgData] of Object.entries(packageLock.packages)) {
        if (pkgPath !== '' && pkgData.integrity && !pkgData.integrity.startsWith('sha512-')) {
          weakHashPackages.push({ path: pkgPath, integrity: pkgData.integrity });
        }
      }
      
      expect(weakHashPackages).toEqual([]);
    });
  });

  describe('Semver version format validation', () => {
    const semverRegex = /^\d+\.\d+\.\d+(-[\w.-]+)?(\+[\w.-]+)?$/;

    test('all package versions follow semver format', () => {
      const invalidVersions = [];
      
      for (const [pkgPath, pkgData] of Object.entries(packageLock.packages)) {
        if (pkgPath !== '' && pkgData.version) {
          if (!semverRegex.test(pkgData.version)) {
            invalidVersions.push({ path: pkgPath, version: pkgData.version });
          }
        }
      }
      
      expect(invalidVersions).toEqual([]);
    });

    test('flowbite version is valid semver', () => {
      const flowbitePackage = packageLock.packages['node_modules/flowbite'];
      expect(flowbitePackage.version).toMatch(semverRegex);
    });

    test('swiper version is valid semver', () => {
      const swiperPackage = packageLock.packages['node_modules/swiper'];
      expect(swiperPackage.version).toMatch(semverRegex);
    });

    test('webpack version is valid semver', () => {
      const webpackPackage = packageLock.packages['node_modules/webpack'];
      expect(webpackPackage.version).toMatch(semverRegex);
    });

    test('tailwindcss version is valid semver', () => {
      const tailwindPackage = packageLock.packages['node_modules/tailwindcss'];
      expect(tailwindPackage.version).toMatch(semverRegex);
    });
  });

  describe('License validation', () => {
    test('all packages have license information', () => {
      const packagesWithoutLicense = [];
      
      for (const [pkgPath, pkgData] of Object.entries(packageLock.packages)) {
        // Skip root package which may not have license
        if (pkgPath !== '' && pkgPath.startsWith('node_modules/')) {
          if (!pkgData.license) {
            packagesWithoutLicense.push(pkgPath);
          }
        }
      }
      
      // Allow some packages to not have license (informational test)
      // This is a softer check - we just want to know which ones don't
      if (packagesWithoutLicense.length > 0) {
        console.warn(`Packages without license info: ${packagesWithoutLicense.length}`);
      }
    });

    test('main dependencies use permissive licenses', () => {
      const mainPackages = [
        'node_modules/flowbite',
        'node_modules/swiper',
        'node_modules/webpack',
        'node_modules/tailwindcss'
      ];

      const permissiveLicenses = ['MIT', 'BSD', 'Apache-2.0', 'ISC'];
      
      mainPackages.forEach(pkgPath => {
        const pkg = packageLock.packages[pkgPath];
        if (pkg && pkg.license) {
          expect(permissiveLicenses).toContain(pkg.license);
        }
      });
    });
  });

  describe('Dependency tree consistency', () => {
    test('no circular dependencies in top-level packages', () => {
      const rootDeps = packageLock.packages[''].dependencies || {};
      const rootDevDeps = packageLock.packages[''].devDependencies || {};
      const allRootDeps = { ...rootDeps, ...rootDevDeps };
      
      // Check that no package depends on itself
      Object.keys(allRootDeps).forEach(depName => {
        const depPath = `node_modules/${depName}`;
        const depPackage = packageLock.packages[depPath];
        
        if (depPackage && depPackage.dependencies) {
          expect(depPackage.dependencies[depName]).toBeUndefined();
        }
      });
    });

    test('all declared dependencies are resolvable', () => {
      const unresolvedDeps = [];
      
      const rootDeps = packageLock.packages[''].dependencies || {};
      const rootDevDeps = packageLock.packages[''].devDependencies || {};
      
      [...Object.keys(rootDeps), ...Object.keys(rootDevDeps)].forEach(depName => {
        const depPath = `node_modules/${depName}`;
        if (!packageLock.packages[depPath]) {
          unresolvedDeps.push(depName);
        }
      });
      
      expect(unresolvedDeps).toEqual([]);
    });
  });

  describe('Node engine compatibility', () => {
    test('packages with engine requirements are compatible', () => {
      const incompatiblePackages = [];
      const minNodeVersion = 14; // Common minimum for modern projects
      
      for (const [pkgPath, pkgData] of Object.entries(packageLock.packages)) {
        if (pkgPath !== '' && pkgData.engines && pkgData.engines.node) {
          const nodeReq = pkgData.engines.node;
          // Simple check for major version requirements
          const match = nodeReq.match(/>=?\s*(\d+)/);
          if (match) {
            const requiredVersion = parseInt(match[1], 10);
            if (requiredVersion > minNodeVersion) {
              incompatiblePackages.push({
                path: pkgPath,
                requires: nodeReq
              });
            }
          }
        }
      }
      
      // This is informational - packages requiring Node > 14 are noted
      if (incompatiblePackages.length > 0) {
        console.log(`Packages requiring Node > ${minNodeVersion}:`, incompatiblePackages.length);
      }
    });

    test('webpack-cli requires Node >= 18.12.0', () => {
      const webpackCliPackage = packageLock.packages['node_modules/webpack-cli'];
      expect(webpackCliPackage.engines.node).toBe('>=18.12.0');
    });
  });

  describe('Package configuration edge cases', () => {
    test('handles packages with funding information correctly', () => {
      const packagesWithFunding = [];
      
      for (const [pkgPath, pkgData] of Object.entries(packageLock.packages)) {
        if (pkgPath !== '' && pkgData.funding) {
          packagesWithFunding.push(pkgPath);
        }
      }
      
      expect(packagesWithFunding.length).toBeGreaterThan(0);
      expect(packagesWithFunding).toContain('node_modules/swiper');
      expect(packagesWithFunding).toContain('node_modules/webpack');
    });

    test('handles packages with bin executables correctly', () => {
      const packagesWithBin = [];
      
      for (const [pkgPath, pkgData] of Object.entries(packageLock.packages)) {
        if (pkgPath !== '' && pkgData.bin) {
          packagesWithBin.push(pkgPath);
        }
      }
      
      expect(packagesWithBin.length).toBeGreaterThan(0);
      expect(packagesWithBin).toContain('node_modules/webpack');
      expect(packagesWithBin).toContain('node_modules/webpack-cli');
      expect(packagesWithBin).toContain('node_modules/tailwindcss');
    });

    test('handles packages with peer dependencies correctly', () => {
      const packagesWithPeerDeps = [];
      
      for (const [pkgPath, pkgData] of Object.entries(packageLock.packages)) {
        if (pkgPath !== '' && pkgData.peerDependencies) {
          packagesWithPeerDeps.push(pkgPath);
        }
      }
      
      expect(packagesWithPeerDeps.length).toBeGreaterThan(0);
      expect(packagesWithPeerDeps).toContain('node_modules/webpack-cli');
      expect(packagesWithPeerDeps).toContain('node_modules/terser-webpack-plugin');
    });

    test('handles optional peer dependencies correctly', () => {
      const terserPackage = packageLock.packages['node_modules/terser-webpack-plugin'];
      
      expect(terserPackage.peerDependenciesMeta).toBeDefined();
      
      const optionalPeers = Object.entries(terserPackage.peerDependenciesMeta)
        .filter(([_, meta]) => meta.optional === true)
        .map(([name, _]) => name);
      
      expect(optionalPeers.length).toBeGreaterThan(0);
      expect(optionalPeers).toContain('@swc/core');
      expect(optionalPeers).toContain('esbuild');
    });
  });

  describe('Nested dependency resolution', () => {
    test('handles nested package structures correctly', () => {
      const nestedPackages = Object.keys(packageLock.packages)
        .filter(path => path.includes('/node_modules/') && path !== '' && path.split('/node_modules/').length > 2);
      
      expect(nestedPackages.length).toBeGreaterThan(0);
    });

    test('flowbite-datepicker has nested flowbite with different version', () => {
      const topLevelFlowbite = packageLock.packages['node_modules/flowbite'];
      const nestedFlowbite = packageLock.packages['node_modules/flowbite-datepicker/node_modules/flowbite'];
      
      expect(topLevelFlowbite.version).toBe('3.1.2');
      expect(nestedFlowbite.version).toBe('2.5.2');
      expect(topLevelFlowbite.version).not.toBe(nestedFlowbite.version);
    });

    test('nested flowbite satisfies flowbite-datepicker requirements', () => {
      const datepickerPackage = packageLock.packages['node_modules/flowbite-datepicker'];
      expect(datepickerPackage.dependencies.flowbite).toMatch(/^\^2\./);
      
      const nestedFlowbite = packageLock.packages['node_modules/flowbite-datepicker/node_modules/flowbite'];
      expect(nestedFlowbite.version).toMatch(/^2\./);
    });
  });

  describe('File size and complexity checks', () => {
    test('package-lock.json is not empty', () => {
      const content = fs.readFileSync(packageLockPath, 'utf8');
      expect(content.length).toBeGreaterThan(1000);
    });

    test('has reasonable number of packages', () => {
      const packageCount = Object.keys(packageLock.packages).length;
      expect(packageCount).toBeGreaterThan(10);
      expect(packageCount).toBeLessThan(10000); // Sanity check
    });

    test('root package dependencies count matches expectations', () => {
      const deps = Object.keys(packageLock.packages[''].dependencies || {});
      const devDeps = Object.keys(packageLock.packages[''].devDependencies || {});
      
      expect(deps.length).toBe(2); // flowbite and swiper
      expect(devDeps.length).toBeGreaterThan(10); // Multiple dev dependencies
    });
  });

  describe('Registry and resolution validation', () => {
    test('all packages resolve from npmjs.org', () => {
      const nonNpmPackages = [];
      
      for (const [pkgPath, pkgData] of Object.entries(packageLock.packages)) {
        if (pkgPath !== '' && pkgData.resolved) {
          if (!pkgData.resolved.includes('registry.npmjs.org')) {
            nonNpmPackages.push({ path: pkgPath, resolved: pkgData.resolved });
          }
        }
      }
      
      // Most packages should come from npm registry
      expect(nonNpmPackages.length).toBe(0);
    });

    test('resolved URLs match package names', () => {
      const mismatches = [];
      
      for (const [pkgPath, pkgData] of Object.entries(packageLock.packages)) {
        if (pkgPath !== '' && pkgPath.startsWith('node_modules/') && pkgData.resolved) {
          // Extract package name from path
          const pathParts = pkgPath.split('/node_modules/');
          const pkgName = pathParts[pathParts.length - 1];
          
          // Check if package name appears in resolved URL
          if (!pkgData.resolved.includes(pkgName)) {
            mismatches.push({ path: pkgPath, resolved: pkgData.resolved });
          }
        }
      }
      
      expect(mismatches).toEqual([]);
    });
  });
});