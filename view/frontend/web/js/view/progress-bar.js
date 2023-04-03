define([
    'jquery',
    'ko',
    'uiComponent',
    'Magento_Customer/js/customer-data',
    'priceUtils'
], function ($, ko, Component, customerData, priceUtils) {
    'use strict';

    return Component.extend({
        defaults: {
            displaySubtotal: ko.observable(true),
            maxPrice: 300,
            priceFormat: {
                decimalSymbol: ',',
                groupLength: 3,
                groupSymbol: ".",
                integerRequired: false,
                pattern: "R$%s",
                precision: 2,
                requiredPrecision: 2
            },
            textMissingAmount: {
                mobile: 'Falta %d para frete grátis',
                desktop: 'Faltam %d para você conseguir frete grátis'
            },
            textEmptyCart: {
                mobile: 'Frete grátis a partir de %d',
                desktop: 'Ganhe frete grátis nas compras acima de %d'
            },
            device: 'desktop'
        },

        /**
         * @override
         */
        initialize: function () {
            this._super();
            this.cart = customerData.get('cart');

            $('.block-minicart').addClass('has-free-shipping-block');
            if (window.innerWidth < 800) {
                this.device = 'mobile';
            }
        },

        getTotalCartItems: function () {
            let count = customerData.get('cart')().summary_count;
            if (count === 0) {
                this.lastPercentage = 0;
            }

            return count;
        },

        getSubtotalAmount: function () {
            let subtotalAmount = customerData.get('cart')().subtotalAmount;
            if (subtotalAmount > this.maxPrice) {
                subtotalAmount = this.maxPrice;
            }

            return subtotalAmount;
        },

        getPercentage: function () {
            return (this.getSubtotalAmount() * 100) / this.maxPrice;
        },

        getRemainingAmount: function () {
            return this.maxPrice - this.getSubtotalAmount();
        },

        getRemainingAmountFormatted: function () {
            return priceUtils.formatPrice(this.getRemainingAmount(), this.priceFormat);
        },

        getMaxPriceFormatted: function () {
            return priceUtils.formatPrice(this.maxPrice, this.priceFormat);
        },

        getFreeShippingInfo: function () {
            let text;
            if (this.getTotalCartItems() > 0) {
                if (this.getRemainingAmount() > 0) {
                    text = this.textMissingAmount[this.device].replace('%d', this.getRemainingAmountFormatted());
                    return text;
                }

                return 'Você ganhou frete grátis!';
            }

            text = this.textEmptyCart[this.device].replace('%d', this.getMaxPriceFormatted());
            return text;
        }
    });
});
