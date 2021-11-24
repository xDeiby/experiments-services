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

## Configuraciones
Se mostrarán las configuraciones necesarias, para la agregación de nuevos datos para el análisis comunicacional, o de cualquier otro modelo.


### Agregar nuevos cálculos al modelo
Para agregar nuevos la extracción o cálculo de datos del modelo, lo que se debe hacer es ir a la clase **CommunicationModelMetadata.ts**, la cual corresponde a la clase que calcula los datos de un modelo de análisis comunicacional. Este es un ejemplo de un caso muy sencillo, que no requiere muchos cálculos

~~~
    // Ejemplo de un cálculo básico del numero de actores
     public calculateMetric(): number {
        const nodes = this.model.actors;
        // Cálculo...
        return nodes.length;
    }
~~~

- Finalmente agregamos el resultado de este método a el JSON que genera el método getAllMetadata, indicando el nombre que le queremos asignar a dicho campo, en este caso NewMetric

~~~
public getAllMetadata(additionaField?: string): {
  // ...
  communicationMetadata.NewMetric = this.numRels();
  // ...
  
  return communicationMetadata;
~~~

### Agregar nuevos cálculos de experimento (Encuestas y Evaluaciones)

Para agregar nuevos datos al JSON generado por el calculo de datos del experimento, debemos ir a la clase ***ExperimentMetada.ts***.
En el caso que queramos agregar un nuevo cálculo, se debe seguir el siguiente proceso. 

- En este ejemplo, se quiere poner un 1 si la respuesta de un Quiz es correcta y 0 de lo contrario. Para ello se crea el método: 

~~~
    // Determina si una pregunta fue respondida correctamente
    private _isCorrectAnswer(question: IQuestion): QuizResponse {
        return question.alternatives.find((alt) => alt.selected && alt.isCorrect)
            ? QuizResponse.CORRECT
            : QuizResponse.INCORRECT;
    }
~~~

- Luego de crear el método, vamos al método publico getMetadata, que devolverá el JSON con los datos calculados. Entonces, nuestro método, dado que lo aplicamos al quiz, debemos ponerlo de la siguiente forma

~~~
public getMetadata() {
  // ...
quizzes.forEach((quiz, index) => {
  const baseField = `Quiz${index + 1}`;
  let newField: string;

  // Datos de las preguntas del quiz
  quiz.questions.forEach((question, index2) => {

  // Respuestas correctas o incorrectas por cada pregunta
  newField = `${baseField}CorrectQuestion${index2 + 1}`;
  experimentMetadata[newField] = this._isCorrectAnswer(question);

  // Tiempo de respuesta de cada pregunta
  newField = `${baseField}TimeQuestion${index2 + 1}`;
  experimentMetadata[newField] = question.timeResp;
});

  // ...
 return experimentMetadata;
}
~~~
- Entonces, se muestran algunos campos adicionales, para ejemplificar.

### Agregar nuevos Modelos
Es necesario entender el rol de la función intermediaria entre los metadatos del modelo y el experimento. Esta función llamada calculateMetadata, obtiene los metadatos del experimento y del modelo, para luego integrarlos en un solo JSON, que será el que obtendrá el frontend.

Sin embargo, lo único que cambia si se quiere agregar un nuevo tipo de modelo, será la clase a la cual llamamos para generar los datos del modelo, ya que se supone que los datos del experimento siempre van a ser la misma clase.

-	Es por ello, que se necesita una forma de distinguir el modelo el cual estamos recibiendo, en este caso el modelo da esa flexibilidad en el campo HEADER

~~~
    "header": [
        {
            "userName": "default user",
            "identifier": "1637761690471",
            "type": "COMMUNICATIONANALYSIS"
        }
    ]
~~~

- Mediante este campo podríamos hacer una selección de que clase queremos que interprete dicho modelo, es decir algo parecido a esto:

~~~
  const modelMetadata;
  switch(header.type) {
    case "COMMUNICATIONANALYSIS":
      modelMetadata = new CommunicationoModelMetadata(jsonModel);
     // Otros modelos...
    
~~~

Entonces si lo que se quiere es agregar nuevos modelos, se deberá crear una clase que se encargue de toda la gestión de la información del tipo de modelo, de igual forma que la clase CommunicationModelMetadata.ts. Esta clase debe tener un método que devuelve el JSON con los datos calculados.

- A continuación se muestra la clase intermediaria entre los datos del modelo y experimento, indicando, donde se deberian insertar los cambios para agregar un nuevo tipo de modelo,
~~~
export default function calculateMetadata(answers: IAnswer[]): any {
    const allMetadata = [] as any[];

    answers.forEach((answer) => {
        let metadata: any;
        const metaExp = new ExperimentMetadata(answer);

        metadata = metaExp.getMetadata();

        const quizzes = JSON.parse(answer.quizzes) as IFormElements[];

        quizzes.forEach((quiz, index) => {
            const jsonModel = JSON.parse(quiz.imageDetails?.modelJson as string) as CommunicationModel;

            // Dependiendo del modelo de jsonModel, deberia escogerse entre usar CommunicationoModelMetadata u otra clase correspondiente al modelo a analizar
            const modelMetadata = new CommunicationoModelMetadata(jsonModel);

            metadata = { ...metadata, ...modelMetadata.getAllMetadata((index + 1).toString()) };
        });

        allMetadata.push(metadata);
    });

    return allMetadata;
}
~~~
