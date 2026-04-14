const taxonomy = ['taxonomy1', 'taxonomy2', 'taxonomy3'];

function sampleCustomParameters() {
    return {
        string_param: 'This is Insider.',
        int_param: 42,
        double_param: 9.99,
        bool_param: true,
        date_param: new Date(),
        string_array_param: ['tag1', 'tag2', 'tag3'],
        numeric_array_param: [1, 2, 3]
    };
}

let app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        document.getElementById('userAttributes').addEventListener('click', userAttributes);

        document.getElementById('login').addEventListener('click', userIdentifiers.login);
        document.getElementById('logout').addEventListener('click', userIdentifiers.logout);
        document.getElementById('logoutResettingInsiderID').addEventListener('click', userIdentifiers.logoutResettingInsiderID);
        document.getElementById('signUpConfirmation').addEventListener('click', signUpConfirmation);

        document.getElementById('triggerEvents').addEventListener('click', triggerEvents);

        document.getElementById('createProduct').addEventListener('click', createProduct);

        document.getElementById('itemAddToCart').addEventListener('click', purchase.itemAddToCart);
        document.getElementById('itemRemoveFromCart').addEventListener('click', purchase.itemRemoveFromCart);
        document.getElementById('itemRemoveFromCartWithSaleID').addEventListener('click', purchase.itemRemoveFromCartWithSaleID);
        document.getElementById('itemPurchase').addEventListener('click', purchase.itemPurchase);
        document.getElementById('cartClear').addEventListener('click', purchase.cartClear);

        document.getElementById('itemAddToWishlist').addEventListener('click', wishlist.itemAddToWishlist);
        document.getElementById('itemRemoveFromWishlist').addEventListener('click', wishlist.itemRemoveFromWishlist);
        document.getElementById('wishlistClear').addEventListener('click', wishlist.wishlistClear);
        document.getElementById('visitWishlistPage').addEventListener('click', wishlist.visitWishlistPage);

        document.getElementById('smartRecommender').addEventListener('click', smartRecommendation.getData);
        document.getElementById('smartRecommenderWithIDs').addEventListener('click', smartRecommendation.withProductIDs);
        document.getElementById('clickSmartRecommendationProduct').addEventListener('click', smartRecommendation.clickProduct);

        document.getElementById('socialProof').addEventListener('click', pageVisit.productPage);

        document.getElementById('homePage').addEventListener('click', pageVisit.homePage);
        document.getElementById('productPage').addEventListener('click', pageVisit.productPage);
        document.getElementById('cartPage').addEventListener('click', pageVisit.cartPage);
        document.getElementById('cartPageWithSaleID').addEventListener('click', pageVisit.cartPageWithSaleID);
        document.getElementById('categoryPage').addEventListener('click', pageVisit.categoryPage);

        document.getElementById('gdprTrue').addEventListener('click', gdpr.true);
        document.getElementById('gdprFalse').addEventListener('click', gdpr.false);

        document.getElementById('mobileAppAccessTrue').addEventListener('click', mobileAppAccess.enable);
        document.getElementById('mobileAppAccessFalse').addEventListener('click', mobileAppAccess.disable);

        document.getElementById('messageCenter').addEventListener('click', getMessageCenterData);
        document.getElementById('messageCenterWithIdentifiers').addEventListener('click', getMessageCenterDataWithIdentifiers);
        document.getElementById('openMessageCenter').addEventListener('click', openMessageCenter);
        document.getElementById('contentOptimizer').addEventListener('click', contentOptimizer);
        document.getElementById('contentOptimizerNoCache').addEventListener('click', contentOptimizerNoCache);

        document.getElementById('removeInapp').addEventListener('click', removeInapp);

        document.getElementById('showNativeAppReview').addEventListener('click', nativeFeatures.showNativeAppReview);
        document.getElementById('handleUniversalLink').addEventListener('click', nativeFeatures.handleUniversalLink);
        document.getElementById('handleURL').addEventListener('click', nativeFeatures.handleURL);

        initInsider();
    }
};

