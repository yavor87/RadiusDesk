Ext.define('Rd.patch.view.Table', {
    override: 'Ext.view.Table',
    getRecord: function (node) {
        node = this.getNode(node);
        if (node) {
            var recordIndex = node.getAttribute('data-recordIndex');
            if (recordIndex) {
                recordIndex = parseInt(recordIndex, 10);
                if (recordIndex > -1) {
                    // Eliminates one of sources of "PageMap asked for range which it does not have" error
                    if (this.store.getCount() > 0) {
                        return this.store.data.getAt(recordIndex); 
                    }
                }
            }
            return this.dataSource.data.get(node.getAttribute('data-recordId'));
        }
    },
    renderRow: function (record, rowIdx, out) {
        var me = this,
        isMetadataRecord = rowIdx === -1,
        selModel = me.selModel,
        rowValues = me.rowValues,
        itemClasses = rowValues.itemClasses,
        rowClasses = rowValues.rowClasses,
        cls,
        rowTpl = me.rowTpl;
        rowValues.record = record;
        rowValues.recordId = record.internalId;
        rowValues.recordIndex = rowIdx;
        rowValues.rowId = me.getRowId(record);
        rowValues.itemCls = rowValues.rowCls = '';
        if (!rowValues.columns) {
            rowValues.columns = me.ownerCt.columnManager.getColumns();
        }
        itemClasses.length = rowClasses.length = 0;
        if (!isMetadataRecord) {
            itemClasses[0] = Ext.baseCSSPrefix + "grid-row";
            if (selModel && selModel.isRowSelected) {
                var storeRows = this.getStore().getCount();
                // Eliminates one of sources of "PageMap asked for range which it does not have" error
                if (rowIdx + 1 < storeRows) { 
                    if (selModel.isRowSelected(rowIdx + 1)) {
                        itemClasses.push(me.beforeSelectedItemCls);
                    }
                }
                if (selModel.isRowSelected(record)) {
                    itemClasses.push(me.selectedItemCls);
                }
            }
            if (me.stripeRows && rowIdx % 2 !== 0) {
                rowClasses.push(me.altRowCls);
            }
            if (me.getRowClass) {
                cls = me.getRowClass(record, rowIdx, null, me.dataSource);
                if (cls) {
                    rowClasses.push(cls);
                }
            }
        }
        if (out) {
            rowTpl.applyOut(rowValues, out);
        } else {
            return rowTpl.apply(rowValues);
        }
    }
});
