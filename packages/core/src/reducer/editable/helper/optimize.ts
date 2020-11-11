import { emptyFilter } from './empty';
import { Row, Cell } from '../../../types/editable';

export const flatten = function <T>(c: Array<T>, n: Array<T>): Array<T> {
  return [...c, ...n];
};

export const optimizeCells = (cells: Array<Cell> = []): Array<Cell> =>
  cells.filter(emptyFilter);

export const optimizeRows = (rows: Array<Row> = []): Array<Row> =>
  rows.filter(emptyFilter);

export const optimizeCell = (cell: Cell): Cell => {
  const { rows, ...other } = cell;
  const optimized = {
    ...other,
    rows: (rows || [])
      .map(
        (r: Row): Array<Row> => {
          const { cells = [] } = r;
          if (cells.length !== 1) {
            return [r];
          }

          const { rows: cellRows = [], layout }: Cell = cells[0];
          if (cellRows.length > 0 && !layout) {
            return cellRows;
          }
          return [r];
        }
      )
      .reduce(flatten, []),
  };

  return optimized;
};

export const optimizeRow = ({ cells, ...other }: Row): Row => ({
  ...other,
  cells: (cells || [])
    .map((c: Cell) => {
      const { rows = [], size } = c;
      if (rows.length !== 1 || c.layout) {
        return [c];
      }

      const { cells: rowCells = [] }: Row = rows[0];
      if (rowCells.length === 1) {
        return rowCells.map((r) => ({ ...r, size }));
      }

      return [c];
    })
    .reduce(flatten, []),
});
