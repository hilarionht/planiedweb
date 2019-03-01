import { DatePipe } from "@angular/common";

class DateOnlyPipe extends DatePipe {
    public transform(value): any {
      return super.transform(value, 'dd/MM/yyyy');
    }
  }