<?php
declare(strict_types=1);

namespace RemoteTech\SfStimulusTurboUI;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\ExtensionInterface;
use Symfony\Component\HttpKernel\Bundle\Bundle;

final class RemoteTechSfStimulusTurboUIBundle extends Bundle
{
    public function build(ContainerBuilder $container): void
    {
        parent::build($container);

    }

    public function getPath(): string
    {
        return \dirname(__DIR__);
    }
}

