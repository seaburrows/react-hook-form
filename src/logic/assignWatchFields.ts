import transformToNestObject from './transformToNestObject';
import getDefaultValue from './getDefaultValue';
import reportFieldNotFound from './reportFieldNotFound';
import get from '../utils/get';
import getPath from '../utils/getPath';
import isEmptyObject from '../utils/isEmptyObject';
import isUndefined from '../utils/isUndefined';
import isObject from '../utils/isObject';
import { FieldValue, FieldValues, FieldName } from '../types';

export default <FormValues extends FieldValues>(
  fieldValues: FormValues,
  fieldName: FieldName<FormValues>,
  watchFields: Set<FieldName<FormValues>>,
  combinedDefaultValues: Partial<FormValues>,
): FieldValue<FormValues> | Partial<FormValues> | undefined => {
  let value;

  if (isEmptyObject(fieldValues)) {
    value = undefined;
  } else if (!isUndefined(fieldValues[fieldName])) {
    watchFields.add(fieldName);
    value = fieldValues[fieldName];
  } else {
    value = get(transformToNestObject(fieldValues), fieldName);

    if (isUndefined(value)) {
      reportFieldNotFound(fieldName);
    } else {
      getPath<FormValues>(fieldName, value).forEach(name =>
        watchFields.add(name),
      );
    }
  }

  return isUndefined(value)
    ? isObject(combinedDefaultValues)
      ? getDefaultValue(combinedDefaultValues, fieldName)
      : combinedDefaultValues
    : value;
};
