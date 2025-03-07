export function sortData(data, fieldName, direction) {
      let sortedData = [...data];
      let getFieldValue = (record) => {
          return record[fieldName] ? record[fieldName].toString().toLowerCase() : '';
      };
      let getFieldDataType = (value) => {
          if (!isNaN(value) && isFinite(value)) return 'integer';
      };
      let sortOrder = direction === 'asc' ? 1 : -1;

      sortedData.sort((firstValue, secondValue) => {
          let xValue = getFieldValue(firstValue);
          let yValue = getFieldValue(secondValue);
          let xFieldDataType = getFieldDataType(xValue);
          let yFieldDataType = getFieldDataType(yValue);

          if (xFieldDataType === 'integer' && yFieldDataType === 'integer') {
              xValue = xValue === '' ? null : parseFloat(xValue);
              yValue = yValue === '' ? null : parseFloat(yValue);
          }
          if (xValue === yValue) return 0;
          if (xValue === null || xValue === '') return 1;
          if (yValue === null || yValue === '') return -1;
          return sortOrder * ((xValue > yValue) - (yValue > xValue));
      });
      return sortedData;
  }