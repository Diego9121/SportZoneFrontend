import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { EMPRESA } from '@/lib/empresa'
import { formatMoneda } from '@/lib/currency'
import type { ReporteCompraItem, ReporteComprasResumen } from '../schemas/reporte.schema'

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
    width: '31%',
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
  colDoc: { width: '20%' },
  colProveedor: { width: '35%' },
  colTotal: { width: '20%', textAlign: 'right' },
  colFecha: { width: '25%' },
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

interface ReporteComprasPdfProps {
  resumen: ReporteComprasResumen
  compras: ReporteCompraItem[]
  desde?: string
  hasta?: string
}

function ReporteComprasPdf({ resumen, compras, desde, hasta }: ReporteComprasPdfProps) {
  return (
    <Document title="Reporte de compras">
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{EMPRESA.nombre.toUpperCase()}</Text>
        <Text style={styles.empresaInfo}>{EMPRESA.direccion} · {EMPRESA.contacto} · NIT: {EMPRESA.nit}</Text>

        <View style={styles.separator} />

        <Text style={styles.subtitle}>Reporte de compras</Text>
        <Text style={styles.periodo}>{formatPeriodo(desde, hasta)}</Text>

        <View style={styles.resumenGrid}>
          <View style={styles.resumenBox}>
            <Text style={styles.resumenLabel}>Cantidad de compras</Text>
            <Text style={styles.resumenValue}>{resumen.cantidadIngresos}</Text>
          </View>
          <View style={styles.resumenBox}>
            <Text style={styles.resumenLabel}>Total comprado</Text>
            <Text style={styles.resumenValue}>{formatMoneda(resumen.totalComprado)}</Text>
          </View>
          <View style={styles.resumenBox}>
            <Text style={styles.resumenLabel}>Compra promedio</Text>
            <Text style={styles.resumenValue}>{formatMoneda(resumen.compraPromedio)}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRowHeader}>
            <Text style={[styles.headerCell, styles.colDoc]}>N° documento</Text>
            <Text style={[styles.headerCell, styles.colProveedor]}>Proveedor</Text>
            <Text style={[styles.headerCell, styles.colTotal]}>Total</Text>
            <Text style={[styles.headerCell, styles.colFecha]}>Fecha</Text>
          </View>
          {compras.map((compra) => (
            <View key={compra.id} style={styles.tableGroup}>
              <View style={styles.tableRow}>
                <Text style={[styles.cell, styles.colDoc]}>{compra.numeroDoc ?? `#${compra.id}`}</Text>
                <Text style={[styles.cell, styles.colProveedor]}>{compra.proveedorNombre ?? '-'}</Text>
                <Text style={[styles.cell, styles.colTotal]}>{formatMoneda(compra.total)}</Text>
                <Text style={[styles.cell, styles.colFecha]}>{new Date(compra.createdAt).toLocaleDateString()}</Text>
              </View>
              {compra.detalles.length > 0 && (
                <View style={styles.detalleWrapper}>
                  {compra.detalles.map((detalle, index) => (
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

export default ReporteComprasPdf
