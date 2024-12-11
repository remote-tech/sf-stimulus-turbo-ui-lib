<?php

namespace RemoteTech\SfStimulusTurboUI\TwigExtension;

use Symfony\Component\DependencyInjection\Attribute\AsTaggedItem;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

#[AsTaggedItem('twig.extension')]
class JsonDecode extends AbstractExtension
{
    public function getFilters(): array
    {
        return [
            new TwigFilter('json_decode', [$this, 'jsonDecode']),
        ];
    }

    public function jsonDecode($jsonString)
    {
        return json_decode($jsonString, true); // return as associative array
    }
}