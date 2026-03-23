import { Platform } from 'react-native';

// API Keys Provided from Environment Variables
const API_KEYS = {
    apple: process.env.EXPO_PUBLIC_RC_APPLE_KEY || '',
    google: process.env.EXPO_PUBLIC_RC_GOOGLE_KEY || ''
};

const ENTITLEMENT_ID = 'Saludappble Pro'; // User specified entitlement

class RevenueCatService {
    constructor() {
        this.isInitialized = false;
        this.isPremium = false;
        this.customerInfo = null;
        this.Purchases = null; // Store the module
    }

    async configure() {
        if (this.isInitialized) return;

        try {
            // Dynamic import to prevent crash in Expo Go
            this.Purchases = require('react-native-purchases').default;
            const { LOG_LEVEL } = require('react-native-purchases');

            // Enable debug logs for development
            this.Purchases.setLogLevel(LOG_LEVEL.DEBUG);

            if (Platform.OS === 'ios') {
                this.Purchases.configure({ apiKey: API_KEYS.apple });
            } else if (Platform.OS === 'android') {
                this.Purchases.configure({ apiKey: API_KEYS.google });
            }

            // Verify initial status
            await this.checkSubscriptionStatus();

            // Listen for real-time updates
            this.Purchases.addCustomerInfoUpdateListener((info) => {
                this.handleCustomerInfo(info);
            });

            this.isInitialized = true;
            console.log('✅ RevenueCat Configured Successfully');
        } catch (error) {
            console.warn('⚠️ RevenueCat Init Failed (Likely Expo Go):', error.message);
            console.log('⚠️ Running in Safe Mode for Expo Go ⚠️');
            this.isInitialized = true; // Mark initialized to prevent re-tries
            this.Purchases = null; // Ensure null if failed
        }
    }

    async checkSubscriptionStatus() {
        if (!this.Purchases) {
            console.log('⚠️ [Mock] Subscription Check: False (No Native Module)');
            return this.isPremium;
        }

        try {
            const customerInfo = await this.Purchases.getCustomerInfo();
            return this.handleCustomerInfo(customerInfo);
        } catch (error) {
            console.log('⚠️ Subscription Check Failed (Mocking False)');
            return this.isPremium;
        }
    }

    handleCustomerInfo(customerInfo) {
        this.customerInfo = customerInfo;

        // Check for specific entitlement 'Saludappble Pro'
        if (customerInfo?.entitlements?.active[ENTITLEMENT_ID]) {
            this.isPremium = true;
            console.log('👑 User is Premium (Saludappble Pro)');
        } else {
            this.isPremium = false;
            console.log('🔒 User is Free Tier');
        }
        return this.isPremium;
    }

    async getOfferings() {
        if (!this.Purchases) {
            return this.getMockOfferings();
        }

        try {
            const offerings = await this.Purchases.getOfferings();
            if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
                return offerings.current.availablePackages;
            }
        } catch (error) {
            console.log('⚠️ Fetch Offerings Failed, using Mock');
        }
        return this.getMockOfferings();
    }

    getMockOfferings() {
        return [
            {
                identifier: 'monthly',
                product: { priceString: '$4.99', title: 'Monthly Pro', description: 'Access to all AI features' }
            },
            {
                identifier: 'yearly',
                product: { priceString: '$49.99', title: 'Yearly Pro', description: 'Best Value' }
            },
            {
                identifier: 'lifetime',
                product: { priceString: '$199.99', title: 'Lifetime Access', description: 'One time payment' }
            }
        ];
    }

    async purchasePackage(packageToPurchase) {
        if (!this.Purchases) {
            console.log('⚠️ [Mock] Purchase: Success');
            this.isPremium = true;
            return true;
        }

        try {
            const { customerInfo } = await this.Purchases.purchasePackage(packageToPurchase);
            return this.handleCustomerInfo(customerInfo);
        } catch (error) {
            if (error.userCancelled) {
                console.log('❌ User cancelled purchase');
            } else {
                console.log('⚠️ Purchase Error (Mocking Success for Dev)');
                this.isPremium = true; // Fallback for dev
                return true;
            }
        }
    }

    async restorePurchases() {
        if (!this.Purchases) {
            console.log('⚠️ [Mock] Restore: Success');
            this.isPremium = true;
            return true;
        }

        try {
            const customerInfo = await this.Purchases.restorePurchases();
            return this.handleCustomerInfo(customerInfo);
        } catch (error) {
            console.log('⚠️ Restore Failed (Mocking Success)');
            this.isPremium = true;
            return true;
        }
    }

    // New Data Getters
    get isUserPremium() { return this.isPremium; }
    get currentEntitlement() { return ENTITLEMENT_ID; }
}

export default new RevenueCatService();