async function initInsider() {
    // FIXME-INSIDER: Please change with your partner name and app group.
    await window.Insider.init(
        'your_partner_name',
        'group.com.useinsider.cordovademo',
        (callback) => {
            switch ((callback.result || {}).type) {
                case window.Insider.callbackType.NOTIFICATION_OPEN:
                    console.log('[INSIDER][NOTIFICATION_OPEN]: ', callback.result || {});
                    break;
                case window.Insider.callbackType.TEMP_STORE_CUSTOM_ACTION:
                    console.log('[INSIDER][TEMP_STORE_CUSTOM_ACTION]: ', callback.result || {});
                    break;
            }
        },
    );

    await window.Insider.registerWithQuietPermission(false);
    window.Insider.setActiveForegroundPushView();
    window.Insider.startTrackingGeofence();
    window.Insider.enableIDFACollection(true);
    window.Insider.enableLocationCollection(true);
    window.Insider.enableIpCollection(true);
    window.Insider.enableCarrierCollection(true);

    console.log("[INSIDER][initialize]: Method is triggered");
}

function userAttributes() {
    // --- USER --- //

    let currentUser = window.Insider.getCurrentUser();
    const stringArray = ['value1', 'value2', 'value3'];

    // Setting User Attributes
    currentUser.setName("John")
        .setSurname("Doe")
        .setAge(23)
        .setGender(Insider.gender.FEMALE)
        .setBirthday(new Date())
        .setEmailOptin(true)
        .setSMSOptin(true)
        .setPushOptin(true)
        .setLocationOptin(true)
        .setWhatsappOptin(true)
        .setFacebookID("Facebook-ID")
        .setTwitterID("Twittter-ID")
        .setLanguage("TR")
        .setLocale("tr_TR");

    currentUser.setCustomAttributeWithString('string_parameter', 'This is Insider.');
    currentUser.setCustomAttributeWithInt('int_parameter', 10);
    currentUser.setCustomAttributeWithDouble('double_parameter', 10.5);
    currentUser.setCustomAttributeWithBoolean('bool_parameter', true);
    currentUser.setCustomAttributeWithDate('date_parameter', new Date());
    currentUser.setCustomAttributeWithArray('key', stringArray);

    console.log("[INSIDER][currentUser]: Method is triggered");
}

const userIdentifiers = {
    login: async function() {
        let currentUser = window.Insider.getCurrentUser();
        let identifiers = Insider.identifier();

        identifiers.addEmail("mobile.test@useinsider.com");
        identifiers.addPhoneNumber("+909876543210");
        identifiers.addUserID("{crmID}");

        currentUser.login(identifiers.getIdentifiers(), (id) => alert(id));

        console.log("[INSIDER][login]: Method is triggered. Identifiers: ", identifiers);
    },
    logout: async function() {
        let currentUser = window.Insider.getCurrentUser();

        currentUser.logout();

        console.log("[INSIDER][logout]: Method is triggered.");
    },
    logoutResettingInsiderID: async function() {
        let currentUser = window.Insider.getCurrentUser();

        currentUser.logoutResettingInsiderID(null, (newInsiderID) => {
            console.log("[INSIDER][logoutResettingInsiderID]: New Insider ID:", newInsiderID);
            alert("Logout successful! New Insider ID: " + newInsiderID);
        });

        console.log("[INSIDER][logoutResettingInsiderID]: Method triggered");
    }
}

const purchase = {
    itemAddToCart: async function() {
        let product = createNewProduct("product_id", "Pear", taxonomy, "ImageURL", 1000, "TRY");
        const customParameters = sampleCustomParameters();

        await window.Insider.itemAddedToCart(product, customParameters);

        console.log("[INSIDER][itemAddToCart]: Method is triggered, Product: ", product, "CustomParameters: ", customParameters);
    },
    itemRemoveFromCart: async function() {
        const productID = 'product_id';
        const customParameters = sampleCustomParameters();

        await window.Insider.itemRemovedFromCart(productID, customParameters);

        console.log("[INSIDER][itemRemoveFromCart]: Method is triggered, Product ID: ", productID, "CustomParameters: ", customParameters);
    },
    itemRemoveFromCartWithSaleID: async function() {
        const productID = 'product_id';
        const saleID = 'sale_12345';
        const customParameters = sampleCustomParameters();

        await window.Insider.itemRemovedFromCart(productID, saleID, customParameters);

        console.log("[INSIDER][itemRemoveFromCartWithSaleID]: Method is triggered, Product ID: ", productID, "SaleID: ", saleID, "CustomParameters: ", customParameters);
    },
    itemPurchase: async function() {
        let product = createNewProduct("product_id", "Pear", taxonomy, "ImageURL", 1000, "TRY");
        const customParameters = sampleCustomParameters();

        await window.Insider.itemPurchased('product_id', product, customParameters);

        console.log("[INSIDER][itemPurchase]: Method is triggered, Product: ", product, "CustomParameters: ", customParameters);
    },
    cartClear: async function() {
        const customParameters = sampleCustomParameters();

        window.Insider.cartCleared(customParameters);

        console.log("[INSIDER][cartClear]: Method is triggered, CustomParameters: ", customParameters);
    }
}

