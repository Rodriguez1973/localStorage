/*
Proyecto realizado por: José A. Rodríguez López
Fecha: 18/12/2022
*/
let registros = new Array() //Array donde se almacenaran las variables locales del sessionStorage.
let indiceRegistro=0  //Contador registros de sesión.

//-------------------------------------------------------------------------------------------------
//Referencias de los objetos del formulario.
const grabarSessionStorage = document.getElementById('grabarSessionStorage')
const mostrarSessionStorage = document.getElementById('mostrarSessionStorage')
const iTarea = document.getElementById('tarea')
const iTProgramado = document.getElementById('tProgramado')
const iTEmpleado = document.getElementById('tEmpleado')
const iDescripcion = document.getElementById('descripcion')
const tablaDatos = document.getElementById('tablaDatos')

//--------------------------------------------------------------------------------------------------
//Clase que modela cada registro de actividad.
class registroActividad{
  constructor(tarea,tProgramado, tEmpleado, descripcion){
      this.tarea=tarea
      this.tProgramado=tProgramado
      this.tEmpleado=tEmpleado
      this.descripcion=descripcion
  }

  toString(){
      return this.tarea+'*/*'+this.tProgramado+'*/*'+this.tEmpleado+'*/*'+this.descripcion
  }
}


//--------------------------------------------------------------------------------------------------
//Definición de eventos de los objetos.
grabarSessionStorage.addEventListener('click', guardarSessionStorage, false) //Evento click sobre el ícono de grabar.
mostrarSessionStorage.addEventListener('click', mostrarSessionStorage, false) //Evento click sobre el ícono de mostrar tabla.

//--------------------------------------------------------------------------------------------------
//Función que almacena una un registro en el sessionStorage.
function guardarSessionStorage() {
  if (typeof(Storage) !== 'undefined') {
    if (validarRegistro()) {
      let registro=new registroActividad(iTarea.value,iTProgramado.value, iTEmpleado.value, iDescripcion.value)
      window.localStorage.setItem(++indiceRegistro, registro.toString())
      limpiaCampos();
    }
  } else {
   // Código cuando Storage NO es compatible
  }
}

//--------------------------------------------------------------------------------------------------
//Función que establece una cookie.
function establecerCookie(valorCookie, diasExpiracion) {
  let fecha = new Date() //Fecha actual.
  let claveCookie = fecha.getTime()
  let fechaExpiracion = new Date(
    fecha.getTime() + diasExpiracion * 24 * 60 * 60 * 1000,
  ) //Fecha de expiración.
  document.cookie =
    claveCookie +
    '=' +
    valorCookie +
    '; expires=' +
    fechaExpiracion.toUTCString() +
    '; path=/'

  Swal.fire({
    title: 'Cookie guardada',
    confirmButtonText: 'Aceptar',
  })
}

//--------------------------------------------------------------------------------------------------
//Presenta una tabla con las cookies almacenadas.
function mostrarCookiesAlmacenadas() {
  let registros = document.cookie.split(';') //Obtiene los registros de las cookies del documento.
  cookies = new Array()
  for (let registro in registros) {
    let cadena = registros[registro].replaceAll('=', '*/*') //Adapta el registro.
    if (cadena.split('*/*').length == 5) {
      cookies.push(cadena.split('*/*'))
    }
  }
  mostrarTabla()
}

