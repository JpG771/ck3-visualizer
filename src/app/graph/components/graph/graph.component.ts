import { Component, OnInit } from '@angular/core';
import { Ck3Service } from 'src/app/core/services/ck3.service';
import { Ck3Date } from 'src/app/shared/models/base';
import { Character, DeadCharacter } from 'src/app/shared/models/character';
import { Religion } from 'src/app/shared/models/religion';
import { sortArrayByNumber } from 'src/app/shared/utils/array.util';
import { skillToLabel } from 'src/app/shared/utils/attributes.util';
import { dateToObject, yearDifference } from 'src/app/shared/utils/date.util';
import { translateSexLabel } from 'src/app/shared/utils/sex.util';
import { toTitleCase } from 'src/app/shared/utils/string.util';

export interface GraphItem {
  label: string | number;
  value: number;
}

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit {
  population = 0;
  bestCharacter = {
    diplomacy: {
      name: '',
      value: 0,
    },
    martial: {
      name: '',
      value: 0,
    },
    stewardship: {
      name: '',
      value: 0,
    },
    intrigue: {
      name: '',
      value: 0,
    },
    learning: {
      name: '',
      value: 0,
    },
    prowess: {
      name: '',
      value: 0,
    },
  };
  skillToLabel = skillToLabel;

  constructor(private ck3Service: Ck3Service) {}

  ngOnInit(): void {
    this.aggregateData(this.ck3Service.currentData);
  }

  private aggregateData(data: any) {
    if (data) {
      const sexData: GraphItem[] = [
        { label: 'Male', value: 0 },
        { label: 'Female', value: 0 },
      ];
      const cultureData: GraphItem[] = [];
      const faithData: GraphItem[] = [];
      const sexualityData: GraphItem[] = [];
      const birthByYearData: GraphItem[] = [];
      const deadByYearData: GraphItem[] = [];
      const averageLifeExpectancyData: GraphItem[] = [];
      const ageGroupData: GraphItem[] = [];

      // Get Data
      this.population = Object.keys(data.living).length;
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
          this.aggregateIdData(
            ageGroupData,
            element,
            this.getAgeGroup(data.meta_data?.meta_date)
          );
          this.getBestCharacter(element);
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

      // Translate labels
      this.setCultureLabel(data, cultureData);
      this.setFaithLabel(data, faithData);

      // Build charts
      this.buildPieChart('sexChart', sexData);
      this.buildPieChart('sexualityChart', sexualityData);
      this.buildPieChart('faithChart', faithData);
      this.buildCultureChart('cultureChart', cultureData);
      this.buildBirthdayChart(
        'birthByYearChart',
        birthByYearData,
        deadByYearData
      );
      this.buildLifeExpectancyChart(
        'lifeExpectancyChart',
        averageLifeExpectancyData
      );
      this.buildAgeGroupChart('ageGroupChart', ageGroupData);
    }
  }

  private aggregateSexData(array: GraphItem[], characterData: Character) {
    if (characterData.female === 'yes') {
      array[1].value++;
    } else {
      array[0].value++;
    }
  }
  private aggregateIdData(
    dataArray: GraphItem[],
    element: any,
    getItem: (element: any) => any,
    getLabel?: (item: any) => string
  ) {
    const item = getItem(element);
    const foundItem = dataArray.find((data) => data.label === item);
    if (!foundItem) {
      dataArray.push({
        label: getLabel ? getLabel(item) : item,
        value: 1,
      });
    } else {
      foundItem.value++;
    }
  }
  private averageData(
    dataArray: GraphItem[],
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
    birthdaysData: GraphItem[],
    deathsData: GraphItem[]
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

    Plotly.newPlot(chartId, chartData, undefined, { responsive: true });
  }
  private buildLifeExpectancyChart(chartId: string, data: GraphItem[]) {
    data.sort((itemA: any, itemB: any) => {
      return itemA.label - itemB.label;
    });
    let average: GraphItem[] = data.reduce(
      (previousValue: GraphItem[], currentValue) => {
        if (previousValue.length === 0) {
          return [currentValue];
        } else {
          const previousItem = previousValue[previousValue.length - 1];
          if (
            typeof currentValue.label === 'number' &&
            typeof previousItem.label === 'number'
          ) {
            const yearDifference = currentValue.label - previousItem.label;
            if (yearDifference < 10) {
              previousItem.value =
                (previousItem.value + currentValue.value) / 2;
            } else {
              previousValue.push(currentValue);
            }
          } else {
            previousValue.push(currentValue);
          }
          return previousValue;
        }
      },
      []
    );
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
    Plotly.newPlot(chartId, chartData, undefined, { responsive: true });
  }
  private buildPieChart(chartId: string, data: GraphItem[]) {
    const pieData = [
      {
        type: 'pie',
        values: data.map((element) => element.value),
        labels: data.map((element) => element.label),
        textinfo: 'label+percent',
        insidetextorientation: 'radial',
      },
    ];

    Plotly.newPlot(chartId, pieData, undefined, { responsive: true });
  }
  private buildAgeGroupChart(chartId: string, data: GraphItem[]) {
    data.sort((itemA: any, itemB: any) => {
      return itemA.label - itemB.label;
    });
    data.forEach((element) => {
      element.label = this.getAgeGroupLabel(element.label);
    });
    const chartData = [
      {
        type: 'bar',
        x: data.map((element) => element.label),
        y: data.map((element) => element.value),
      },
    ];
    Plotly.newPlot(chartId, chartData, undefined, { responsive: true });
  }
  private buildCultureChart(chartId: string, data: GraphItem[]) {
    data = data.filter((item) => item.label !== 'None');
    data.sort((itemA, itemB) => itemA.value - itemB.value);

    const chartData = [
      {
        type: 'bar',
        orientation: 'h',
        x: data.map((element) => element.value),
        y: data.map((element) => element.label),
        text: data.map(
          (item) =>
            `${item.label} (${
              Math.round((item.value / this.population) * 1000) / 10
            }%)`
        ),
        textinfo: 'label+percent',
      },
    ];
    const layout = {
      showLegend: false,
    };
    Plotly.newPlot(chartId, chartData, layout, { responsive: true });
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
  private getAgeGroup = (currentDate: Ck3Date) => (character: Character) => {
    if (currentDate && character.birth) {
      const age = yearDifference(character.birth, currentDate);
      if (age >= 70) return 70;
      if (age >= 60) return 60;
      if (age >= 50) return 50;
      if (age >= 40) return 40;
      if (age >= 30) return 30;
      if (age >= 20) return 20;
      if (age >= 10) return 10;
      return 1;
    }
    return 0;
  };
  private getAgeGroupLabel = (age: any) => {
    if (age >= 70) return '70+';
    if (age >= 60) return '60-69';
    if (age >= 50) return '50-59';
    if (age >= 40) return '40-49';
    if (age >= 30) return '30-39';
    if (age >= 20) return '20-29';
    if (age >= 10) return '10-19';
    return '0-10';
  };

  private getBestCharacter = (characterData: Character) => {
    if (characterData.skill && characterData.skill.length > 5) {
      const diplomacy = parseInt(
        characterData.skill[0] as unknown as string,
        10
      );
      const martial = parseInt(characterData.skill[1] as unknown as string, 10);
      const stewardship = parseInt(
        characterData.skill[2] as unknown as string,
        10
      );
      const intrigue = parseInt(
        characterData.skill[3] as unknown as string,
        10
      );
      const learning = parseInt(
        characterData.skill[4] as unknown as string,
        10
      );
      const prowess = parseInt(characterData.skill[5] as unknown as string, 10);

      this.verifyBestCharater(
        characterData,
        diplomacy,
        this.bestCharacter.diplomacy
      );
      this.verifyBestCharater(
        characterData,
        martial,
        this.bestCharacter.martial
      );
      this.verifyBestCharater(
        characterData,
        stewardship,
        this.bestCharacter.stewardship
      );
      this.verifyBestCharater(
        characterData,
        intrigue,
        this.bestCharacter.intrigue
      );
      this.verifyBestCharater(
        characterData,
        learning,
        this.bestCharacter.learning
      );
      this.verifyBestCharater(
        characterData,
        prowess,
        this.bestCharacter.prowess
      );
    }
  };
  private verifyBestCharater(
    character: Character,
    skill: number,
    bestObject: { name: string; value: number }
  ) {
    if (skill > bestObject.value) {
      bestObject.name = character.first_name;
      bestObject.value = skill;
    }
  }

  tempDict: { [key: string]: any } = {};
  private setCultureLabel(data: any, array: GraphItem[]) {
    if (data.culture_manager && data.culture_manager.cultures) {
      for (const key in data.culture_manager.cultures) {
        if (
          Object.prototype.hasOwnProperty.call(
            data.culture_manager.cultures,
            key
          )
        ) {
          const element = data.culture_manager.cultures[key];
          this.tempDict[key] = element.culture_template;
        }
      }
    }
    array.forEach((data) => {
      let newLabel: string = this.tempDict[data.label];
      if (newLabel) {
        newLabel = newLabel.charAt(0).toUpperCase() + newLabel.slice(1);
        data.label = newLabel;
      } else {
        data.label = 'None';
      }
    });
    this.tempDict = {};
  }
  private setFaithLabel(data: any, array: GraphItem[]) {
    if (data.religion && data.religion.religions) {
      for (const key in data.religion.religions) {
        if (
          Object.prototype.hasOwnProperty.call(data.religion.religions, key)
        ) {
          const element: Religion = data.religion.religions[key];
          if (element.faiths) {
            element.faiths.forEach((faith) => {
              this.tempDict[faith] = element.template;
            });
          }
        }
      }
    }
    array.forEach((data) => {
      let newLabel: string = this.tempDict[data.label];
      if (newLabel) {
        newLabel = newLabel.replace('_religion', '').replace('_', ' ');
        data.label = toTitleCase(newLabel) || '';
      } else {
        data.label = 'None';
      }
    });
    // Reduce Faiths to religion
    array.sort((itemA: GraphItem, itemB: GraphItem) => {
      return itemA.label && itemB.label
        ? itemA.label.toString().localeCompare(itemB.label.toString())
        : -1;
    });
    array.reduce((previousValue: GraphItem[], currentValue) => {
      if (previousValue.length === 0) {
        return [currentValue];
      } else {
        const previousItem = previousValue[previousValue.length - 1];
        if (previousItem.label === currentValue.label) {
          previousItem.value = previousItem.value + currentValue.value;
        } else {
          previousValue.push(currentValue);
        }
        return previousValue;
      }
    }, []);
    this.tempDict = {};
  }
}
