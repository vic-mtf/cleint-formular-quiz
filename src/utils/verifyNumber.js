export default function verifyNumber(num) {
    var prefixes = ['080', '081', '082', '083', '084', '085', '089', '090', '091', '097', '098', '099'];
    if(num.length !== 10 || !/^([0-9]){10,}$/.test(num)) 
        return false;
    var prefix = num.substring(0, 3);
    if(prefixes.includes(prefix)) 
        return true;
    return false;
}