//--------------------------------------------------------------------------------------------------
//Función que muestra la tabla en la interfaz.
function mostrarTabla() {
  tablaDatos.innerHTML = '' //Borra la tabla.
  if (cookies.length > 0) {
    let indice = 1 //Indice del elemento
    let tabla = document.createElement('table') //Tabla
    tablaDatos.appendChild(tabla)
    let thead = document.createElement('thead') //Encabezado
    tabla.appendChild(thead)
    let trEncabezado = document.createElement('tr') //Fila encabezado.
    thead.appendChild(trEncabezado)
    let thColumna = document.createElement('th') //Columna1.
    thColumna.innerText = 'NºReg.'
    trEncabezado.appendChild(thColumna)
    thColumna = document.createElement('th') //Columna2.
    thColumna.innerText = 'Clave'
    trEncabezado.appendChild(thColumna)
    thColumna = document.createElement('th') //Columna3.
    thColumna.innerText = 'Tarea'
    trEncabezado.appendChild(thColumna)
    thColumna = document.createElement('th') //Columna4.
    thColumna.innerText = 'Tiempo\nProgramado'
    trEncabezado.appendChild(thColumna)
    thColumna = document.createElement('th') //Columna5.
    thColumna.innerText = 'Tiempo\nEmpleado'
    trEncabezado.appendChild(thColumna)
    thColumna = document.createElement('th') //Columna6.
    thColumna.innerText = 'Descripción'
    trEncabezado.appendChild(thColumna)
    let tbody = document.createElement('tbody') //Cuerpo de la tabla
    tabla.appendChild(tbody)

    //Recorre todas las cookies.
    for (const cookie of cookies) {
      let fila = document.createElement('tr') //Crea una fila.
      tbody.appendChild(fila) //Añade la fila al cuerpo de la tabla.
      let celda = document.createElement('td') //Crea celda nº registro.
      celda.innerText = indice
      fila.appendChild(celda)
      celda = document.createElement('td') //Crea celda clave.
      let iBorrar = document.createElement('input') //Botón de borrado.
      iBorrar.type = 'button'
      iBorrar.id = cookie[0]
      iBorrar.value = 'Borrar'
      iBorrar.addEventListener('click', borrarCookie, false)
      celda.appendChild(iBorrar)
      fila.appendChild(celda)
      celda = document.createElement('td') //Crea celda tarea.
      celda.innerText = cookie[1]
      fila.appendChild(celda)
      celda = document.createElement('td') //Crea celda tiempo programado
      celda.innerText = cookie[2]
      fila.appendChild(celda)
      celda = document.createElement('td') //Crea celda tiempo empleado
      celda.innerText = cookie[3]
      fila.appendChild(celda)
      celda = document.createElement('td') //Crea celda descripción.
      celda.innerText = cookie[4]
      fila.appendChild(celda)
      indice++
    }
  }
}

//--------------------------------------------------------------------------------------------------
//Función que borra una cookie almacenada.
function borrarCookie(evt) {
  let fechaActual=new Date()
  let fechaExpiracion=new Date()
  fechaExpiracion.setTime(fechaActual.getTime()-1)
  document.cookie = evt.target.id + '=; expires='+fechaExpiracion.toUTCString()+'; max-age=0; path=/'
  cookies = new Array()
  mostrarCookiesAlmacenadas()
}

//--------------------------------------------------------------------------------------------------
//Functión que valida los datos de los registros a almacenar localmente.
function validarRegistro() {
  let valido = true
  if (iTarea.value.trim() === '' || iTarea.value.trim().includes('*/*')) {
    valido = false
    let mensaje = 'La tarea no puede estar vacía o contener la subcadena "*/*".'
    mostrarMensaje('Error de validación',mensaje,'warning')
  } else if (iTProgramado.value == '' || iTProgramado.value <= 0) {
    valido = false
    let mensaje = 'El tiempo programado no puede ser nulo o negativo.'
    mostrarMensaje('Error de validación',mensaje,'warning')
  } else if (iTEmpleado.value == '' || iTEmpleado.value <= 0) {
    valido = false
    let mensaje = 'El tiempo empleado no puede ser nulo o negativo.'
    mostrarMensaje('Error de validación',mensaje,'warning')
  } else if (
    iDescripcion.value.trim() === '' ||
    iDescripcion.value.trim().includes('*/*')
  ) {
    valido = false
    let mensaje =
      'La descripción no puede estar vacía o contener la subcadena "*/*".'
    mostrarMensaje('Error de validación',mensaje,'warning')
  }
  return valido
}

//--------------------------------------------------------------------------------------------------
function mostrarMensaje(titulo,mensaje,icono) {
  Swal.fire({
    title: titulo,
    text: mensaje,
    icon: icono,
    confirmButtonText: 'Aceptar',
  })
}

//--------------------------------------------------------------------------------------------------
//Función que límpia los campos tras guardar una cookie.
function limpiaCampos() {
  iTarea.value = ''
  iTEmpleado.value = 1
  iTProgramado.value = 1
  iDescripcion.value = ''
}