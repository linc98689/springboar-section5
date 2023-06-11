// Given a sorted array and a number, write a function called sortedFrequency that counts the occurrences of the number in the array
function sortedFrequency(arr, val) {
    let result = recSortedFreqency(arr, val, 0, arr.length-1);
    return result === 0? -1:result;
}

// recursive version
function recSortedFreqency(arr, val, startIdx, endIdx){
    if(startIdx > endIdx){
        return 0;
    }
    else{
        let midIdx = Math.floor( (startIdx + endIdx + 1)/2);
        if(arr[midIdx] === val){
            return 1+ recSortedFreqency(arr, val, startIdx, midIdx-1) +
                   recSortedFreqency(arr, val, midIdx+1, endIdx);
        }
        else if(arr[midIdx] > val){
            return recSortedFreqency(arr, val, startIdx, midIdx-1);
        }
        else{
            return recSortedFreqency(arr, val, midIdx+1, endIdx);
        }
    }

}
// module.exports = sortedFrequency