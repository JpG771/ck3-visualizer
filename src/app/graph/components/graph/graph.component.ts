import { Component, OnInit } from '@angular/core';
import { Ck3Service } from 'src/app/core/services/ck3.service';
import { Character, DeadCharacter } from 'src/app/shared/models/character';
import { sortArrayByNumber } from 'src/app/shared/utils/array.util';
import { dateToObject } from 'src/app/shared/utils/date.util';
import { translateSexLabel } from 'src/app/shared/utils/sex.util';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit {
  constructor(private ck3Service: Ck3Service) {}

  ngOnInit(): void {
    this.aggregateData(this.ck3Service.currentData);
  }

  private aggregateData(data: any) {
    if (data) {
      const sexData = [
        { label: 'Male', value: 0 },
        { label: 'Female', value: 0 },
      ];
      const cultureData: any[] = [];
      const faithData: any[] = [];
      const sexualityData: any[] = [];
      const birthByYearData: any[] = [];
      const deadByYearData: any[] = [];
      const averageLifeExpectancyData: any[] = [];

      for (const key in data.living) {
        if (Object.prototype.hasOwnProperty.call(data.living, key)) {
          const element = data.living[key];
          this.aggregateSexData(sexData, element);
          this.aggregateIdData(
            cultureData,
            element,
            (element) => element.culture
          );
          this.aggregateIdData(faithData, element, (element) => element.faith);
          this.aggregateIdData(
            sexualityData,
            element,
            (element) => element.sexuality,
            translateSexLabel
          );
          this.aggregateIdData(birthByYearData, element, this.getBirthYear);
        }
      }
      for (const key in data.dead_unprunable) {
        if (Object.prototype.hasOwnProperty.call(data.dead_unprunable, key)) {
          const element = data.dead_unprunable[key];
          this.aggregateIdData(birthByYearData, element, this.getBirthYear);
          this.aggregateIdData(deadByYearData, element, this.getDeathYear);
          this.averageData(
            averageLifeExpectancyData,
            element,
            this.getLifeExpectancy,
            this.getDeathYear
          );
        }
      }
      for (const key in data.characters.dead_prunable) {
        if (
          Object.prototype.hasOwnProperty.call(
            data.characters.dead_prunable,
            key
          )
        ) {
          const element = data.characters.dead_prunable[key];
          this.aggregateIdData(birthByYearData, element, this.getBirthYear);
          this.aggregateIdData(deadByYearData, element, this.getDeathYear);
          this.averageData(
            averageLifeExpectancyData,
            element,
            this.getLifeExpectancy,
            this.getDeathYear
          );
        }
      }

      this.buildPieChart('sexChart', sexData);
      this.buildPieChart('cultureChart', cultureData);
      this.buildPieChart('faithChart', faithData);
      this.buildPieChart('sexualityChart', sexualityData);
      this.buildBirthdayChart(
        'birthByYearChart',
        birthByYearData,
        deadByYearData
      );
      this.buildLifeExpectancyChart(
        'lifeExpectancyChart',
        averageLifeExpectancyData
      );
    }
  }

  private aggregateSexData(array: any[], characterData: Character) {
    if (characterData.female === 'yes') {
      array[1].value++;
    } else {
      array[0].value++;
    }
  }
  private aggregateIdData(
    dataArray: any[],
    element: any,
    getItem: (element: any) => any,
    getLabel?: (item: any) => string
  ) {
    const item = getItem(element);
    const foundItem = dataArray.find((data) => data.item === item);
    if (!foundItem) {
      dataArray.push({
        item: item,
        label: getLabel ? getLabel(item) : item,
        value: 1,
      });
    } else {
      foundItem.value++;
    }
  }
  private averageData(
    dataArray: any[],
    element: any,
    getValue: (element: any) => any,
    getLabel?: (item: any) => string | number | undefined
  ) {
    const value = getValue(element);
    if (value > 0) {
      const label = getLabel ? getLabel(element) : element;
      const foundItem = dataArray.find((data) => data.label === label);
      if (!foundItem) {
        dataArray.push({
          label,
          value,
        });
      } else {
        foundItem.value = (foundItem.value + value) / 2;
      }
    }
  }

  private buildBirthdayChart(
    chartId: string,
    birthdaysData: any[],
    deathsData: any[]
  ) {
    birthdaysData.sort(sortArrayByNumber((element) => element.label));
    deathsData.sort(sortArrayByNumber((element) => element.label));
    const chartData = [
      {
        mode: 'lines',
        name: 'Births',
        x: birthdaysData.map((element) => element.label),
        y: birthdaysData.map((element) => element.value),
      },
      {
        mode: 'lines',
        name: 'Deaths',
        x: deathsData.map((element) => element.label),
        y: deathsData.map((element) => element.value),
      },
    ];

    Plotly.newPlot(chartId, chartData, undefined, {responsive: true});
  }
  private buildLifeExpectancyChart(chartId: string, data: any[]) {
    data.sort((itemA: any, itemB: any) => {
      return itemA.label - itemB.label;
    });
    let average: any[] = data.reduce((previousValue: any[], currentValue) => {
      if (previousValue.length === 0) {
        return [currentValue];
      } else {
        const previousItem = previousValue[previousValue.length - 1];
        const yearDifference = currentValue.label - previousItem.label;
        if (yearDifference < 10) {
          previousItem.value = (previousItem.value + currentValue.value) / 2;
        } else {
          previousValue.push(currentValue);
        }
        return previousValue;
      }
    }, []);
    data.forEach((element) => (element.value = Math.round(element.value)));
    const chartData = [
      {
        mode: 'markers',
        name: 'Details',
        x: data.map((element) => element.label),
        y: data.map((element) => element.value),
      },
      {
        mode: 'lines',
        name: 'Average',
        x: average.map((element) => element.label),
        y: average.map((element) => element.value),
      },
    ];
    Plotly.newPlot(chartId, chartData, undefined, {responsive: true});
  }
  private buildPieChart(chartId: string, data: any[]) {
    const pieData = [
      {
        type: 'pie',
        values: data.map((element) => element.value),
        labels: data.map((element) => element.label),
        textinfo: 'label+percent',
        insidetextorientation: 'radial',
      },
    ];

    Plotly.newPlot(chartId, pieData, undefined, {responsive: true});
  }

  private getBirthYear = (characterData: Character) => {
    if (
      characterData &&
      characterData.birth &&
      characterData.birth.length > 4
    ) {
      return dateToObject(characterData.birth)?.year;
    }
    return undefined;
  };
  private getDeathYear = (characterData: DeadCharacter) => {
    if (
      characterData &&
      characterData.dead_data &&
      characterData.dead_data.date &&
      characterData.dead_data.date.length > 4
    ) {
      return dateToObject(characterData.dead_data.date)?.year;
    }
    return undefined;
  };
  private getLifeExpectancy = (character: DeadCharacter) => {
    const birthDate = this.getBirthYear(character);
    const deathDate = this.getDeathYear(character);

    if (birthDate && deathDate) {
      return deathDate - birthDate;
    }
    return 0;
  };
}
