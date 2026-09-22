# Game Files

The current local player assets are stored here:

```text
public/games/square-face.swf
public/games/oval-face.swf
public/games/square-face-cover.png
```

The site loads the SWF files with Ruffle through the shared Flash generator.
The PNG is the stable click-to-load cover shown before runtime activation. Do
not decompile or modify the SWF internals; only adjust the page wrapper, copy,
and player loading experience.

Before describing a file as authorized, commercial-use-ready, embeddable, or
redistributable, verify its exact hash and evidence in
`data/game-license-registry.json`. The current Square and Oval entries are
`UNKNOWN`; file presence and git history do not prove permission.
