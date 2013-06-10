Ext.define('Rd.patch.data.Store', {
    require: ['Ext.data.Store'],
    override: 'Ext.data.Store',
    loadToPrefetch: function(options) {
        var me = this,
        i,
        records,

        // Get the requested record index range in the dataset
        startIdx = options.start,
        endIdx = options.start + options.limit - 1,

        // The end index to load into the store's live record collection
////            loadEndIdx = options.start + (me.viewSize || options.limit) - 1,

        // Calculate a page range which encompasses the requested range plus both buffer zones
        startPage = me.getPageFromRecordIndex(Math.max(startIdx - me.trailingBufferZone, 0)),
        endPage = me.getPageFromRecordIndex(endIdx + me.leadingBufferZone),

        // Wait for the viewable range to be available
        waitForRequestedRange = function() {
            if (me.rangeCached(startIdx, endIdx)) {
                me.loading = false;
                records = me.pageMap.getRange(startIdx, endIdx);
                me.pageMap.un('pageAdded', waitForRequestedRange);

                // If there is a listener for guranteedrange (PagingScroller uses this), then go through that event
                if (me.hasListeners.guaranteedrange) {
                    me.guaranteeRange(startIdx, endIdx, options.callback, options.scope);
                }
                // Otherwise load the records directly
                else {
                    me.loadRecords(records, {
                        start: startIdx
                    });
                }
                me.fireEvent('load', me, records, true);
                if (options.groupChange) {
                    me.fireGroupChange();
                }
            }
        };

        if (me.fireEvent('beforeload', me, options) !== false) {

            // So that prefetchPage does not consider the store to be fully loaded if the local count is equal to the total count
            delete me.totalCount;

            me.loading = true;

            // Wait for the requested range to become available in the page map
            me.pageMap.on('pageAdded', waitForRequestedRange);
            
            // Load the first page in the range, which will give us the initial total count.
            // Once it is loaded, go ahead and prefetch any subsequent pages, if necessary.
            // The prefetchPage has a check to prevent us loading more than the totalCount,
            // so we don't want to blindly load up <n> pages where it isn't required. 
            me.on('prefetch', function(){
                for (i = startPage + 1; i <= endPage; ++i) {
                    me.prefetchPage(i, options);
                }
            }, null, {single: true});
            
            me.prefetchPage(startPage, options);
        }
    },
    reload: function(options) {
        var me = this,
            startIdx,
            endIdx,
            startPage,
            endPage,
            i,
            waitForReload,
            bufferZone,
            records;

        if (!options) {
            options = {};
        }

        // If buffered, we have to clear the page cache and then
        // cache the page range surrounding store's loaded range.
        if (me.buffered) {

            // So that prefetchPage does not consider the store to be fully loaded if the local count is equal to the total count
            delete me.totalCount;

            waitForReload = function() {
                if (me.rangeCached(startIdx, endIdx)) {
                    me.loading = false;
                    me.pageMap.un('pageAdded', waitForReload);
                    records = me.pageMap.getRange(startIdx, endIdx);
                    me.loadRecords(records, {
                        start: startIdx
                    });
                    me.fireEvent('load', me, records, true);
                }
            };
            bufferZone = Math.ceil((me.leadingBufferZone + me.trailingBufferZone) / 2);

            // Get our record index range in the dataset
            startIdx = options.start || me.getAt(0).index;
            endIdx = startIdx + (options.count || me.getCount()) - 1;

            // Calculate a page range which encompasses the Store's loaded range plus both buffer zones
            startPage = me.getPageFromRecordIndex(Math.max(startIdx - bufferZone, 0));
            endPage = me.getPageFromRecordIndex(endIdx + bufferZone);

            // Clear cache (with initial flag so that any listening PagingScroller does not reset to page 1).
            me.pageMap.clear(true);

            if (me.fireEvent('beforeload', me, options) !== false) {
                me.loading = true;

                //___ Dirk fix ___(move from buttom to top)
                // Wait for the requested range to become available in the page map
                // Load the range as soon as the whole range is available
                me.pageMap.on('pageAdded', waitForReload);


                // Recache the page range which encapsulates our visible records
                for (i = startPage; i <= endPage; i++) {
                    me.prefetchPage(i, options);
                }

                // Wait for the requested range to become available in the page map
                // Load the range as soon as the whole range is available
                //me.pageMap.on('pageAdded', waitForReload);
            }
        } else {
            return me.callParent(arguments);
        }
    },
        // Buffering
    /**
     * Prefetches data into the store using its configured {@link #proxy}.
     * @param {Object} options (Optional) config object, passed into the Ext.data.Operation object before loading.
     * See {@link #method-load}
     */
    prefetch: function(options) {
        var me = this,
            pageSize = me.pageSize,
            proxy,
            operation;

        // Check pageSize has not been tampered with. That would break page caching
        if (pageSize) {
            if (me.lastPageSize && pageSize != me.lastPageSize) {
                Ext.error.raise("pageSize cannot be dynamically altered");
            }
            if (!me.pageMap.pageSize) {
                me.pageMap.pageSize = pageSize;
            }
        }

        // Allow first prefetch call to imply the required page size.
        else {
            me.pageSize = me.pageMap.pageSize = pageSize = options.limit;
        }

        // So that we can check for tampering next time through
        me.lastPageSize = pageSize;

        // Always get whole pages.
        if (!options.page) {
            options.page = me.getPageFromRecordIndex(options.start);
            options.start = (options.page - 1) * pageSize;
            options.limit = Math.ceil(options.limit / pageSize) * pageSize;
        }

        // Currently not requesting this page, then request it...
        if (!me.pageRequests[options.page]) {

            // Copy options into a new object so as not to mutate passed in objects
            options = Ext.apply({
                action : 'read',
                filters: me.filters.items,
                sorters: me.sorters.items,
                groupers: me.groupers.items,

                // Generation # of the page map to which the requested records belong.
                // If page map is cleared while this request is in flight, the generation will increment and the payload will be rejected
                generation: me.pageMap.generation
            }, options);

            operation = new Ext.data.Operation(options);

            if (me.fireEvent('beforeprefetch', me, operation) !== false) {
               // me.loading = true;
                proxy = me.proxy;
                me.pageRequests[options.page] = proxy.read(operation, me.onProxyPrefetch, me);
                if (proxy.isSynchronous) {
                    delete me.pageRequests[options.page];
                }
            }
        }
        return me;
    }

});


