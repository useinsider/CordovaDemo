var insiderExampleProduct;
const taxonomy = ['taxonomy1', 'taxonomy2', 'taxonomy3'];
var currentUser;

var app = {
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        // Cordova is now initialized. Have fun!
        document.getElementById('tagEvent').addEventListener('click', tagEvent);
        document.getElementById('setUserProperties').addEventListener('click', setUserProperties);
        document.getElementById('visitPage').addEventListener('click', visitPage);
        document.getElementById('createProduct').addEventListener('click', createProduct);
        document.getElementById('messageCenter').addEventListener('click', getMessageCenter);
        document.getElementById('contentOptimizer').addEventListener('click', contentOptimizer);
        document.getElementById('smartRecommendation').addEventListener('click', getSmartRecommendation);
        document.getElementById('signUpConfirmation').addEventListener('click', signUpConfirmation);
        document.getElementById('cartCleared').addEventListener('click', cartCleared);
        document.getElementById('login').addEventListener('click', login);
        document.getElementById('logout').addEventListener('click', logout);
        document.getElementById('startTrackingGeofence').addEventListener('click', startTrackingGeofence);
        initSDK();

        currentUser = window.Insider.getCurrentUser();
    }
};

async function initSDK() {
    await window.Insider.init('your_partner_name', 'your_app_group',
        (callback) => {
            switch ((callback.result || {}).type) {
                case window.Insider.callbackType.NOTIFICATION_OPEN:
                    console.log('[INSIDER][NOTIFICATION_OPEN]: ', JSON.stringify(callback.result) || {});
                    break;
                case window.Insider.callbackType.INAPP_BUTTON_CLICK:
                    console.log('[INSIDER][INAPP_BUTTON_CLICK]: ', JSON.stringify(callback.result) || {});
                    break;
                case window.Insider.callbackType.TEMP_STORE_PURCHASE:
                    console.log('[INSIDER][TEMP_STORE_PURCHASE]: ', JSON.stringify(callback.result) || {});
                    break;
                case window.Insider.callbackType.TEMP_STORE_ADDED_TO_CART:
                    console.log('[INSIDER][TEMP_STORE_ADDED_TO_CART]: ', JSON.stringify(callback.result) || {});
                    break;
                case window.Insider.callbackType.TEMP_STORE_CUSTOM_ACTION:
                    console.log('[INSIDER][TEMP_STORE_CUSTOM_ACTION]: ', JSON.stringify(callback.result) || {});
                    break;
            }
        },
    );


    window.Insider.setGDPRConsent(true);
    await window.Insider.registerWithQuietPermission(false);
    window.Insider.enableIDFACollection(true);
    window.Insider.enableLocationCollection(true);
    window.Insider.enableIpCollection(true);
    window.Insider.enableCarrierCollection(true);

}

