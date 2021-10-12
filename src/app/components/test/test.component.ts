import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { InfoRecruit } from 'src/app/info-recruit';
import { AuthService } from 'src/app/services/auth.service';
import { TestService } from 'src/app/services/test.service';
import { Test } from 'src/app/test';
import { Editor } from 'tinymce';
import * as pdfjs from 'pdfjs-dist';
// import * as XLSX from "xlsx";
declare var contentEditor: any;
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnInit {
  // @Input() val ?: string;

  editor!: Editor;

  content =
    '<h3>Điều 1: Điều khoản chung</h3><ol><li>Loại HĐLĐ:</li><li>Thời hạn HĐLĐ … tháng</li><li>Thời điểm từ: ngày …… tháng …… năm …….. đến ngày …… tháng …… năm ……</li><li>Địa điểm làm việc:</li><li>Bộ phận công tác: Phòng             <span> Chức danh chuyên môn (vị trí công tác):                </span></li><li>Nhiệm vụ công việc như sau:<ul><li>Thực hiện công việc theo đúng chức danh chuyên môn của mình dưới sự quản lý, điều hành của Ban Giám đốc (và các cá nhân được bổ nhiệm hoặc ủy quyền phụ trách).</li><li>Phối hợp cùng với các bộ phận, phòng ban khác trong Công ty để phát huy tối đa hiệu quả công việc.</li><li>Hoàn thành những công việc khác tùy thuộc theo yêu cầu kinh doanh của Công ty và theo quyết định của Ban Giám đốc (và các cá nhân được bổ nhiệm hoặc ủy quyền phụ trách).</li></ul></li></ol>';

  constructor(
    private testService: TestService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // this.testGet()
    this.testGetWithInterface();
    this.refresh();
  }
  async getContent(src: any) {
    const doc = await pdfjs.getDocument(src).promise;
    const page = await doc.getPage(1);
    return await page.getTextContent();
  }
  async getItems() {
    const src = '../../../assets/filePdf.pdf';
    console.log('work');
    const content = await this.getContent(src);
    const items = content.items.map((item) => {
      console.log(item.toString());
    });
    return items;
  }
  initEditor() {
    // document.querySelector('#testInsert')?.append(this.editor)
  }
  onClick() {}

  refresh() {
    const tesst = [
      { grade: 1 },
      { grade1: 1 },
      { grade2: 1 },
      { grade3: 1 },
      { grade4: 1 },
      { grade5: 1 },
    ];
    console.log(tesst);
    // this.
  }

  // file = new FormControl('');
  // file_data: any;
  // fileChange(event: any){
  //   const fileList: FileList = event.target.files;
  //   if(fileList.length > 0){
  //     const file = fileList[0];
  //     console.log('fileInfo', file.name, file.size, file.type);
  //     if((file.size/1048576)<=4){
  //       let formData = new FormData();
  //       formData.append('file',file,file.name);
  //       this.file_data = formData;
  //     }
  //   }
  // }
  // convertJson!: string;
  // fileUpload(event: any){
  //   // console.log(event.target.files);
  //   const selectedFile = event.target.files[0];
  //   const fileReader = new FileReader();
  //   fileReader.readAsBinaryString(selectedFile);
  //   fileReader.onload = (event) => {
  //     // console.log(event)
  //     let binaryData = event.target?.result;
  //     let workbook = XLSX.read(binaryData, {type:'binary'});
  //     workbook.SheetNames.forEach(sheet => {
  //       const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
  //       console.log(data);
  //       // this.convertJson = JSON.stringify(data, undefined, 4);
  //       this.convertJson = JSON.stringify(data);
  //     })
  //     console.log(workbook);
  //     // console.log(JSON.parse(this.convertJson)[0].Word);
  //     console.log(this.convertJson);
  //   }
  // }
  // submitXlSX(){
  //   const formData: FormData = new FormData();
  //   formData.append('time-keep', this.convertJson);
  //   this.testService.timeKeep(formData).subscribe(value => {
  //     console.log(value);
  //   }, err => {
  //     console.log(err);
  //   })
  // }
  respon: string = '';
  img: string = '';
  // onSubmit(test: string){
  //   this.respon
  //   console.log(test);
  // }
  // onSend(test: string, test2: string){
  //   this.testService.uploadFile(this.file_data).subscribe(res => {
  //     this.img = res;
  //     console.log(res);
  //   });

  //   const data = {
  //     test: test,
  //     test2: test2
  //   }
  //   const toJson = JSON.stringify(data);

  //   const formData: FormData = new FormData();
  //   // formData.append('test', test);
  //   console.log(toJson);
  //   console.log(JSON.parse(toJson));
  //   formData.append('test', toJson);
  //   this.testService.sendForm(formData).subscribe(res => {
  //     this.respon = res
  //     console.log(res);
  //   },
  //   err => {
  //     console.log(err);
  //   });
  // }

  testID!: InfoRecruit;
  testGetID() {
    // const id = MockInfoRecruitID;
    // console.log(id.ID);
  }

  tests: any[] = [];

  testGet() {
    this.testService.testget().subscribe(
      (val) => (this.tests = val),
      (err) => console.log(err)
    );
  }

  GWI: Test[] = [];

  testGetWithInterface() {
    this.testService.testGetWithInterface().subscribe(
      (val) => (this.GWI = val),
      (err) => console.log(err)
    );
  }

  // html = `
  //   <p style="text-align: center; font-size: 15px;"><img title="TinyMCE Logo" src="//www.tinymce.com/images/glyph-tinymce@2x.png" alt="TinyMCE Logo" width="110" height="97" />
  // </p>
  // <h1 style="text-align: center;">Welcome to the TinyMCE Cloud demo!</h1>
  // <h5 style="text-align: center;">Note, this includes some "enterprise/premium" features.<br>Visit the <a href="https://www.tinymce.com/pricing/#demo-enterprise">pricing page</a> to learn more about our premium plugins.</h5>
  // <p>Please try out the features provided in this full featured example.</p>

  // <h2>Got questions or need help?</h2>
  // <ul>
  //   <li>Our <a href="//www.tinymce.com/docs/">documentation</a> is a great resource for learning how to configure TinyMCE.</li>
  //   <li>Have a specific question? Visit the <a href="https://community.tinymce.com/forum/">Community Forum</a>.</li>
  //   <li>We also offer enterprise grade support as part of <a href="https://tinymce.com/pricing">TinyMCE premium subscriptions</a>.</li>
  // </ul>

  // <h2>A simple table to play with</h2>
  // <table style="text-align: center;">
  //   <thead>
  //     <tr>
  //       <th>Product</th>
  //       <th>Cost</th>
  //       <th>Really?</th>
  //     </tr>
  //   </thead>
  //   <tbody>
  //     <tr>
  //       <td>TinyMCE Cloud</td>
  //       <td>Get started for free</td>
  //       <td>YES!</td>
  //     </tr>
  //     <tr>
  //       <td>Plupload</td>
  //       <td>Free</td>
  //       <td>YES!</td>
  //     </tr>
  //   </tbody>
  // </table>

  // <h2>Found a bug?</h2>
  // <p>If you think you have found a bug please create an issue on the <a href="https://github.com/tinymce/tinymce/issues">GitHub repo</a> to report it to the developers.</p>

  // <h2>Finally ...</h2>
  // <p>Don't forget to check out our other product <a href="http://www.plupload.com" target="_blank">Plupload</a>, your ultimate upload solution featuring HTML5 upload support.</p>
  // <p>Thanks for supporting TinyMCE! We hope it helps you and your users create great content.<br>All the best from the TinyMCE team.</p>
  //   `;

  login(userName: string, passWord: string) {
    // this.authService.loginUser(userName, passWord).subscribe( data => {
    //   console.log(data);
    // }, err => {
    //   console.log(err);
    // })
    // const data = {
    //   userName: userName,
    //   passWord: passWord
    // }
    // const toJson = JSON.stringify(data);
    // const formData: FormData = new FormData();
    // formData.append('login', toJson);
    // this.authService.authLogin(userName, passWord).subscribe(data => {
    //   console.log('DialogLoginComponent: login, data = ', data);
    //       // if (Object.prototype.hasOwnProperty.call(data, 'error')) {
    //       //   console.log('loginComponent: login: error', data);
    //       // } else {
    //       //   this.data.token = data;
    //       //   console.log('DialogLoginComponent: this.data', this.data);
    //       //   this.dialogRef.close({ data: this.data });
    //       // }
    //       // this.data.token = data;
    //       //   console.log('DialogLoginComponent: this.data', this.data);
    //       //   this.dialogRef.close({ data: this.data });
    //     },
    //     (error) => {
    //       console.log('AuthService: failed', error);
    //     }
    // )
  }
}

export const MockInfoRecruitID: InfoRecruit[] = [
  {
    ID: 1,
    id_recruit: 1,
    department: 'IT',
    position: 'frontend',
    require: 'HTML, CSS, JS',
    describe: 'làm giao diện web',
    amount: 3,
    time: '2021-06-30',
    location: 'HCM',
    benefit: 'lương thưởng tốt',
    approval: true,
  },
];
