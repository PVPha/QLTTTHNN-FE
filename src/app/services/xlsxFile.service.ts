import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

export class xlsxFileService {
  constructor() {}
  public exportAsExcelFile(
    WD: any[],
    KPI: any[],
    SALE: any[],
    excelFileName: string
  ): void {
    const worksheetWD: XLSX.WorkSheet = XLSX.utils.json_to_sheet(WD);
    const worksheetKPI: XLSX.WorkSheet = XLSX.utils.json_to_sheet(KPI);
    const worksheetSALE: XLSX.WorkSheet = XLSX.utils.json_to_sheet(SALE);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: [worksheetWD, worksheetKPI, worksheetSALE] },
      SheetNames: ['WorkDay', 'KPI', 'Sale'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      // fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
      fileName + EXCEL_EXTENSION
    );
  }

  //handel upload file
  jsonWorkDay!: string;
  jsonKPI!: string;
  jsonSale!: string;
  fileName!: string;
  sheetName: string[] = [];
  fileUpload(event: any) {
    console.log(event.target.files);
    const selectedFile = event.target.files[0];
    this.fileName = selectedFile.name;
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event) => {
      console.log(event);
      let binaryData = event.target?.result;
      let workbook = XLSX.read(binaryData, { type: 'binary' });
      // loop all sheet

      // workbook.SheetNames.forEach(sheet => {
      //   const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
      //   console.log(data);
      //   // this.convertJson = JSON.stringify(data, undefined, 4);
      //   this.convertJson = JSON.stringify(data);
      // })
      console.log(workbook.SheetNames);
      this.sheetName = workbook.SheetNames;

      // console.log(JSON.parse(this.convertJson)[0].Word);
      // console.log(this.convertJson);
      //select sheet name
      const dataWorkDay = XLSX.utils.sheet_to_json(workbook.Sheets['WorkDay']);
      this.jsonWorkDay = JSON.stringify(dataWorkDay);
      console.log(this.jsonWorkDay);
      const dataKPI = XLSX.utils.sheet_to_json(workbook.Sheets['KPI']);
      this.jsonKPI = JSON.stringify(dataKPI);
      console.log(this.jsonKPI);
      const dataSale = XLSX.utils.sheet_to_json(workbook.Sheets['Sale']);
      this.jsonSale = JSON.stringify(dataSale);
      console.log(this.jsonSale);
    };
  }
}
