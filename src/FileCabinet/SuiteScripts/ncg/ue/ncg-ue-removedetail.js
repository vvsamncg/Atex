/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/record','N/runtime'],
    /**
 * @param{record} record
 */
   function (record, runtime) {

        function afterSubmit(scriptContext){
            if(scriptContext.type != scriptContext.UserEventType.CREATE &&
                scriptContext.type != scriptContext.UserEventType.EDIT){
                return;
            }

            var soId = scriptContext.newRecord.getValue({
                fieldId: Fields.ORDER_ID
            });

            var poId = scriptContext.newRecord.getValue({
                fieldId: Fields.CREATED_FROM
            });

            if(!soId) return;

            try {
                var order = record.load({
                    type: record.Type.SALES_ORDER,
                    id: soId,
                    isDynamic: true
                });

                for (var i = 0; i < order.getLineCount({sublistId: Fields.ITEM}); i++) {
                    if (poId != order.getSublistValue({
                        sublistId: Fields.ITEM,
                        fieldId: Fields.PO,
                        line: i
                    })) {
                        continue;
                    }

                    order.selectLine({
                        sublistId: Fields.ITEM,
                        line: i
                    });

                    order.removeCurrentSublistSubrecord({
                        sublistId: Fields.ITEM,
                        fieldId: Fields.INVENTORY_DETAIL,
                    })

                    order.commitLine({
                        sublistId: Fields.ITEM
                    })
                }

                order.save({
                    ignoreMandatoryFields: true
                })
            }catch(e){
                log.debug('Remove detail - error', e);
            }

        }

        const Fields = {
            ITEM: 'item',
            CREATED_FROM: 'createdfrom',
            ORDER_ID: 'custbody_ncg_ref_num',
            INVENTORY_DETAIL: 'inventorydetail',
            PO: 'createdpo'
        }

        return {afterSubmit:afterSubmit}

    });
