
export const voucherSwitch = (str) => {
    let resultStr;
    switch(str){
        case 'oneday':
            resultStr = '1일 이용권'
            break;
        case 'oneweek':
            resultStr = '1주 이용권'
            break;
        case 'twoweek':
            resultStr = '2주 이용권'
            break;
        case 'onemonth':
            resultStr = '1개월 이용권'
            break;
        case 'onlyfifty':
            resultStr = '50곡 이용권'
            break;
        case 'onlyhundred':
            resultStr = '100곡 이용권'
            break;
        default: 
            resultStr = '사용중인 이용권이 없습니다.'
            break;
    }
    return resultStr;
} 