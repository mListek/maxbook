import { LightningElement, wire, track } from 'lwc';
import getNavigationMenuItems from '@salesforce/apex/NavigationMenuItemsController.getNavigationMenuItems';
import isGuestUser from '@salesforce/user/isGuest';

export default class NavigationMenu extends LightningElement {

    menuName = 'Guest';

    @track menuItems = [];
    @track isLoaded = false;
    @track error;

    @wire(getNavigationMenuItems, { menuName: '$menuName' })
    wiredMenuItems({error, data}) {        
        if (data && !this.isLoaded) {
            this.menuItems = data.map((item, index) => {
                return {
                    target: item.Target,
                    id: index,
                    label: item.Label,
                    defaultListViewId: item.DefaultListViewId,
                    type: item.Type,
                    accessRestriction: item.AccessRestriction
                }
            }).filter(item => {
                return item.accessRestriction === "None"
                        || (item.accessRestriction === "LoginRequired" && !isGuestUser);
            });
            this.error = undefined;
            this.isLoaded = true;
        } else if (error) {
            this.error = error;
            this.menuItems = [];
            this.isLoaded = true;
            console.log(`Navigation menu error: ${JSON.stringify(this.error)}`);
        }
    }
}