const wishlist = {
    itemAddToWishlist: async function() {
        let product = createNewProduct("product_id", "Pear", taxonomy, "ImageURL", 1000, "TRY");
        const customParameters = sampleCustomParameters();

        await window.Insider.itemAddedToWishlist(product, customParameters);

        console.log("[INSIDER][itemAddToWishlist]: Method is triggered, Product: ", product, "CustomParameters: ", customParameters);
    },
    itemRemoveFromWishlist: async function() {
        const productID = 'product_id';
        const customParameters = sampleCustomParameters();

        await window.Insider.itemRemovedFromWishlist(productID, customParameters);

        console.log("[INSIDER][itemRemoveFromWishlist]: Method is triggered, Product ID: ", productID, "CustomParameters: ", customParameters);
    },
    wishlistClear: async function() {
        const customParameters = sampleCustomParameters();

        await window.Insider.wishlistCleared(customParameters);

        console.log("[INSIDER][wishlistClear]: Method is triggered, CustomParameters: ", customParameters);
    },
    visitWishlistPage: async function() {
        let product = createNewProduct("product1", "Pear", taxonomy, "ImageURL", 1000, "TRY");
        let product2 = createNewProduct("product2", "Apple", taxonomy, "ImageURL", 50, "TRY");
        const insiderExampleProducts = [product, product2];
        const customParameters = sampleCustomParameters();

        await window.Insider.visitWishlistPage(insiderExampleProducts, customParameters);

        console.log("[INSIDER][visitWishlistPage]: Method is triggered, CustomParameters: ", customParameters);
    }
}

const pageVisit = {
    homePage: async function() {
        const customParameters = sampleCustomParameters();

        await window.Insider.visitHomePage(customParameters);

        console.log("[INSIDER][homePage]: Method is triggered, CustomParameters: ", customParameters);
    },
    categoryPage: async function() {
        const customParameters = sampleCustomParameters();

        await window.Insider.visitListingPage(taxonomy, customParameters);

        console.log("[INSIDER][categoryPage]: Method is triggered, CustomParameters: ", customParameters);
    },
    productPage: async function() {
        let product = createNewProduct("product1", "Pear", taxonomy, "ImageURL", 1000, "TRY");
        const customParameters = sampleCustomParameters();

        await window.Insider.visitProductDetailPage(product, customParameters);

        console.log("[INSIDER][productPage]: Method is triggered, CustomParameters: ", customParameters);
    },
    cartPage: async function() {
        let product = createNewProduct("product1", "Pear", taxonomy, "ImageURL", 1000, "TRY");
        let product2 = createNewProduct("product2", "Apple", taxonomy, "ImageURL", 50, "TRY");

        const insiderExampleProducts = [product, product2];
        const customParameters = sampleCustomParameters();

        await window.Insider.visitCartPage(insiderExampleProducts, customParameters);

        console.log("[INSIDER][cartPage]: Method is triggered, CustomParameters: ", customParameters);
    },
    cartPageWithSaleID: async function() {
        let product = createNewProduct("product1", "Pear", taxonomy, "ImageURL", 1000, "TRY");
        let product2 = createNewProduct("product2", "Apple", taxonomy, "ImageURL", 50, "TRY");

        const insiderExampleProducts = [product, product2];
        const saleID = 'sale_12345';
        const customParameters = sampleCustomParameters();

        await window.Insider.visitCartPage(insiderExampleProducts, saleID, customParameters);

        console.log("[INSIDER][cartPageWithSaleID]: Method is triggered, SaleID: ", saleID, "CustomParameters: ", customParameters);
    }
}

