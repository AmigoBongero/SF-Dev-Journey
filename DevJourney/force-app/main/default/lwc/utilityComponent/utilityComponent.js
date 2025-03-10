export function sortArrayOfObjectsByField(data, fieldName, direction) {
      let sortedData = [...data];
      let getFieldValue = (record) => {
          return record[fieldName] ? record[fieldName].toString().toLowerCase() : '';
      };
      let sortOrder = direction === 'asc' ? 1 : -1;

      sortedData.sort((firstRecord, secondRecord) => {
          let firstFieldValue = getFieldValue(firstRecord);
          let secondFieldValue = getFieldValue(secondRecord);

          if (isFinite(firstFieldValue) && isFinite(secondFieldValue)) {
              firstFieldValue = firstFieldValue === '' ? null : parseInt(firstFieldValue);
              secondFieldValue = secondFieldValue === '' ? null : parseInt(secondFieldValue);
          }
          if (firstFieldValue === secondFieldValue) {
              return 0;
          }
          if (firstFieldValue === null || firstFieldValue === '') {
              return 1;
          }
          if (secondFieldValue === null || secondFieldValue === '') {
              return -1;
          }
          return sortOrder * ((firstFieldValue > secondFieldValue) - (secondFieldValue > firstFieldValue));
      });
      return sortedData;
  }