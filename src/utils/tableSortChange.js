// 自定义表格排序规则
function tableSortChange(column,dataList){
    //获取字段名称和排序类型
    var fieldName = column.prop;
    var sortingType = column.order;
    //按照降序排序
    if(sortingType == "descending"){
        dataList = dataList.sort((a, b) => b[fieldName] - a[fieldName]);
    }
    //按照升序排序
    else{
        dataList = dataList.sort((a, b) => a[fieldName] - b[fieldName]);
    }

    return dataList
}

export default tableSortChange;