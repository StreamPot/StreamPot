# All methods

## Specifying inputs

You can add any number of inputs to an streampot request.

```js
client
  .input('https://example.com/path/to/input1.avi')
  .input('https://example.com/path/to/input2.avi');

// Most methods have several aliases, 
// here you may use addInput or mergeAdd instead
client
  .addInput('https://example.com/path/to/frame%02d.png')
  .addInput('https://example.com/path/to/soundtrack.mp3');

client
  .mergeAdd('https://example.com/path/to/input1.avi')
  .mergeAdd('https://example.com/path/to/input2.avi');
```

## Input options

### `inputFormat(format)` - specify input format

