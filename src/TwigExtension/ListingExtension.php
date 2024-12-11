<?php

namespace RemoteTech\SfStimulusTurboUI\TwigExtension;

use Symfony\Component\DependencyInjection\Attribute\AsTaggedItem;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

#[AsTaggedItem('twig.extension')]
class ListingExtension extends AbstractExtension
{
    public function getFunctions(): array
    {
        return [
            new TwigFunction('getColumnLink', [ListingRuntime::class, 'getColumnLink']),
            new TwigFunction('encodeSQID', [ListingRuntime::class, 'encodeSQID']),
//            new TwigFunction('getBrowserFromUserAgent', [ListingRuntime::class, 'getBrowserFromUserAgent']),
//            new TwigFunction('getBrowserIconFromUserAgent', [ListingRuntime::class, 'getBrowserIconFromUserAgent']),
//            new TwigFunction('getOSFromUserAgent', [ListingRuntime::class, 'getOSFromUserAgent']),
//            new TwigFunction('getOSIconFromUserAgent', [ListingRuntime::class, 'getOSIconFromUserAgent']),
            new TwigFunction('getCountryByCode', [ListingRuntime::class, 'getCountryByCode']),
        ];
    }
}
