import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { EMPRESA } from '@/lib/empresa'
import { formatMoneda } from '@/lib/currency'
import type { ReporteVentaItem, ReporteVentasResumen } from '../schemas/reporte.schema'

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 9,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },
  empresaInfo: {
    fontSize: 8,
    textAlign: 'center',
    color: '#444444',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },
  periodo: {
    fontSize: 8,
    color: '#444444',
    marginBottom: 6,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    marginVertical: 8,
  },
  resumenGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  resumenBox: {
    width: '23%',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 4,
    padding: 6,
  },
  resumenLabel: {
    fontSize: 7,
    color: '#444444',
  },
  resumenValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginTop: 2,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000000',
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#eeeeee',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  tableGroup: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#cccccc',
  },
  tableRow: {
    flexDirection: 'row',
  },
  detalleWrapper: {
    paddingLeft: 16,
    paddingBottom: 4,
    backgroundColor: '#fafafa',
  },
  detalleText: {
    fontSize: 7,
    color: '#555555',
    marginTop: 1,
  },
  cell: {
    padding: 4,
    fontSize: 8,
  },
  headerCell: {
    padding: 4,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },
  colDoc: { width: '23%' },
  colComprobante: { width: '10%' },
  colCliente: { width: '17%' },
  colEstado: { width: '9%' },
  colTotal: { width: '10%', textAlign: 'right' },
  colCosto: { width: '9%', textAlign: 'right' },
  colGanancia: { width: '9%', textAlign: 'right' },
  colFecha: { width: '13%' },
  footer: {
    marginTop: 10,
    fontSize: 7,
    textAlign: 'center',
    color: '#444444',
  },
})

function formatPeriodo(desde?: string, hasta?: string): string {
  if (!desde && !hasta) return 'Todo el periodo'
  const desdeTexto = desde ? new Date(desde).toLocaleDateString() : 'inicio'
  const hastaTexto = hasta ? new Date(hasta).toLocaleDateString() : 'hoy'
  return `Del ${desdeTexto} al ${hastaTexto}`
}

interface ReporteVentasPdfProps {
  resumen: ReporteVentasResumen
  ventas: ReporteVentaItem[]
  desde?: string
  hasta?: string
}

function ReporteVentasPdf({ resumen, ventas, desde, hasta }: ReporteVentasPdfProps) {
  return (
    <Document title="Reporte de ventas">
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{EMPRESA.nombre.toUpperCase()}</Text>
        <Text style={styles.empresaInfo}>{EMPRESA.direccion} · {EMPRESA.contacto} · NIT: {EMPRESA.nit}</Text>

        <View style={styles.separator} />

        <Text style={styles.subtitle}>Reporte de ventas</Text>
        <Text style={styles.periodo}>{formatPeriodo(desde, hasta)}</Text>

        <View style={styles.resumenGrid}>
          <View style={styles.resumenBox}>
            <Text style={styles.resumenLabel}>Cantidad de ventas</Text>
            <Text style={styles.resumenValue}>{resumen.cantidadVentas}</Text>
          </View>
          <View style={styles.resumenBox}>
            <Text style={styles.resumenLabel}>Total vendido</Text>
            <Text style={styles.resumenValue}>{formatMoneda(resumen.totalVendido)}</Text>
          </View>
          <View style={styles.resumenBox}>
            <Text style={styles.resumenLabel}>Descuentos</Text>
            <Text style={styles.resumenValue}>{formatMoneda(resumen.totalDescuentos)}</Text>
          </View>
          <View style={styles.resumenBox}>
            <Text style={styles.resumenLabel}>Ticket promedio</Text>
            <Text style={styles.resumenValue}>{formatMoneda(resumen.ticketPromedio)}</Text>
          </View>
          <View style={styles.resumenBox}>
            <Text style={styles.resumenLabel}>Costo total</Text>
            <Text style={styles.resumenValue}>{formatMoneda(resumen.totalCosto)}</Text>
          </View>
          <View style={styles.resumenBox}>
            <Text style={styles.resumenLabel}>Ganancia bruta</Text>
            <Text style={styles.resumenValue}>{formatMoneda(resumen.gananciaBruta)}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRowHeader}>
            <Text style={[styles.headerCell, styles.colDoc]}>N° documento</Text>
            <Text style={[styles.headerCell, styles.colComprobante]}>Comprobante</Text>
            <Text style={[styles.headerCell, styles.colCliente]}>Cliente</Text>
            <Text style={[styles.headerCell, styles.colEstado]}>Estado</Text>
            <Text style={[styles.headerCell, styles.colTotal]}>Total</Text>
            <Text style={[styles.headerCell, styles.colCosto]}>Costo</Text>
            <Text style={[styles.headerCell, styles.colGanancia]}>Ganancia</Text>
            <Text style={[styles.headerCell, styles.colFecha]}>Fecha</Text>
          </View>
          {ventas.map((venta) => (
            <View key={venta.id} style={styles.tableGroup}>
              <View style={styles.tableRow}>
                <Text style={[styles.cell, styles.colDoc]}>{venta.numeroDoc ?? `#${venta.id}`}</Text>
                <Text style={[styles.cell, styles.colComprobante]}>{venta.tipoComprobante}</Text>
                <Text style={[styles.cell, styles.colCliente]}>{venta.clienteNombre ?? 'Cliente general'}</Text>
                <Text style={[styles.cell, styles.colEstado]}>{venta.estado}</Text>
                <Text style={[styles.cell, styles.colTotal]}>{formatMoneda(venta.total)}</Text>
                <Text style={[styles.cell, styles.colCosto]}>{formatMoneda(venta.costo)}</Text>
                <Text style={[styles.cell, styles.colGanancia]}>{formatMoneda(venta.ganancia)}</Text>
                <Text style={[styles.cell, styles.colFecha]}>{new Date(venta.createdAt).toLocaleDateString()}</Text>
              </View>
              {venta.detalles.length > 0 && (
                <View style={styles.detalleWrapper}>
                  {venta.detalles.map((detalle, index) => (
                    <Text key={index} style={styles.detalleText}>
                      • {detalle.nombre} — {detalle.cantidad} x {formatMoneda(detalle.precioUnitario)} = {formatMoneda(detalle.total)}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Generado el {new Date().toLocaleString()}
        </Text>
      </Page>
    </Document>
  )
}

export default ReporteVentasPdf
