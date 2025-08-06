emailjs.send("servicio_cbrzaih", "plantilla_xox9vur", {
    name: "Joyeria K'latee",
    email: "klatee.joyeria@gmail.com",
    message: "Hola!! Bienvenido a la Familia K'latee Joyeria! Por ser nuevo integrante de esta gran familia, te obsequiamos un bono de descuento del 10% en tu primera compra. Espero lo disfrutes al maximo. FELICITACIONES!!!"
}, "service_cbrzaih")
.then((response) => {
    console.log('Correo enviado con éxito!', response.status, response.text);
})
.catch((error) => {
    console.error('Error al enviar el correo:', error);
    alert('Hubo un problema al enviar el correo. Por favor, intenta nuevamente.');
});