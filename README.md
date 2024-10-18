# cdo-records
Code dot org Records

<!-- BADGIE TIME -->

[![pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen?logo=pre-commit)](https://github.com/pre-commit/pre-commit)

<!-- END BADGIE TIME -->

Emulating code.org's firebase records or talking to the real ones
from other projects.

Data is transferred by encoding strings as images and sending images
to get around code.org's limitation that you can't directly send web
requests to websites outside of a whitelist they have, but you can load
images from other domains. Because of this, we can request images from
a webserver running this program, and now we can access either external
database records, or access code.org's official database records for another
project (very sneaky shenanigins).

Main file is `index.js`
Worked on this more than two years ago as of 2024-10-17 and I remember
almost nothing. Imported from repl.it. Do not recommend them, run a site of
your own you have complete control over.
