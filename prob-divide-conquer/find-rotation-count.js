/**
 * Write a function called findRotationCount which accepts an array of distinct numbers sorted in increasing order. The array has been rotated counter-clockwise n number of times. Given such an array, find the value of n.
 */
function findRotationCount(arr) {
    return (recFindMaxIndex(arr, 0, arr.length-1) + 1 ) % arr.length;
}

function recFindMaxIndex(arr, startIdx, endIdx){
    // if(startIdx > endIdx)
    //     return -1;
    if(startIdx === endIdx) // only one element in task arr
        return startIdx;
    else{
        let midIdx = Math.floor((startIdx + endIdx + 1)/2);
        if (arr[startIdx] <= arr[midIdx] && arr[midIdx] <= arr[endIdx]) //no rotation
            return endIdx;
        else{
            if(arr[startIdx] <= arr[midIdx])// max in higher part
                return recFindMaxIndex(arr, midIdx, endIdx);
            else // max in lower part
                return recFindMaxIndex(arr, startIdx, midIdx -1);
        }
    }
}
// module.exports = findRotationCount