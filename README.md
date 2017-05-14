# stripframe

Find the hidden web page in the frame.

## Installation

```
npm install stripframe
```

## Usage

### html string

```js
var stripframe = require('stripframe');
var frame = stripframe('<frameset rows="*,0"><frame src="/blogPostView?id=00000"></frameset>');
console.log(frame.url()); // /blogPostView?id=00000
```

### stripframe with axios

```js
var axios = require('axios');
var stripframe = require('stripframe');
axios.get('http://blog.example.com/00000')
  .then(response => stripframe(response.data))
  .then(frame => frame.url())
  .then(url => console.log(url)); // /blogPostView?id=00000
```

## License

MIT