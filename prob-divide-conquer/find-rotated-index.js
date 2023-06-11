/**
 * Write a function called findRotatedIndex which accepts a rotated array of sorted numbers and an integer. The function should return the index of num in the array. If the value is not found, return -1.
 */
function findRotatedIndex(arr, val) {
    return recFindRotatedIndex(arr, val, 0, arr.length-1);
}

function recFindRotatedIndex(arr, val, startIdx, endIdx){
    if(startIdx > endIdx) // not found
        return -1; 
    else {
        let midIdx = Math.floor((startIdx + endIdx +1)/2);
        if(arr[midIdx] === val)     //found index
            return midIdx;
        else if(startIdx === endIdx) // not found
            return -1
        else if((arr[endIdx]-arr[midIdx])*(arr[midIdx]-arr[startIdx]) >=0) // no rotation
            return recFindSortedIndex(arr, val, startIdx, endIdx);
        else{
           if(arr[midIdx] > arr[startIdx]) //lower part sorted
                return Math.max(recFindSortedIndex(arr,val, startIdx, midIdx-1),
                recFindRotatedIndex(arr, val, midIdx+1, endIdx));
            else // uper part sorted
                return Math.max(recFindRotatedIndex(arr,val, startIdx, midIdx-1),
                recFindSortedIndex(arr, val, midIdx+1, endIdx));
        }
    }
}

// no rotation
function recFindSortedIndex(arr, val, startIdx, endIdx){
    if(startIdx > endIdx)
        return -1;
    else{
        let midIdx = Math.floor((startIdx + endIdx +1)/2);
        if (arr[midIdx] === val)
            return midIdx;
        else if (arr[midIdx] < val)
            return recFindSortedIndex(arr, val, midIdx+1, endIdx);
        else
            return recFindSortedIndex(arr, val, startIdx, midIdx-1);
    }
}
// module.exports = findRotatedIndex