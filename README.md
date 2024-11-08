# image-optimizer

## TODO

- [ ] Preguntar si quieres conservar las originales o eliminarlas.
- [ ] Crear el ejecutable.

## Script para optimizar imágenes

- La idea es que le digamos una ruta y el revise todas las imagenes que haya en esa carpeta y las optimice.
- Para la optimizacion debe coger el lado mas largo de la imagen y redimensionarla a 2160px si es la horizontal o 1440px si es la vertical.
- Tambien debe tranformar la imagen a mozjpg.
- Nos deberia preguntar si queremos que se le añada la marca de agua.
  To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.33. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
