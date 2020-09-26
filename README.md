# EEFlows

 - Python:  3.6
 - DB:      PostgreSQL 10
 - Node:    10.15
 - React:   16.9


## Setting up development

### Installing Docker and Docker Compose

Refer to original [Docker documentation](https://docs.docker.com/engine/installation/) for installing Docker.

After installing Docker you need to install [Docker Compose](https://docs.docker.com/compose/install/) to run
 multi-container Docker applications (such as ours). The `curl` method is preferred for installation.

To run Docker commands without `sudo`, you also need to
[create a Docker group and add your user to it](https://docs.docker.com/engine/installation/linux/ubuntulinux/#/create-a-docker-group).

### Setting up EEFlows

The easy way is to use `make` to set up everything automatically:

    make setup

This command:

- copies PyCharm project directory
- creates local settings file from local.py.example
- builds Docker images
- sets up database and runs Django migrations
- runs `docker-compose up`

Refer to `Makefile` to see what actually happens. You can then use the same commands to set everything up manually.


## Running development server

Both docker and docker-compose are used to run this project, so the run command is quite straightforward.

    docker-compose up

This builds, (re)creates and starts containers for Django, Node, PostgreSQL and Redis. Refer to `docker-compose.yml` for
more insight. Django app is running on `3000` port. Front-end server is running on `8000` port.
For more information see [SPA docs](app/README.md)

Logs from all running containers are shown in the terminal. To run in "detached mode", pass the `-d` flag to
docker-compose. To see running containers, use `docker-compose ps`. To see logs from these containers, run
`docker-compose logs`.

To _stop_ all running containers, use

    docker-compose stop

This stops running containers without removing them. The same containers can be started again with
`docker-compose start`. To stop a single container, pass the name as an extra argument, e.g.
`docker-compose stop django`.

To _stop and remove_ containers, run

    docker-compose down

This stops all running containers and removes containers, networks, volumes and images created by `up`.

## Running Django commands in Docker

    docker-compose run django python manage.py <command>

### Command shortcuts in the Makefile

|Action                                |Makefile shortcut                      |Actual command                                                              |
|:-------------------------------------|:--------------------------------------|:---------------------------------------------------------------------------|
|Installing Python packages            |`make pipenv-install cmd=<package>`    |Runs `pipenv install $(cmd)` in its own container                           |
|(Re)Generate Pipfile.lock             |`make pipenv-lock`                     |Runs `pipenv lock -v` in its own container                                  |
|Check Python package security warnings|`make pipenv-check`                    |`docker-compose run --rm --workdir / django pipenv check`                   |
|make migrations                       |`make makemigrations cmd=<command>`    |`docker-compose run --rm django ./manage.py makemigrations $(cmd)`          |
|migrating                             |`make migrate cmd=<command>`           |`docker-compose run --rm django ./manage.py migrate $(cmd)`                 |
|manage.py commands                    |`make docker-manage cmd=<command>`     |`docker-compose run --rm django ./manage.py $(cmd)`                         |
|any command in Django container       |`make docker-django cmd=<command>`     |`docker-compose run --rm django $(cmd)`                                     |
|run tests                             |`make test`                            |`docker-compose run --rm django py.test`                                    |
|run linters                           |`make quality`                         |                                                                            |
|run StyleLint                         |`make stylelint`                       |`docker-compose run --rm node yarn stylelint`                               |
|run ESLint                            |`make eslint`                          |`docker-compose run --rm node yarn lint`                                    |
|run Prospector                        |`make prospector`                      |`docker-compose run --rm django prospector`                                 |
|run isort                             |`make isort`                           |`docker-compose run --rm django isort --recursive --check-only -p . --diff` |
|run psql                              |`make psql`                            |`docker-compose exec postgres psql --user eeflows --dbname eeflows`         |

## Installing new pip or npm packages

### Node
Since `yarn` is inside the container, currently the easiest way to install new packages is to add them
to the `package.json` file and rebuild the container.

### Python

Python package management is handled by `pipenv`, and employs a lock file (`Pipfile.lock`) to store the package version information.
The lock file ensures that when we are building production images
we don't install conflicting packages and everything is resolved to matching version while developing.

To install a new Python package, there are two options.
* Edit the `Pipfile` and add the required package there, then run `make pipenv-lock` to regenerate the lock file.
* Or run `make pipenv-install cmd=<package>` -- this will add the package to Pipenv and regenerate Pipfile.lock in one take.


## Rebuilding Docker images

To rebuild the images run `docker-compose build`. This builds images for all containers specified in the configuration
file.

To rebuild a single image, add the container name as extra argument, e.g. `docker-compose build node`.

## Swapping between branches

After changing to a different branch, run `docker-compose up --build`. This builds the images before starting
containers.

If you switch between multiple branches that you have already built once, but haven't actually changed any configuration
(e.g. installed new pip or npm packages), Docker finds the necessary steps from its cache and doesn't actually build
anything.

## Running tests

You can also use `--reuse-db` or `--nomigrations` flags to the actual command above to speed things up a bit. See also:
https://pytest-django.readthedocs.org/en/latest/index.html

### Coverage

You can also calculate tests coverage with `coverage run -m py.test && coverage html`,


## Running code formatting tools

Code formatting tools are used to use same code style across the project.

For JavaScript we use Prettier.
```bash
# To check Javascript code style use:
make prettier-check-all

# To check single Javascript file use:
make prettier-check cmd="app/src/index.js" # File path should be relative to project root

# To format Javascript code use:
make prettier-format-all

# To format single Javascript file use:
make prettier-format cmd="app/src/index.js" # File path should be relative to project root
```

For Python we use Black formatter.
```bash
# To check Python code style use:
make black-check-all

# To check single Python file use:
make black-check cmd="test_project/accounts/admin.py" # File path should be relative to project root

# To format Python code use:
make black-format-all

# To format single Python file use:
make black-format cmd="app/src/index.js" # File path should be relative to project root
```

There is also option to use file watchers.
To use pre-built docker helpers for this, import `.idea_template/watchers.xml`.
To make this process faster the first time then run `make build-formatting-helpers` to pre-build formatting helpers.

Or use `prettier` and `black` directly if NodeJS and/or Python is available for you.


## Running linters

Linters check your code for common problems. Running them is a good idea before submitting pull requests, to ensure you
don't introduce problems to the codebase.

We use _ESLint_ (for JavaScript parts), _Prospector_ (for Python), _StyleLint_ (for SCSS), _isort_ (for Python imports)
and _Pipenv check_ (for security vulnerabilities).

To use them, run those commands in the Django app dir:

    # Check Javascript sources with ESLint:
    make eslint
    # Check SCSS sources with StyleLint:
    make stylelint
    # Check Python sources with Prospector:
    make prospector
    # Check Python imports with isort:
    make isort
    # Check Python package security vulnerabilities:
    make pipenv-check
    # Run all of above:
    make quality


## Running tests

Tests are ran by `pytest` and `jest` test runners for python and javascript respectively. They can be run with the
makefile via `make test`.
