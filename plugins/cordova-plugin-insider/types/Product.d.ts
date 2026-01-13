export interface Product {
    setColor(color: string):Product;
    setVoucherName(voucherName: string):Product;
    setPromotionName(color: string):Product;
    setSize(size: string):Product;
    setSalePrice(salePrice: number):Product;
    setShippingCost(shippingCost: number):Product;
    setVoucherDiscount(voucherDiscount: number):Product;
    setPromotionDiscount(promotionDiscount: number):Product;
    setStock(setStock: number):Product;
    setQuantity(quantity: number):Product;
    setGroupCode(groupCode: string):Product;
    setBrand(brand: string):Product;
    setGender(gender: string):Product;
    setDescription(description: string):Product;
    setSku(sku: string):Product;
    setMultipack(multipack: string):Product;
    setProductType(productType: string):Product;
    setGtin(gtin: string):Product;
    setTags(tags: string[]):Product;
    setInStock(isInStock: boolean):Product;
    setProductURL(productURL: string):Product;
    setCustomAttributeWithString(key: string, value: string):Product;
    setCustomAttributeWithInt(key: string, value: number):Product;
    setCustomAttributeWithBoolean(key: string, value: boolean):Product;
    setCustomAttributeWithDouble(key: string, value: number):Product;
    setCustomAttributeWithDate(key: string, value: Date):Product;
    /**
    * @deprecated Use `setCustomAttributeWithStringArray` instead.
    */
    setCustomAttributeWithArray(key: string, value: object):Product;
    setCustomAttributeWithStringArray(key: string, value: Array<string>):Product;
    setCustomAttributeWithNumericArray(key: string, value: Array<number>):Product;
}