const gdpr = {
    'true': async function() {
        window.Insider.setGDPRConsent(true);

        console.log("[INSIDER][setGDPR]: true");
    },
    'false': async function() {
        window.Insider.setGDPRConsent(false);

        console.log("[INSIDER][setGDPR]: false");
    }
}

const mobileAppAccess = {
    enable: function() {
        window.Insider.setMobileAppAccess(true);
        console.log("[INSIDER][setMobileAppAccess]: true");
    },
    disable: function() {
        window.Insider.setMobileAppAccess(false);
        console.log("[INSIDER][setMobileAppAccess]: false");
    }
};

async function signUpConfirmation() {
    const customParameters = sampleCustomParameters();
    await window.Insider.signUpConfirmation(customParameters);
    console.log("[INSIDER][signUpConfirmation]: Method triggered, CustomParameters: ", customParameters);
}

function removeInapp() {
    window.Insider.removeInapp();
    console.log("[INSIDER][removeInapp]: Method triggered");
}

const nativeFeatures = {
    showNativeAppReview: function() {
        window.Insider.showNativeAppReview();
        console.log("[INSIDER][showNativeAppReview]: Method triggered");
    },
    handleUniversalLink: function() {
        const url = 'https://example.useinsider.com/product/123';
        window.Insider.handleUniversalLink(url);
        console.log("[INSIDER][handleUniversalLink]: Method triggered, URL: ", url);
    },
    handleURL: function() {
        const url = 'https://example.useinsider.com/product/123';
        window.Insider.handleURL(url);
        console.log("[INSIDER][handleURL]: Method triggered, URL: ", url);
    }
}

async function triggerEvents() {
    // --- EVENT --- //

    const stringArray = ['value1', 'value2', 'value3'];
    const numericArray = [1, 2, 3];

    // You can create an event without parameters and call the build method;
    const event = await window.Insider.tagEvent("event_name").build();

    const event2 = await window.Insider
        .tagEvent("second_event")
        ?.addParameterWithInt('int_parameter', 10)
        .addParameterWithDate('date_parameter', new Date())
        .addParameterWithDouble('double_parameter', 10.5)
        .addParameterWithBoolean('bool_parameter', true)
        .addParameterWithString('string_parameter', 'This is Insider.')
        .addParameterWithStringArray('string_array_parameter', stringArray)
        .addParameterWithNumericArray('numeric_array_parameter', numericArray)
        .build();

    const event3 = await window.Insider
        .tagEvent("third_event")
        ?.addParameterWithInt('int_parameter', 10)
        .build();

    console.log("[INSIDER][triggerEvents]: Method is triggered.");
}

const smartRecommendation = {
    getData: async function() {
        // --- RECOMMENDATION ENGINE --- //
        const smartData = await window.Insider.getSmartRecommendation(1, 'tr_TR', 'TRY');
        console.log("[INSIDER][getSmartRecommendation]: ", smartData);
    },
    withProductIDs: async function() {
        const productIDs = ['product1', 'product2', 'product3'];
        const smartData = await window.Insider.getSmartRecommendationWithProductIDs(productIDs, 1, 'tr_TR', 'TRY');
        console.log("[INSIDER][getSmartRecommendationWithProductIDs]: ", smartData);
    },
    clickProduct: async function() {
        let product = createNewProduct("product1", "Pear", taxonomy, "ImageURL", 1000, "TRY");
        await window.Insider.clickSmartRecommendationProduct(1, product);
        console.log("[INSIDER][clickSmartRecommendationProduct]: Method is triggered.");
    }
}

async function getMessageCenterData() {
    // --- MESSAGE CENTER --- //

    const startDate = new Date(Date.now() - 86400000);
    const endDate = new Date(Date.now() + 86400000);

    const data = await window.Insider.getMessageCenterData(100, startDate, endDate);

    console.log("[INSIDER][messageCenter]: ", data);
}

