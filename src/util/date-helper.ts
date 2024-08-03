export class DateHelper {

  public static getMonthName(month: number) {
    month++;
    switch (month) {
      case 1: return 'January';
      case 2: return 'February';
      case 3: return 'March';
      case 4: return 'April';
      case 5: return 'May';
      case 6: return 'June';
      case 7: return 'July';
      case 8: return 'August';
      case 9: return 'September';
      case 10: return 'October';
      case 11: return 'November';
      case 12: return 'December';
      default: return '';
    }
  }

  public static getMonthNames() {
    return ['January','February','March','April','May','June','July','August','September','October','November','December'];
  }

  public static getMonthNumber(month: string) {
    switch (month) {
      case 'January': return 0;
      case 'February': return 1;
      case 'March': return 2;
      case 'April': return 3;
      case 'May': return 4;
      case 'June': return 5;
      case 'July': return 6;
      case 'August': return 7;
      case 'September': return 8;
      case 'October': return 9;
      case 'November': return 10;
      case 'December': return 11;
      default: return 0;
    }
  }

  public static getLastDayOfMonth(month: string, year: number) {
    switch (month) {
      case 'January': return 31;
      case 'February': return this.isLeapYear(year) ? 29 : 28;
      case 'March': return 31;
      case 'April': return 30;
      case 'May': return 31;
      case 'June': return 30;
      case 'July': return 31;
      case 'August': return 31;
      case 'September': return 30;
      case 'October': return 31;
      case 'November': return 30;
      case 'December': return 31;
      default: return 31;
    }
  }

  public static getDaysOfMonthAndYear(month: string, year: number): number[] {
    switch (month) {
      case 'January': return this.range(1,31);
      case 'February': return this.isLeapYear(year) ? this.range(1,29) : this.range(1,28);
      case 'March': return this.range(1,31);
      case 'April': return this.range(1,30);
      case 'May': return this.range(1,31);
      case 'June': return this.range(1,30);
      case 'July': return this.range(1,31);
      case 'August': return this.range(1,31);
      case 'September': return this.range(1,30);
      case 'October': return this.range(1,31);
      case 'November': return this.range(1,30);
      case 'December': return this.range(1,31);
      default: return this.range(1,31);
    }
  }

  public static isLeapYear(year: number) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  private static range(start: number, end: number) {
    const array = [];
    for (let i = start; i <= end; i++) {
      array.push(i);
    }
    return array;
  }
}
