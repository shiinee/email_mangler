Email Mangler is an ~~aptly named~~ apps script that creates native filters for your Gmail account.

## Deploy easily with clasp

Email Mangler can be easily developed and deployed on your own Google account using [clasp](https://github.com/google/clasp).

Just follow the instructions to install clasp: https://github.com/google/clasp/blob/master/README.md

## Keep a private fork for your config

Email Mangler is developed and deployed locally with [clasp](https://github.com/google/clasp).

Of course, it contains an empty config, so deploying it directly wouldn't be very helpful! 
What I actually deploy is a private fork of the public repository, containing my personal
config.

Here's how I set that up:

1. Create a temporary bare clone of this repository:

    ``git clone --bare git@github.com:shiinee/email_mangler.git``

2. Create a new private repository on github for your personal fork. Let's say it's called
`shiinee/private_email_mangler`.

3. Do a mirror push of your bare clone to the new private repository:

    ``git push --mirror git@github.com:shiinee/private_email_mangler.git``

4. The local clone isn't necessary anymore; you can remove it.

5. Clone your private repository:

    ``git clone git@github.com:shiinee/private_email_mangler.git``

6. Add the original repo as a remote to pull future changes from:

    ```
    git remote add upstream git@github.com:shiinee/email_mangler.git
    git remote set-url --push upstream DISABLE
    ```

    Disabling push on the remote repo will help you not accidentally push to the original
    repo, if you're a contributor.

That's it. You can now work on your private fork, and pull new changes from the original
as needed with ``git pull upstream master``.

(based on [GitHub's instructions for duplicating a repository without forking](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/duplicating-a-repository))
