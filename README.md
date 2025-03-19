# PlantFinder

## Desktop

Pour constuire l'application, voici les étapes :

Compiler le React : 
```npm run build```
*Petit problème, lors du build pour que ça marche, il faut rajouter les '.' devant les premiers '/' dans dist/index.html, sinon il trouve pas les fichiers.*

Compiler Electron :
```npm run electron-build```

Ensuite vous retrouvez l'installateur dans dans *dist-electron* ou le programme décompresser *dist-electron/win-unpacked*.
