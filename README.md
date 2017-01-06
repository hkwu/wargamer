# Wargamer
[![npm](https://img.shields.io/npm/v/wargamer.svg?style=flat-square)](https://www.npmjs.com/package/wargamer)
[![Travis](https://img.shields.io/travis/rust-lang/rust.svg?style=flat-square)](https://travis-ci.org/hkwu/wargamer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

A promise-based Node.js client library for the Wargaming.net API. Supports all of the documented APIs listed in the [API reference](https://developers.wargaming.net/reference/).

- World of Tanks
- World of Tanks Blitz
- World of Tanks Console
- World of Warships
- World of Warplanes
- Wargaming.net

The library currently supports Node.js 4.0.0 and above.

## Installation
```bash
npm install --save wargamer
```

or

```bash
yarn add wargamer
```

Web bundles are available as well.

```html
<script src="wargamer.min.js"></script>
<script>
  const wot = new wargamer.WorldOfTanks({ /* ... */ });
</script>
```

The web distribution is hosted by the following CDNs:
- [unpkg](https://unpkg.com/#/) - Files are located under `dist/` (e.g. `dist/wargamer.min.js`).
- [jsDelivr](https://www.jsdelivr.com/) - See the library's [project entry](https://www.jsdelivr.com/projects/wargamer).

## Usage
Below is a sample of Wargamer code. More details and examples are available on the [documentation site](https://wargamer.js.org/).

```js
import Wargamer from 'wargamer';

const tanks = Wargamer.WoT({ realm: 'ru', applicationId: 'application_id'});

tanks.fetch('account/list', { search: 'Straik' })
  .then((response) => {
    console.log(response.meta); // { count: 100 }
    console.log(response.data); // [{ nickname: 'Straik', account_id: 73892 }, ...]
  }).catch((error) => {
    console.log(error.message);
  });
```

## References
- [Wargamer Documentation](https://wargamer.js.org/)
- [Wargaming.net Developer's Room](https://developers.wargaming.net/)
- [Wargaming.net API Documentation](https://developers.wargaming.net/documentation/)
- [Wargaming.net API Reference and Interactive Console](https://developers.wargaming.net/reference/)
