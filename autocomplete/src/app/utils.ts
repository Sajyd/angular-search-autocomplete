export const removeDuplicates = function(array: any) {
    for (let i = array.length - 1; i >= 0; i--) {
      for (let j = 0; j < i; j++) {
        if (array[j]?.name === array[i]?.name) {
          array.splice(i, 1);
          break;
        }
        }
    }
    return array;
};