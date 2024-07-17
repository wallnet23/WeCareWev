import { Component, ElementRef, ViewChild } from '@angular/core';
import "../../../../dynamsoft.config";
import { EnumCapturedResultItemType } from "dynamsoft-core";
import type { BarcodeResultItem } from "dynamsoft-barcode-reader";
import { CaptureVisionRouter } from "dynamsoft-capture-vision-router";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ScannerSelectorComponent } from "../scanner-selector/scanner-selector.component";

@Component({
  selector: 'app-img-decode',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ScannerSelectorComponent
],
  templateUrl: './img-decode.component.html',
  styleUrl: './img-decode.component.scss'
})
export class ImgDecodeComponent {

  exampleForm = new FormGroup({
    example: new FormControl<string>(''),
    child: new FormControl<string>('')
  })

  onBarcodeScanned(barcode: string) {
    this.exampleForm.get('child')!.setValue(barcode); // Imposta il valore del barcode nel FormControl
  }

  print() {
    console.log("FORM RESULT: ", this.exampleForm.getRawValue());
  }

  // pReader: Promise<BarcodeReader> | null = null;

  // async ngOnInit(): Promise<void> { }

  // decodeImg = async (e: any) => {
  //   try {
  //     const reader = await (this.pReader = this.pReader || BarcodeReader.createInstance());
  //     const results = await reader.decode(e.target.files[0]);
  //     for (const result of results) {
  //       alert(result.barcodeText);
  //     }
  //     if (!results.length) { alert('No barcode found'); }
  //   } catch (ex: any) {
  //     let errMsg;
  //     if (ex.message.includes("network connection error")) {
  //       errMsg = "Failed to connect to Dynamsoft License Server: network connection error. Check your Internet connection or contact Dynamsoft Support (support@dynamsoft.com) to acquire an offline license.";
  //     } else {
  //       errMsg = ex.message||ex;
  //     }
  //     console.error(errMsg);
  //     alert(errMsg);
  //   }
  //   e.target.value = '';
  // }

  // async ngOnDestroy() {
  //   if (this.pReader) {
  //     (await this.pReader).destroyContext();
  //     console.log('ImgDecode Component Unmount');
  //   }
  // }

  // @ViewChild('resDiv') resDiv?: ElementRef<HTMLDivElement>;

  // pCvRouter?: Promise<CaptureVisionRouter>;
  // bDestoried = false;

  // captureImage = async (e: Event) => {
  //   let files = [...(e.target! as HTMLInputElement).files as any as File[]];
  //   (e.target! as HTMLInputElement).value = '';
  //   this.resDiv!.nativeElement.innerText = "";
  //   try {
  //     const cvRouter = await (this.pCvRouter = this.pCvRouter || CaptureVisionRouter.createInstance());
  //     if (this.bDestoried) return;

  //     for (let file of files) {
  //       // Decode selected image with 'ReadBarcodes_SpeedFirst' template.
  //       const result = await cvRouter.capture(file, "ReadBarcodes_SpeedFirst");
  //       if (this.bDestoried) return;

  //       if (files.length > 1) {
  //         this.resDiv!.nativeElement.innerText += `\n${file.name}:\n`;
  //       }
  //       for (let _item of result.items) {
  //         if (_item.type !== EnumCapturedResultItemType.CRIT_BARCODE) { continue; }
  //         let item = _item as BarcodeResultItem;
  //         this.resDiv!.nativeElement.innerText += item.text + "\n";
  //         console.log(item.text);
  //       }
  //       if (!result.items.length) this.resDiv!.nativeElement.innerText += 'No barcode found\n';
  //     }
  //   } catch (ex: any) {
  //     let errMsg = ex.message || ex;
  //     console.error(errMsg);
  //     alert(errMsg);
  //   }
  // }

  // async ngOnDestroy() {
  //   this.bDestoried = true;
  //   if (this.pCvRouter) {
  //     try {
  //       (await this.pCvRouter).dispose();
  //     } catch (_) { }
  //   }
  // }
}
