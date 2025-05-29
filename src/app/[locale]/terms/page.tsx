"use client";
import Head from 'next/head';
import styles from './terms.module.css';

export default function TermsConditions() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Términos y Condiciones - ToySwap Marketplace</title>
        <meta name="description" content="Términos y condiciones de uso de nuestro marketplace de juguetes usados" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Términos y Condiciones de ToydaCity</h1>
        <p className={styles.effectiveDate}>Última actualización: 21/05/2025</p>

        <section className={styles.section}>
          <h2>1. Aceptación de los Términos</h2>
          <p>Al registrarte y usar ToySwap (la <b>Plataforma</b>), aceptas estos Términos y Condiciones, nuestra Política de Privacidad y todas las normas comunitarias.</p>
        </section>

        <section className={styles.section}>
          <h2>2. Descripción del Servicio</h2>
          <p>ToySwap es un marketplace que permite:</p>
          <ul>
            <li><strong>Vender</strong> juguetes usados en buen estado</li>
            <li><strong>Comprar</strong> juguetes de segunda mano</li>
            <li><strong>Intercambiar</strong> juguetes con otros usuarios</li>
            <li><strong>Donar</strong> juguetes a organizaciones benéficas asociadas</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Requisitos para Usuarios</h2>
          <ul>
            <li>Debes tener al menos 18 años o contar con supervisión parental</li>
            <li>Proporcionar información veraz al registrarte</li>
            <li>No puedes tener múltiples cuentas sin autorización</li>
            <li>Eres responsable de mantener la seguridad de tu cuenta</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Normas para Publicaciones</h2>
          <p>Los juguetes publicados deben:</p>
          <ul>
            <li>Estar en condiciones funcionales y seguras para su uso</li>
            <li>Tener descripciones precisas y fotos reales</li>
            <li>No infringir derechos de autor o marcas registradas</li>
            <li>Cumplir con todas las regulaciones de seguridad infantil</li>
            <li>No incluir productos prohibidos (armas, materiales peligrosos, etc.)</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Transacciones y Pagos</h2>
          <ul>
            <li>ToySwap no es parte en las transacciones entre usuarios</li>
            <li>Las partes negocian directamente el precio y método de pago</li>
            <li>Recomendamos usar los sistemas de pago integrados para mayor seguridad</li>
            <li>Los impuestos y gastos de envío son responsabilidad del comprador/vendedor</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>6. Intercambios y Donaciones</h2>
          <ul>
            <li>Los términos del intercambio deben acordarse claramente entre las partes</li>
            <li>Las donaciones a organizaciones benéficas pueden ser verificadas por ToySwap</li>
            <li>No se permiten intercambios de valor desigual sin compensación adicional</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>7. Conducta Prohibida</h2>
          <p>No está permitido:</p>
          <ul>
            <li>Publicar información falsa o engañosa</li>
            <li>Contactar usuarios fuera de la plataforma para evadir comisiones</li>
            <li>Utilizar la plataforma para actividades ilegales</li>
            <li>Acosar o enviar spam a otros usuarios</li>
            <li>Manipular el sistema de valoraciones</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>8. Limitación de Responsabilidad</h2>
          <p>ToySwap no se hace responsable por:</p>
          <ul>
            <li>La calidad o estado real de los juguetes publicados</li>
            <li>Problemas en transacciones entre usuarios</li>
            <li>Daños durante el transporte</li>
            <li>Uso inadecuado de los juguetes comprados</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>9. Modificaciones</h2>
          <p>Podemos actualizar estos términos periódicamente. Te notificaremos sobre cambios importantes.</p>
        </section>

        <section className={styles.section}>
          <h2>10. Terminación</h2>
          <p>Podemos suspender o cancelar cuentas que violen estos términos sin previo aviso.</p>
        </section>

        <section className={styles.contact}>
          <h2>Contacto</h2>
          <p>Para preguntas sobre estos términos: <a href="mailto:legal@toydacity.com">legal@toydacity.com</a></p>
        </section>
      </main>
    </div>
  );
}