async function getMessageCenterDataWithIdentifiers() {
    // --- MESSAGE CENTER WITH MULTIPLE IDENTIFIERS --- //

    const startDate = new Date(Date.now() - 86400000);
    const endDate = new Date(Date.now() + 86400000);

    let identifiers = Insider.identifier();
    identifiers.addEmail("mobile.test@useinsider.com");
    identifiers.addPhoneNumber("+909876543210");
    identifiers.addUserID("demo_user_id");
    identifiers.addCustomIdentifier("custom_identifier_key", "custom_identifier_value");

    const data = await window.Insider.getMessageCenterDataWithIdentifiers(
        100,
        startDate,
        endDate,
        identifiers.getIdentifiers()
    );

    console.log("[INSIDER][messageCenterWithIdentifiers]: ", data);
}

function openMessageCenter() {
    // --- APP CARDS PAGE --- //
    window.location.href = 'message-center.html';
    console.log("[INSIDER][openAppCards]: Opening app cards page");
}

async function contentOptimizer() {
    // --- CONTENT OPTIMIZER --- //

    // Integer
    const contentOptimizerInt = await window.Insider.getContentIntWithName('int_variable_name', 10, Insider.contentOptimizerDataType.ELEMENT);
    console.log("[INSIDER][getContentIntWithName]: ", contentOptimizerInt);

    // String
    const contentOptimizerString = await window.Insider.getContentStringWithName('string_variable_name', 'defaultValue', Insider.contentOptimizerDataType.ELEMENT);
    console.log("[INSIDER][getContentStringWithName]: ", contentOptimizerString);

    // Boolean
    const contentOptimizerBool = await window.Insider.getContentBoolWithName('bool_variable_name', true, Insider.contentOptimizerDataType.ELEMENT);
    console.log("[INSIDER][getContentBoolWithName]: ", contentOptimizerBool);
}

async function contentOptimizerNoCache() {
    // --- CONTENT OPTIMIZER WITHOUT CACHE --- //

    // Integer
    const contentOptimizerInt = await window.Insider.getContentIntWithNameWithoutCache('int_variable_name', 10, Insider.contentOptimizerDataType.ELEMENT);
    console.log("[INSIDER][getContentIntWithNameWithoutCache]: ", contentOptimizerInt);

    // String
    const contentOptimizerString = await window.Insider.getContentStringWithNameWithoutCache('string_variable_name', 'defaultValue', Insider.contentOptimizerDataType.ELEMENT);
    console.log("[INSIDER][getContentStringWithNameWithoutCache]: ", contentOptimizerString);

    // Boolean
    const contentOptimizerBool = await window.Insider.getContentBoolWithNameWithoutCache('bool_variable_name', true, Insider.contentOptimizerDataType.ELEMENT);
    console.log("[INSIDER][getContentBoolWithNameWithoutCache]: ", contentOptimizerBool);
}

function createProduct() {
    let product = createNewProduct("product1", "Pear", taxonomy, "ImageURL", 1000, "TRY");

    console.log("[INSIDER][createProduct]: ", product);
}

function createNewProduct(productId, productName, taxonomy, imageURL, price, currency) {
    const stringArray = ['value1', 'value2', 'value3'];
    const numericArray = [1, 2, 3];
    let product = window.Insider.createNewProduct(productId,
        productName,
        taxonomy,
        imageURL,
        price,
        currency);

    product
        .setColor("red")
        .setVoucherName("voucherName")
        .setVoucherDiscount(10.5)
        .setPromotionName("promotionName")
        .setPromotionDiscount(10.5)
        .setSize("size")
        .setSalePrice(10.5)
        .setShippingCost(10.5)
        .setQuantity(10)
        .setStock(10);

    product
        .setCustomAttributeWithString('string_parameter', 'This is Insider.')
        .setCustomAttributeWithInt('int_parameter', 10)
        .setCustomAttributeWithDouble('double_parameter', 10.5)
        .setCustomAttributeWithBoolean('bool_parameter', true)
        .setCustomAttributeWithDate('date_parameter', new Date())
        .setCustomAttributeWithStringArray('string_array_parameter', stringArray)
        .setCustomAttributeWithNumericArray('numeric_array_parameter', numericArray);

    product.setCustomAttributeWithArray('array_parameter', stringArray);

    return product;
}

app.initialize();
