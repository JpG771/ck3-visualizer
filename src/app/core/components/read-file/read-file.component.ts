import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { Ck3Service } from '../../services/ck3.service';

export type objectAnyProp = { [propName: string]: any };

@Component({
  selector: 'app-read-file',
  templateUrl: './read-file.component.html',
  styleUrls: ['./read-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadFileComponent implements OnInit, AfterViewInit, OnDestroy {
  reader?: FileReader;
  currentProgress: number = 0;
  currentProgressLabel: string = '';
  fileSelector: HTMLElement | null = null;
  cancel = true;
  fileCode: objectAnyProp = {};
  isDebug = false; // True to see each lines, false for faster processing

  constructor(
    public ck3Service: Ck3Service,
    public changeRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.fileSelector = document.getElementById('file-selector');
    if (this.fileSelector) {
      this.fileSelector.addEventListener('change', (event: any) => {
        this.cancel = false;
        const fileList = event.target?.files;
        if (fileList) {
          for (const file of fileList) {
            this.readFile(file);
          }
        }
      });
    }
  }
  ngOnDestroy(): void {
    if (this.fileSelector && this.fileSelector.removeAllListeners) {
      this.fileSelector.removeAllListeners('change');
    }
  }

  readFile = (file: any) => {
    // Not supported in Safari for iOS.
    const name = file.name ? file.name : 'NOT SUPPORTED';
    // Not supported in Firefox for Android or Opera for Android.
    const type = file.type ? file.type : 'NOT SUPPORTED';
    // Unknown cross-browser support.
    const size = file.size ? file.size : 'NOT SUPPORTED';
    this.currentProgress = 1;
    this.currentProgressLabel = 'Opening file ' + name;
    this.changeRef.markForCheck();
    this.reader = new FileReader();
    this.reader.onload = (_progressEvent) => {
      // By lines
      if (this.reader?.result && typeof this.reader?.result === 'string') {
        var lines = this.reader?.result.split(/\r\n|\n/);
        this.readLines(lines);
      }
    };
    this.reader.onerror = (event) => {
      alert(event.target?.error?.name || 'Reader error');
    };
    this.reader.readAsText(file);
  };

  async readLines(lines: string[]) {
    for (var line = 590390; line < lines.length; line++) {
      if (this.cancel) break;
      const currentLine = lines[line];
      let newProgress = Math.round((line / lines.length) * 1000) / 10;
      if (newProgress < 2) newProgress = 2;
      if (this.isDebug || newProgress !== this.currentProgress) {
        this.currentProgress = newProgress;
        this.currentProgressLabel = `Reading line ${(line + 1).toString(
          10
        )}  on ${lines.length.toString(10)}`;
        this.changeRef.markForCheck();
        try {
          await this.readLineAsync(currentLine);
        } catch (error) {
          console.error(error);
          break;
        }
      } else {
        const error = this.readLine(currentLine);
        if (error) console.error(error);
      }
    }
    this.currentProgress = 0;
    this.currentProgressLabel = this.cancel
      ? 'Read cancelled'
      : 'File read completed';
    if (!this.cancel) {
      this.ck3Service.currentData = this.fileCode;
    }
    this.cancel = true;
    this.changeRef.markForCheck();
    this.fileCode = { ...this.fileCode };
  }

  readLineAsync(line: string) {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const error = this.readLine(line);
        if (error) {
          reject(error);
        } else {
          resolve(void 0);
        }
      });
    });
  }

  currentParents: objectAnyProp[] = [];
  currentObject?: objectAnyProp;
  currentPropName?: string;
  currentLevel = 0;
  skip = false;
  skipLevel = 0;
  propertiesToRead = {
    meta_data: {
      meta_date: true,
      meta_player_name: true,
    },
  };
  currentToRead = this.propertiesToRead;
  currentToReadParents = [];
  readLine(line: string) {
    const lineParts = line.split(`\t`).map((value) => value.trim());
    if (lineParts.length > 0) {
      return lineParts
        .filter((part) => !!part)
        .reduce((previousValue: string, currentValue: string) => {
          return previousValue || this.verifyValue(currentValue);
        }, '');
    }
    return '';
  }

  /** Should we create a new object, assign value, close object? */
  private verifyValue(newProp: string): string {
    const fixedNewProp = newProp.trim();
    const indexOfEqual = fixedNewProp.indexOf('=');
    const indexOfObjectOpen = fixedNewProp.indexOf('{');
    const indexOfObjectClosure = fixedNewProp.indexOf('}');
    // if (newProp === 'break') {
    //   // For debugging
    //   return 'break';
    // }
    if (fixedNewProp === '') {
      return '';
    } else if (
      indexOfEqual > 0 &&
      (indexOfObjectOpen < 0 || indexOfEqual < indexOfObjectOpen)
    ) {
      this.currentPropName = fixedNewProp.slice(0, indexOfEqual);
      const value = fixedNewProp.slice(indexOfEqual + 1);

      if (this.isPropertyUsed()) {
        this.skip = false;
      } else {
        this.skip = true;
        this.currentPropName = undefined;
      }
      return this.verifyValue(value);
    } else if (
      indexOfEqual < 0 &&
      indexOfObjectOpen >= 0 &&
      indexOfObjectClosure > 0
    ) {
      if (this.currentPropName) {
        this.setMultiValues(fixedNewProp, this.currentPropName);
      }
    } else if (indexOfObjectOpen >= 0) {
      // Start new object
      const value = fixedNewProp.slice(1);
      if (!this.skip) {
        this.skipLevel = this.currentLevel;
        this.openObject();
      }
      this.currentLevel++;
      return this.verifyValue(value);
    } else if (indexOfObjectClosure >= 0) {
      this.currentLevel--;
      if (!this.skip || this.currentLevel === this.skipLevel) {
        this.skipLevel--;
        this.skip = false;
        this.closeObject();
      }
    } else if (this.currentPropName) {
      this.setValue(fixedNewProp, this.currentPropName);
    } else if (!this.skip) {
      return `Value not handled :  ${fixedNewProp}`;
    }
    return '';
  }

  private setValue(value: string, propName: string) {
    const fixedValue = value.trim().replace('"', '').replace('"', '');
    if (this.currentObject) {
      this.currentObject[propName] = fixedValue;
    } else {
      this.fileCode[propName] = fixedValue;
    }
  }

  private setMultiValues(value: string, propName: string) {
    const values = value
      .replace('{', '')
      .replace('}', '')
      .split(' ')
      .map((individualValue) =>
        individualValue.trim().replace('"', '').replace('"', '')
      )
      .filter((value) => !!value);

    if (this.currentObject) {
      this.currentObject[propName] = values;
    } else {
      this.fileCode[propName] = values;
    }
  }

  private openObject() {
    if (!this.currentPropName) {
      // TODO : Maybe rework this part to change this.currentObject into an array?
      // This case can appen with a line like this `data={ {`
      // data is an object but inside of it there are unnamed objects
      this.currentPropName = 'data';
    }
    if (this.currentPropName) {
      if (this.currentObject) {
        this.currentParents.push(this.currentObject);
        this.currentObject = {};
        const existingProperty =
          this.currentParents[this.currentParents.length - 1][
            this.currentPropName
          ];
        if (existingProperty) {
          // Already contains an object with the same property name, so it should be an array
          if (Array.isArray(existingProperty)) {
            existingProperty.push(this.currentObject);
          } else {
            this.currentParents[this.currentParents.length - 1][
              this.currentPropName
            ] = [existingProperty, this.currentObject];
          }
        } else {
          this.currentParents[this.currentParents.length - 1][
            this.currentPropName
          ] = this.currentObject;
        }
      } else {
        this.currentObject = {};
        this.fileCode[this.currentPropName] = this.currentObject;
      }
      this.currentPropName = undefined;
    }
  }

  private closeObject() {
    this.currentObject = this.currentParents.pop();
    this.currentPropName = undefined;
  }

  private isPropertyUsed() {
    const list = [
      'living',
      'first_name',
      'birth',
      'female',
      'culture',
      'faith',
      'sexuality',
    ];
    if (
      (this.currentPropName && list.includes(this.currentPropName)) ||
      (this.skip === false && this.currentLevel === 1)
    ) {
      return true;
    }

    return false;
  }
}
