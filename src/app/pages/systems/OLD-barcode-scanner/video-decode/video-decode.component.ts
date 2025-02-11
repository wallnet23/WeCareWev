import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import "../../../../dynamsoft.config";
import { CaptureVisionRouter } from "dynamsoft-capture-vision-router";
import { MultiFrameResultCrossFilter } from "dynamsoft-utility";
import { CameraEnhancer, CameraView } from 'dynamsoft-barcode-reader-bundle';

const strErrorDistoryed = 'videoCapture component destoryed';

@Component({
  selector: 'app-video-decode',
  standalone: true,
  imports: [],
  templateUrl: './video-decode.component.html',
  styleUrl: './video-decode.component.scss'
})
export class VideoDecodeComponent {

  @ViewChild('uiContainer') uiContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('resultsContainer') resultsContainer?: ElementRef<HTMLDivElement>;

  @Output() barcodeScanned = new EventEmitter<string>();

  resolveInit?: ()=>void;
  pInit:Promise<void> = new Promise(r=>{this.resolveInit=r});
  bDestoryed = false;

  cvRouter?:CaptureVisionRouter;
  cameraEnhancer?:CameraEnhancer;

  async ngAfterViewInit(): Promise<void> {

    try{
      // Create a `CameraEnhancer` instance for camera control and a `CameraView` instance for UI control.
      const cameraView = await CameraView.createInstance("assets/dynamsoft/dist/dce.ui.html");
      if(this.bDestoryed){ throw Error(strErrorDistoryed); } // Check if component is destroyed after every async
      this.cameraEnhancer = await CameraEnhancer.createInstance(cameraView);
      if(this.bDestoryed){ throw Error(strErrorDistoryed); }

      // Get default UI and append it to DOM.
      this.uiContainer!.nativeElement.append(cameraView.getUIElement());

      // Create a `CaptureVisionRouter` instance and set `CameraEnhancer` instance as its image source.
      this.cvRouter = await CaptureVisionRouter.createInstance();
      if(this.bDestoryed){ throw Error(strErrorDistoryed); }
      this.cvRouter.setInput(this.cameraEnhancer);

      // Define a callback for results.
      this.cvRouter.addResultReceiver({ onDecodedBarcodesReceived: (result) => {
        if (!result.barcodeResultItems.length) return;

        this.resultsContainer!.nativeElement.textContent = '';
        // console.log(result);
        for (let item of result.barcodeResultItems) {
          this.resultsContainer!.nativeElement.append(
            `${item.formatString}: ${item.text}`,
            document.createElement('br'),
            document.createElement('hr'),
          );
          this.barcodeScanned.emit(item.text);
        }
      }});

      // Filter out unchecked and duplicate results.
      const filter = new MultiFrameResultCrossFilter();
      // Filter out unchecked barcodes.
      filter.enableResultCrossVerification("barcode", true);
      // Filter out duplicate barcodes within 3 seconds.
      filter.enableResultDeduplication("barcode", true);
      await this.cvRouter.addResultFilter(filter);
      if(this.bDestoryed){ throw Error(strErrorDistoryed); }

      // Open camera and start scanning single barcode.
      await this.cameraEnhancer.open();
      if(this.bDestoryed){ throw Error(strErrorDistoryed); }
      await this.cvRouter.startCapturing("ReadSingleBarcode");
      if(this.bDestoryed){ throw Error(strErrorDistoryed); }

    }catch(ex:any){

      if((ex as Error)?.message === strErrorDistoryed){
        // console.log(strErrorDistoryed);
      }else{
        let errMsg = ex.message || ex;
        console.error(errMsg);
        alert(errMsg);
      }
    }

    // distroy function will wait pInit
    this.resolveInit!();
  }

  async ngOnDestroy() {
    this.bDestoryed = true;
    try{
      await this.pInit;
      this.cvRouter?.dispose();
      this.cameraEnhancer?.dispose();
    }catch(_){}
  }
}
