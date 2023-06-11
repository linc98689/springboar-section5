/**
 * Write a function called findFloor which accepts a sorted array and a value x, and returns the floor of x in the array. The floor of x in an array is the largest element in the array which is smaller than or equal to x. If the floor does not exist, return -1.
 */
function findFloor(arr, val) {
    return recFindFloor(arr, val, 0, arr.length-1);
}

function recFindFloor(arr, val, startIdx, endIdx){
    if(startIdx > endIdx)
        return -1;
    else{
        let midIdx = Math.floor((startIdx + endIdx +1)/2);
        if (arr[midIdx] === val)
            return val;
        else if(arr[midIdx] > val){
            return recFindFloor(arr, val, startIdx, midIdx-1);
        }else{
            return Math.max(arr[midIdx], recFindFloor(arr, val, midIdx+1, endIdx));
        }
    }
}

// module.exports = findFloor