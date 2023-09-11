function pageInit(){
    for(var i = 1; i <= nlapiGetLineItemCount('item'); i++){
        nlapiSelectLineItem('item', i);
        removeMachineSubrecord();
    }
}