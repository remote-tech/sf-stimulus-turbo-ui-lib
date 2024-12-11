<?php

namespace RemoteTech\SfStimulusTurboUI\TwigExtension;

use RemoteTech\SfStimulusTurboUI\Exception\AxeException;
use Symfony\Component\DependencyInjection\Attribute\AsTaggedItem;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

#[AsTaggedItem('twig.extension')]
class DateTimeHelper extends AbstractExtension
{
    public function getFilters(): array
    {
        return [
            new TwigFilter('formatDateTime', [self::class, 'formatDateTime']),
            new TwigFilter('formatDateTimeFromString', [self::class, 'formatDateTimeFromString']),
            new TwigFilter('formatDate', [self::class, 'formatDate']),
            new TwigFilter('formatTimezone', [self::class, 'formatTimezone']),
            new TwigFilter('getNoOfDaysPassed', [self::class, 'getNoOfDaysPassed']),
            new TwigFilter('getNoOfDaysPassedFromTimestamp', [self::class, 'getNoOfDaysPassedFromTimestamp']),
        ];
    }

    public static function isEarlierDate(\DateTimeInterface $subject, \DateTimeInterface $reference): bool
    {
        $interval = $subject->diff($reference);

        if ($interval->invert == 1) {
            return false;
        }

        return true;
    }

    /**
     * @throws AxeException
     */
    public static function formatTimezone(?string $timezoneStr): string
    {
        if ($timezoneStr == null) {
            return '-';
        }
        try {
            $timezone = new \DateTimeZone($timezoneStr);
            $dateTime = new \DateTime("now", $timezone);
            $offsetHours = ($timezone->getOffset($dateTime)) / 3600;
            return $timezoneStr . ' (UTC ' . ($offsetHours >= 0 ? '+' : '') . $offsetHours . ':00)';
        } catch (\Exception $e) {
            return '--';
        }
    }
    
    public static function formatDateTime(\DateTimeImmutable|\DateTime $date): string
    {
        return $date->format('Y-m-d H:i:s');
    }

    public static function formatDateTimeFromString(?string $date): string
    {
        if (null === $date) {
            return '';
        }
        try {
            $date = new \DateTime($date);
        } catch (\Exception $e) {
            throw new AxeException('Invalid date string');
        }
        return self::formatDateTime($date);
    }

    public static function formatDate(\DateTime $date): string
    {
        return $date->format('Y-m-d');
    }

    public static function getNoOfDaysPassed(\DateTime $date): string
    {
        $currentDateTime = new \DateTime();

        $interval = $currentDateTime->diff($date);

        if ($interval->days < 1) {
            if ($interval->h < 1) {
                return $interval->i . ' min ago';
            }
            return $interval->h . ' hours ago';
        }
        return $interval->days . ' days ago';
    }

    public static function getNoOfDaysPassedFromTimestamp(?string $timestamp): string
    {
        if (null === $timestamp) {
            return '--';
        }
        $date = (new \DateTime())->setTimestamp((int)$timestamp);

        return self::getNoOfDaysPassed($date);
    }
}
