const express = require('express');
const dot = require('dot-object');
const primitives = require('@primer/primitives');

const colors = primitives.default.colors;
const colorModes = Object.keys(colors);

const getHex = (colorMode, token) => {
  const tokens = colors[colorMode];
  if (!tokens)
    return {
      error: `could not find ${colorMode} in color modes, did you mean one of ${colorModes.join(', ')}`
    };

  const hex = dot.pick(token, tokens);
  if (!hex) {
    const possibleTokens = Object.keys(dot.dot(tokens));

    return {
      error: `could not find ${token} in ${colorMode}, did you mean one of \n${possibleTokens.join('\n')}`
    };
  }

  return { hex };
};

const app = express();
app.listen(process.env.PORT || 3000, () => {
  console.log('listening');
});

app.get('/', async (req, res) => {
  const { mode, token, color } = req.query;
  const { hex, error } = getHex(mode, token);

  if (error) {
    res.status(404).end(error);
  } else {
    res.setHeader('content-type', 'image/svg+xml');
    res.status(200).send(
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="50" height="50" viewBox="0 0 50 50">
        <rect xmlns="http://www.w3.org/2000/svg" fill="${color || hex}" x="0" y="0" width="50" height="50" rx="5"/>
       </svg>`
    );
  }
});

module.exports = app;
