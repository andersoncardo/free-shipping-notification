<?php

namespace Cardoso\FreeShippingNotification\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\View\Element\Template;

class Config extends \Magento\Framework\View\Element\Template
{
    /**
     * @var ScopeConfigInterface
     */
    private $scopeConfig;

    public function __construct(
        ScopeConfigInterface $scopeConfig,
        Template\Context $context,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->scopeConfig = $scopeConfig;
    }

    /**
     * @return float|null
     */
    public function getMaxPrice(): ?float
    {
        return $this->scopeConfig->getValue('free_shipping_notify/general/max_price', 'store');
    }
}