//Null Test
async function nullCheck() {
    currentUser?.setName(null)
        .setSurname(null)
        .setAge(null)
        .setGender(null)
        .setBirthday(null)
        .setEmailOptin(null)
        .setSMSOptin(null)
        .setPushOptin(null)
        .setLocationOptin(null)
        .setWhatsappOptin(null)
        .setFacebookID(null)
        .setTwitterID(null)
        .setLanguage(null)
        .setLocale(null);

    var identifiers = Insider.identifier();
    identifiers.addEmail(null);
    identifiers.addPhoneNumber(null);
    identifiers.addUserID(null);

    currentUser.setCustomAttributeWithString('string_parameter', null);
    currentUser.setCustomAttributeWithInt('int_parameter', null);
    currentUser.setCustomAttributeWithDouble('double_parameter', null);
    currentUser.setCustomAttributeWithBoolean('bool_parameter', null);
    currentUser.setCustomAttributeWithDate('date_parameter', null);

    window.Insider.getCurrentUser().setCustomAttributeWithArray('key', null);

    const event2 = await window.Insider
        .tagEvent(null)
        ?.addParameterWithInt('int_parameter', null)
        .build();

    const vListing = await window.Insider.visitListingPage(null);

    createProduct("product1", "Pear", taxonomy, "ImageURL", 0, "TRY")
        .then(async (product) => {
            const visitP = await window.Insider.visitProductDetailPage(null);

            const itemP = await window.Insider.itemPurchased('product_id', product);

            const itemAC = await window.Insider.itemAddedToCart(null);

            const res = await window.Insider.visitCartPage(null);
        });

    const itemR = await window.Insider.itemRemovedFromCart(null);

    var product = await window.Insider.createNewProduct(null,
        null,
        null,
        null,
        null,
        null);

    product
        .setColor(null)
        .setVoucherName(null)
        .setVoucherDiscount(null)
        .setPromotionName(null)
        .setPromotionDiscount(null)
        .setSize(null)
        .setSalePrice(null)
        .setShippingCost(null)
        .setQuantity(null)
        .setStock(null);

    product
        .setCustomAttributeWithString('string_parameter', null)
        .setCustomAttributeWithInt('int_parameter', null)
        .setCustomAttributeWithDouble('double_parameter', null)
        .setCustomAttributeWithBoolean('bool_parameter', null)
        .setCustomAttributeWithDate('date_parameter', null);

    product.setCustomAttributeWithArray('array_parameter', null);

    const mData = await window.Insider.getMessageCenterData(null, null, null);


    const contentOptimizerInt = await window.Insider.getContentIntWithName('int_variable_name', null, null);

    const contentOptimizerString = await window.Insider.getContentStringWithName('string_variable_name', null, null);

    const contentOptimizerBool = await window.Insider.getContentBoolWithName('bool_variable_name', null, null);

    const smartData = await window.Insider.getSmartRecommendation(null, null, null);

    const smartDataWithProduct = await window.Insider.getSmartRecommendationWithProduct(null, null, null);

}

function startTrackingGeofence() {
    window.Insider.startTrackingGeofence();
}

function signUpConfirmation() {
    nullCheck();
    window.Insider.signUpConfirmation();
}

function cartCleared() {
    window.Insider.cartCleared();
}

function login() {
    var identifiers = Insider.identifier();
    identifiers.addEmail('mobile@useinsider.com');
    identifiers.addPhoneNumber('+901234567');
    identifiers.addUserID('CRM-ID');

    currentUser.login(identifiers.getIdentifiers(), (id) => alert(id));
}

function logout() {
    currentUser.logout();
}

function setUserProperties() {
    // --- USER --- //

    // Setting User Attributes
    currentUser.setName("John")
        .setSurname("Doe")
        .setAge(23)
        .setGender(Insider.gender.FEMALE)
        .setBirthday(new Date())
        .setEmailOptin(true)
        .setSMSOptin(false)
        .setPushOptin(true)
        .setLocationOptin(true)
        .setWhatsappOptin(true)
        .setFacebookID("Facebook-ID")
        .setTwitterID("Twittter-ID")
        .setLanguage("TR")
        .setLocale("tr_TR");

    // Setting User Identifiers.
    var identifiers = Insider.identifier();
    identifiers.addEmail('mobile@useinsider.com');
    identifiers.addPhoneNumber('+901234567');
    identifiers.addUserID('CRM-ID');

    currentUser.setCustomAttributeWithString('string_parameter', 'This is Insider.');
    currentUser.setCustomAttributeWithInt('int_parameter', 10);
    currentUser.setCustomAttributeWithDouble('double_parameter', 10.5);
    currentUser.setCustomAttributeWithBoolean('bool_parameter', true);
    currentUser.setCustomAttributeWithDate('date_parameter', new Date());

    const arr = ['value1', 'value2', 'value3'];
    window.Insider.getCurrentUser().setCustomAttributeWithArray('key', arr);
}

async function tagEvent() {
    try {
        // --- EVENT --- //

        // You can create an event without parameters and call the build method;
        const event = await window.Insider.tagEvent("event_name").build();

        const event2 = await window.Insider
            .tagEvent("second_event")
            ?.addParameterWithInt('int_parameter', 10)
            .addParameterWithDate('date_parameter', new Date())
            .addParameterWithDouble('double_parameter', 10.5)
            .addParameterWithBoolean('bool_parameter', true)
            .addParameterWithString('string_parameter', 'This is Insider.')
            .build();

        const event3 = await window.Insider
            .tagEvent("third_event")
            ?.addParameterWithInt('int_parameter', 10)
            .build();

    } catch (error) {
        console.log('[Demo Error]: ', error.toString());
    }
}

