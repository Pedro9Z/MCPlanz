const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
