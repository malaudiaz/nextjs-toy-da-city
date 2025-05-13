import Head from 'next/head';
import styles from './policies.module.css';

export default function PrivacyPolicy() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Política de Privacidad - ToydaCity Marketplace</title>
        <meta name="description" content="Política de privacidad de nuestro marketplace de juguetes usados" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Política de Privacidad de ToydaCity</h1>
        
        <section className={styles.section}>
          <h2>1. Información que recopilamos</h2>
          <p>En ToydaCity, recopilamos la siguiente información cuando usas nuestro marketplace:</p>
          <ul>
            <li>Información de registro (nombre, email, dirección)</li>
            <li>Datos de transacciones (historial de compras/ventas)</li>
            <li>Información de productos listados</li>
            <li>Datos de comunicación (mensajes entre usuarios)</li>
            <li>Información técnica (dirección IP, tipo de dispositivo)</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>2. Uso de la información</h2>
          <p>Utilizamos tus datos para:</p>
          <ul>
            <li>Facilitar transacciones entre compradores y vendedores</li>
            <li>Mejorar y personalizar tu experiencia</li>
            <li>Procesar pagos y prevenir fraudes</li>
            <li>Cumplir con obligaciones legales</li>
            <li>Enviar actualizaciones relevantes (puedes desactivarlo)</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Compartir información</h2>
          <p>No vendemos tus datos personales. Compartimos información solo cuando es necesario para:</p>
          <ul>
            <li>Proveedores de pago (Stripe, PayPal, etc.)</li>
            <li>Servicios de envío</li>
            <li>Cumplimiento legal (requerimientos judiciales)</li>
            <li>Protección contra fraudes</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Seguridad de datos</h2>
          <p>Implementamos medidas de seguridad como:</p>
          <ul>
            <li>Encriptación SSL para todas las comunicaciones</li>
            <li>Protección contra accesos no autorizados</li>
            <li>Almacenamiento seguro de información sensible</li>
            <li>Revisiones periódicas de seguridad</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Tus derechos</h2>
          <p>Tienes derecho a:</p>
          <ul>
            <li>Acceder a tus datos personales</li>
            <li>Solicitar corrección o eliminación</li>
            <li>Oponerte al procesamiento</li>
            <li>Solicitar limitación del tratamiento</li>
            <li>Portabilidad de datos</li>
          </ul>
          <p>Para ejercer estos derechos, contáctanos en privacidad@toyswap.com</p>
        </section>

        <section className={styles.section}>
          <h2>6. Cookies y tecnologías similares</h2>
          <p>Usamos cookies para:</p>
          <ul>
            <li>Funcionamiento básico del sitio</li>
            <li>Analizar tráfico y uso</li>
            <li>Personalizar contenido</li>
          </ul>
          <p>Puedes gestionar tus preferencias de cookies en la configuración de tu navegador.</p>
        </section>

        <section className={styles.section}>
          <h2>7. Cambios en esta política</h2>
          <p>Actualizaremos esta política cuando sea necesario. Te notificaremos sobre cambios significativos.</p>
          <p>Última actualización: {new Date().toLocaleDateString()}</p>
        </section>

        <section className={styles.contact}>
          <h2>Contacto</h2>
          <p>Para preguntas sobre privacidad: <a href="mailto:privacidad@toydacity.com">privacidad@toydacity.com</a></p>
        </section>
      </main>
    </div>
  );
}