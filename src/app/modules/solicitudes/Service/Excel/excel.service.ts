import { Injectable } from "@angular/core";
import { ImagePosition, Workbook } from "exceljs";
import { ConsultaService } from "./consulta.service";
import {
  IConsultaExcelTablaCompraDto,
  IConsultaExcelTablaDto,
  ITablaConsultaCompraDto,
  ITablaConsultaDto,
} from "../../Interfaces/CompraVale/excel";
import * as fs from "file-saver";
import { LOGO } from "../../Interfaces/logo";
import {
  Cantidad,
  Consulta,
  Decano,
  IConsultaDelAl,
  In,
  Tabla,
  ValidarVale,
} from "../../Interfaces/CompraVale/Consulta";
import { Veri } from "../../Interfaces/CompraVale/Veri";
import { IExistenciaVales } from "../../Interfaces/existenciavales.interface";
@Injectable({
  providedIn: "root",
})
export class ExcelService {
  consulta: Consulta[] = [];
  fecha: Date;
  fechac: Date;
  cantvale: String;
  idcompra: string;
  precio: number;
  items: Veri[] = [];
  valor: ValidarVale[] = [];
  cantidad1: Cantidad[] = [];
  valeDelAl!: IConsultaDelAl[];
  fechaActual: Date = new Date();
  cccc: Tabla[] = [];
  vvvv: Tabla[];
  varivv: number = 0;
  valorvv: number;
  id: string;
  in: In[] = [];
  decano: Decano[] = [];
  hhh: Date;
  private workbook!: Workbook;
  constructor(private consultaService: ConsultaService) {}

