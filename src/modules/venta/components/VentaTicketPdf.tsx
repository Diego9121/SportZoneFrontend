import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { EMPRESA } from '@/lib/empresa'
import type { Venta } from '../schemas/venta.schema'

// Ancho típico de un rollo de impresora térmica de 80mm (en puntos PDF).
const ANCHO_TICKET = 226.77

const styles = StyleSheet.create({
  page: {
    width: ANCHO_TICKET,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 8,
    // El PDF estándar no incluye Arial (es una fuente propietaria de Microsoft);
    // Helvetica es la fuente base de PDF métricamente equivalente a Arial.
    fontFamily: 'Helvetica',
  },
  center: { textAlign: 'center' },
  logo: {
    alignSelf: 'center',
    width: 28,
    height: 28,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  logoText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
  },
  title: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
  },
  empresaInfo: {
    fontSize: 7,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'dashed',
    marginVertical: 6,
  },
  itemDescripcion: {
    marginBottom: 1,
  },
  itemLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  grandTotal: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
  },
  footer: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 7,
  },
  qrWrapper: {
    marginTop: 10,
    alignItems: 'center',
  },
  qrImage: {
    width: 90,
    height: 90,
  },
  qrCaption: {
    marginTop: 4,
    fontSize: 6,
    textAlign: 'center',
  },
})

function buildQrUrl(venta: Venta): string {
  const texto = [
    EMPRESA.nombre,
    `NIT: ${EMPRESA.nit}`,
    `Doc: ${venta.numeroDoc ?? venta.id}`,
    `Cliente: ${venta.clienteNombre ?? 'Cliente general'}`,
    `Total: ${venta.total.toFixed(2)}`,
    `Fecha: ${new Date(venta.createdAt).toLocaleString()}`,
  ].join('\n')
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(texto)}`
}

interface VentaTicketPdfProps {
  venta: Venta
}

function VentaTicketPdf({ venta }: VentaTicketPdfProps) {
  return (
    <Document title={`Ticket ${venta.numeroDoc ?? venta.id}`}>
      <Page size={{ width: ANCHO_TICKET }} style={styles.page}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>SZ</Text>
        </View>
        <Text style={[styles.center, styles.title]}>{EMPRESA.nombre.toUpperCase()}</Text>
        <Text style={[styles.center, styles.empresaInfo]}>{EMPRESA.direccion}</Text>
        <Text style={[styles.center, styles.empresaInfo]}>Tel: {EMPRESA.contacto}</Text>
        <Text style={[styles.center, styles.empresaInfo]}>NIT: {EMPRESA.nit}</Text>
        <Text style={[styles.center, styles.empresaInfo]}>{EMPRESA.sucursal}</Text>

        <View style={styles.separator} />

        <Text style={styles.center}>{venta.tipoComprobante.toUpperCase()}</Text>
        <Text style={styles.center}>{venta.numeroDoc ?? `#${venta.id}`}</Text>

        <View style={styles.separator} />

        <Text>Cliente: {venta.clienteNombre ?? 'Cliente general'}</Text>
        <Text>Fecha: {new Date(venta.createdAt).toLocaleString()}</Text>

        <View style={styles.separator} />

        {venta.detalles.map((detalle) => (
          <View key={detalle.id}>
            <Text style={styles.itemDescripcion}>{detalle.varianteDescripcion}</Text>
            <View style={styles.itemLine}>
              <Text>
                {detalle.cantidad} x {detalle.precioUnitario.toFixed(2)}
                {detalle.descuento > 0 ? ` (-${detalle.descuento.toFixed(2)})` : ''}
              </Text>
              <Text>{detalle.subtotal.toFixed(2)}</Text>
            </View>
          </View>
        ))}

        <View style={styles.separator} />

        <View style={styles.totalRow}>
          <Text>Subtotal</Text>
          <Text>{venta.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text>Descuento</Text>
          <Text>{venta.descuento.toFixed(2)}</Text>
        </View>
        <View style={[styles.totalRow, styles.grandTotal]}>
          <Text>TOTAL</Text>
          <Text>{venta.total.toFixed(2)}</Text>
        </View>

        <View style={styles.separator} />

        {venta.observacion && <Text style={styles.footer}>{venta.observacion}</Text>}
        <Text style={styles.footer}>¡Gracias por su compra!</Text>

        <View style={styles.qrWrapper}>
          <Image style={styles.qrImage} src={buildQrUrl(venta)} />
          <Text style={styles.qrCaption}>Escanea para verificar esta factura</Text>
        </View>
      </Page>
    </Document>
  )
}

export default VentaTicketPdf
