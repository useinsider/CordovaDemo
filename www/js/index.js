const taxonomy = ['taxonomy1', 'taxonomy2', 'taxonomy3'];
// FIXME-INSIDER: Please change with your partner name.
const PARTNER_NAME = 'your_partner_name';

const PLAYGROUND_MAX_LINES = 200;
const playgroundLines = [];

function renderPlaygroundConsole() {
    const output = document.getElementById('playgroundConsole');
    if (!output) return;
    output.textContent = playgroundLines.join('\n');
    output.scrollTop = output.scrollHeight;
}

function appendPlaygroundLine(line) {
    playgroundLines.push(line);
    if (playgroundLines.length > PLAYGROUND_MAX_LINES) {
        playgroundLines.splice(0, playgroundLines.length - PLAYGROUND_MAX_LINES);
    }
    console.log(line);
    renderPlaygroundConsole();
}

function describeResult(result) {
    if (result === undefined) return 'Method is triggered.';
    if (typeof result === 'string') return result;
    try {
        return JSON.stringify(result);
    } catch (e) {
        return String(result);
    }
}

function logInsider(method, result) {
    appendPlaygroundLine('[INSIDER][' + method + ']: ' + describeResult(result));
}

function logInsiderError(method, error) {
    const message = error && error.message ? error.message : String(error);
    appendPlaygroundLine('[INSIDER][' + method + '] error: ' + message);
}

function clearPlaygroundConsole() {
    playgroundLines.length = 0;
    renderPlaygroundConsole();
}

// Runs a button handler and reports a thrown or rejected call on the console instead of failing silently.
function guarded(method, handler) {
    return async function() {
        try {
            await handler.apply(this, arguments);
        } catch (error) {
            logInsiderError(method, error);
        }
    };
}

let app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        document.getElementById('clearConsole').addEventListener('click', clearPlaygroundConsole);

        document.getElementById('miniAppsButton').addEventListener('click', openMiniApps);
        document.getElementById('miniAppsBackdrop').addEventListener('click', closeMiniApps);
        document.getElementById('miniAppAppCards').addEventListener('click', openAppCardsPage);

        document.getElementById('userAttributes').addEventListener('click', guarded('currentUser', userAttributes));

        document.getElementById('login').addEventListener('click', guarded('login', userIdentifiers.login));
        document.getElementById('logout').addEventListener('click', guarded('logout', userIdentifiers.logout));
        document.getElementById('logoutResettingInsiderID').addEventListener('click', guarded('logoutResettingInsiderID', userIdentifiers.logoutResettingInsiderID));
        document.getElementById('signUpConfirmation').addEventListener('click', guarded('signUpConfirmation', signUpConfirmation));

        document.getElementById('triggerEvents').addEventListener('click', guarded('tagEvent', triggerEvents));

        document.getElementById('createProduct').addEventListener('click', guarded('createProduct', createProduct));

        document.getElementById('itemAddToCart').addEventListener('click', guarded('itemAddedToCart', purchase.itemAddToCart));
        document.getElementById('itemRemoveFromCart').addEventListener('click', guarded('itemRemovedFromCart', purchase.itemRemoveFromCart));
        document.getElementById('itemPurchase').addEventListener('click', guarded('itemPurchased', purchase.itemPurchase));
        document.getElementById('cartClear').addEventListener('click', guarded('cartCleared', purchase.cartClear));

        document.getElementById('smartRecommender').addEventListener('click', guarded('getSmartRecommendation', smartRecommendation.getData));
        document.getElementById('smartRecommenderWithIDs').addEventListener('click', guarded('getSmartRecommendationWithProductIDs', smartRecommendation.withProductIDs));
        document.getElementById('clickSmartRecommendationProduct').addEventListener('click', guarded('clickSmartRecommendationProduct', smartRecommendation.clickProduct));

        document.getElementById('socialProof').addEventListener('click', guarded('visitProductDetailPage', pageVisit.productPage));

        document.getElementById('homePage').addEventListener('click', guarded('visitHomePage', pageVisit.homePage));
        document.getElementById('productPage').addEventListener('click', guarded('visitProductDetailPage', pageVisit.productPage));
        document.getElementById('cartPage').addEventListener('click', guarded('visitCartPage', pageVisit.cartPage));
        document.getElementById('categoryPage').addEventListener('click', guarded('visitListingPage', pageVisit.categoryPage));

        document.getElementById('gdprTrue').addEventListener('click', guarded('setGDPRConsent', gdpr.true));
        document.getElementById('gdprFalse').addEventListener('click', guarded('setGDPRConsent', gdpr.false));

        document.getElementById('mobileAppAccessTrue').addEventListener('click', guarded('setMobileAppAccess', mobileAppAccess.enable));
        document.getElementById('mobileAppAccessFalse').addEventListener('click', guarded('setMobileAppAccess', mobileAppAccess.disable));

        document.getElementById('messageCenter').addEventListener('click', guarded('getMessageCenterData', getMessageCenterData));
        document.getElementById('appCards').addEventListener('click', guarded('getCampaigns', getAppCardsCampaigns));
        document.getElementById('contentOptimizer').addEventListener('click', guarded('contentOptimizer', contentOptimizer));
        document.getElementById('contentOptimizerNoCache').addEventListener('click', guarded('contentOptimizerNoCache', contentOptimizerNoCache));

        document.getElementById('startTrackingGeofence').addEventListener('click', guarded('startTrackingGeofence', geofence.startTracking));
        document.getElementById('allowBackgroundLocationUpdates').addEventListener('click', guarded('setAllowsBackgroundLocationUpdates', geofence.allowBackgroundLocationUpdates));

        document.getElementById('enableInApp').addEventListener('click', guarded('enableInAppMessages', inAppMessages.enable));
        document.getElementById('disableInApp').addEventListener('click', guarded('disableInAppMessages', inAppMessages.disable));
        document.getElementById('removeInapp').addEventListener('click', guarded('removeInapp', removeInapp));

        document.getElementById('addToWishlist').addEventListener('click', guarded('itemAddedToWishlist', wishlist.add));
        document.getElementById('removeFromWishlist').addEventListener('click', guarded('itemRemovedFromWishlist', wishlist.remove));
        document.getElementById('clearWishlist').addEventListener('click', guarded('wishlistCleared', wishlist.clear));
        document.getElementById('visitWishlistPage').addEventListener('click', guarded('visitWishlistPage', wishlist.visitPage));

        document.getElementById('reinitWithPartnerName').addEventListener('click', guarded('reinitWithPartnerName', reinitWithPartnerName));

        initInsider().catch((error) => logInsiderError('initialize', error));
    }
};

