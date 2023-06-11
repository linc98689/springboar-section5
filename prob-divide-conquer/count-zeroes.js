function countZeroes(arr) {
  // find index of last 1 in array of sorted numbers of 1 and 0 : [1,1,...,0,0,...,0]
  let leftIdx = 0, rightIdx = arr.length -1;
  let lastOneIdx = -1;
  while (leftIdx <= rightIdx){
    let midIdx = Math.floor((rightIdx + leftIdx + 1)/2);
    if (arr[midIdx] === 1){
        lastOneIdx = midIdx;
        leftIdx = midIdx + 1;
    }
    else{
        rightIdx = midIdx -1;
    }
  }
  
  return arr.length - (lastOneIdx + 1); // count of 0s: total count - count of 1s
}

// module.exports = countZeroes