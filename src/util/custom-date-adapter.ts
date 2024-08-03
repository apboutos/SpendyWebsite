import {NativeDateAdapter} from "@angular/material/core";
import {Injectable} from "@angular/core";
import {DateHelper} from "./date-helper";

export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = DateHelper.getMonthName(date.getMonth()); // Months are 0-based
    const year = date.getFullYear();

    return `${day} ${month} ${year}`; // Format: dd-MM-yyyy
  }

  override parse(value: any): Date | null {
    if (typeof value === 'string') {
      const parts = value.split('-');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Months are 0-based
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return null;
  }
}
