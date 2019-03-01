import { DatePipe } from '@angular/common/src/pipes/date_pipe';

class DateOnlyPipe extends DatePipe {
  public transform(value): any {
    return super.transform(value, 'MM/dd/y');
  }
}