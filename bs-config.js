import { extname } from "path";
import { parse } from "url";

export const server = {
  baseDir: "./src",
  middleware: [
    function (req, res, next) {
      const parsedUrl = parse(req.url);
      const ext = extname(parsedUrl.pathname);
      if (!ext && parsedUrl.pathname !== "/index.html") {
        req.url = "/index.html";
      }
      next();
    }
  ]
};
