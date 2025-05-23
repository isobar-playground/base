[![PHPUnit](https://github.com/isobar-playground/base/actions/workflows/phpunit.yml/badge.svg?branch=master)](https://github.com/isobar-playground/base/actions/workflows/phpunit.yml)
[![Coverage](https://raw.githubusercontent.com/isobar-playground/base/refs/heads/badges/coverage.svg)](https://github.com/isobar-playground/base/actions/workflows/phpunit.yml)
[![GrumPHP](https://github.com/isobar-playground/base/actions/workflows/grumphp.yml/badge.svg?branch=master)](https://github.com/isobar-playground/base/actions/workflows/grumphp.yml)
[![Docker Build](https://github.com/isobar-playground/base/actions/workflows/test_build.yml/badge.svg?branch=master)](https://github.com/isobar-playground/base/actions/workflows/test_build.yml)

# Base Project 🚀

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/isobar-playground/base?quickstart=1)

This project is a base for web applications built with Drupal. It leverages Docker images `wodby/drupal-php` and `wodby/apache` for containerization. For local environments, it utilizes `docker-compose` along with `mariadb` and `wodby/node` images.

## Features ✨

- **Drupal Installation**: Drupal is installed using Composer.
- **Dependency Management**: Dependencies are updated via Dependabot on GitHub.
- **Coding Standards**: Code quality is enforced using `grumphp`.
- **Starterkit Theme**: A starterkit theme is created using Single Directory Components and TailwindCSS.
- **Static Code Analysis**: Automated code analysis to ensure code quality and standards.
- **Unit Testing**: PHPUnit is used for running unit tests.
- **GitHub Codespaces**: The project is configured to run in GitHub Codespaces.

## Local Environment Setup 🛠️

To set up the local development environment, follow these steps:

1. Clone the repository:
   ```sh
   git clone git@github.com:isobar-playground/base.git
   ```
2. Navigate to the project directory:
   ```sh
   cd base
   ```
3. Run the Make command to start the environment:
   ```sh
   make
   ```
4. Access the local environment at http://base.localhost

## Makefile Commands 📜

The `Makefile` includes several commands to manage the Docker environment:

| Command    | Description                                                                                                          |
| ---------- | -------------------------------------------------------------------------------------------------------------------- |
| `help`     | Prints the help for available commands.                                                                              |
| `up`       | Starts up the containers, builds them if necessary, and installs Composer dependencies.                              |
| `down`     | Stops the containers.                                                                                                |
| `start`    | Starts the containers without updating.                                                                              |
| `stop`     | Stops the containers.                                                                                                |
| `prune`    | Removes containers and their volumes. Optionally, specify a service name to prune a single container.                |
| `ps`       | Lists running containers.                                                                                            |
| `shell`    | Accesses the `php` container via shell. Optionally, specify a service name to open a shell on a different container. |
| `composer` | Executes `composer` commands in the specified `COMPOSER_ROOT` directory.                                             |
| `drush`    | Executes `drush` commands in the specified `DRUPAL_ROOT` directory.                                                  |
| `logs`     | Views container logs. Optionally, specify a service name to limit logs.                                              |
| `build`    | Builds containers for production.                                                                                    |
| `theme`    | Generate theme from custom theme starterkit.                                                                         |

## Docker Compose Configuration 🐳

The project uses `docker-compose` for managing the local development environment. The `.env` and `.env.local` files are included to configure environment variables for Docker Compose.

### Building Docker Images 🏗️

#### Node Image

The Node image is based on `wodby/node` and requires the `NODE_TAG` argument, which specifies the version of the image. This can be a development version with `-dev-` or a production version. The version information is located in the `.env` or `.env.local` file.

#### PHP Image

The PHP image is based on `wodby/drupal-php` and requires the `PHP_TAG` argument for the image version, which is specified in the `.env` or `.env.local` file. In the `.env` file, it will be a development version (e.g., `8.3-dev-4.60.1`), while in the `.env.local` file, after running the `./scripts/prod-env.bash` script, it will be a production version without the `-dev-` part. The image also requires the `NODE_IMAGE` argument, which copies built assets from the Node image.

#### Apache Image

The Apache image is based on `wodby/apache` and requires the built PHP image passed via the `PHP_IMAGE` argument. It also requires the `APACHE_TAG` argument. The versions for Apache images are specified in the `.env` file as they do not have development releases.

#### Supervisor Image

The project also includes a Docker image with a Supervisor service based on `wodby/php` image. This service manages background processes, and currently, it is configured to run a rabbitmq-worker. The Supervisor configuration files are located in the `docker/supervisor/conf.d` directory.

### Build Order

The images should be built in the following order:

1. Node image
2. PHP image
3. Apache image
4. Supervisor image

## Static Code Analysis and Coding Standards 🧹

Code quality and adherence to coding standards are ensured using `grumphp`. The tool runs a set of predefined tasks, including static code analysis and unit tests, before each commit to maintain high code quality.

## Unit Testing with PHPUnit 🧪

Unit tests are written using PHPUnit and run on every pull request and commit to the master branch.

## Theme Development 🎨

The base starterkit theme is developed using Single Directory Components and TailwindCSS, providing a modern and efficient approach to theming in Drupal. In order to use it run following command:

```bash
make theme
```

You will be prompted for a new topic name. By default this will be the PROJECT_NAME from the .env file.

**Important: Once you have created a new theme from the starterkit, please apply the changes to the Docker configuration.**

### Creating new Single Directory Component

To create a new Single Directory Component please follow steps below:

1. Create a new Story file in the respective directory within the `stories` directory using the following template:

   ```twig
   {% stories accordion with { title: 'Organisms' } %}

     {% story default with {
       name: 'Accordion',
     } %}
       {% embed 'base_starterkit:accordion' %}{% endembed %}
     {% endstory %}

   {% endstories %}
   ```

2. Create a new Twig file in the respective directory within the `components` directory with the component template.
3. Optionally, create a new `*.component.yml` file next to the Twig file to define component properties using the following guide: [Annotated Example Component YAML](https://www.drupal.org/docs/develop/theming-drupal/using-single-directory-components/annotated-example-componentyml)
4. Preview component in the Storybook on your browser at http://storybook.base.localhost.
5. When developing a new component, remember to flush the Drupal cache with the `make drush cr` command if problems occur.

## RabbitMQ Integration 🐰

The project integrates with a RabbitMQ service, which is available at http://rabbitmq.base.localhost. The default login credentials are:

- Username: admin
- Password: admin

Drupal integrates its internal queues with this RabbitMQ service, allowing for efficient background processing and message handling.

## Contribution 🤝

Feel free to contribute to this project by creating issues or submitting pull requests. Ensure to follow the coding standards and guidelines provided.

### Initial database dump update

To update the initial database dump stored in `docker/mariadb/base.sql.gz`, use the following command:

```bash
make drush sql:dump -- --gzip
```

### Reverting project to initial stage

To revert project to initial stage and purge all data stored in volumes, use the following command:

```bash
make prune
```

After pruning all data rebuild project with

```bash
make
```

Optionally, you can reset the current state of the Git repository with

```bash
git reset --hard
git clean -fd
```

and then rebuild and lunch local images so that the environment is up to date with the HEAD state:

```bash
make build up
```

## License 📄

This project is licensed under the MIT License.

For more details, visit the [repository](https://github.com/isobar-playground/base).
