<?php

namespace RemoteTech\SfStimulusTurboUI\TwigExtension;

use RemoteTech\SfStimulusTurboUI\Service\Listing\Column;
use RemoteTech\SfStimulusTurboUI\Service\SqidService;
//use RemoteTech\SfStimulusTurboUI\Service\UserAgentHelper;
use Symfony\Component\DependencyInjection\Attribute\AsTaggedItem;
use Symfony\Component\Intl\Countries;
use Symfony\Component\Routing\RouterInterface;
use Twig\Extension\RuntimeExtensionInterface;

#[AsTaggedItem('twig.runtime')]
class ListingRuntime implements RuntimeExtensionInterface
{

    public function __construct(
        private readonly RouterInterface $router,
        private readonly SqidService     $sqidService,
    )
    {
    }

    /**
     * @param array<string, mixed> $column
     * @return string
     */
    public function getColumnLink(array $column): string
    {
        /** @var Column $columnObj */
        $columnObj = $column['column'];
        /** @var array<string, string> $item */
        $item = $column['item'];

        $params = [];
        foreach ($columnObj->getLinkParams() as $key => $param) {
            $value = $item[$param['value']];

            if (true === $param['encoded']) {
                $value = $this->encodeSQID((int)$item[$param['value']]);
            }
            $params[$key] = $value;
        }

        if (null === $this->router->getRouteCollection()->get($columnObj->getLink())) {
            return $columnObj->getLink();
        }
        return $this->router->generate($columnObj->getLink(), $params);
    }

    public function encodeSQID(int $value): string
    {
        return $this->sqidService->encode($value);
    }

    public function getCountryByCode(?string $countryCode): string
    {
        if (null === $countryCode || 'ZZ' == $countryCode) {
            return '';
        }

        if (!Countries::exists($countryCode)) {
            return $countryCode;
        }

        return Countries::getName($countryCode);
    }
}
