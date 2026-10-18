This is the source code for the new KBHFF member system.

# NOTE:
This repository contains code in active development. It cannot be deployed in it's current form.

We are currently transferring asynchronous corrections from the untracked live development. When this code base is aligned with
the current live site, we will post information about how to set up this project on your local machine and/or a live server.

Stay tuned.


# About KBHFF
Københavns Fødevarefællesskab / Copenhagen Foodcoop (KBHFF) is a volunteer based organisation, that buys and distributes
vegetables and fruit from local organic produces on behalf of their members. Read more on kbhff.dk.

# Licenses:
kbhff_dk is licensed as follows:

## Source code:
https://github.com/kbhff/kbhff_dk_/blob/master/LICENSE.md


# Contributing to KBHFF

Any help is welcome. 

Please contact us at [it@kbhff.dk](mailto:it@kbhff.dk)


## Local Janitor patch

The Janitor framework submodule contains a local fix for client-side admin
navigation when the site is served on a non-default port. Its URL cleaner now
uses `location.host` (including the port) instead of `document.domain`, which
does not include the port. The framework source and merged bundles are patched
in `submodules/janitor`; the production admin bundles are patched in
`theme/www/janitor/js/seg_desktop.js` and `seg_smartphone.js`.

When updating the Janitor submodule or rebuilding its admin bundles, preserve
this change in `u-history.js` and rebuild or reapply it to the production
bundles. The submodule patch must be committed within Janitor separately from
the parent repository's changes.