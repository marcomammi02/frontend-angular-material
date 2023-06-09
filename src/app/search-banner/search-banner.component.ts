import { Component, ViewChild, ElementRef, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';

@Component({
  selector: 'app-search-banner',
  templateUrl: './search-banner.component.html',
  styleUrls: ['./search-banner.component.scss']
})

export class SearchBannerComponent implements OnInit{

  constructor(private http: HttpClient, private dataService: DataService) { }

  ngOnInit(): void {
    this.getData();
  }

  // Variabili per aprire e chiudere il Search-Banner
  @Input() isBannerOpen!: boolean;
  @Output() isBannerOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  loading: boolean = false;

  arrTires: any = [];

  // Variabili Brand
  availableBrands: string[] = [];
  selectedBrand: string = '';
  brandQuaryString: string = '&brand=';

  // Variabili Size
  availableSizes: string[] = [];
  selectedSize: string = '';
  sizeQuaryString: string = '&size=';

  // Variabili Season
  summerChecked: boolean = true;
  allSeasonChecked: boolean = true;
  winterChecked: boolean = true;
  seasonQuaryString: string = '';

  // Manda i risultati al componente padre (home-page)
  @Output() resultsOutput: EventEmitter<any> = new EventEmitter<any>();
  results: any = {};

  // Prende i dati dal DB per popolare il Form
  async getData() {
    this.loading = true;
    try {
      const response = await this.http.get('http://127.0.0.1:8000/api/tires').toPromise();
      this.arrTires = response;
      this.filter()
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  // Richiede i dati filtrati dal DB
  async search() {
    this.brandQuaryString = this.quaryBrandSizeComposer(this.selectedBrand, this.brandQuaryString, 'brand');
    this.sizeQuaryString = this.quaryBrandSizeComposer(this.selectedSize, this.sizeQuaryString, 'size');
    this.quarySeasonComposer();
    this.loading = true;
    try {
      const response = await this.http.get('http://127.0.0.1:8000/api/tires?' + this.brandQuaryString + this.sizeQuaryString + this.seasonQuaryString).toPromise();
      this.results = response;
      this.resultsOutput.emit(response);
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
    this.saveObjectToService()
    this.reset()
  }

  // Filtra Brand e Size per popolare i select nel Form
  filter() {
    for (let obj of this.arrTires) {
      let brand = obj.brand;
      let size = obj.size;
      if (!this.availableBrands.includes(brand)) {
        this.availableBrands.push(brand);
      }
      if (!this.availableSizes.includes(size)) {
        this.availableSizes.push(size)
      }
    }
  }

  // Forma le quary string di Brand e Size
  quaryBrandSizeComposer( a: string,  b: string, c: string) {
    if (a !== '') {
      b = '&' + c + '=' + a;
    }
    return b;
  }

  // quaryBrandComposer() {
  //   if (this.selectedBrand !== '') {
  //     this.brandQuaryString = '&brand=' +this.selectedBrand;
  //   }
  // }
  //
  // quarySizeComposer() {
  //   if (this.selectedSize !== '') {
  //     this.sizeQuaryString = '&size=' +this.selectedSize;
  //   }
  // }

  // Forma la quary string per Season
  quarySeasonComposer() {
    if (this.summerChecked) {
      this.seasonQuaryString += '&season[]=summer';
    }
    if (this.allSeasonChecked) {
      this.seasonQuaryString += '&season[]=4 season';
    }
    if (this.winterChecked) {
      this.seasonQuaryString += '&season[]=winter';
    }
    if (!this.summerChecked && !this.allSeasonChecked && !this.winterChecked) {
      this.seasonQuaryString = '&season[]=0';
    }
  }

  // Reset delle quary string
  reset() {
    this.seasonQuaryString = '';
    this.brandQuaryString = '';
    this.sizeQuaryString = '';
  }

  // Chiude il Search-Banner
  closeBanner() {
    this.isBannerOpen = false;
    this.isBannerOpenChange.emit(this.isBannerOpen);
  }

  // Manda i risults alla pagina /results
  saveObjectToService() {
    this.dataService.resultObj = this.results;
  }
}
