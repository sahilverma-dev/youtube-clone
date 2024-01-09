import "colors";

import { app } from "./app";
import { PORT } from "./constants/env";

// cleaning log on refresh
console.clear();

app.listen(PORT, () => {
  console.log(
    "Server is running at port :".green,
    process.env.PORT?.toString().blue
  );
});
