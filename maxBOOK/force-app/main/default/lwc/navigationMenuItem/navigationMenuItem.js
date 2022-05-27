import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import basePath from '@salesforce/community/basePath';

export default class NavigationMenuItem extends NavigationMixin(LightningElement) {

    @api item = {};

    @track href = 'javascript:void(0);';

    // the PageReference object used by lightning/navigation
    pageReference;

    connectedCallback() {
        const { type, target, defaultListViewId } = this.item;

        // get the correct PageReference object for the menu item type
        if (type === 'SalesforceObject') {
            this.pageReference = {
                type: 'standard__objectPage',
                attributes: { 
                    objectApiName: target
                },
                state: {
                    filterName: defaultListViewId
                }
            };
        } else if (type === 'InternalLink') {
            this.pageReference = {
                type: 'standard__webPage',
                attributes: {
                    url: target
                }
            };
        } else if (type === 'ExternalLink') {
            this.pageReference = {
                type: 'standard__webPage',
                attributes: {
                    url: target
                }
            };
        }
        
        // use the NavigationMixin from lightning/navigation to generate the URL for navigation. 
        if (this.pageReference) {
            this[NavigationMixin.GenerateUrl](this.pageReference)
                .then(url => {
                    this.href = url;
                });
        }
    }

    handleClick(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        if (this.item.target === "Login") {
            this[NavigationMixin.Navigate]({
                type: "comm__namedPage",
                attributes: {
                    name: "Login"
                }
            });
        } else if (this.item.target === "Logout") {
            const sitePrefix = basePath.replace(/\/s$/i, "");
            window.open(`${sitePrefix}/secur/logout.jsp?retUrl=${basePath}`, "_self");
        } else if (this.pageReference) {
            this[NavigationMixin.Navigate](this.pageReference);
        }
    }
}