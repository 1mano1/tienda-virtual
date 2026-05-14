describe('Pruebas de Seguridad Automatizadas', () => {
  const backendUrl = 'http://localhost:4000/api';

  it('SEC01: Verificación de Cabeceras de Seguridad (Helmet)', () => {
    cy.request(backendUrl + '/salud').then((response) => {
      // Verificar que Helmet está funcionando
      expect(response.headers).to.have.property('x-content-type-options', 'nosniff');
      expect(response.headers).to.have.property('x-frame-options', 'SAMEORIGIN');
      expect(response.headers).to.have.property('strict-transport-security');
      // X-Powered-By no debe estar presente para no revelar tecnología
      expect(response.headers).to.not.have.property('x-powered-by');
    });
  });

  it('SEC02: Validación de Integridad en Checkout (Inyección de Caracteres)', () => {
    cy.visit('/');
    
    // Agregar un producto para habilitar el checkout
    cy.get('[data-testid="product-card"]').first().find('button').click();

    // Interceptar la llamada a la API
    cy.intercept('POST', '**/api/compra').as('checkoutRequest');

    // Forzar el checkout con un payload malicioso simulado en el estado o interceptando
    // En este caso, simularemos que un atacante modifica el nombre en la petición
    cy.window().then((win) => {
      // Aunque el componente usa un nombre fijo 'Cliente Demo', validamos que el backend 
      // responda correctamente a una petición con caracteres especiales si se enviaran.
      cy.request({
        method: 'POST',
        url: backendUrl + '/compra',
        body: {
          customerName: '<script>alert("xss")</script>',
          items: [{ productId: 1, quantity: 1 }]
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(201); // El backend actual lo crea, pero verificamos que no truene
        expect(response.body.customerName).to.not.include('<script>'); // Idealmente debería estar sanitizado
        // Nota: En este proyecto demo el backend NO sanitiza, por lo que esta prueba 
        // podría fallar si esperamos sanitización estricta, lo cual sirve para documentar la vulnerabilidad.
      });
    });
  });

  it('SEC03: Control de Exposición de Información', () => {
    // 1. Verificar endpoint de seguridad simulado
    cy.request(backendUrl + '/seg').then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('finding');
      expect(response.body.severity).to.equal('medium');
    });

    // 2. Verificar que rutas inexistentes no fuguen info
    cy.request({
      url: backendUrl + '/ruta-inexistente-que-no-debe-existir',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(404);
      // No debe contener trazas de stack o rutas de archivos
      const bodyStr = JSON.stringify(response.body);
      expect(bodyStr).to.not.include('C:\\');
      expect(bodyStr).to.not.include('/usr/src/app');
      expect(bodyStr).to.not.include('node_modules');
    });
  });
});