  dowloadExcel(
    _existenciaI: IExistenciaVales,
    dataExcelConsulta: IConsultaExcelTablaDto,
    dataExcelCompra: IConsultaExcelTablaCompraDto,
    fechaDesde: Date,
    fechaAsta: Date,
    deca: Decano[]
  ) {
    this.workbook = new Workbook();
    this.workbook.creator = "ues.edu.sv";
    // this.workbook.addWorksheet('CONSULTAS');
    this.crearTablaConsulta(
      _existenciaI,
      dataExcelConsulta.tablaConsultaConsulta,
      dataExcelCompra.tablaConsultaCompra,
      fechaDesde,
      fechaAsta,
      deca
    );
    //this.crearTablaConsulta();
    this.workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data]);
      fs.saveAs(blob, "consulta.xlsx");
    });
  }
  async crearTablaConsulta(
    eexistenciaI: IExistenciaVales,
    dataConsultaTaTableConsulta: ITablaConsultaDto[],
    dataConsultaTaTableCompra: ITablaConsultaCompraDto[],
    fechaDesde: Date,
    fechaAsta: Date,
    decan: Decano[]
  ) {
    let sheet = this.workbook.addWorksheet("CONSULTAS");
    sheet.getColumn("A").width = 15;
    sheet.getColumn("B").width = 15;
    sheet.getColumn("C").width = 15;
    sheet.getColumn("D").width = 15;
    sheet.getColumn("E").width = 15;
    sheet.getColumn("F").width = 15;
    sheet.getColumn("G").width = 15;
    sheet.getColumn("H").width = 15;
    sheet.getColumn("I").width = 15;
    sheet.getColumn("J").width = 15;
    sheet.getColumn("K").width = 15;
    sheet.getColumn("L").width = 15;

    sheet.columns.forEach((column) => {
      column.alignment = { vertical: "middle", wrapText: true };
    });
    const logo = this.workbook.addImage({
      base64: LOGO,
      extension: "png",
    });
    const position: ImagePosition = {
      tl: { col: 0.3, row: 1 },
      ext: { width: 60, height: 80 },
    };
    sheet.addImage(logo, position);
    sheet.mergeCells("B2", "H2");
    sheet.mergeCells("B3", "H3");
    sheet.mergeCells("B4", "H4");
    sheet.mergeCells("A6", "B6");
    sheet.mergeCells("A7", "B7");
    sheet.mergeCells("C6", "F6");
    sheet.mergeCells("C7", "F7");
    const titulo = sheet.getCell("B2");
    const titulo1 = sheet.getCell("B3");
    const titulo2 = sheet.getCell("B4");
    titulo.value = "UNIVERSIDAD DE EL SALVADOR";
    titulo1.value = "FACULTAD MULTIDISCIPLINARIA PARACENTRAL";
    titulo2.value = "INFORME MENSUAL CONSUMO DE COMBUSTIBLE";
    const titulo3 = sheet.getCell("A6");
    const titulo4 = sheet.getCell("A7");
    titulo3.value = "LINEA DE TRABAJO:";
    titulo4.value = "PERIODO:";

    const titulo5 = sheet.getCell("C6");
    titulo5.value = "ENSEÑANZA MULTIDISCIPLINARIA PARACENTRAL";
    const titulo6 = sheet.getCell("C7");
    titulo6.value = `${
      "Del " +
      this.formatDate(`${fechaDesde}`) +
      " Al " +
      this.formatDate(`${fechaAsta}`)
    }`;
    const titulo7 = sheet.getCell("A11");
    sheet.mergeCells("A11", "D11");
    titulo7.value = `${
      "Asignación de Vales de combustible " +
      this.formatDate(`${fechaDesde}`) +
      ""
    }`;
    const titulo8 = sheet.getCell("A12");
    titulo8.value = `${"INICIO"}`;

    titulo7.style.font = {
      bold: true,
      size: 12,
      name: "Antique Olive",
      color: {
        argb: "FF000000",
      },
    };

    titulo.style.font = {
      bold: true,
      size: 12,
      name: "Antique Olive",
      color: {
        argb: "FF000000",
      },
    };
    titulo.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: false,
    };
    titulo1.style.font = {
      bold: true,
      size: 12,
      name: "Antique Olive",
      color: {
        argb: "FF000000",
      },
    };
    titulo1.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: false,
    };
    titulo2.style.font = {
      bold: true,
      size: 12,
      name: "Antique Olive",
      color: {
        argb: "FF000000",
      },
    };
    titulo2.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: false,
    };
    titulo3.style.font = {
      bold: true,
      size: 10,
      name: "Antique Olive",
      color: {
        argb: "FF000000",
      },
    };
    titulo4.style.font = {
      bold: true,
      size: 10,
      name: "Antique Olive",
      color: {
        argb: "FF000000",
      },
    };
    titulo5.style.font = {
      bold: true,
      size: 10,
      name: "Antique Olive",
      underline: "single",
      color: {
        argb: "FF000000",
      },
    };
    titulo6.style.font = {
      bold: true,
      size: 10,
      name: "Antique Olive",
      underline: "single",
      color: {
        argb: "FF000000",
      },
    };
    const headerR = sheet.getRow(10);
    headerR.values = [
      "N° de Vales/ F.",
      "Entradas Cant.",
      "Entradas P.U.",
      "Entradas Total",
      "Salidas Cant.",
      "Salidas P.U.",
      "Salidas  Total",
      "Fecha",
    ];
    const titulo00 = sheet.getCell("H" + `${11}`);
    titulo00.value = `${this.formatDate(`${fechaDesde}`)}`;
    titulo00.style.font = {
      bold: true,
      size: 12,
      name: "Antique Olive",
      color: {
        argb: "FF000000",
      },
    };

    headerR.alignment = { vertical: "middle", wrapText: false };
    ["A", "B", "C", "D", "E", "F", "G", "H"].forEach((columnKey) => {
      sheet.getCell(`${columnKey}10`).font = {
        bold: true,
        color: { argb: "FFFFFF" },
        size: 12,
        italic: true,
      };
      sheet.getCell(`${columnKey}10`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0000FF" },
        bgColor: { argb: "" },
      };
    });

    headerR.alignment = { vertical: "middle", wrapText: false };
    ["A", "B", "C", "D", "E", "F", "G", "H"].forEach((columnKey) => {
      sheet.getCell(`${columnKey}11`).font = {
        bold: true,
        color: { argb: "000000" },
        size: 12,
        italic: true,
      };
      sheet.getCell(`${columnKey}11`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "C7F6FF" },
        bgColor: { argb: "" },
      };
    });
    //-------------------------------------------
    let cell = 0;
    let conn = 1;
    let con = 0;
    let cell1 = 0;
    let conn1 = 1;
    let con1 = 0;
    let j = 0;
    let cant = 0;
    let salidadcant = 0;
    let salidadpu = 0;
    let valorpre = 0;

    let mm = 0;
    let nn = 0;
    let kk = 0;

    const fileInsertar = sheet.getRows(
      13,
      dataConsultaTaTableConsulta.length + 31
    )!;
    let index = 0;
    let row = fileInsertar[index];
    dataConsultaTaTableConsulta.forEach((item) => {
      kk++;
      if (this.fecha === null) {
        row = fileInsertar[index];
        //--------------------------------------

        //-------------------------------------
        row.values = [
          this.formatDate(`${item.fecha}`),
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ];
        index++;
      } else {
        if (item.fecha != this.fecha) {
          row = fileInsertar[index];
          row.values = [
            this.formatDate(`${item.fecha}`),
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ];
          index++;
          cell1 = index;
          row = fileInsertar[index];
          cant = j - item.cantidadvale;
          this.cantidad1.push({ cant: con1, veri: index, conta: 1 });
          salidadcant = salidadcant + item.cantidadvale;
          salidadpu = salidadpu + item.valor;
          row.values = [
            `${item.correlativo}`,
            `${""}`,
            `${"$"}`,
            `${"$"}`,
            `${item.cantidadvale}`,
            `${"$" + item.valor}`,
            `${"$" + item.cantidadvale * item.valor}`,
            `${this.formatDate(`${item.fecha}`)}`,
          ];
          this.in.push({ idn: item.fecha, in: index, vall: item.valor });
          if (nn > 0 && item.fecha != this.fecha) {
            mm++;
            this.cccc.push({
              id: item.solicitudvehiculoid,
              i: index,
              codi: mm,
              val: item.valor,
            });
            nn = 0;
            mm = 0;
          }
          con1 = 0;
          con = 0;
          j = cant;
          index++;
          valorpre = valorpre + item.cantidadvale * item.valor;
          this.cantvale = item.idasignacionvale;
          this.precio = item.valor;
        } else {
          mm++;
          nn++;
          if (
            con === 1 &&
            item.valor === this.precio &&
            item.idasignacionvale === this.cantvale
          ) {
            conn++;
            con1++;
            this.valor.push({
              inde: index,
              cantidad: item.cantidadvale,
              valor: item.valor,
              valorAntes: this.precio,
              idA: item.idasignacionvale,
              con: conn,
              conv: conn1,
            });
            cell1 = 0;
          }
          row = fileInsertar[index];
          row.values = [`${item.correlativo}`, `${""}`];
          index++;
          if (item.idasignacionvale != this.cantvale) {
            this.in.push({ idn: item.fecha, in: index, vall: item.valor });
            this.cccc.push({
              id: item.solicitudvehiculoid,
              i: index,
              codi: mm,
              val: item.valor,
            });
            nn++;
            mm = 0;
            row.values = [
              `${item.correlativo}`,
              `${""}`,
              `${"$"}`,
              `${"$"}`,
              `${item.cantidadvale}`,
              `${"$" + item.valor}`,
              `${"$" + item.cantidadvale * item.valor}`,
              `${this.formatDate(`${item.fecha}`)}`,
            ];
            this.cantvale = item.idasignacionvale;
            this.precio = item.valor;
            salidadcant = salidadcant + item.cantidadvale;
            salidadpu = salidadpu + item.valor;
            valorpre = valorpre + item.cantidadvale * item.valor;
          } else if (item.valor != this.precio) {
            con++;
            cell = index;
            conn1++;
            this.valor.push({
              inde: index,
              cantidad: item.cantidadvale,
              valor: item.valor,
              valorAntes: this.precio,
              idA: item.idasignacionvale,
              con: conn,
              conv: conn1,
            });
            row.values = [
              `${item.correlativo}`,
              `${""}`,
              `${"$"}`,
              `${"$"}`,
              `${item.cantidadvale}`,
              `${"$" + item.valor}`,
              `${"$" + item.cantidadvale * item.valor}`,

              `${this.formatDate(`${item.fecha}`)}`,
            ];
            this.precio = item.valor;
            salidadpu = salidadpu + item.valor;
            valorpre = valorpre + item.cantidadvale * item.valor;
          }
        }
        this.fecha = item.fecha;
      }
    });
    //------------
    ["A", "B", "C", "D", "E", "F", "G", "H"].forEach((columnKey) => {
      sheet.getCell(`${columnKey}${index + 13}`).font = {
        bold: true,
        color: { argb: "000000" },
        size: 12,
        italic: true,
      };
      sheet.getCell(`${columnKey}${index + 13}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "C7F6FF" },
        bgColor: { argb: "" },
      };
    });
    sheet.mergeCells("A" + `${index + 13}`, "E" + `${index + 13}`);
    const titul1 = sheet.getCell("A" + `${index + 13}`);
    titul1.value = `${
      "Compra de vales de combustible " +
      `${this.formatDate(`${fechaDesde}`)}` +
      ""
    }`;
    titul1.style.font = {
      bold: true,
      size: 12,
      name: "Antique Olive",
      color: {
        argb: "FF000000",
      },
    };
    index = index + 1;
    let cantcompra = 0;
    let cantcomprapu = 0;
    dataConsultaTaTableCompra.forEach((item) => {
      if (this.fechac === null) {
        row = fileInsertar[index];
        //--------------------------------------
        //-------------------------------------
        row.values = [
          this.formatDate(`${item.fechacompra}`),
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ];
        index++;
      } else {
        if (item.fechacompra != this.fechac) {
          row = fileInsertar[index];
          row.values = [
            this.formatDate(`${item.fechacompra}`),
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ];
          index++;
          row = fileInsertar[index];
          row.values = [
            "DEl " + `${item.codigoinicio}` + " AL " + `${item.codigofin}`,
            `${item.cantidad}`,
            `${"$" + item.preciounitario}`,
            `${"$" + item.cantidad * item.preciounitario}`,
            `${""}`,
            `${"$"}`,
            `${"$"}`,
            `${this.formatDate(`${item.fechacompra}`)}`,
          ];
          index++;
          cantcompra = cantcompra + item.cantidad;
          cantcomprapu = cantcomprapu + item.cantidad * item.preciounitario;
        } else {
          row.values = [
            "DEl " + `${item.codigoinicio}` + " AL " + `${item.codigofin}`,
            `${item.cantidad}`,
            `${"$" + item.preciounitario}`,
            `${"$" + item.cantidad * item.preciounitario}`,
            `${""}`,
            `${"$"}`,
            `${"$"}`,
            `${this.formatDate(`${item.fechacompra}`)}`,
          ];
          index++;
          cantcompra = cantcompra + item.cantidad;
          cantcomprapu = cantcomprapu + item.cantidad * item.preciounitario;
        }
        this.fechac = item.fechacompra;
      }
    });
    //----------------------------------------------
    ["A", "B", "C", "D", "E", "F", "G", "H"].forEach((columnKey) => {
      sheet.getCell(`${columnKey}${index + 13}`).font = {
        bold: true,
        color: { argb: "000000" },
        size: 12,
        italic: true,
      };
      sheet.getCell(`${columnKey}${index + 13}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "C7F6FF" },
        bgColor: { argb: "" },
      };
    });
    const titulo01 = sheet.getCell("A" + `${index + 13}`);
    titulo01.value = `${"TOTAL"}`;
    titulo01.style.font = {
      bold: true,
      size: 12,
      name: "Antique Olive",
      color: {
        argb: "FF000000",
      },
    };
    const titulo021 = sheet.getCell("B" + `${index + 13}`);
    titulo021.value = `${cantcompra}`;
    titulo021.style.font = {
      bold: true,
      size: 12,
      name: "Antique Olive",
      color: {
        argb: "FF000000",
      },
    };
    const titulo023 = sheet.getCell("D" + `${index + 13}`);
    titulo023.value = `${cantcomprapu}`;
    titulo023.style.font = {
      bold: true,
      size: 12,
      name: "Antique Olive",
      color: {
        argb: "FF000000",
      },
    };
    const titulo02 = sheet.getCell("E" + `${index + 13}`);
    titulo02.value = `${kk}`;
    titulo02.style.font = {
      bold: true,
      size: 12,
      name: "Antique Olive",
      color: {
        argb: "FF000000",
      },
    };
    const titulo03 = sheet.getCell("G" + `${index + 13}`);
    titulo03.value = `${kk * this.in[0].vall}`;
    titulo03.style.font = {
      bold: true,
      size: 12,
      name: "Antique Olive",
      color: {
        argb: "FF000000",
      },
    };
    const titulo04 = sheet.getCell("H" + `${index + 13}`);
    titulo04.value = `${this.formatDate(`${fechaAsta}`)}`;
    titulo04.style.font = {
      bold: true,
      size: 12,
      name: "Antique Olive",
      color: {
        argb: "FF000000",
      },
    };
    sheet.mergeCells("A" + `${index + 15}`, "F" + `${index + 15}`);
    ["A", "B", "C", "D", "E", "F"].forEach((columnKey) => {
      sheet.getCell(`${columnKey}${index + 15}`).font = {
        bold: true,
        color: { argb: "000000" },
        size: 12,
        italic: true,
      };
      sheet.getCell(`${columnKey}${index + 15}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "C7F6FF" },
        bgColor: { argb: "" },
      };
    });
    const titulo05 = sheet.getCell("A" + `${index + 15}`);
    titulo05.value =
      'Vales disponibles a la fecha de impresión: "' +
      `${this.formatoFecha(this.fechaActual)}` +
      '" = ' +
      `${eexistenciaI.valesDisponibles}`;
    titulo05.style.font = {
      bold: true,
      size: 12,
      name: "Antique Olive",
      color: {
        argb: "FF000000",
      },
    };
    sheet.mergeCells("A" + `${index + 17}`, "E" + `${index + 17}`);
    sheet.mergeCells("A" + `${index + 18}`, "E" + `${index + 18}`);
    sheet.mergeCells("A" + `${index + 19}`, "E" + `${index + 19}`);
    const titulo099 = sheet.getCell("A" + `${index + 17}`);
    titulo099.value = " F.";
    titulo099.style.font = {
      bold: true,
      size: 10,
      name: "Antique Olive",
      color: {
        argb: "FF000000",
      },
    };
    const titulo09911 = sheet.getCell("A" + `${index + 18}`);
    titulo09911.value = `${decan[0].nombre} ${decan[0].apellido}`;
    const titulo0991 = sheet.getCell("A" + `${index + 19}`);
    titulo0991.value = " Nombre y firma Decano";
    titulo0991.style.font = {
      bold: true,
      size: 10,
      name: "Antique Olive",
      color: {
        argb: "FF000000",
      },
    };
    console.log("obj veri", this.valor);
    //--------------------------------------------
    let connnnnn = 0;
    let ooo = 0;
    for (let j = 0; j < this.cccc.length; j++) {
      if (this.in[j].idn != this.hhh) {
        const titulosffcc = sheet.getCell("E" + `${this.in[j].in + 13}`);
        titulosffcc.value = `${this.cccc[j].codi}`;
        const titulosffcc1 = sheet.getCell("G" + `${this.in[j].in + 13}`);
        titulosffcc1.value = `$${this.cccc[j].codi * this.cccc[j].val}`;
      } else {
        const titulosffcc = sheet.getCell("E" + `${this.in[j].in + (13 - 1)}`);
        titulosffcc.value = `${this.cccc[j].codi}`;
        const titulosffcc1 = sheet.getCell("G" + `${this.in[j].in + (13 - 1)}`);
        titulosffcc1.value = `$${this.cccc[j].codi * this.cccc[j].val}`;
      }
      connnnnn = connnnnn + this.cccc[j].codi;
      this.hhh = this.in[j].idn;
    }

    let ll = this.in.length;
    if (this.hhh === this.in[ll - 1].idn) {
      const titulosffcc = sheet.getCell(
        "E" + `${this.in[ll - 1].in + (13 - 1)}`
      );
      titulosffcc.value = `${kk - connnnnn}`;
      const titulosffcc1 = sheet.getCell(
        "G" + `${this.in[ll - 1].in + (13 - 1)}`
      );
      titulosffcc1.value = `$${(kk - connnnnn) * this.in[ll - 1].vall}`;
    } else {
      const titulosffcc = sheet.getCell("E" + `${this.in[ll - 1].in + 13}`);
      titulosffcc.value = `${kk - connnnnn}`;
      const titulosffcc1 = sheet.getCell("G" + `${this.in[ll - 1].in + 13}`);
      titulosffcc1.value = `$${(kk - connnnnn) * this.in[ll - 1].vall}`;
    }
    //------------------------------------------
    for (let i = 0; i < this.valor.length; i++) {
      if (this.valor[i].valor != this.valor[i].valorAntes) {
        const tituloff0 = sheet.getCell(
          "E" +
            `${
              this.valor[i].inde +
              12 -
              (this.valor[i].cantidad - this.valor[i].conv)
            }`
        );
        tituloff0.value =
          `${this.valor[i].cantidad - this.valor[i].conv}` +
          " DE " +
          `${this.valor[i].cantidad}`;

        const tituloff = sheet.getCell("E" + `${this.valor[i].inde + 12}`);
        tituloff.value =
          `${this.valor[i].conv}` + " DE " + `${this.valor[i].cantidad}`;
        const tituloff1 = sheet.getCell("G" + `${this.valor[i].inde + 12}`);
        tituloff1.value = `${this.valor[i].conv * this.valor[i].valor}`;

        const tituloff2 = sheet.getCell(
          "G" +
            `${
              this.valor[i].inde +
              12 -
              (this.valor[i].cantidad - this.valor[i].conv)
            }`
        );
        tituloff2.value = `${
          (this.valor[i].cantidad - this.valor[i].conv) *
          this.valor[i].valorAntes
        }`;
        console.log(this.valor[i]);
      }
    }
  }
  formatoFecha(fecha: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    return fecha.toLocaleDateString(undefined, options);
  }

  formatDate(fechaStr: string): string {
    // Dividir la cadena en partes
    const partes = fechaStr.split("-");
    if (partes.length !== 3) {
      return "Fecha inválida";
    }

    // Crear una nueva cadena con el formato deseado (dd/MM/yyyy)
    const fechaFormateada = `${partes[2]}/${partes[1]}/${partes[0]}`;
    return fechaFormateada;
  }
  cargarConsultaValeDelAl(id: string, i: number, val: number) {
    this.cccc.push({ id: id, i: i, codi: 0, val: val });
    this.consultaService.getConsultaSolicitudVDelAl(id).subscribe((resp) => {
      this.valeDelAl = resp;
    });
  }
}