async function visitPage() {
    try {
        try {
           await window.Insider.visitHomePage();

            await window.Insider.visitListingPage(taxonomy);

            var product = createProduct("product1", "Pear", taxonomy, "ImageURL", 300.42, "TRY");
            var product_2 = createProduct("product2", "Apple", taxonomy, "ImageURL", 50, "TRY");

            await window.Insider.visitProductDetailPage(product);

            await window.Insider.itemPurchased('product_id', product);

            await window.Insider.itemAddedToCart(product);

            const insiderExampleProducts = [product, product_2];

            await window.Insider.visitCartPage(insiderExampleProducts);

            await window.Insider.itemRemovedFromCart('product_id');

            await window.Insider.cartCleared();

        } catch (error) {
            console.log('[Demo Error]: ', error);
        }



    } catch (error) {
        console.log('[Demo Error]: ', error.toString());
    }
}

function createProduct(productId, productName, taxonomy, imageURL, price, currency) {

    var product = window.Insider.createNewProduct(productId,
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

    // Setting custom attributes.
    // MARK: Your attribute key should be all lowercased and should not include any special or non Latin characters or any space, otherwise this attribute will be ignored. You can use underscore _.
    product
        .setCustomAttributeWithString('string_parameter', 'This is Insider.')
        .setCustomAttributeWithInt('int_parameter', 10)
        .setCustomAttributeWithDouble('double_parameter', 10.5)
        .setCustomAttributeWithBoolean('bool_parameter', true)
        .setCustomAttributeWithDate('date_parameter', new Date());

    // MARK: You can only call the method with array of string otherwise this event will be ignored.
    const arr = ['value1', 'value2', 'value3'];
    product.setCustomAttributeWithArray('array_parameter', arr);

    console.log(product);

    return product;
}

async function getMessageCenter() {
    try {
        // --- MESSAGE CENTER --- //
        const startDate = new Date(Date.now());
        const endDate = new Date(Date.now() + 86400000);

        const mData = await window.Insider.getMessageCenterData(100, startDate, endDate);
        console.log("getMessageCenterData->" + JSON.stringify(mData));
    }
    catch (error) {
        console.log('[Demo Error]: ', error.toString());
    }
}

async function contentOptimizer() {
    try {
        // --- CONTENT OPTIMIZER --- //

        // Integer
        const contentOptimizerInt = await window.Insider.getContentIntWithName('int_variable_name', 10, Insider.contentOptimizerDataType.ELEMENT);
        console.log("getContentIntWithName->" + JSON.stringify(contentOptimizerInt));

        // String
        const contentOptimizerString = await window.Insider.getContentStringWithName('string_variable_name', 'defaultValue', Insider.contentOptimizerDataType.ELEMENT);
        console.log("getContentStringWithName->" + JSON.stringify(contentOptimizerString));

        // Boolean
        const contentOptimizerBool = await window.Insider.getContentBoolWithName('bool_variable_name', true, Insider.contentOptimizerDataType.ELEMENT);
        console.log("getContentBoolWithName->" + JSON.stringify(contentOptimizerBool));
    }
    catch (error) {
        console.log('[Demo Error]: ', error.toString());
    }
}

async function getSmartRecommendation() {
    try {
        // --- RECOMMENDATION ENGINE --- // 
        // ID comes from your smart recommendation campaign.
        // Please follow the language code structure. For instance en_US.
        const smartData = await window.Insider.getSmartRecommendation(1, 'tr_TR', 'TRY');
        console.log("getSmartRecommendation->" + JSON.stringify(smartData));

        var product = createProduct("product1", "Pear", taxonomy, "ImageURL", 300.42, "TRY");
         
                const smartDataWithProduct = await window.Insider.getSmartRecommendationWithProduct(product, 1, 'tr_TR');
                console.log("getSmartRecommendationWithProduct->" + JSON.stringify(smartDataWithProduct));

                const clickSmartRecommendationProduct = await window.Insider.clickSmartRecommendationProduct(product, 1);
                console.log("clickSmartRecommendationProduct->" + JSON.stringify(clickSmartRecommendationProduct));
          

    }
    catch (error) {
        console.log('[Demo Error]: ', error.toString());
    }
}

app.initialize();
