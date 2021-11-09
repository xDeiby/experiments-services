# Manual de instalación

### Intalacion de node
Se debe intalar versiones de node sobre la v14

Instalación de node en ubuntu
~~~ 
sudo apt install nodejs 
~~~
Instalación npm en ubuntu
~~~
sudo apt install npm
~~~

- Si se esta usando windows, simplemente desargar en <https://nodejs.org/es/>

### Instalación de paquetes
- Ya habiendo descargado el proyecto, con node y npm instalados, se deben instalar las dependencias del proyecto mediante el siguiente script (Estando dentro del directorio del proyecto en la cmd).
~~~
npm install
~~~
- o si esta utilizando yarn
~~~
yarn
~~~

## Variables de entorno
Estas variables de entorno se describen en el archivo ***.env.example***
- Base de datos de desarrollo
Se inidica donde se conectara la aplicación. En caso de una base datos local, se puede indicar lo siguiente, node se conectara a nuesta base datos local en en el puert0 27017, creando la base datos nombreDb por defecto al ingresar algun elemento a la base de datos.
~~~
MONGODB_URI=mongodb://localhost/nombreDb
~~~
***En caso de trabajar con un cluster de mongoDB, simplemente remplazar por el link del mismo***

- Base de datos de pruebas
Solo definirla si se quieren hacer pruebas, que comunmente se harán de forma local.
~~~
MONGODB_URI_TEST=mongodb://localhost/pruebasDb
~~~
- Puerto de la aplicación
Si no se ingresa un puerto, la aplicación por defecto toma el puerto 3001. Si no es lo deseado, simplemente definir
~~~
PORT=3000
~~~
***La aplicación de front, localmente, escucha en el puerto 3001 por defecto***

### Cloudinary variables
Cloudinary es un base de datos que permite guardar archivos de forma gratuita, en este se usa para guardar las imagenes de las evaluaciones, los siguientes definien la conexión a esta base de datos externa.
~~~
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
~~~
***Para mas información: <https://cloudinary.com/>***

### Scripts
- Si se quiere desplegar la aplicación, deben ejecutar los scripts:
~~~
npm build
o
yarn build
~~~
y luego para ejecutar el producto de la aplicación
~~~
npm start
o
yarn start
~~~
- Si se quiera ejecutar la aplicación en modo desarrollo (Se conectara a la base de datos de desarrollo)
~~~
npm run start:dev
o
yarn run start:dev
~~~
- Si se quiere ejecutar la aplicación en modo test (Se conecta a una base de datos de pruebas)
~~~
npm run test:start
o
yarn run test:start
~~~
- Para ejecutar los test unitarios y de integración en la aplicación
~~~
npm run test
o
yarn run test
~~~
- Para obtener los porcentajes de coverage de todas las pruebas
~~~
npm run coverage
o
yarn run coverage
~~~
