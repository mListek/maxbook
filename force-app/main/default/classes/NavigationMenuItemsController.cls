global with sharing class NavigationMenuItemsController {

    @AuraEnabled(cacheable=true)
    public static List<NavigationMenuItem> getNavigationMenuItems(String menuName) {
        
        String networkId = Network.getNetworkId();

        if (UserInfo.getUserType() == 'Guest') {
            menuName = 'Guest';
        } else {
            menuName = 'Logged';
        }

        List<NavigationLinkSet> linkSets = [
            SELECT Id, MasterLabel, NetworkId 
            FROM NavigationLinkSet
            WHERE MasterLabel = :menuName AND NetworkId = :networkId
        ];

        Id linkSetId = linkSets.get(0).Id;

        return [SELECT Label, Target, Type, DefaultListViewId, AccessRestriction,
                ParentId,
                Position,
                Status,
                TargetPrefs
            FROM NavigationMenuItem
            WHERE NavigationLinkSetId = :linkSetId
            AND Status = 'Live'
            ORDER BY Position
        ];
    }
}
