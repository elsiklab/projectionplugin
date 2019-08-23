define([
    'dojo/_base/declare',
    'dijit/CheckedMenuItem',
    'JBrowse/Plugin'
],
function(
   declare,
   CheckedMenuItem,
   JBrowsePlugin
) {
    return declare(JBrowsePlugin, {
        constructor: function(args) {
            var browser = args.browser;

            console.log('ProjectionPlugin plugin starting');

            browser.afterMilestone('initView', function() {
                browser.addGlobalMenuItem('view', new CheckedMenuItem({
                    label: 'Reverse complement view',
                    id: 'menubar_revcomp',
                    title: 'Reverse complement view',
                    checked: !!browser.config.reverseComplement,
                    onClick: function() {
                        var ret = browser.view.visibleRegion();
                        browser.config.reverseComplement = this.get('checked');
                        browser.navigateTo( ret.ref + ":" + Math.round(browser.refSeq.length - ret.end) + ".." + Math.round(browser.refSeq.length - ret.start));
                        browser.view.redrawTracks();
                    }
                }));
            });
        }
    });
});
