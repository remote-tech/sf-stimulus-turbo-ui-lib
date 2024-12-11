<?php

namespace RemoteTech\SfStimulusTurboUI\TwigExtension;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class FormExtension extends AbstractExtension
{
    public function getFunctions(): array
    {
        return [
            new TwigFunction('form_success', [$this, 'formSuccess'], ['needs_environment' => true, 'is_safe' => ['html']]),
            new TwigFunction('form_error', [$this, 'formError'], ['needs_environment' => true, 'is_safe' => ['html']])
        ];
    }

    public function formSuccess(\Twig\Environment $twig, ?string $message): string
    {
        if (null === $message) {
            return '';
        }
        return $twig->render('form_theme/form_success.html.twig', [
            'successMessages' => $message,
        ]);
    }

    public function formError(\Twig\Environment $twig, ?string $message): string
    {
        if (null === $message) {
            return '';
        }
        return $twig->render('form_theme/form_error.html.twig', [
            'errorMessages' => $message,
        ]);
    }
}
