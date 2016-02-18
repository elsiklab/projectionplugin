define([
           'dojo/_base/declare',
           'dijit/CheckedMenuItem',
           'JBrowse/Plugin'
       ],
       function(
           declare,
           dijitCheckedMenuItem,
           JBrowsePlugin
       ) {
return declare( JBrowsePlugin,
{
    constructor: function( args ) {
        var browser = args.browser;

        // do anything you need to initialize your plugin here
        console.log( "ProjectionPlugin plugin starting" );

        browser.afterMilestone('initView', function() {
            browser.addGlobalMenuItem( 'view', new dijitCheckedMenuItem({
                label: 'Reverse complement view',
                id: 'menubar_revcomp',
                title: 'Reverse complement view',
                checked: false,
                onClick: function() {
                    var ret = browser.view.visibleRegion();
                    browser.config.reverseComplement = this.get("checked");
                    browser.navigateTo({ ref: ret.ref, start: Math.round(browser.refSeq.length - ret.end), end: Math.round(browser.refSeq.length - ret.start)});
                    browser.view.redrawTracks();
                }
            }));
        });
    }
});
});