async function initInsider() {
    // FIXME-INSIDER: Please change with your app group.
    await window.Insider.init(PARTNER_NAME, 'group.com.useinsider.cordovademo',
        (callback) => {
            switch ((callback.result || {}).type) {
                case window.Insider.callbackType.NOTIFICATION_OPEN:
                    logInsider('NOTIFICATION_OPEN', callback.result || {});
                    break;
                case window.Insider.callbackType.TEMP_STORE_CUSTOM_ACTION:
                    logInsider('TEMP_STORE_CUSTOM_ACTION', callback.result || {});
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

    logInsider('initialize');
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

    logInsider('currentUser');
}

const userIdentifiers = {
    login: async function() {
        let currentUser = window.Insider.getCurrentUser();
        let identifiers = Insider.identifier();

        identifiers.addEmail("mobile.test@useinsider.com");
        identifiers.addPhoneNumber("+909876543210");
        identifiers.addUserID("{crmID}");

        currentUser.login(identifiers.getIdentifiers(), (id) => {
            logInsider('login', 'Insider ID: ' + id);
            alert(id);
        });

        logInsider('login');
    },
    logout: async function() {
        let currentUser = window.Insider.getCurrentUser();

        currentUser.logout();

        logInsider('logout');
    },
    logoutResettingInsiderID: async function() {
        let currentUser = window.Insider.getCurrentUser();

        currentUser.logoutResettingInsiderID(null, (newInsiderID) => {
            const message = "Logout successful! New Insider ID: " + newInsiderID;
            logInsider('logoutResettingInsiderID', message);
            alert(message);
        });

        logInsider('logoutResettingInsiderID');
    }
}

const purchase = {
    itemAddToCart: async function() {
        let product = createNewProduct("product_id", "Pear", taxonomy, "ImageURL", 1000, "TRY");

        await window.Insider.itemAddedToCart(product);

        logInsider('itemAddedToCart');
    },
    itemRemoveFromCart: async function() {
        const productID = 'product_id';

        await window.Insider.itemRemovedFromCart(productID);

        logInsider('itemRemovedFromCart', 'Product ID: ' + productID);
    },
    itemPurchase: async function() {
        let product = createNewProduct("product_id", "Pear", taxonomy, "ImageURL", 1000, "TRY");

        await window.Insider.itemPurchased('product_id', product);

        logInsider('itemPurchased');
    },
    cartClear: async function() {
        window.Insider.cartCleared();

        logInsider('cartCleared');
    }
}

const pageVisit = {
    homePage: async function() {
        await window.Insider.visitHomePage();

        logInsider('visitHomePage');
    },
    categoryPage: async function() {
        await window.Insider.visitListingPage(taxonomy);

        logInsider('visitListingPage');
    },
    productPage: async function() {
        let product = createNewProduct("product1", "Pear", taxonomy, "ImageURL", 1000, "TRY");

        await window.Insider.visitProductDetailPage(product);

        logInsider('visitProductDetailPage');
    },
    cartPage: async function() {
        let product = createNewProduct("product1", "Pear", taxonomy, "ImageURL", 1000, "TRY");
        let product2 = createNewProduct("product2", "Apple", taxonomy, "ImageURL", 50, "TRY");

        const insiderExampleProducts = [product, product2];

        await window.Insider.visitCartPage(insiderExampleProducts);

        logInsider('visitCartPage');
    }
}

const gdpr = {
    'true': async function() {
        window.Insider.setGDPRConsent(true);

        logInsider('setGDPRConsent', 'true');
    },
    'false': async function() {
        window.Insider.setGDPRConsent(false);

        logInsider('setGDPRConsent', 'false');
    }
}

const mobileAppAccess = {
    enable: function() {
        window.Insider.setMobileAppAccess(true);
        logInsider('setMobileAppAccess', 'true');
    },
    disable: function() {
        window.Insider.setMobileAppAccess(false);
        logInsider('setMobileAppAccess', 'false');
    }
};

async function signUpConfirmation() {
    await window.Insider.signUpConfirmation();
    logInsider('signUpConfirmation');
}

const inAppMessages = {
    enable: function() {
        window.Insider.enableInAppMessages();
        logInsider('enableInAppMessages');
    },
    disable: function() {
        window.Insider.disableInAppMessages();
        logInsider('disableInAppMessages');
    }
};

const geofence = {
    startTracking: function() {
        window.Insider.startTrackingGeofence();
        logInsider('startTrackingGeofence');
    },
    allowBackgroundLocationUpdates: function() {
        if (window.cordova.platformId === 'android') {
            logInsider('setAllowsBackgroundLocationUpdates', 'iOS only, no native call on Android');
            return;
        }
        window.Insider.setAllowsBackgroundLocationUpdates(true);
        logInsider('setAllowsBackgroundLocationUpdates', 'true');
    }
};

const wishlist = {
    add: function() {
        const product = createNewProduct("product_id", "Pear", taxonomy, "ImageURL", 1000, "TRY");
        window.Insider.itemAddedToWishlist(product);
        logInsider('itemAddedToWishlist');
    },
    remove: function() {
        window.Insider.itemRemovedFromWishlist('product_id');
        logInsider('itemRemovedFromWishlist', 'Product ID: product_id');
    },
    clear: function() {
        window.Insider.wishlistCleared();
        logInsider('wishlistCleared');
    },
    visitPage: function() {
        const product1 = createNewProduct("product1", "Pear", taxonomy, "ImageURL", 100, "TRY");
        const product2 = createNewProduct("product2", "Apple", taxonomy, "ImageURL", 200, "TRY");
        window.Insider.visitWishlistPage([product1, product2]);
        logInsider('visitWishlistPage');
    }
};

function reinitWithPartnerName() {
    window.Insider.reinitWithPartnerName(PARTNER_NAME);
    logInsider('reinitWithPartnerName', 'active partner: ' + PARTNER_NAME);
}

function removeInapp() {
    window.Insider.removeInapp();
    logInsider('removeInapp');
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
        .addParameterWithArray('array_parameter', stringArray)
        .build();

    const event3 = await window.Insider
        .tagEvent("third_event")
        ?.addParameterWithInt('int_parameter', 10)
        .build();

    logInsider('tagEvent', 'event_name, second_event, third_event sent');
}

const smartRecommendation = {
    getData: async function() {
        // --- RECOMMENDATION ENGINE --- //
        const smartData = await window.Insider.getSmartRecommendation(1, 'tr_TR', 'TRY');
        logInsider('getSmartRecommendation', smartData);

        const product = createNewProduct("product1", "Pear", taxonomy, "ImageURL", 1000, "TRY");
        const smartDataWithProduct = await window.Insider.getSmartRecommendationWithProduct(product, 1, 'tr_TR');
        logInsider('getSmartRecommendationWithProduct', smartDataWithProduct);

        await smartRecommendation.withProductIDs();
    },
    withProductIDs: async function() {
        const productIDs = ['product1', 'product2', 'product3'];
        const smartData = await window.Insider.getSmartRecommendationWithProductIDs(productIDs, 1, 'tr_TR', 'TRY');
        logInsider('getSmartRecommendationWithProductIDs', smartData);
    },
    clickProduct: async function() {
        let product = createNewProduct("product1", "Pear", taxonomy, "ImageURL", 1000, "TRY");
        await window.Insider.clickSmartRecommendationProduct(product, 1);
        logInsider('clickSmartRecommendationProduct');
    }
}

async function getMessageCenterData() {
    // --- MESSAGE CENTER --- //

    const startDate = new Date(Date.now() - 86400000);
    const endDate = new Date(Date.now() + 86400000);

    const data = await window.Insider.getMessageCenterData(100, startDate, endDate);

    logInsider('getMessageCenterData', data);
}

async function getAppCardsCampaigns() {
    // --- APP CARDS --- //
    logInsider('getCampaigns', 'Method is triggered, waiting response...');

    const response = await window.Insider.appCards.getCampaigns();

    if (!response) {
        logInsider('getCampaigns', 'No campaigns data received');
        return;
    }

    logInsider('getCampaigns', 'Received ' + response.appCards.length + ' app cards');
    response.appCards.forEach((card) => {
        const content = card.content || {};
        appendPlaygroundLine('  - Card ID: ' + card.id);
        appendPlaygroundLine('    Title: ' + (content.title || 'N/A'));
        appendPlaygroundLine('    Description: ' + (content.description || 'N/A'));
        appendPlaygroundLine('    Read: ' + card.isRead);
        appendPlaygroundLine('    Images: ' + (card.images || []).length);
        appendPlaygroundLine('    Buttons: ' + (card.buttons || []).length);
    });
}

function openMiniApps() {
    document.getElementById('miniAppsSheet').hidden = false;
}

function closeMiniApps() {
    document.getElementById('miniAppsSheet').hidden = true;
}

function openAppCardsPage() {
    try {
        sessionStorage.setItem('homeScrollY', String(document.getElementById('playgroundSections').scrollTop || 0));
    } catch (e) { /* sessionStorage may be unavailable; navigation still works */ }
    closeMiniApps();
    logInsider('appCards', 'Opening app cards page');
    window.location.href = 'app-cards.html';
}

async function contentOptimizer() {
    // --- CONTENT OPTIMIZER --- //

    // Integer
    const contentOptimizerInt = await window.Insider.getContentIntWithName('int_variable_name', 10, Insider.contentOptimizerDataType.ELEMENT);
    logInsider('getContentIntWithName', contentOptimizerInt);

    // String
    const contentOptimizerString = await window.Insider.getContentStringWithName('string_variable_name', 'defaultValue', Insider.contentOptimizerDataType.ELEMENT);
    logInsider('getContentStringWithName', contentOptimizerString);

    // Boolean
    const contentOptimizerBool = await window.Insider.getContentBoolWithName('bool_variable_name', true, Insider.contentOptimizerDataType.ELEMENT);
    logInsider('getContentBoolWithName', contentOptimizerBool);
}

async function contentOptimizerNoCache() {
    // --- CONTENT OPTIMIZER WITHOUT CACHE --- //

    // Integer
    const contentOptimizerInt = await window.Insider.getContentIntWithoutCache('int_variable_name', 10, Insider.contentOptimizerDataType.ELEMENT);
    logInsider('getContentIntWithoutCache', contentOptimizerInt);

    // String
    const contentOptimizerString = await window.Insider.getContentStringWithoutCache('string_variable_name', 'defaultValue', Insider.contentOptimizerDataType.ELEMENT);
    logInsider('getContentStringWithoutCache', contentOptimizerString);

    // Boolean
    const contentOptimizerBool = await window.Insider.getContentBoolWithoutCache('bool_variable_name', true, Insider.contentOptimizerDataType.ELEMENT);
    logInsider('getContentBoolWithoutCache', contentOptimizerBool);
}

function createProduct() {
    let product = createNewProduct("product1", "Pear", taxonomy, "ImageURL", 1000, "TRY");

    logInsider('createProduct', product);
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

(function restoreHomeScroll() {
    try {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        var saved = sessionStorage.getItem('homeScrollY');
        if (saved === null) return;
        sessionStorage.removeItem('homeScrollY');
        var y = parseInt(saved, 10) || 0;
        var applyScroll = function() {
            var sections = document.getElementById('playgroundSections');
            if (sections) sections.scrollTop = y;
        };
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            applyScroll();
        } else {
            window.addEventListener('DOMContentLoaded', applyScroll);
        }
        // Re-apply once after load in case late content (images) shifts layout.
        window.addEventListener('load', applyScroll, { once: true });
    } catch (e) { /* no-op: scroll restoration is best-effort */ }
})();

app.initialize();
