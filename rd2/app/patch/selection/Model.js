Ext.define('Rd.patch.selection.Model', {
    override: 'Ext.selection.Model',
     /**
     * this override fixes multiple bugs when store is a buffered type
     * and fixed a bug that causes the initial hasId to not work because
     * the store.gerById() method expects an ID and not the record
     * also forcing the double verification when the record is not found because
     * it places both checks in a single if statement
     * @param record
     * @returns {boolean}

    http://www.sencha.com/forum/showthread.php?258397-4.2.0-RC-Selecting-a-grid-s-row-with-a-buffered-store-causes-a-JavaScript-error/page2

     */
    storeHasSelected: function(record) {
        var store = this.store,
            records,
            len, id, i, m;


        if (record.hasId()) {
            return store.getById(record.getId());
        } else {
            if (store.buffered) {//on buffered stores the map holds the data items
                records = [];
                for (m in store.data.map) {
                    records = records.concat(store.data.map[m].value);
                }
            } else {
                records = store.data.items;
            }
            len = records.length;
            id = record.internalId;

            for (i = 0; i < len; ++i) {
                if (id === records[i].internalId) {
                    return true;
                }
            }
        }
        return false;
    }

});
